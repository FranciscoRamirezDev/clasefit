# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json` (ClaseFit, clasefit, 1.0.0)
- [x] `android.package` e `ios.bundleIdentifier` (com.keppri.clasefit.franciscoramirez)
- [x] `eas.json` con perfiles preview (APK de distribución interna) y production (AAB por defecto, `autoIncrement`)
- [x] Números de build administrados por EAS (`appVersionSource: "remote"`); `ios.buildNumber` y `android.versionCode` de `app.json` no se usan en los builds de EAS
- [ ] (Bonus) Build instalable · enlace:

## Falta para Google Play
- [ ] Cuenta de Google Play Console (pago único de USD 25)
- [ ] Build de producción en AAB: `npx eas-cli@latest build --platform android --profile production`
- [ ] Ficha de la tienda: descripción corta y larga, ícono 512x512, gráfico destacado 1024x500 y capturas de pantalla
- [ ] URL pública de política de privacidad
- [ ] Formulario de Seguridad de datos (la app no recolecta datos personales hoy, pero hay que declararlo)
- [ ] Cuestionario de clasificación de contenido y público objetivo
- [ ] Prueba cerrada previa a producción si la cuenta es personal y nueva (requisito vigente de Google Play)
- [ ] Envío con `npx eas-cli@latest submit --platform android`

## Falta para App Store
- [ ] Membresía del Apple Developer Program (USD 99 al año)
- [ ] Registro de la app en App Store Connect con el bundle identifier
- [ ] Build de iOS de producción: `npx eas-cli@latest build --platform ios --profile production` (requiere credenciales de Apple)
- [ ] Etiquetas de privacidad (App Privacy) en App Store Connect
- [ ] Capturas para los tamaños de pantalla requeridos, descripción y palabras clave
- [ ] Distribución por TestFlight para pruebas internas
- [ ] Envío a revisión con `npx eas-cli@latest submit --platform ios`

## Riesgos o bloqueos para publicar
- La app usa datos mock locales y las reservas viven en memoria: se pierden al cerrar la app. Para publicar se necesita backend o, como mínimo, persistencia con AsyncStorage.
- Apple puede rechazar una app con datos ficticios o funcionalidad mínima (App Review Guidelines 4.2).
- Ícono y splash son los de la plantilla de Expo; hay que reemplazarlos por la marca del gimnasio. Además, `app.json` no configura el splash (`assets/splash-icon.png` existe pero no se usa).
- La validación de horarios depende del reloj del dispositivo; con backend, la hora de referencia debería ser la del servidor.
- Solo se probó en Android con Expo Go; falta probar en iOS y en el build nativo.
