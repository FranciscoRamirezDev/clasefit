# Bitácora de uso de IA

## Herramientas que usé
- Claude Code: implementación dentro del proyecto (OpenSpec, código y pruebas).
- Claude (chat): planeación por fases, análisis del insumo funcional y detección de ambigüedades antes de escribir la spec.

## Prompts clave (3 a 5)
| # | Fase | Prompt | Qué obtuve |
|---|---|---|---|
| 1 | | | |

## Errores de la IA que detecté
| # | Qué hizo mal | Cómo lo detecté | Cómo lo resolví |
|---|---|---|---|
| 1 | Hallazgo de entorno: la configuración estándar de Jest para Expo (`jest-expo`) ya no es suficiente; el preset de React Native se movió al paquete `@react-native/jest-preset` | Al correr `npx jest --passWithNoTests` antes de escribir código, Jest falló pidiendo esa dependencia | Instalé `@react-native/jest-preset` con `npx expo install` para alinear la versión con el SDK de Expo |
| 2 | En `spec.md` (HU-01) exigió mostrar el día con año ("mié 7 oct 2026"), aunque el insumo solo pide "día" | Revisé el requisito y el escenario "Día mostrado con año" contra el insumo funcional | Pedí cambiarlo a "día" con el formato "mié 7 oct" y la hora "18:00", y ajustar las tareas 2.1 y 2.2 |
| 3 | En `tasks.md` (5.2), `reservar(claseId)` y `cancelar(claseId)` no retornaban el resultado de la validación, así que las pantallas no tenían cómo mostrar el mensaje de la regla que falló | Revisé la tarea contra los escenarios de HU-02 y HU-03, que exigen mostrar el mensaje correspondiente | Pedí que ambas retornen `ok` o el mensaje de la regla que falló |
| 4 | La verificación manual de la tarea 6.4 no cubría la confirmación de cancelación ni las clases llenas | Comparé la tarea con los escenarios de HU-01 y HU-03 | Agregué: cancelar con 2 horas o más pide confirmación, no confirmar mantiene la reserva, confirmar la elimina y libera el cupo, y una clase llena muestra "Llena" con el botón deshabilitado |
| 5 | La tarea 7.2 pedía correr `npx expo lint`, pero el proyecto no tiene ESLint configurado y no está en el alcance | Revisé la configuración del proyecto | Quité `npx expo lint` y dejé solo `npx tsc --noEmit` |

## Supuestos que la IA propuso y acepté
| Supuesto | Por qué lo acepté |
|---|---|
| RN-03 (máximo 2 reservas por día) cuenta también las reservas de clases del mismo día que ya empezaron | Revisé la regla y es su lectura literal: una reserva de una clase que ya empezó sigue siendo una reserva de ese día. Quedó registrado en `design.md` (Risks / Trade-offs) |

## Resultado de `openspec validate`
```
Change 'add-class-booking' is valid
```