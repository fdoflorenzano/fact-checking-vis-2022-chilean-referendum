# Visualización de Factchecking Plebiscito de Salida 2022

Este proyecto es un ejercicio de visualización y diseño, aplicado al trabajo realizado por [Factchecking.cl](https://factchecking.cl), en particular aplicado para el [Plebiscito de Salida 2022](https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/).

Al consumir las verificaciones de Factchecking a través de su página web tuve un par de dificultades. Este proyecto busca mejorar la experiencia de consumir las verificaciones realizadas a través de visualización de datos y re-diseño de información. Las dificultades que resaltaron fueron:

- Es difícil saber rápidamente el resultado de verificaciones individuales, ya que el uso de colores constante en avatares y de fondo hace necesario leer el texto cada vez.
- No se incluyen datos importantes con cada verificación, como fuente de publicación original, ni una respuesta a porqué la afirmación fue catalogada como tal. Se puede entender esto como una invitación a leer el artículo completo, pero creo es posible hacerlo de forma limitada.
- Las estadísticas al inicio de la página son muy superficiales y son solo numéricas. No permiten apreciar la totalidad de trabajo realizado, ni poder dimensionar las proporciones de resultados de verificación.

Todo lo anterior se dice desde un punto de vista constructivo, desde alguien que respeta el trabajo y misión de la plataforma. Todos los datos incluidos aquí fueron extraídos de la web de Factchecking, y manualmente verificados por mi. Esto último para aclarar que es muy posible aparezcan errores, ya sean manuales o que vienen de los datos originales.

## Tecnologías

Este proyecto fue inicializado con un _template_ de React + Vite + TS. Se agregaron `d3` y algunas dependencias de `@radix-ui` para elevar rápidamente la usabilidad y posibilidades de visualización en el _front-end_.

También se utilizaron una serie de scripts para procesar los datos a visualizar, que utilizan `cheerio` para web scraping y `@google/genai` para extraer algunos aspectos que luego fueron verificados manualmente.

### Datos

Se realizaron los siguientes pasos:

- Correr `npm run data:scrape` para navegar las verificaciones del proyecto de interés y extraer el HTML de cada artículo.\
- Correr `npm run data:extend` para procesar los HTML extraídos y analizar el contenido con Gemini para extraer y determinar ciertos atributos no siempre explícitamente mencionados, como: fecha de publicación de afirmación y fuente de publicación.
- Luego se procesaron manualmente los valores extraídos, corrigiendo varios y extendiendo el valor de fuente de publicación. A su vez se agrega manualmente el valor de preferencia de opción para el plebiscito.
- Finalmente correr `npm run data:clean` que simplemente filtra los datos y atributos que efectivamente se usan finalmente por cada verificación/afirmación.

### Front-end

Para ejecutar/construir la aplicación localmente, se pueden usar los comandos esperables: `npm run dev` y `npm run build`.
