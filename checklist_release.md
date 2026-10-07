# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json` (ClaseFit, clasefit, 1.0.0)
- [x] `android.package` e `ios.bundleIdentifier` (com.keppri.clasefit.franciscoramirez)
- [x] `eas.json` con perfiles preview (APK de distribución interna) y production (AAB por defecto, `autoIncrement`)
- [x] Números de build administrados por EAS (`appVersionSource: "remote"`); `ios.buildNumber` y `android.versionCode` de `app.json` no se usan en los builds de EAS
- [x] (Bonus) Build instalable · enlace: https://expo.dev/accounts/faluradev/projects/clasefit/builds/e3a382cf-bc62-4d5d-b146-2e4478609c1c

## Riesgos o bloqueos para publicar
- La app usa datos mock locales y las reservas viven en memoria: se pierden al cerrar la app. Para publicar se necesita backend o, como mínimo, persistencia con AsyncStorage.
- Apple puede rechazar una app con datos ficticios o funcionalidad mínima (App Review Guidelines 4.2).
- Ícono y splash son los de la plantilla de Expo; hay que reemplazarlos por la marca del gimnasio. Además, `app.json` no configura el splash (`assets/splash-icon.png` existe pero no se usa).
- La validación de horarios depende del reloj del dispositivo; con backend, la hora de referencia debería ser la del servidor.
- Solo se probó en Android con Expo Go; falta probar en iOS y en el build nativo.
