# Bitácora de uso de IA

## Herramientas que usé
- Claude Code: implementación dentro del proyecto (OpenSpec, código y pruebas).
- Claude (chat): planeación por fases, análisis del insumo funcional y detección de ambigüedades antes de escribir la spec.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | 2 | `/opsx:propose add-class-booking` con el insumo y los supuestos ya decididos (borde de RN-04, RN-03 por día de clase, orden de validación, zona horaria) | proposal, spec, design y tasks; validate pasó al primer intento |
| 2 | 2 | Ajustes de revisión: quitar el año del día, que reservar y cancelar retornen el resultado, ampliar la verificación manual de 6.4, quitar `expo lint` y registrar el supuesto de RN-03 | Spec fiel al insumo y tareas consistentes entre sí; la tarea 1.1 no se cambió porque `src/data/clases.json` aún no existía |
| 3 | 3 | `/opsx:apply add-class-booking` | Implementación de todas las tareas con pruebas; además corrigió la versión de `@react-native/jest-preset`, que no estaba en las tareas |
| 4 | 3 | Verificar que el dominio no lee el reloj, que RN-04 usa `>=` y que cada prueba coincide con un Scenario | Las dos primeras se cumplían; detectó 3 escenarios sin prueba, 2 de ellos de RN-04 |
| 5 | 3 | Extraer el flujo de cancelación a funciones puras con el reloj inyectado y probar los escenarios faltantes | 34 pruebas en verde; los escenarios de reglas y dominio quedaron con prueba de nombre exacto, y los 3 de UI (Llena, cancelación confirmada y no confirmada) se cubren con la verificación manual de 6.4 |

## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | Hallazgo de entorno: la configuración estándar de Jest para Expo (`jest-expo`) ya no es suficiente; el preset de React Native se movió al paquete `@react-native/jest-preset` | Al correr `npx jest --passWithNoTests` antes de escribir código, Jest falló pidiendo esa dependencia | Instalé `@react-native/jest-preset` con `npx expo install` para alinear la versión con el SDK de Expo |
| 2 | En `spec.md` (HU-01) exigió mostrar el día con año ("mié 7 oct 2026"), aunque el insumo solo pide "día" | Revisé el requisito y el escenario "Día mostrado con año" contra el insumo funcional | Pedí cambiarlo a "día" con el formato "mié 7 oct" y la hora "18:00", y ajustar las tareas 2.1 y 2.2 |
| 3 | En `tasks.md` (5.2), `reservar(claseId)` y `cancelar(claseId)` no retornaban el resultado de la validación, así que las pantallas no tenían cómo mostrar el mensaje de la regla que falló | Revisé la tarea contra los escenarios de HU-02 y HU-03, que exigen mostrar el mensaje correspondiente | Pedí que ambas retornen `ok` o el mensaje de la regla que falló |
| 4 | La verificación manual de la tarea 6.4 no cubría la confirmación de cancelación ni las clases llenas | Comparé la tarea con los escenarios de HU-01 y HU-03 | Agregué: cancelar con 2 horas o más pide confirmación, no confirmar mantiene la reserva, confirmar la elimina y libera el cupo, y una clase llena muestra "Llena" con el botón deshabilitado |
| 5 | La tarea 7.2 pedía correr `npx expo lint`, pero el proyecto no tiene ESLint configurado y no está en el alcance | Revisé la configuración del proyecto | Quité `npx expo lint` y dejé solo `npx tsc --noEmit` |
| 6 | Las tareas no incluían pruebas para 3 escenarios de la spec ("Sin reservas", "RN-04 se valida antes de pedir confirmación" y "RN-04 se revalida al confirmar"), 2 de ellos de RN-04 | Le pedí a la IA verificar que cada prueba coincidiera con un Scenario, y el cruce automático mostró los escenarios sin cubrir | Extraje el flujo de cancelación a funciones puras con el reloj inyectado (`solicitarCancelacion`, `confirmarCancelacion`, tareas 4.9 y 4.10) y agregué las pruebas con el nombre exacto de cada escenario |
| 7 | Dejó un helper de pruebas (`testHelpers.ts`) en el dominio de producción (`src/domain/`) | Revisando el reporte de la IA vi que `testHelpers.ts` estaba en `src/domain/`, junto al código de producción | Lo moví a `src/domain/__tests__/` y configuré `testMatch` en Jest para que solo cuenten como suites los archivos `*.test.ts` |
| 8 | Cambió la versión de `@react-native/jest-preset` (de `^0.87.1` a `0.86.3`) sin que estuviera en las tareas | Lo vi en su reporte y lo verifiqué contra la versión de React Native instalada (0.86.3) con `npx expo install --check` | Confirmé que `0.86.3` corresponde a `react-native` 0.86.3 y que `npx expo install --check` no reporta diferencias con el SDK 57, así que dejé el cambio |
| 9 | El script `test` de `package.json` quedó como `jest --watchAll` desde el setup inicial (commit `6e34eff`), así que `yarn test` no terminaba | Lo detectó la IA al correr las pruebas | Dejé `"test": "jest"` y agregué `"test:watch": "jest --watchAll"` para el modo watch |
| 10 | Aprendizaje propio: ejecuté `/opsx:apply` sin delimitar el alcance; la IA implementó todo el plan en vez de solo el bloque de dominio | La IA lo señaló cuando le pregunté por qué había avanzado a la sección 5 | Conservé el trabajo, separé los commits por bloque y, como aprendizaje, el alcance de cada bloque va dentro del mismo comando |

## Supuestos que la IA propuso y acepté
| Supuesto | Por qué lo acepté |
|---|---|
| RN-03 (máximo 2 reservas por día) cuenta también las reservas de clases del mismo día que ya empezaron | Revisé la regla y es su lectura literal: una reserva de una clase que ya empezó sigue siendo una reserva de ese día. Quedó registrado en `design.md` (Risks / Trade-offs) |

## Resultado de `openspec validate`
```
Change 'add-class-booking' is valid
```