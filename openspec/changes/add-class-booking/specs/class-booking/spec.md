# Spec Delta

## Purpose

Permite que el socio autenticado vea las próximas clases grupales del gimnasio, reserve un cupo y cancele sus reservas desde el celular, aplicando las reglas de cupo, duplicidad, límite diario y ventana de cancelación.

## ADDED Requirements

### Requirement: HU-01 Ver próximas clases
El sistema SHALL mostrar en "Próximas clases" las clases de hoy, mañana y pasado mañana que no han empezado, ordenadas por fecha y hora. Cada clase SHALL mostrar nombre, día, hora, instructor y "X de Y cupos" (X = cupoTotal - ocupados - 1 si el socio la reservó). La fecha de la clase SHALL ser la fecha actual en America/Bogota (UTC-5 fijo) + diaOffset, a la hora indicada, sin importar la zona del dispositivo.

#### Scenario: Lista ordenada de los tres días
- **WHEN** el socio abre "Próximas clases" y ninguna clase ha empezado
- **THEN** ve las clases con `diaOffset` 0, 1 y 2 ordenadas por fecha y hora de inicio
- **AND** cada clase muestra nombre, día, hora, instructor y cupos disponibles

#### Scenario: Día mostrado
- **WHEN** la fecha actual en Bogotá es miércoles 7 de octubre de 2026 y una clase tiene `diaOffset` 0 y `hora` "18:00"
- **THEN** la clase muestra el día "mié 7 oct" y la hora "18:00"

#### Scenario: Formato de cupos disponibles sin reserva del socio
- **WHEN** una clase tiene `cupoTotal` 15 y `ocupados` 9 y el socio no la ha reservado
- **THEN** la clase muestra "6 de 15 cupos"

#### Scenario: Cupos disponibles con reserva del socio
- **WHEN** una clase tiene `cupoTotal` 15 y `ocupados` 9 y el socio la reservó
- **THEN** la clase muestra "5 de 15 cupos"

#### Scenario: Clase que ya empezó no aparece
- **WHEN** la hora actual en Bogotá es igual o posterior a la hora de inicio de una clase
- **THEN** esa clase no aparece en "Próximas clases"

#### Scenario: Clase en el instante exacto de inicio
- **WHEN** la hora actual en Bogotá es exactamente la hora de inicio de la clase (ej. 18:00:00 para una clase de las 18:00)
- **THEN** la clase se considera empezada y no aparece

#### Scenario: Clase sin cupos se muestra como Llena
- **WHEN** una clase tiene 0 cupos disponibles
- **THEN** la clase muestra "Llena"
- **AND** el botón de reservar de esa clase está deshabilitado

#### Scenario: Fecha de la clase calculada en Bogotá
- **WHEN** la fecha actual en Bogotá es 2026-10-07 y una clase tiene `diaOffset` 1 y `hora` "06:00"
- **THEN** la clase inicia el 2026-10-08 a las 06:00 hora de Bogotá (2026-10-08T11:00:00Z)

#### Scenario: Zona horaria del dispositivo distinta a Bogotá
- **WHEN** el instante actual es 2026-10-08T04:30:00Z (2026-10-07 23:30 en Bogotá) y el dispositivo está configurado en UTC
- **THEN** la fecha actual usada es 2026-10-07 (Bogotá), no 2026-10-08
- **AND** una clase con `diaOffset` 1 y `hora` "06:00" inicia el 2026-10-08 a las 06:00 hora de Bogotá

#### Scenario: Cambio de mes
- **WHEN** la fecha actual en Bogotá es 2026-10-31 y una clase tiene `diaOffset` 2 y `hora` "08:00"
- **THEN** la clase inicia el 2026-11-02 a las 08:00 hora de Bogotá

### Requirement: HU-02 Reservar una clase
El sistema SHALL permitir al socio reservar una clase de "Próximas clases". Antes de reservar SHALL validar RN-02, luego RN-01 y luego RN-03, y SHALL devolver solo el mensaje de la primera regla que falle sin registrar la reserva. Si todas pasan, SHALL registrar la reserva, reducir en uno los cupos disponibles y mostrar "¡Listo! Tu cupo está reservado".

#### Scenario: Reserva exitosa
- **WHEN** el socio reserva una clase con cupos disponibles, que no ha reservado, en un día donde tiene menos de 2 reservas
- **THEN** la reserva queda registrada
- **AND** los cupos disponibles de la clase bajan en uno
- **AND** el socio ve "¡Listo! Tu cupo está reservado"

#### Scenario: RN-02 se valida antes que RN-01
- **WHEN** el socio intenta reservar una clase que ya reservó y que además tiene 0 cupos disponibles
- **THEN** el socio ve solo "Ya reservaste esta clase."
- **AND** no se registra una nueva reserva

#### Scenario: RN-01 se valida antes que RN-03
- **WHEN** el socio ya tiene 2 reservas para un día e intenta reservar otra clase de ese mismo día que tiene 0 cupos disponibles
- **THEN** el socio ve solo "Esta clase ya no tiene cupos."
- **AND** no se registra la reserva

#### Scenario: Una regla falla y no se reserva
- **WHEN** cualquiera de RN-01, RN-02 o RN-03 falla
- **THEN** no se registra la reserva
- **AND** los cupos disponibles de la clase no cambian

### Requirement: HU-03 Ver y cancelar mis reservas
El sistema SHALL mostrar en "Mis reservas" las reservas del socio de clases que aún no han empezado, la más próxima primero, o "Aún no tienes reservas" si no hay ninguna. Al cancelar, SHALL validar RN-04 antes de pedir confirmación y otra vez al confirmar; si el socio confirma y RN-04 se cumple, la reserva SHALL desaparecer y el cupo SHALL liberarse.

