/* =========================================================
   CatrachoGo – Lógica del sitio
   Requiere js/data.js (objeto global CG)
   ========================================================= */
(function () {
  "use strict";
  var D = window.CG;
  if (!D) { console.error("No se cargó js/data.js"); return; }

  /* ===== HELPERS ===== */
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var fmt = function (n) { return "L " + n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmt0 = function (n) { return "L " + Math.round(n).toLocaleString("es-HN"); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var findBy = function (arr, id) { for (var i = 0; i < arr.length; i++) { if (arr[i].id === id) return arr[i]; } return arr[0]; };
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2800); }
  function intVal(el, min) { var v = parseInt(el.value, 10); if (isNaN(v) || v < min) v = min; return v; }
  function setActive(group, btn) { group.querySelectorAll(".filter-btn").forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); }); btn.classList.add("active"); btn.setAttribute("aria-pressed", "true"); }

  /* ===== NAV: menús desplegables por categoría ===== */
  var nav = $("#main-nav"), menu = $("#nav-menu"), menuBtn = $("#menu-btn"), toTop = $("#to-top");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  function closeDrops(except) {
    $$(".nav__item").forEach(function (it) {
      if (it === except) return;
      it.classList.remove("open");
      it.querySelector(".nav__toggle").setAttribute("aria-expanded", "false");
    });
  }
  function closeMenu() {
    menu.classList.remove("open"); nav.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false"); menuBtn.innerHTML = '<i class="ri-menu-line"></i>';
    closeDrops(null);
  }
  menuBtn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    nav.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
    if (!open) closeDrops(null);
  });
  $$(".nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var item = btn.parentNode, open = !item.classList.contains("open");
      closeDrops(item);
      item.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  menu.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a) { closeMenu(); if (document.activeElement) document.activeElement.blur(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("#main-nav")) closeDrops(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrops(null); });

  /* ===== 01 · HISTORIA: línea de tiempo ===== */
  $("#timeline").innerHTML = D.TIMELINE.map(function (t) {
    return '<li class="tl-item reveal">' +
      '<figure class="tl-media"><img src="' + t.img + '" alt="' + esc(t.title) + '" loading="lazy" /><span>' + esc(t.cap) + '</span></figure>' +
      '<div class="tl-body"><span class="tl-date">' + esc(t.date) + '</span><h3>' + esc(t.title) + '</h3><p>' + esc(t.text) + '</p></div></li>';
  }).join("");

  /* ===== 01 · CONSTRUCCIÓN: materiales ===== */
  $("#build-grid").innerHTML = D.MATERIALS.map(function (m) {
    return '<article class="material reveal"><img src="' + m.img + '" alt="' + esc(m.name) + ' en la Gran Muralla" loading="lazy" />' +
      '<div class="material__body"><span class="material__tag">' + esc(m.tag) + '</span><h4>' + esc(m.name) + '</h4><p>' + esc(m.text) + '</p></div></article>';
  }).join("");

  /* ===== 01 · VIDEOS: reproductor local con lista ===== */
  var video = $("#main-video"), playlist = $("#playlist"), currentVideo = -1;
  playlist.innerHTML = D.VIDEOS.map(function (v, i) {
    return '<li><button type="button" data-v="' + i + '" aria-label="Reproducir ' + esc(v.title) + '">' +
      '<span class="playlist__thumb"><img src="' + v.poster.replace(/width=\d+/, "width=300") + '" alt="" loading="lazy" /><i class="ri-play-circle-fill"></i><em>' + esc(v.dur) + '</em></span>' +
      '<span><strong>' + esc(v.title) + '</strong><small>' + esc(v.desc) + '</small></span></button></li>';
  }).join("");
  $("#video-credits").textContent = "Videos alojados en la carpeta /videos del sitio. Créditos: " +
    D.VIDEOS.map(function (v) { return v.title + " — " + v.credit; }).join(" · ") + ".";

  function loadVideo(i, autoplay) {
    if (i === currentVideo) { if (autoplay) { var p0 = video.play(); if (p0 && p0.catch) p0.catch(function () {}); } return; }
    currentVideo = i;
    var v = D.VIDEOS[i];
    video.pause();
    video.setAttribute("poster", v.poster);
    video.src = v.src;
    video.load();
    $("#video-title").textContent = v.title;
    $("#video-desc").textContent = v.desc + " · " + v.dur;
    var dl = $("#video-download");
    dl.href = v.src; dl.setAttribute("download", v.src.split("/").pop());
    playlist.querySelectorAll("button").forEach(function (b) { b.classList.toggle("active", +b.dataset.v === i); });
    if (autoplay) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  }
  playlist.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-v]"); if (!b) return;
    loadVideo(+b.dataset.v, true);
    if (window.innerWidth < 880) $(".player__screen").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  video.addEventListener("ended", function () { if (currentVideo < D.VIDEOS.length - 1) loadVideo(currentVideo + 1, true); });
  video.addEventListener("error", function () { if (video.getAttribute("src")) toast("No se pudo cargar el video. Revisá tu conexión."); });
  loadVideo(0, false);

  /* ===== 01 · GALERÍA + LIGHTBOX ===== */
  var galleryItems = D.GALLERY.slice(), lb = $("#lightbox"), lbIdx = 0;
  function renderGallery(cat) {
    galleryItems = D.GALLERY.filter(function (g) { return cat === "todas" || g.cat === cat; });
    $("#gallery").innerHTML = galleryItems.map(function (g, i) {
      return '<figure tabindex="0" data-i="' + i + '"><img src="' + g.src + '" alt="' + esc(g.cap) + '" loading="lazy" /><figcaption>' + esc(g.cap) + '</figcaption></figure>';
    }).join("");
  }
  renderGallery("todas");
  $("#gallery-filters").addEventListener("click", function (e) {
    var b = e.target.closest(".filter-btn"); if (!b) return;
    setActive(e.currentTarget, b); renderGallery(b.dataset.gfilter);
  });
  function showLb(i) {
    if (!galleryItems.length) return;
    lbIdx = (i + galleryItems.length) % galleryItems.length;
    var g = galleryItems[lbIdx];
    $("#lb-img").src = g.src.replace(/width=\d+/, "width=1600"); $("#lb-img").alt = g.cap; $("#lb-cap").textContent = g.cap;
    lb.classList.add("open");
  }
  function closeLb() { lb.classList.remove("open"); }
  $("#gallery").addEventListener("click", function (e) { var f = e.target.closest("figure"); if (f) showLb(+f.dataset.i); });
  $("#gallery").addEventListener("keydown", function (e) { var f = e.target.closest("figure"); if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showLb(+f.dataset.i); } });
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", function () { showLb(lbIdx - 1); });
  $("#lb-next").addEventListener("click", function () { showLb(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });

  /* ===== 02 · SECCIONES / TOURS ===== */
  function renderTours(filter) {
    $("#tour-grid").innerHTML = D.TOURS.filter(function (t) { return filter === "todos" || t.cat === filter; }).map(function (t) {
      return '<article class="tour-card">' +
        '<div class="tour-card__img"><img src="' + t.img + '" alt="Gran Muralla China – sección ' + esc(t.name) + '" loading="lazy" />' +
        '<span class="badge">' + esc(t.level) + '</span><span class="badge badge--gold">' + esc(t.tag) + '</span></div>' +
        '<div class="tour-card__body"><h3>' + esc(t.name) + '</h3>' +
        '<div class="meta"><span><i class="ri-map-pin-line"></i>' + esc(t.km) + '</span><span><i class="ri-time-line"></i>' + esc(t.time) + '</span></div>' +
        '<p>' + esc(t.desc) + '</p>' +
        '<div class="tour-card__foot"><div class="price"><small>Tour por persona</small><strong>' + fmt0(t.price) + '</strong></div>' +
        '<button class="link-btn" type="button" data-book="' + t.id + '">Reservar <i class="ri-arrow-right-line"></i></button></div></div></article>';
    }).join("");
  }
  renderTours("todos");
  $("#tour-filters").addEventListener("click", function (e) {
    var b = e.target.closest(".filter-btn"); if (!b) return;
    setActive(e.currentTarget, b); renderTours(b.dataset.filter);
  });
  function goBook(id) {
    $("#tour").value = id; updateSummary();
    document.getElementById("reservar").scrollIntoView({ behavior: "smooth" });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-book]"); if (b) goBook(b.dataset.book);
  });

  /* ===== 02 · COMPARATIVA ===== */
  var CAT_NAMES = { clasica: "Clásica", aventura: "Aventura", foto: "Fotografía / Noche" };
  var LVL_CLASS = { "Fácil": "facil", "Moderado": "moderado", "Difícil": "dificil" };
  $("#compare-body").innerHTML = D.TOURS.map(function (t) {
    return "<tr><td><strong>" + esc(t.name) + "</strong></td><td>" + CAT_NAMES[t.cat] + "</td><td>" + esc(t.km) + "</td><td>" + esc(t.time) +
      '</td><td><span class="lvl lvl--' + LVL_CLASS[t.level] + '">' + esc(t.level) + "</span></td><td>" + esc(t.ideal) + "</td><td><strong>" + fmt0(t.price) + "</strong></td></tr>";
  }).join("");

  /* ===== 02 · PAQUETES ===== */
  $("#pkg-grid").innerHTML = D.PACKAGES.map(function (p) {
    return '<article class="pkg reveal' + (p.featured ? ' pkg--featured' : '') + '">' +
      (p.featured ? '<span class="pkg__ribbon">MÁS POPULAR</span>' : '') +
      '<span class="pkg__icon"><i class="' + p.icon + '"></i></span>' +
      '<div><h3>' + esc(p.name) + '</h3><span class="pkg__days">' + esc(p.days) + '</span></div>' +
      '<div class="pkg__price">' + fmt0(p.price) + ' <small>/ persona</small></div>' +
      '<ul class="pkg__list">' + p.items.map(function (i) { return '<li><i class="ri-checkbox-circle-fill"></i>' + esc(i) + '</li>'; }).join("") + '</ul>' +
      '<a href="#reservar" class="btn ' + (p.featured ? 'btn--gold' : '') + ' btn--full">Quiero este paquete</a></article>';
  }).join("");

  /* ===== 02 · HOSPEDAJE ===== */
  $("#lodging-grid").innerHTML = D.LODGING.map(function (l) {
    return '<article class="lodge reveal"><img src="' + l.img + '" alt="' + esc(l.name) + '" loading="lazy" />' +
      '<div class="lodge__body"><span class="lodge__type">' + esc(l.type) + '</span><h4>' + esc(l.name) + '</h4>' +
      '<div class="stars" aria-label="' + l.stars + ' estrellas">' + new Array(l.stars + 1).join("★") + '</div><p>' + esc(l.desc) + '</p>' +
      '<div class="price"><small>por persona / noche</small><strong>' + fmt0(l.price) + '</strong></div></div></article>';
  }).join("");

  /* ===== 04 · TESTIMONIOS ===== */
  $("#testi-track").innerHTML = D.TESTIMONIALS.map(function (t) {
    var ini = t.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("");
    return '<article class="testi"><div class="stars">★★★★★</div><p>“' + esc(t.text) + '”</p>' +
      '<div class="testi__user"><span class="avatar">' + esc(ini) + '</span><div><strong>' + esc(t.name) + '</strong><small>' + esc(t.city) + ', Honduras</small></div></div></article>';
  }).join("");

  /* ===== 04 · FAQ por categorías ===== */
  $("#faq-list").innerHTML = D.FAQ.map(function (f, i) {
    return '<details data-cat="' + f.cat + '"' + (i === 0 ? " open" : "") + '><summary><span><span class="faq__cat">' + esc(f.label) + '</span><br>' + esc(f.q) + '</span></summary><p>' + esc(f.a) + '</p></details>';
  }).join("");
  $("#faq-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".filter-btn"); if (!b) return;
    setActive(e.currentTarget, b);
    var cat = b.dataset.faq;
    $$("#faq-list details").forEach(function (d) { d.hidden = !(cat === "todas" || d.dataset.cat === cat); });
  });

  /* ===== 03 · FORMULARIO / COTIZADOR ===== */
  var tourOpts = D.TOURS.map(function (t) { return '<option value="' + t.id + '">' + esc(t.name) + ' – ' + fmt0(t.price) + '</option>'; }).join("");
  $("#tour").innerHTML = tourOpts; $("#quick-tour").innerHTML = tourOpts;

  function optHtml(group, type, list, unit, checkedId) {
    return list.map(function (o) {
      var id = group + "-" + o.id;
      var u = unit || ("/ " + o.per);
      return '<div class="opt"><input type="' + type + '" name="' + group + '" id="' + id + '" value="' + o.id + '"' + (o.id === checkedId ? " checked" : "") + ' />' +
        '<label for="' + id + '"><strong>' + esc(o.name) + '</strong><small>' + esc(o.desc || o.type) + '</small><b>' + fmt0(o.price) + ' <small>' + u + '</small></b></label></div>';
    }).join("");
  }
  $("#flight-options").innerHTML = optHtml("vuelo", "radio", D.FLIGHTS, "/ persona", "eco");
  $("#lodging-options").innerHTML = optHtml("hospedaje", "radio", D.LODGING, "/ noche", "boutique");
  $("#extras-options").innerHTML = optHtml("extras", "checkbox", D.EXTRAS, null, "seguro");

  // Fecha mínima: 7 días desde hoy (en hora local)
  var minD = new Date(); minD.setDate(minD.getDate() + 7);
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var minDate = minD.getFullYear() + "-" + pad(minD.getMonth() + 1) + "-" + pad(minD.getDate());
  ["#fecha", "#quick-fecha"].forEach(function (s) { $(s).min = minDate; });

  function calc() {
    var tour = findBy(D.TOURS, $("#tour").value);
    var flightEl = document.querySelector('input[name="vuelo"]:checked');
    var lodgeEl = document.querySelector('input[name="hospedaje"]:checked');
    var flight = findBy(D.FLIGHTS, flightEl ? flightEl.value : "eco");
    var lodge = findBy(D.LODGING, lodgeEl ? lodgeEl.value : "boutique");
    var nights = intVal($("#noches"), 1), adults = intVal($("#adultos"), 1), kids = intVal($("#ninos"), 0);
    var pax = adults + kids, lines = [];
    var flightCost = flight.price * (adults + kids * 0.75);
    var lodgeCost = lodge.price * nights * (adults + kids * 0.5);
    var tourCost = tour.price * (adults + kids * 0.5);
    lines.push(["Vuelo " + flight.name + " (" + pax + " pax)", flightCost]);
    lines.push([lodge.name + " · " + nights + " noche(s)", lodgeCost]);
    lines.push(["Tour " + tour.name, tourCost]);
    var extrasCost = 0, extrasNames = [];
    document.querySelectorAll('input[name="extras"]:checked').forEach(function (el) {
      var x = findBy(D.EXTRAS, el.value);
      var c = x.per === "grupo" ? x.price : x.price * pax;
      extrasCost += c; extrasNames.push(x.name); lines.push([x.name, c]);
    });
    var services = lodgeCost + tourCost + extrasCost;
    var tax = services * D.ISV;
    lines.push(["ISV 15% (servicios)", tax]);
    return { tour: tour, flight: flight, lodge: lodge, nights: nights, adults: adults, kids: kids, lines: lines, total: flightCost + services + tax, extras: extrasNames };
  }

  function updateSummary() {
    var r = calc();
    $("#summary-list").innerHTML = r.lines.map(function (l) { return "<li><span>" + esc(l[0]) + "</span><span>" + fmt(l[1]) + "</span></li>"; }).join("");
    $("#summary-total").textContent = fmt(r.total);
    $("#summary-usd").textContent = "≈ US$ " + Math.round(r.total / D.RATE).toLocaleString("en-US");
    $("#summary-name").textContent = r.tour.name;
    $("#summary-img").src = r.tour.img.replace(/width=\d+/, "width=900");
    $("#summary-img").alt = "Sección " + r.tour.name + " de la Gran Muralla";
    return r;
  }
  $("#booking-form").addEventListener("input", updateSummary);
  $("#booking-form").addEventListener("change", updateSummary);
  updateSummary();

  // Cotización rápida (hero)
  $("#quick-search").addEventListener("submit", function (e) {
    e.preventDefault();
    $("#tour").value = $("#quick-tour").value;
    if ($("#quick-fecha").value) $("#fecha").value = $("#quick-fecha").value;
    $("#adultos").value = intVal($("#quick-personas"), 1);
    updateSummary();
    document.getElementById("reservar").scrollIntoView({ behavior: "smooth" });
    toast("Cotización precargada ✈️");
  });

  // Envío de reserva
  function genCode() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "CG-"; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function getStore() { try { return JSON.parse(localStorage.getItem("cg_reservas") || "{}"); } catch (e) { return {}; } }
  function setStore(o) { try { localStorage.setItem("cg_reservas", JSON.stringify(o)); } catch (e) { /* almacenamiento no disponible */ } }

  $("#booking-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.currentTarget, err = $("#form-error"); err.textContent = "";
    var nombre = $("#nombre").value.trim(), correo = $("#correo").value.trim(), tel = $("#telefono").value.trim(), fecha = $("#fecha").value;
    if (nombre.length < 3) { err.textContent = "Ingresá tu nombre completo."; $("#nombre").focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { err.textContent = "Ingresá un correo electrónico válido."; $("#correo").focus(); return; }
    if (tel.replace(/\D/g, "").length < 8) { err.textContent = "Ingresá un teléfono válido (mínimo 8 dígitos)."; $("#telefono").focus(); return; }
    if (!fecha) { err.textContent = "Seleccioná la fecha de salida."; $("#fecha").focus(); return; }
    if (fecha < minDate) { err.textContent = "La salida debe ser al menos 7 días a partir de hoy."; $("#fecha").focus(); return; }

    var r = updateSummary(), code = genCode(), comentarios = $("#comentarios").value.trim();
    var data = { code: code, nombre: nombre, correo: correo, telefono: tel, origen: $("#origen").value, fecha: fecha,
      tour: r.tour.name, vuelo: r.flight.name, hospedaje: r.lodge.name, noches: r.nights, adultos: r.adults, ninos: r.kids,
      extras: r.extras, total: r.total, lines: r.lines, comentarios: comentarios, estado: "Pendiente de confirmación", creado: new Date().toLocaleString("es-HN") };
    var st = getStore(); st[code] = data; setStore(st);

    var resumen = "¡Gracias por reservar con CatrachoGo, " + nombre + "!\n\n" +
      "Código de reserva: " + code + "\n" +
      "Sección de la Muralla: " + r.tour.name + "\n" +
      "Salida: " + fecha + " desde " + data.origen + "\n" +
      "Viajeros: " + r.adults + " adulto(s), " + r.kids + " niño(s)\n" +
      "Vuelo: " + r.flight.name + "\n" +
      "Hospedaje: " + r.lodge.name + " (" + r.nights + " noches)\n" +
      "Extras: " + (r.extras.length ? r.extras.join(", ") : "Ninguno") + "\n" +
      "Total estimado: " + fmt(r.total) + "\n\n" +
      "Un asesor te contactará en menos de 24 horas para confirmar tu viaje.";

    var btn = form.querySelector('button[type="submit"]'), btnHtml = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';

    fetch("https://formsubmit.co/ajax/hola@catrachogo.hn", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: "Nueva reserva CatrachoGo " + code, _template: "table", _captcha: "false",
        _replyto: correo, email: correo, _autoresponse: resumen,
        codigo: code, nombre: nombre, telefono: tel, origen: data.origen, fecha_salida: fecha,
        seccion: r.tour.name, vuelo: r.flight.name, hospedaje: r.lodge.name, noches: r.nights,
        adultos: r.adults, ninos: r.kids, extras: r.extras.join(", ") || "Ninguno",
        total_estimado: fmt(r.total), comentarios: comentarios
      })
    }).then(function (res) { return res.json(); }).then(function (j) {
      if (String(j.success) !== "true") throw new Error("fail");
      $("#modal-text").textContent = "Gracias, " + nombre.split(" ")[0] + ". Tu viaje a " + r.tour.name + " por " + fmt(r.total) + " quedó registrado. Te enviamos la confirmación a " + correo + " (revisá también tu carpeta de spam). Guardá tu código:";
    }).catch(function () {
      $("#modal-text").textContent = "Tu viaje quedó registrado en este dispositivo, pero no pudimos enviar el correo de confirmación. Revisá tu conexión e intentá de nuevo, o escribinos a hola@catrachogo.hn. Tu código:";
    }).then(function () {
      $("#modal-code").textContent = code;
      $("#confirm-modal").classList.add("open");
      btn.disabled = false; btn.innerHTML = btnHtml;
    });

    form.reset();
    document.getElementById("vuelo-eco").checked = true;
    document.getElementById("hospedaje-boutique").checked = true;
    document.getElementById("extras-seguro").checked = true;
    updateSummary();
  });
  $("#modal-close").addEventListener("click", function () { $("#confirm-modal").classList.remove("open"); });
  $("#confirm-modal").addEventListener("click", function (e) { if (e.target.id === "confirm-modal") e.currentTarget.classList.remove("open"); });

  // Consultar reserva
  $("#lookup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var code = $("#lookup-code").value.trim().toUpperCase(), d = getStore()[code], out = $("#lookup-result");
    if (!d) { out.innerHTML = '<div class="res">No encontramos el código <strong>' + esc(code) + '</strong> en este dispositivo. Verificalo o escribinos por WhatsApp.</div>'; return; }
    out.innerHTML = '<div class="res"><strong>' + esc(d.code) + '</strong> · ' + esc(d.estado) + '<br>' + esc(d.nombre) + ' — ' + esc(d.tour) +
      ', salida ' + esc(d.fecha) + ' desde ' + esc(d.origen) + '<br>Vuelo ' + esc(d.vuelo) + ' · ' + esc(d.hospedaje) + ' (' + esc(d.noches) + ' noches) · ' +
      esc(d.adultos) + ' adulto(s), ' + esc(d.ninos) + ' niño(s)<br>Total estimado: <strong>' + fmt(+d.total || 0) + '</strong></div>';
  });

  // Boletín
  $("#newsletter-form").addEventListener("submit", function (e) { e.preventDefault(); e.currentTarget.reset(); toast("¡Gracias por suscribirte! 📬"); });

  /* ===== ANIMACIONES ===== */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
    // Respaldo: todo visible aunque el observador no dispare
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add("visible"); }); }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }
})();
