# Guía de Autogestión - Muebles M&O

Esta guía te explica de forma clara y paso a paso cómo administrar tu catálogo web, subir fotos reales de tus muebles y configurar tu número de WhatsApp para recibir pedidos directamente.

---

## 1. Configurar tu Número de WhatsApp

Si quieres cambiar el número de teléfono al que llegan los mensajes (actualmente configurado con un número de ejemplo), debes actualizarlo en dos archivos del código:

### Paso 1: Cambiar el Botón Flotante y el Header

Abre el archivo [Layout.astro](file:///C:/Users/Usuario/.gemini/antigravity/scratch/muebles-myo/src/layouts/Layout.astro) y busca la URL de WhatsApp:

```html
https://wa.me/51907242330
```

- Reemplaza `51907242330` por tu número con código de país (por ejemplo, `51` es Perú, seguido de tu número de 9 dígitos, sin espacios ni caracteres especiales).
- Cambia este enlace tanto en el botón flotante (al final del archivo) como en el botón "Escríbenos" del header.

### Paso 2: Cambiar el Botón de la Ficha de Producto

Abre el archivo [ProductGallery.tsx](file:///C:/Users/Usuario/.gemini/antigravity/scratch/muebles-myo/src/components/ProductGallery.tsx) y busca la línea de la variable `whatsappUrl` (alrededor de la línea 40):

```javascript
const whatsappUrl = `https://wa.me/51907242330?text=${encodeURIComponent(formattedMessage)}`;
```

- Reemplaza el número `51907242330` por tu número real. El mensaje dinámico que incluye el producto y color seleccionados se seguirá generando automáticamente.

---

## 2. Cómo Subir Imágenes de Nuevos Muebles

Todas las fotos reales de tus muebles deben almacenarse en la carpeta pública del proyecto.

1. Guarda las imágenes en formato `.png` o `.jpg` dentro del directorio:
   ```
   muebles-myo/public/images/
   ```
2. Te recomendamos usar nombres descriptivos en minúscula sin espacios. Por ejemplo:
   - `sillon_base.png` (para el mueble principal)
   - `sillon_azul.png` (para la variación en otro color)
   - `sillon_detalle.jpg` (para costuras o acercamientos)

---

## 3. Cómo Agregar o Modificar Muebles en el Catálogo

La base de datos de productos de la web está centralizada en dos archivos. Para añadir un producto nuevo (por ejemplo, un sillón o una mesa), debes registrarlo en ambos archivos:

### Paso A: Registrarlo en las Colecciones

Abre [src/pages/collection/[id].astro](file:///C:/Users/Usuario/.gemini/antigravity/scratch/muebles-myo/src/pages/collection/[id].astro) y localiza la constante `allProducts` (alrededor de la línea 34). Añade un nuevo bloque como este dentro del arreglo:

```javascript
  {
    id: 'sillon-nordico', // Identificador único (URL del producto)
    name: 'Sillón Nórdico Larvik', // Nombre visible
    category: 'Sillones', // Categoría
    collectionId: 'salon', // ID de colección ('salon', 'comedor' o 'iluminacion')
    price: 'S/ 1,899', // Precio en soles
    image: '/images/sillon_base.png', // Imagen de portada en la home/colección
    tag: 'Nuevo' // Etiqueta opcional (ej: 'Nuevo', 'Personalizable')
  }
```

### Paso B: Registrarlo en la Ficha de Detalle

Abre [src/pages/product/[id].astro](file:///C:/Users/Usuario/.gemini/antigravity/scratch/muebles-myo/src/pages/product/[id].astro).

1. En la función `getStaticPaths()`, añade tu nuevo `id` al listado:
   ```javascript
   export function getStaticPaths() {
     return [
       { params: { id: "nordic-sofa" } },
       { params: { id: "ottoman-set" } },
       { params: { id: "sillon-nordico" } }, // <-- TU NUEVO ID AQUÍ
     ];
   }
   ```
2. Busca la constante `products` (alrededor de la línea 15) y añade la configuración detallada de tu producto:

```javascript
  'sillon-nordico': {
    name: "Sillón Nórdico Larvik",
    price: "S/ 1,899",
    description: "Sillón individual de estilo escandinavo, ideal como complemento de lectura...",
    variations: [
      {
        colorName: 'Gris Perla', // Nombre del color
        hex: '#d1d5db', // Círculo de color en la web
        mainImage: '/images/sillon_base.png', // Foto principal en este color
        thumbnails: [
          '/images/sillon_detalle.jpg' // Fotos secundarias de este color
        ]
      },
      {
        colorName: 'Azul Báltico',
        hex: '#1e3a8a',
        mainImage: '/images/sillon_azul.png',
        thumbnails: []
      }
    ],
    specs: [
      { label: "Dimensiones", value: "85 x 80 x 90 cm" },
      { label: "Estructura", value: "Madera de haya maciza" }
    ],
    highlights: [
      "Tapizado antimanchas",
      "Garantía estructural de 3 años"
    ]
  }
```

---

## 4. Crear Nuevas Colecciones

Si quieres crear otra colección (por ejemplo, una línea de "Dormitorio"):

1. En [src/pages/collection/[id].astro](file:///C:/Users/Usuario/.gemini/antigravity/scratch/muebles-myo/src/pages/collection/[id].astro), añade la nueva colección en `getStaticPaths()` y en el objeto `collections`:
   ```javascript
   export function getStaticPaths() {
     return [
       { params: { id: "salon" } },
       { params: { id: "comedor" } },
       { params: { id: "iluminacion" } },
       { params: { id: "dormitorio" } }, // <-- NUEVA COLECCIÓN
     ];
   }
   ```
2. Define su nombre, descripción e imagen en el objeto `collections` de la misma página.
3. Ahora cualquier producto que tenga `collectionId: 'dormitorio'` aparecerá automáticamente en la página `/collection/dormitorio`.