#### Scenario: Reservas ordenadas por proximidad
- **WHEN** el socio tiene reservas en varias clases futuras
- **THEN** "Mis reservas" las muestra ordenadas por fecha y hora de inicio, la más próxima primero

#### Scenario: Sin reservas
- **WHEN** el socio no tiene reservas de clases que no hayan empezado
- **THEN** ve "Aún no tienes reservas"

#### Scenario: Reserva de una clase que ya empezó no aparece
- **WHEN** el socio tiene una reserva de una clase cuya hora de inicio es igual o anterior a la hora actual en Bogotá
- **THEN** esa reserva no aparece en "Mis reservas"

#### Scenario: Cancelación confirmada
- **WHEN** el socio pulsa cancelar en una reserva que cumple RN-04 y confirma
- **THEN** la reserva desaparece de "Mis reservas"
- **AND** los cupos disponibles de esa clase suben en uno en "Próximas clases"

#### Scenario: Cancelación no confirmada
- **WHEN** el socio pulsa cancelar en una reserva que cumple RN-04 y no confirma
- **THEN** la reserva se mantiene y los cupos no cambian

#### Scenario: RN-04 se valida antes de pedir confirmación
- **WHEN** el socio pulsa cancelar en una reserva que no cumple RN-04
- **THEN** ve "Ya no puedes cancelar: faltan menos de 2 horas."
- **AND** no se le pide confirmación y la reserva se mantiene

#### Scenario: RN-04 se revalida al confirmar
- **WHEN** el socio pulsa cancelar faltando exactamente 2 horas para el inicio, se le pide confirmación, y confirma cuando ya faltan menos de 2 horas
- **THEN** ve "Ya no puedes cancelar: faltan menos de 2 horas."
- **AND** la reserva se mantiene

### Requirement: RN-01 No reservar clases sin cupos
El sistema SHALL rechazar la reserva de una clase con 0 cupos disponibles (cupoTotal - ocupados - reserva del socio) con el mensaje "Esta clase ya no tiene cupos.". La regla SHALL aplicarse en el dominio aunque la interfaz deshabilite el botón de reservar.

#### Scenario: Clase llena
- **WHEN** el socio intenta reservar una clase con `cupoTotal` 12 y `ocupados` 12
- **THEN** la reserva se rechaza con "Esta clase ya no tiene cupos."

#### Scenario: Último cupo disponible
- **WHEN** el socio intenta reservar una clase con `cupoTotal` 15 y `ocupados` 14 que no ha reservado
- **THEN** RN-01 se cumple y la clase queda con 0 cupos disponibles después de reservar

#### Scenario: Regla aplicada sin depender de la UI
- **WHEN** se solicita reservar una clase llena directamente al dominio, sin pasar por el botón
- **THEN** la reserva se rechaza con "Esta clase ya no tiene cupos."

### Requirement: RN-02 No reservar la misma clase dos veces
El sistema SHALL rechazar la reserva de una clase que el socio ya tiene reservada con el mensaje "Ya reservaste esta clase.".

#### Scenario: Reserva duplicada
- **WHEN** el socio intenta reservar una clase que ya reservó
- **THEN** la reserva se rechaza con "Ya reservaste esta clase."
- **AND** el socio sigue teniendo una sola reserva de esa clase

### Requirement: RN-03 Máximo 2 reservas por día de clase
El sistema SHALL rechazar una reserva si el socio ya tiene 2 reservas de clases que ocurren el mismo día (en Bogotá) que la clase a reservar, con el mensaje "Solo puedes reservar 2 clases por día.". El límite SHALL contarse por el día de la clase, no por el día en que se hace la reserva, y SHALL incluir las reservas de clases de ese día que ya empezaron.

#### Scenario: Tercera reserva el mismo día de clase
- **WHEN** el socio tiene reservadas 2 clases de mañana e intenta reservar una tercera clase de mañana con cupos disponibles
- **THEN** la reserva se rechaza con "Solo puedes reservar 2 clases por día."

#### Scenario: Reservas hechas hoy para días distintos
- **WHEN** el socio, hoy, reservó 2 clases de mañana e intenta reservar una clase de hoy con cupos disponibles
- **THEN** RN-03 se cumple y la reserva se registra

#### Scenario: Segunda reserva del día permitida
- **WHEN** el socio tiene 1 reserva para pasado mañana e intenta reservar otra clase de pasado mañana con cupos disponibles
- **THEN** RN-03 se cumple y la reserva se registra

#### Scenario: Reservas de clases que ya empezaron cuentan para el límite
- **WHEN** el socio reservó hoy una clase de las 06:00 y otra de las 18:00, son las 10:00 (la de las 06:00 ya empezó) e intenta reservar una clase de hoy a las 20:00 con cupos disponibles
- **THEN** la reserva se rechaza con "Solo puedes reservar 2 clases por día."

### Requirement: RN-04 Cancelar solo hasta 2 horas antes
El sistema SHALL permitir cancelar una reserva solo si faltan 120 minutos o más para el inicio de la clase. Si faltan menos de 120 minutos SHALL bloquear la cancelación con el mensaje "Ya no puedes cancelar: faltan menos de 2 horas.".

#### Scenario: Exactamente 2 horas antes
- **WHEN** la clase inicia a las 18:00 y el socio cancela a las 16:00 (faltan 120 minutos)
- **THEN** la cancelación está permitida

#### Scenario: 1 hora 59 minutos antes
- **WHEN** la clase inicia a las 18:00 y el socio cancela a las 16:01 (faltan 119 minutos)
- **THEN** la cancelación se bloquea con "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: Con amplio margen
- **WHEN** la clase inicia mañana a las 06:00 y el socio cancela hoy a las 20:00
- **THEN** la cancelación está permitida
