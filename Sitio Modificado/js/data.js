/* =========================================================
   CatrachoGo – Datos del sitio (contenido clasificado)
   Editá este archivo para cambiar precios, textos, fotos o videos.
   ========================================================= */
var CG = (function () {
  "use strict";
  var IMG = function (id, w) { return "https://sspark.genspark.ai/i/" + id + "?width=" + (w || 1000); };

  return {
    RATE: 26.5,   // Lempiras por dólar (referencial)
    ISV: 0.15,
    IMG: IMG,

    /* ---------- 01 · CONOCÉ LA MURALLA ---------- */
    TIMELINE: [
      { date: "Siglo VII – III a.C.", title: "Los primeros muros", img: IMG("Kj3U5qkf641tsGEP", 900), cap: "Pintura tradicional china",
        text: "En la época de los Reinos Combatientes, varios estados chinos (Qi, Yan, Zhao, Wei) levantaron muros de tierra apisonada para defenderse entre sí y de los nómadas del norte." },
      { date: "221 – 206 a.C.", title: "Qin Shi Huang une las murallas", img: IMG("lpwQ2feTnI5YvdOm", 900), cap: "Ilustración: soldados de la era Qin",
        text: "El primer emperador de China unificó el país y ordenó conectar los muros existentes en una sola línea defensiva de unos 5,000 km. Cientos de miles de soldados, campesinos y presos trabajaron en ella." },
      { date: "206 a.C. – 220 d.C.", title: "Dinastía Han: hacia el desierto", img: IMG("q9JLeAvYzyL0Tsqm", 900), cap: "Ruinas Han de tierra apisonada, Gansu",
        text: "Los Han la extendieron hacia el oeste, hasta el desierto de Gobi, para proteger la Ruta de la Seda. Usaban capas de grava, tierra y juncos que aún resisten en Dunhuang." },
      { date: "Siglos V – XIV", title: "Siglos de reconstrucciones", img: IMG("MLI9TY27W6faHn6r", 900), cap: "Ilustración: obreros en plena construcción",
        text: "Dinastías como los Wei del Norte, Sui y Jin reforzaron distintos tramos. Durante la dinastía Yuan (mongoles) la Muralla perdió importancia, porque los invasores ya gobernaban China." },
      { date: "1368 – 1644", title: "Dinastía Ming: la Muralla que hoy visitás", img: IMG("W2djfjj44glghY2q", 900), cap: "Tramo Ming con torre de vigilancia",
        text: "Tras expulsar a los mongoles, los Ming construyeron la versión más fuerte: ladrillo cocido, piedra labrada, miles de torres y fortalezas como Shanhaiguan, donde la Muralla entra al mar." },
      { date: "1644 – 1900s", title: "Fin de su uso militar", img: IMG("r9vA7Le4fQplCi00", 900), cap: "Fotografía histórica, inicios del siglo XX",
        text: "En 1644 los manchúes cruzaron por el paso de Shanhaiguan y fundaron la dinastía Qing. La Muralla dejó de ser frontera y muchos tramos quedaron abandonados por siglos." },
      { date: "1957 – hoy", title: "Patrimonio de la Humanidad", img: IMG("463jBFVaYod5UKWH", 900), cap: "La Muralla al atardecer",
        text: "Badaling abrió al turismo en 1957, en 1987 la UNESCO la declaró Patrimonio de la Humanidad y en 2007 fue elegida una de las Nuevas 7 Maravillas del Mundo. Hoy la visitan más de 10 millones de personas al año." }
    ],

    MATERIALS: [
      { tag: "Época Qin y Han", name: "Tierra apisonada", img: IMG("R7uInmPpmNp0uRt5", 700),
        text: "Se colocaba tierra húmeda entre tablas de madera y se golpeaba capa por capa hasta dejarla dura como piedra." },
      { tag: "Desierto de Gobi", name: "Grava, arena y juncos", img: IMG("ugDFQj1NehTTHkGc", 700),
        text: "Donde no había tierra buena, se alternaban capas de grava con ramas de tamarisco y juncos para amarrar la estructura." },
      { tag: "Montañas", name: "Bloques de piedra", img: IMG("xJw25N21tIUSwbH1", 700),
        text: "En zonas rocosas se cortaba la piedra del mismo cerro. Los bloques de la base podían pesar más de una tonelada." },
      { tag: "Dinastía Ming", name: "Ladrillo y mortero de arroz", img: IMG("s9O6hf3zvfwa2QIg", 700),
        text: "Ladrillos cocidos en hornos cercanos, unidos con cal y arroz glutinoso. Muchos llevan grabado el nombre del taller que los hizo." }
    ],

    VIDEOS: [
      { src: "videos/mutianyu-panoramica.mp4", poster: IMG("Mg7FuJroyK68XdHc", 900), title: "Mutianyu: panorámicas desde la Muralla",
        desc: "Torres, crestas montañosas y el teleférico de Mutianyu.", dur: "1:33",
        credit: "Ian Messenger (CC BY 2.0)" },
      { src: "videos/vista-desde-la-torre.mp4", poster: IMG("TtWkiuBJBfYHrU54", 900), title: "Vista desde la segunda torre",
        desc: "Caminando entre viajeros por la Muralla cerca de Beijing.", dur: "0:23",
        credit: "Lynette vía Flickr (CC BY-NC 2.0)" },
      { src: "videos/explorando-la-muralla.mp4", poster: IMG("hP3DkW0JSVqNJ4sj", 900), title: "Explorando la Gran Muralla (documental)",
        desc: "Historia de Qin Shi Huang y recorrido con un guía de Beijing (en inglés).", dur: "2:28",
        credit: "Link Media / Explore (Internet Archive)" }
    ],

    GALLERY: [
      { src: IMG("hP3DkW0JSVqNJ4sj", 1200), cap: "La Gran Muralla serpenteando entre montañas", cat: "paisajes" },
      { src: IMG("CtFoW1OyLSi1597N", 1000), cap: "Otoño rojo en Mutianyu", cat: "estaciones" },
      { src: IMG("vwELbyHRe1i66MLx", 900), cap: "Amanecer en Jinshanling", cat: "paisajes" },
      { src: IMG("0E5rhFZnF8esT5hA", 1000), cap: "Simatai iluminada de noche", cat: "experiencias" },
      { src: IMG("LfbdfjoRMU3tlMqW", 1000), cap: "La Muralla cubierta de nieve", cat: "estaciones" },
      { src: IMG("sTP9H6SALll8STio", 1000), cap: "Ilustración: construcción de la Muralla", cat: "historia" },
      { src: IMG("zh6nsgUt8Eu3eIp7", 900), cap: "Tobogán de Mutianyu", cat: "experiencias" },
      { src: IMG("6sEJzKJ2Vwmv34Yt", 900), cap: "Huanghuacheng junto al lago", cat: "paisajes" },
      { src: IMG("jZoelcTYSdUBRlI5", 900), cap: "Fotografía histórica: jinetes bajo la Muralla", cat: "historia" },
      { src: IMG("3ryJdWNStvdpDTmw", 900), cap: "Jiankou, la Muralla salvaje", cat: "paisajes" },
      { src: IMG("1X0zVcYfi07h4qrv", 900), cap: "Laolongtou: donde la Muralla entra al mar", cat: "historia" },
      { src: IMG("TtWkiuBJBfYHrU54", 1000), cap: "Escalinatas de Badaling", cat: "experiencias" },
      { src: IMG("ws5cEBD4BMTxQW92", 1000), cap: "Commune by the Great Wall", cat: "experiencias" },
      { src: IMG("CPXGAIORuhg5HTEx", 1000), cap: "Verano verde y niebla en la Muralla", cat: "estaciones" },
      { src: IMG("tnfG5q0yvsNSIzRm", 1000), cap: "Guerreros de terracota del emperador Qin", cat: "historia" }
    ],

    /* ---------- 02 · PLANIFICÁ TU VIAJE ---------- */
    TOURS: [
      { id: "mutianyu", name: "Mutianyu", cat: "clasica", img: IMG("Mg7FuJroyK68XdHc"), price: 3950, km: "73 km de Beijing", time: "Día completo", level: "Fácil", ideal: "Primera visita, familias",
        desc: "La sección más bonita y mejor conservada: 23 torres entre bosques. Incluye teleférico de subida.", tag: "Más vendido" },
      { id: "badaling", name: "Badaling", cat: "clasica", img: IMG("DiauL8dLLCYJMD6y"), price: 3200, km: "70 km de Beijing", time: "Día completo", level: "Fácil", ideal: "Niños y adultos mayores",
        desc: "La más famosa y accesible, visitada por presidentes. Ideal para familias y adultos mayores.", tag: "Familias" },
      { id: "jinshanling", name: "Jinshanling", cat: "aventura", img: IMG("1Ty4NukIIyCTUWZf"), price: 4600, km: "140 km de Beijing", time: "Día completo", level: "Moderado", ideal: "Fotógrafos, caminantes",
        desc: "Caminata de 6 km con vistas espectaculares al amanecer. El paraíso de los fotógrafos.", tag: "Amanecer" },
      { id: "simatai", name: "Simatai Nocturna", cat: "foto", img: IMG("U4PAsxOpoLS3n7MP"), price: 5200, km: "120 km de Beijing", time: "Tarde + noche", level: "Moderado", ideal: "Parejas, lunas de miel",
        desc: "La única sección abierta de noche, iluminada sobre la villa acuática de Gubei. Muy romántica.", tag: "Noche" },
      { id: "jiankou", name: "Jiankou → Mutianyu", cat: "aventura", img: IMG("gs6n6nzUO3HK0atW"), price: 5600, km: "90 km de Beijing", time: "Día completo", level: "Difícil", ideal: "Senderistas con experiencia",
        desc: "La Muralla salvaje, sin restaurar. Trekking de 10 km para aventureros con guía de montaña.", tag: "Extremo" },
      { id: "huanghuacheng", name: "Huanghuacheng (Lago)", cat: "foto", img: IMG("6sEJzKJ2Vwmv34Yt"), price: 4300, km: "65 km de Beijing", time: "Día completo", level: "Moderado", ideal: "Fotografía y naturaleza",
        desc: "La Muralla que se sumerge en el agua. Paseo en bote y campos de flores en primavera.", tag: "Única" }
    ],

    PACKAGES: [
      { name: "Esencial", days: "7 días / 5 noches", price: 79900, icon: "ri-map-2-line", featured: false,
        items: ["Vuelo ida y vuelta en clase económica", "5 noches en hotel boutique (Beijing)", "Tour a Mutianyu con teleférico", "Traslados aeropuerto – hotel", "Seguro de viaje internacional"] },
      { name: "Clásico Imperial", days: "9 días / 7 noches", price: 98500, icon: "ri-ancient-gate-line", featured: true,
        items: ["Vuelo ida y vuelta en clase económica", "7 noches: 5 en Beijing + 2 junto a la Muralla", "Mutianyu + Simatai nocturna", "Ciudad Prohibida y Plaza Tiananmén", "Cena de pato laqueado", "Asesoría de visa incluida"] },
      { name: "Premium Dragón", days: "10 días / 8 noches", price: 149000, icon: "ri-vip-crown-2-line", featured: false,
        items: ["Vuelo en Económica Premium", "8 noches en hoteles 5★ y Commune by the Great Wall", "Mutianyu, Jinshanling y Huanghuacheng", "Guía privado y fotógrafo profesional", "Todas las comidas y traslados VIP"] }
    ],

    LODGING: [
      { id: "hostal", type: "Económico", name: "Hostal Hutong", img: IMG("bSiggvbZVabqIAEY", 700), price: 950, stars: 2,
        desc: "Casa tradicional en los callejones del Beijing antiguo." },
      { id: "boutique", type: "Boutique", name: "Hotel Siheyuan", img: IMG("YJvSmvlbnb7SpBE1", 700), price: 2400, stars: 4,
        desc: "Patio chino restaurado, cerca de la Ciudad Prohibida." },
      { id: "lodge", type: "Junto a la Muralla", name: "Lodge Gubei", img: IMG("uE3zByZnVTHcceid", 700), price: 3900, stars: 4,
        desc: "Despertá con vista a las torres de Simatai." },
      { id: "resort", type: "Resort Premium", name: "Commune by the Great Wall", img: IMG("iTFxedATXLhsfH8G", 700), price: 7800, stars: 5,
        desc: "Villas de diseño con acceso privado a la Muralla." }
    ],

    /* ---------- 03 · RESERVÁ ---------- */
    FLIGHTS: [
      { id: "eco", name: "Económica", desc: "1–2 escalas · 23 kg", price: 42500 },
      { id: "premium", name: "Económica Premium", desc: "Más espacio · 2 maletas", price: 68000 },
      { id: "business", name: "Business", desc: "Cama-plana · salones VIP", price: 165000 },
      { id: "none", name: "Ya tengo vuelo", desc: "Solo traslado aeropuerto", price: 1450 }
    ],

    EXTRAS: [
      { id: "seguro", name: "Seguro de viaje", desc: "Cobertura médica USD 60k", price: 2650, per: "persona" },
      { id: "visa", name: "Trámite de visa china", desc: "Formulario + cita + gestión", price: 3200, per: "persona" },
      { id: "tobogan", name: "Tobogán de Mutianyu", desc: "Bajada en trineo por la montaña", price: 450, per: "persona" },
      { id: "prohibida", name: "Tour Ciudad Prohibida", desc: "Medio día con guía", price: 2900, per: "persona" },
      { id: "pato", name: "Cena de pato laqueado", desc: "Restaurante tradicional", price: 1350, per: "persona" },
      { id: "foto", name: "Fotógrafo profesional", desc: "Sesión de 2 h en la Muralla", price: 3800, per: "grupo" }
    ],

    /* ---------- 04 · AYUDA ---------- */
    TESTIMONIALS: [
      { name: "Andrea Mejía", city: "Tegucigalpa", text: "Nunca pensé que llegaría a China. CatrachoGo me ayudó con la visa y todo salió perfecto. ¡Mutianyu en otoño es un sueño!" },
      { name: "Carlos Zelaya", city: "San Pedro Sula", text: "La Simatai nocturna fue lo mejor del viaje. El guía hablaba excelente español y siempre estuvo pendiente." },
      { name: "Familia Banegas", city: "La Ceiba", text: "Fuimos con los niños a Badaling y el tobogán les encantó. Precios claros en Lempiras, sin sorpresas." },
      { name: "Luis Fernando Paz", city: "Choluteca", text: "Hice el trekking de Jiankou: duro pero increíble. Las fotos parecen de película. 100% recomendado." },
      { name: "Gabriela Rivera", city: "Comayagua", text: "Dormir en el Commune junto a la Muralla fue una experiencia única. Vale cada lempira." }
    ],

    FAQ: [
      { cat: "documentos", label: "Visa y documentos", q: "¿Los hondureños necesitan visa para China?",
        a: "Sí. Se tramita la visa de turista (tipo L). Te ayudamos con el formulario, la reserva de hotel y vuelo, la carta de invitación del tour y la cita. El trámite toma entre 5 y 10 días hábiles. Podés agregarlo como extra en tu cotización." },
      { cat: "documentos", label: "Visa y documentos", q: "¿Qué documentos necesito para viajar?",
        a: "Pasaporte hondureño con al menos 6 meses de vigencia y 2 páginas en blanco, visa china, boletos de ida y vuelta, reserva de hotel y seguro de viaje. Si hacés escala en EE. UU. también necesitás visa estadounidense vigente." },
      { cat: "viaje", label: "El viaje", q: "¿Cuál es la mejor época para visitar la Muralla?",
        a: "Primavera (abril–mayo) y otoño (septiembre–octubre) tienen clima templado y los paisajes más bonitos; en octubre las montañas se tiñen de rojo. Evitá la Semana Dorada china (1–7 de octubre) por las multitudes." },
      { cat: "viaje", label: "El viaje", q: "¿Cuánto dura el vuelo desde Honduras?",
        a: "Entre 22 y 30 horas con 1 o 2 escalas (normalmente vía Houston, Los Ángeles, Ciudad de México o Madrid). Te asignamos la mejor conexión disponible." },
      { cat: "muralla", label: "En la Muralla", q: "¿Qué tan difícil es caminar la Muralla?",
        a: "Mutianyu y Badaling son aptas para toda la familia, con teleférico. Jinshanling requiere condición media y Jiankou es para senderistas con experiencia. Te recomendamos la sección según tu ritmo." },
      { cat: "muralla", label: "En la Muralla", q: "¿Qué llevo el día del tour?",
        a: "Zapatos cómodos con buen agarre, agua, bloqueador solar, gorra, una chaqueta liviana (en la montaña hace más frío) y efectivo en yuanes para snacks o souvenirs." },
      { cat: "pagos", label: "Pagos", q: "¿Cómo se paga?",
        a: "Con una reserva del 30% asegurás tu lugar. El saldo se paga hasta 30 días antes de la salida, por transferencia bancaria, depósito o tarjeta en hasta 6 cuotas." },
      { cat: "pagos", label: "Pagos", q: "¿Los precios incluyen impuestos?",
        a: "Sí. El cotizador ya incluye el ISV del 15% sobre los servicios de agencia (hospedaje, tours y extras). Los boletos aéreos se muestran con sus tasas incluidas." }
    ]
  };
})();
