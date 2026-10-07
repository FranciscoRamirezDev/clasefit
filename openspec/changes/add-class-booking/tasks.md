# Tasks

## 1. Datos y tipos

- [ ] 1.1 Copiar `docs/insumo-funcional/mock-data/clases.json` a `src/data/clases.json` sin modificar su contenido; verificar con `diff` que ambos archivos son idénticos
- [ ] 1.2 Crear `src/domain/types.ts` (Clase, Reserva, ResultadoValidacion) y `src/domain/mensajes.ts` con los 6 textos literales del insumo ("¡Listo! Tu cupo está reservado", "Aún no tienes reservas", "Esta clase ya no tiene cupos.", "Ya reservaste esta clase.", "Solo puedes reservar 2 clases por día.", "Ya no puedes cancelar: faltan menos de 2 horas."); verificar con `npx tsc --noEmit`

## 2. Dominio: fechas

- [ ] 2.1 Implementar `src/domain/fechas.ts` con aritmética UTC y offset fijo de -5 h (America/Bogota): fecha actual en Bogotá, `inicioClase(clase, now)`, clave de día `YYYY-MM-DD` en Bogotá, `yaEmpezo(clase, now)` (`now >= inicio`), `formatearDia` ("mié 7 oct 2026") y `formatearHora` ("18:00") sin `Intl`, `toLocaleString` ni getters locales
- [ ] 2.2 Escribir `src/domain/__tests__/fechas.test.ts` (instantes en UTC, ej. `new Date('2026-10-07T21:00:00Z')`) con una prueba por escenario: "Fecha de la clase calculada en Bogotá", "Zona horaria del dispositivo distinta a Bogotá", "Cambio de mes", "Día mostrado con año"; verificar con `npx jest src/domain/__tests__/fechas.test.ts`
- [ ] 2.3 Agregar a `fechas.test.ts` pruebas de `yaEmpezo` para 1 ms antes del inicio (false) y exactamente en el inicio (true); verificar que pasan

## 3. Dominio: clases y cupos (HU-01, HU-03)

- [ ] 3.1 Implementar en `src/domain/clases.ts` `cuposDisponibles(clase, reservas)` (cupoTotal - ocupados - 1 si el socio la reservó), `proximasClases(clases, reservas, now)` y `misReservas(clases, reservas, now)` (excluyen clases empezadas, ordenan por inicio)
- [ ] 3.2 Escribir `src/domain/__tests__/clases.test.ts` con una prueba por escenario: "Formato de cupos disponibles sin reserva del socio", "Cupos disponibles con reserva del socio", "Lista ordenada de los tres días", "Clase que ya empezó no aparece", "Clase en el instante exacto de inicio", "Reservas ordenadas por proximidad", "Reserva de una clase que ya empezó no aparece"; verificar con `npx jest src/domain/__tests__/clases.test.ts`

## 4. Dominio: reglas de negocio

- [ ] 4.1 Implementar en `src/domain/reglas.ts` RN-01 (sin cupos), RN-02 (duplicada) y RN-03 (máx. 2 por día de clase en Bogotá, contando también reservas de clases del día que ya empezaron), cada una retornando `ok` o el mensaje de `mensajes.ts`
- [ ] 4.2 Escribir `src/domain/__tests__/rn01.test.ts` con una prueba por escenario de RN-01: "Clase llena", "Último cupo disponible", "Regla aplicada sin depender de la UI"; verificar que pasan
- [ ] 4.3 Escribir `src/domain/__tests__/rn02.test.ts` con la prueba del escenario "Reserva duplicada"; verificar que pasa
- [ ] 4.4 Escribir `src/domain/__tests__/rn03.test.ts` con una prueba por escenario de RN-03: "Tercera reserva el mismo día de clase", "Reservas hechas hoy para días distintos", "Segunda reserva del día permitida", "Reservas de clases que ya empezaron cuentan para el límite"; verificar que pasan
- [ ] 4.5 Implementar `validarCancelacion(clase, now)` (RN-04: permitido si `inicio - now >= 120 min`) en `reglas.ts`
- [ ] 4.6 Escribir `src/domain/__tests__/rn04.test.ts` con una prueba por escenario de RN-04: "Exactamente 2 horas antes" (permitido), "1 hora 59 minutos antes" (bloqueado con el mensaje literal), "Con amplio margen"; verificar que pasan
- [ ] 4.7 Implementar `validarReserva(claseId, clases, reservas, now)` que evalúa RN-02, luego RN-01, luego RN-03 y retorna solo el primer fallo
- [ ] 4.8 Escribir `src/domain/__tests__/validarReserva.test.ts` con una prueba por escenario de HU-02: "Reserva exitosa", "RN-02 se valida antes que RN-01", "RN-01 se valida antes que RN-03", "Una regla falla y no se reserva"; verificar con `npx jest src/domain`

## 5. Estado

- [ ] 5.1 Implementar `src/state/reservasReducer.ts` (acciones `RESERVAR` y `CANCELAR`, puro, sin reloj) y probarlo en `src/state/__tests__/reservasReducer.test.ts` (reservar agrega, cancelar quita, cancelar inexistente no cambia el estado); verificar que pasan
- [ ] 5.2 Implementar `src/state/ReservasContext.tsx` con `useReducer`, exponiendo `reservas`, `reservar(claseId)` y `cancelar(claseId)` que validan con el dominio usando `new Date()` y solo despachan si la validación pasa; verificar con `npx tsc --noEmit`
- [ ] 5.3 Agregar un hook `useAhora` con tick periódico (~30 s) que fuerce re-render para ocultar clases que empiezan con la app abierta; verificar con `npx tsc --noEmit`

## 6. Pantallas y navegación

- [ ] 6.1 Crear `src/components/ClaseCard.tsx` (nombre, día "mié 7 oct 2026", hora, instructor, "X de Y cupos" o "Llena", botón de acción deshabilitado si está llena) usando el formateo de `fechas.ts`; verificar con `npx tsc --noEmit`
- [ ] 6.2 Crear `src/screens/ProximasClasesScreen.tsx`: lista de `proximasClases`, botón Reservar que llama `reservar` y muestra con `Alert` "¡Listo! Tu cupo está reservado" o el mensaje de la regla que falló; verificar con `npx tsc --noEmit`
- [ ] 6.3 Crear `src/screens/MisReservasScreen.tsx`: lista de `misReservas` o "Aún no tienes reservas"; al pulsar cancelar valida RN-04, muestra el mensaje si falla o un `Alert` de confirmación si pasa, y al confirmar llama `cancelar` (que revalida); verificar con `npx tsc --noEmit`
- [ ] 6.4 Crear `src/components/TabSelector.tsx` y reemplazar el contenido de `App.tsx` por `ReservasProvider` + selector de 2 pestañas ("Próximas clases", "Mis reservas"); verificar en `npx expo start` que se alterna entre pestañas, que reservar una clase baja sus cupos en uno, que reservarla de nuevo muestra "Ya reservaste esta clase." y que cancelarla libera el cupo

## 7. Verificación final

- [ ] 7.1 Correr `npx jest` (sin `--watchAll`) y verificar que todas las pruebas pasan, incluida una por cada Scenario de RN-01 a RN-04
- [ ] 7.2 Correr `npx tsc --noEmit` y `npx expo lint` y verificar que terminan sin errores
- [ ] 7.3 Correr `openspec validate add-class-booking --strict` y verificar que el cambio es válido
