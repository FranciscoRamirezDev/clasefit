# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json` (ClaseFit, clasefit, 1.0.0)
- [x] `android.package` e `ios.bundleIdentifier` (com.keppri.clasefit.franciscoramirez)
- [x] `eas.json` con perfiles preview (APK de distribución interna) y production (AAB por defecto, `autoIncrement`)
- [x] Números de build administrados por EAS (`appVersionSource: "remote"`); `ios.buildNumber` y `android.versionCode` de `app.json` no se usan en los builds de EAS
- [x] (Bonus) Build instalable · enlace: https://expo.dev/accounts/faluradev/projects/clasefit/builds/e3a382cf-bc62-4d5d-b146-2e4478609c1c


