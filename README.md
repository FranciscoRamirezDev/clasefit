# ClaseFit · MVP de reserva de clases

App en React Native (Expo + TypeScript) para que un socio del gimnasio vea las próximas clases, reserve y cancele, construida con Spec-Driven Development usando OpenSpec.

## Requisitos
- Node.js 20.19.4 o superior (en las ramas 22 y 24: 22.13 o 24.3 en adelante)
- Yarn
- Expo Go en el celular, o un emulador

## Correr la app
```bash
yarn install
npx expo start
```
Escanea el QR con Expo Go.

## Correr las pruebas
```bash
yarn test
```
34 pruebas unitarias; las de las reglas RN-01 a RN-04 llevan el nombre exacto del Scenario de la spec que cubren.

## Estructura
- `src/domain/`: reglas de negocio como funciones puras, con la fecha actual inyectada.
- `src/state/`: estado de reservas en memoria (Context + useReducer).
- `src/screens/` y `src/components/`: pantallas Próximas clases y Mis reservas.
- `openspec/specs/class-booking/spec.md`: spec vigente.
- `openspec/changes/archive/`: cambio `add-class-booking` con proposal, design y tasks.

## Supuestos principales
- RN-04: se puede cancelar con 2 horas o más de anticipación; con menos de 2 horas se bloquea.
- RN-03: el límite de 2 reservas se cuenta por día de la clase, incluyendo clases de ese día que ya empezaron.
- Al reservar se valida RN-02, luego RN-01 y luego RN-03; se muestra solo el primer mensaje que falle.
- Las fechas se calculan en America/Bogota (UTC-5), sin depender de la zona horaria del dispositivo.

## Release
- `app.json` y `eas.json` configurados (perfiles preview y production).
- APK de prueba: https://expo.dev/accounts/faluradev/projects/clasefit/builds/e3a382cf-bc62-4d5d-b146-2e4478609c1c
- Configuración de release y riesgos para publicar: ver `checklist_release.md`.

## Documentos de la prueba
- `bitacora_ia.md`: uso de IA y errores detectados.
- `respuestas_reflexion.md`: reflexión sobre SDD y OpenSpec.
