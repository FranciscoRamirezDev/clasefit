# Design

## Context

Ver proposal.md (Why) para la motivación y `specs/class-booking/spec.md` para el comportamiento exigido.

Estado actual del proyecto:
- Expo SDK 57 (`expo ~57.0.27`), React Native 0.86, React 19.2, TypeScript estricto. Punto de entrada `index.ts` → `App.tsx` (plantilla por defecto, sin lógica).
- Jest con preset `jest-expo` ya configurado; existe la carpeta vacía `src/domain/__tests__/`.
- Carpetas vacías `src/components`, `src/data`, `src/domain`, `src/screens`, `src/state`.
- Los datos mock están en `docs/insumo-funcional/mock-data/clases.json`; se copian a `src/data/clases.json`.
- No hay backend, login ni persistencia. El socio autenticado es único y viene de `clases.json`; el dominio no depende de su nombre ni de su id.

Restricciones: las fechas se calculan en America/Bogota sin depender de la zona horaria del dispositivo, y las reglas RN-01 a RN-04 deben ser verificables con pruebas unitarias deterministas (sin depender del reloj real ni de la zona horaria de la máquina que corre Jest).

## Decisions

### 1. Estructura del proyecto

```
App.tsx                      # ReservasProvider + selector de 2 pestañas
src/data/clases.json         # copia del mock del insumo
src/domain/
  types.ts                   # Clase, Reserva, ResultadoValidacion
  fechas.ts                  # inicio de clase, clave de día, yaEmpezo, formato (Bogotá)
  clases.ts                  # próximas clases, cupos disponibles, mis reservas
  reglas.ts                  # RN-01..RN-04 y validarReserva (orden RN-02, RN-01, RN-03)
  mensajes.ts                # textos literales del insumo
  __tests__/                 # pruebas unitarias del dominio
src/state/
  ReservasContext.tsx        # Context + useReducer
  reservasReducer.ts         # reducer puro (testeable sin React)
src/screens/
  ProximasClasesScreen.tsx
  MisReservasScreen.tsx
src/components/
  ClaseCard.tsx, TabSelector.tsx
```

Navegación: `App.tsx` envuelve la app en el provider y muestra un `TabSelector` propio con "Próximas clases" y "Mis reservas", alternando la pantalla visible con `useState`. No se instala librería de navegación.

Los mensajes al usuario viven en `mensajes.ts` con el texto exacto del insumo, para que pruebas y UI usen la misma fuente.

**Por qué**: solo hay dos vistas, sin rutas anidadas ni deep links. Se aparta a propósito de la guía de `AGENTS.md` (Expo Router en `src/app/`): migrar exige cambiar el entry point, `app.json` y agregar dependencias, lo que excede el MVP.

**Alternativa considerada**: Expo Router con `Tabs`. Se descarta por ahora por el costo de migración descrito; queda como evolución si la app crece.

### 2. Dónde viven las reglas de negocio: funciones puras en `src/domain/`

Todas las reglas y cálculos derivados son funciones puras que reciben explícitamente sus entradas, incluido `now: Date`. Firmas orientativas:

- `inicioClase(clase, now): Date`
- `cuposDisponibles(clase, reservas): number` → `cupoTotal - ocupados - (reservada ? 1 : 0)`
- `proximasClases(clases, reservas, now)` → excluye `now >= inicio`, ordena por inicio.
- `misReservas(clases, reservas, now)` → mismo filtro y orden.
- `validarReserva(claseId, clases, reservas, now): { ok: true } | { ok: false; mensaje }` → RN-02, RN-01, RN-03 en ese orden; retorna el primer fallo.
- `validarCancelacion(clase, now)` → RN-04 (`inicio - now >= 120 min`).

RN-03 cuenta todas las reservas del socio cuya clase cae en el mismo día (en Bogotá) que la clase a reservar, **incluidas las de clases que ya empezaron** (no se filtra por `now` al contar).

**Por qué**: el reloj inyectado hace que cada Scenario del spec sea una prueba determinista (ej. 16:00 vs 16:01) sin mocks de timers. La UI solo deshabilita el botón "Llena" como ayuda visual; el dominio rechaza igual (RN-01).

**Alternativa considerada**: reglas dentro del reducer o de los componentes. Se descarta porque acopla la lógica a React y obliga a pruebas de componente para validar reglas.

### 3. Manejo de estado: Context + useReducer en `src/state/`, en memoria

