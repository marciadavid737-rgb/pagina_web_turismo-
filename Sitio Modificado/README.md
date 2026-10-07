# CatrachoGo – Viaje a la Gran Muralla China desde Honduras

Sitio web estático de una agencia de turismo hondureña. Cuenta la historia de la Gran Muralla y vende tours y paquetes con precios en Lempiras.

## Estructura de archivos
```
index.html          Página principal (todo el contenido, organizado por categorías)
css/style.css       Estilos
js/data.js          DATOS editables: historia, materiales, videos, galería, tours, paquetes, hospedaje, vuelos, extras, testimonios, FAQ
js/main.js          Lógica: menú, reproductor, galería, filtros, cotizador, reserva
js/comprobante.js   Comprobante de cotización/reserva: visor, PDF (jsPDF), imprimir y WhatsApp
videos/             Videos que se reproducen en el sitio (sin YouTube)
  ├── mutianyu-panoramica.mp4     (1:33, 6.5 MB)
  ├── vista-desde-la-torre.mp4    (0:23, 2.4 MB)
  └── explorando-la-muralla.mp4   (2:28, 15.3 MB)
```

## Cómo está organizada la información (4 categorías)
| # | Categoría | Secciones (ancla) |
|---|-----------|-------------------|
| 01 | Conocé la Muralla | `#historia`, `#construccion`, `#videos`, `#galeria` |
| 02 | Planificá tu viaje | `#secciones`, `#comparativa`, `#paquetes`, `#hospedaje` |
| 03 | Reservá | `#reservar`, `#consultar` |
| 04 | Ayuda | `#nosotros`, `#testimonios`, `#faq`, `#contacto` |

También están `#inicio` (portada) e `#indice` (tarjetas que llevan a cada categoría). El menú de arriba tiene un desplegable para cada categoría.

## Funciones que ya están hechas
- **Historia**: qué es la Muralla, datos clave y una línea de tiempo con imágenes, desde el siglo VII a.C. hasta hoy.
- **Cómo se construyó**: 4 materiales con foto, 6 pasos de construcción, un mito y el costo humano.
- **Reproductor de video propio**: los videos se cargan desde `/videos`, se ven en la misma página y tienen lista de reproducción, avance automático al siguiente y botón de descarga.
- La galería se puede filtrar (Paisajes, Estaciones, Experiencias, Historia) y las fotos se abren en grande (lightbox).
- Tours con filtro y una **tabla comparativa** de las secciones.
- Paquetes, hospedaje, un cotizador con ISV y conversión a USD, y la reserva (FormSubmit + localStorage).
- Consulta de reservas por código.
- **Comprobante de cotización en PDF**: botones "Ver mi cotización" (formulario), "Ver comprobante / PDF" (resumen) y "Ver comprobante" (después de confirmar la reserva). Abre un visor con los colores del sitio y permite **Descargar PDF** (A4, jsPDF + autoTable), **Imprimir** y **enviar por WhatsApp**.
- Preguntas frecuentes **separadas por categoría** (Visa, Viaje, En la Muralla, Pagos).
- Diseño adaptable a celular y botón para volver arriba.

## Créditos y licencias de los videos
- *Great Wall of China – Mutianyu*: Ian Messenger, CC BY 2.0 (Internet Archive).
- *great wall 2nd tower view*: Lynette (Flickr), CC BY-NC 2.0 (Internet Archive).
- *The Great Wall – Explore*: Link Media, Inc. (colección Link TV, Internet Archive). Antes de usarlo con fines comerciales hay que confirmar los permisos.

## Pendiente / próximos pasos
- Poner videos propios de la agencia en `videos/` y agregarlos a `CG.VIDEOS` en `js/data.js`.
- Si se suben videos muy pesados (más de 20 MB), alojarlos en R2 o un CDN.
- Poner los enlaces reales de las redes sociales.
- Guardar las reservas en el servidor (por ahora solo quedan en el dispositivo y se envían por correo).

## Datos
No usa tablas. Las reservas se guardan en `localStorage` con la clave `cg_reservas` (incluye el detalle de costos `lines` y `comentarios` para el comprobante) y se envían por correo con FormSubmit. El código de cotización (`COT-XXXXXX`) se guarda en `sessionStorage` (`cg_cot_ref`).
