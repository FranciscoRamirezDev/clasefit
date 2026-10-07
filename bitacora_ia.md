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

## Resultado de `openspec validate`
```
Change 'add-class-booking' is valid
```