- Estado: `{ reservas: Reserva[] }` con `Reserva = { claseId }` (un solo socio autenticado). Las clases se leen de `clases.json` y no cambian; los cupos se derivan, no se almacenan.
- Acciones: `RESERVAR(claseId)` y `CANCELAR(claseId)`. El reducer es puro y no consulta el reloj.
- El provider expone `reservar(claseId)` y `cancelar(claseId)`, que obtienen `now = new Date()`, validan con el dominio y solo despachan si la validación pasa; devuelven `ok` o `mensaje` para que la pantalla lo muestre.
- Cancelación: la pantalla llama `validarCancelacion` al pulsar; si falla muestra el mensaje sin confirmación; si pasa abre un `Alert` de confirmación y al confirmar llama `cancelar`, que revalida RN-04 con un `now` nuevo.
- Un tick ligero (~30 s) fuerza re-render para que las clases que empiezan con la app abierta desaparezcan de ambas listas.

**Por qué**: dos pantallas comparten un estado pequeño; Context + useReducer lo cubre sin dependencias. Persistencia (AsyncStorage) queda fuera: el insumo la marca como bonus.

**Alternativa considerada**: Zustand/Redux. Se descarta por agregar una dependencia para un estado de una sola lista.

### 4. Cálculo de fechas: aritmética UTC con offset fijo de -5 horas

- `OFFSET_BOGOTA_MS = -5 * 60 * 60 * 1000`. Colombia no tiene horario de verano, así que el offset es constante.
- Fecha actual en Bogotá: `const b = new Date(now.getTime() + OFFSET_BOGOTA_MS)` y se leen `b.getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`.
- Inicio de la clase: `Date.UTC(año, mes, día + diaOffset, hh, mm) - OFFSET_BOGOTA_MS` (es decir, +5 h en UTC). `Date.UTC` normaliza desbordes de día/mes/año (31 oct + 2 → 2 nov).
- Clave de día para RN-03: `YYYY-MM-DD` del inicio de la clase en Bogotá.
- Formato visible: día "mié 7 oct" (día de semana abreviado, día y mes abreviado, sin año) y hora "HH:mm", con arreglos propios de nombres en español y getters UTC sobre la fecha desplazada; nunca `toLocaleString`, `Intl` ni getters locales.
- Pruebas: los instantes se escriben en UTC (`new Date('2026-10-07T21:00:00Z')` = 16:00 en Bogotá), así que el resultado no depende de la zona horaria de la máquina que corre Jest.

**Por qué**: es exacto para un offset fijo, no depende de la zona horaria del dispositivo ni de la base de datos de zonas del motor JS, y es trivial de probar con instantes UTC fijos.

Nota: el insumo (§6) dice "fecha actual del dispositivo", pero su supuesto de zona horaria es America/Bogota (§7). Se usa la fecha actual en Bogotá para que el resultado no cambie según la configuración del teléfono ni de la máquina de pruebas.

## Alternativa descartada

**Usar `date-fns-tz` o `dayjs` con plugin `timezone`.** Se descarta porque agrega dependencias para un caso que se resuelve con un offset fijo, y porque esas librerías dependen de `Intl.DateTimeFormat` con soporte de zonas IANA; en Hermes ese soporte varía según versión y plataforma, lo que introduce riesgo de comportamiento distinto entre iOS, Android y Jest (Node) sin aportar nada para America/Bogota.

## Risks / Trade-offs

- [Colombia adopta horario de verano en el futuro] → el offset fijo quedaría incorrecto. Mitigación: el offset está en una sola constante en `fechas.ts`; cambiarlo o migrar a una librería afecta un solo módulo.
- [El reloj del dispositivo está mal configurado] → fechas y RN-04 se calculan con una hora incorrecta. Aceptado: no hay backend que provea la hora.
- [Reservas en memoria se pierden al cerrar la app] → aceptado por el insumo; AsyncStorage queda como mejora posterior.
- [Una clase empieza mientras la pantalla está abierta o el diálogo de confirmación sigue abierto] → mitigado con el tick periódico, el filtro por `now` en cada cálculo y la revalidación de RN-04 al confirmar.
- [Desviación de AGENTS.md (Expo Router)] → decisión explícita del MVP; si la app crece se migra a Expo Router.
- [Supuesto revisado y aceptado: RN-03 cuenta también las reservas de clases del mismo día que ya empezaron] → es la lectura literal de la regla ("máximo 2 reservas por día"): una reserva de una clase ya empezada sigue siendo una reserva de ese día. Consecuencia: el socio no puede liberar el límite diario esperando a que pase una de sus clases.
