# Comparador de Alojamientos

Sitio web para comparar precios de alojamientos (hoteles, cabañas, departamentos y casas) entre los principales buscadores.
Ahora integra consultas en tiempo real a Google Hotels vía SerpAPI para recuperar opciones reales de reserva en Booking.com, Airbnb, Expedia, Vrbo, Agoda y más.

## Características

- Formulario para seleccionar ciudad, cantidad de personas y tipos de alojamiento múltiples.
- Resultados dinámicos con comparación de precios aproximados por plataforma.
- Diseño responsivo listo para publicar en GitHub Pages.

## Cómo utilizarlo

1. Clona este repositorio.
2. Instala las dependencias con `npm install` (requiere Node.js 18 o superior para disponer de `fetch` nativo).
3. Crea un archivo `.env` en la raíz con tu clave de [SerpAPI](https://serpapi.com/):

   ```env
   SERPAPI_KEY=tu_clave_personal
   ```

4. Inicia el servidor en modo local con `npm start` y visita `http://localhost:3000`.
5. Completa el formulario de búsqueda y presiona **Comparar precios** para ver los resultados actualizados desde los portales oficiales.

## Despliegue en GitHub Pages

1. Ve a la configuración del repositorio.
2. En **Pages**, selecciona la rama y carpeta raíz (`/`).
3. Guarda los cambios y espera a que GitHub genere la URL pública.

> Nota: Si no cuentas con una clave de SerpAPI, la aplicación mostrará los resultados de demostración almacenados en el cliente.
