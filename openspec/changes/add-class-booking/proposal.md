# Proposal

## Why

Hoy las reservas de clases grupales de ClaseFit se hacen por WhatsApp con la recepción, lo que genera sobrecupos y reservas olvidadas. El MVP busca que el socio vea las próximas clases, reserve y cancele desde el celular, con las reglas de cupo y cancelación aplicadas de forma consistente.

## What Changes

- Nueva pantalla **Próximas clases** (HU-01): lista las clases de hoy, mañana y pasado mañana que aún no han empezado, ordenadas por fecha y hora, con nombre, día (con año), hora, instructor y cupos disponibles ("5 de 20 cupos"); las clases sin cupos muestran "Llena" y no se pueden reservar.
- Acción **Reservar** (HU-02): valida RN-02, RN-01 y RN-03 en ese orden, muestra solo el primer mensaje que falle y, si todo pasa, descuenta el cupo y muestra "¡Listo! Tu cupo está reservado".
- Nueva pantalla **Mis reservas** (HU-03): lista las reservas futuras del socio, la más próxima primero, o "Aún no tienes reservas"; permite cancelar con confirmación, aplicando RN-04 antes de pedir confirmación y otra vez al confirmar.
- Reglas de negocio RN-01 a RN-04 implementadas en el dominio, independientes de la UI. RN-03 cuenta también las reservas de clases del día que ya empezaron.
- Cálculo de fechas en America/Bogota (UTC-5 fijo) a partir de `diaOffset` y `hora`, independiente de la zona horaria del dispositivo.
- Navegación con un selector de 2 pestañas propio, sin librería de navegación.
- Datos locales desde `src/data/clases.json`; reservas en memoria (sin persistencia en este cambio).

Fuera de alcance (según el insumo): login, pagos, instructores, administración, notificaciones y backend.

## Capabilities

### New Capabilities
- `class-booking`: consulta de próximas clases, reserva y cancelación de clases grupales por parte del socio, con las reglas de cupo, duplicidad, límite diario y ventana de cancelación.

### Modified Capabilities
<!-- Ninguna: no existen specs previas en openspec/specs/. -->

## Impact

- **Código nuevo**: `src/domain/` (reglas y cálculo de fechas como funciones puras + pruebas en `src/domain/__tests__/`), `src/state/` (Context + reducer de reservas), `src/screens/` y `src/components/` (pantallas y componentes), `src/data/clases.json` (copia de `docs/insumo-funcional/mock-data/clases.json`).
- **Código modificado**: `App.tsx` pasa a ser el contenedor con el provider y el selector de 2 pestañas.
- **Dependencias**: ninguna nueva (sin librería de navegación ni de fechas).
- **Pruebas**: Jest con preset `jest-expo`, ya configurado.
