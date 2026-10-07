# Respuestas de reflexión

## 1. ¿Tenías experiencia previa con OpenSpec o Spec-Driven Development?
No tenía experiencia con OpenSpec ni con Spec-Driven Development como metodología formal. Aun así, el enfoque me resultó muy familiar: uso una herramienta propia que sigue el mismo patrón, basada en el ciclo de vida del desarrollo de software, donde viven todas las specs. Por eso entendí rápido el ciclo de proponer, revisar, implementar y archivar. Me parecen herramientas muy interesantes y prácticas de usar, sobre todo porque dejan las decisiones escritas y trazables.

## 2. ¿Cómo cambia tu rol como desarrollador?
El rol del desarrollador viene evolucionando con cada avance tecnológico, y en mi caso ya trabajo como ingeniero de software en todas las fases del ciclo de vida, no solo en la implementación. Con SDD y la IA ese perfil pesa más: escribo menos código y dedico más tiempo a decidir y revisar. En esta prueba revisé la spec contra el insumo y quité el año que la IA agregó a la fecha. También exigí que cada prueba llevara el nombre de un Scenario, y ese cruce mostró tres escenarios sin cubrir. El valor está en saber qué pedir y en no aceptar un resultado solo porque pasa la validación.

## 3. ¿Cómo debería trabajar el equipo con este enfoque?
Visto desde un plano más amplio, SDD hace que todo el ciclo engrane y funcione de forma más eficiente. El equipo funcional entrega el insumo; el técnico lo convierte en spec y le devuelve las ambigüedades antes de escribir código. Nada pasa a implementación sin esa revisión. Así, cada fase recibe algo claro de la anterior y los errores se encuentran en la spec, donde corregirlos es barato, y no en producción. Es así como se genera software de alta calidad.

## 4. Ventajas y desventajas
A favor: SDD con OpenSpec le da a una sola persona más habilidades y potencia su trabajo. Con la spec como guía y la IA ejecutando, un desarrollador puede cubrir análisis, diseño, implementación y pruebas con una trazabilidad que antes exigía más gente. En contra: que una sola persona se encargue de todo no es sano. Cada fase debería tener su especialista, porque quien escribe la spec no debería ser el único que la revisa. En esta prueba, `openspec validate` pasó en verde con errores que solo una revisión cuidadosa detectó.

## 5. ¿Cuándo usarías SDD y cuándo no?
Usaría SDD cuando hay reglas de negocio, sobre todo si tienen bordes que se pueden interpretar de más de una forma. En esta prueba, RN-04 dependía de si "2 horas antes" incluía o no el minuto exacto, y RN-03 de si el límite se cuenta por el día de la clase o por el día en que se reserva. Sin una spec, esas decisiones quedan escondidas en el código y nadie las revisa. También lo usaría cuando varias personas tienen que ponerse de acuerdo sobre qué construir o cuando el código se va a mantener en el tiempo, porque la spec queda como documentación viva. No lo usaría en prototipos que se van a botar, pruebas técnicas rápidas o cambios triviales como corregir un texto: ahí escribir proposal, spec, design y tasks cuesta más que lo que aporta.
