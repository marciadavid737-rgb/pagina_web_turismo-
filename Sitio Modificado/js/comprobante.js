/* =========================================================
   CatrachoGo – Comprobante de cotización / reserva
   Visor en pantalla + PDF + imprimir + WhatsApp
   Usa los colores del sitio (variables de css/style.css) y los datos de CG.
   Cargar DESPUÉS de js/data.js y js/main.js
   ========================================================= */
(function () {
  "use strict";

  var D = window.CG || {};
  var RATE = D.RATE || 26.5;
  var WA_NUMBER = "50499990000";
  var CONTACT = { tel: "+504 2222-3333", wa: "+504 9999-0000", mail: "hola@catrachogo.hn", city: "Tegucigalpa, Honduras" };
  var TAGLINE = "Agencia de turismo hondureña · Viaje a la Gran Muralla China";
  var PAY_TEXT = "Con una reserva del 30% asegurás tu lugar. El saldo se paga hasta 30 días antes de la salida, por transferencia bancaria, depósito o tarjeta en hasta 6 cuotas.";

  /* ---------- utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  // La fuente estándar de jsPDF solo soporta Latin-1: se normalizan símbolos fuera de ese rango
  function pdfText(s) {
    return clean(String(s == null ? "" : s)
      .replace(/≈/g, "aprox. ")
      .replace(/[–—]/g, "-")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/…/g, "...")
      .replace(/•/g, "-")
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, ""));
  }
  function fmt(n) { return "L " + Number(n || 0).toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function parseMoney(s) { var n = parseFloat(String(s).replace(/[^\d.]/g, "")); return isNaN(n) ? 0 : n; }
  function dateLong(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return iso || "Por definir";
    return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" });
  }
  function todayLong() { return new Date().toLocaleDateString("es-HN", { day: "2-digit", month: "long", year: "numeric" }); }
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- colores del sitio (se leen de css/style.css) ---------- */
  var FALLBACK = { red: "#b3261e", redDark: "#8a1c16", gold: "#d4a24c", goldSoft: "#f3e3c3", ink: "#1c1513", ink2: "#3d3330", muted: "#7a6d68", cream: "#faf6ef", line: "#eadfce" };
  var VARS = { red: "--red", redDark: "--red-dark", gold: "--gold", goldSoft: "--gold-soft", ink: "--ink", ink2: "--ink-2", muted: "--muted", cream: "--cream", line: "--line" };
  function hexToRgb(h) {
    h = String(h).replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return isNaN(n) ? [0, 0, 0] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function brand() {
    var hex = {}, rgb = {};
    Object.keys(FALLBACK).forEach(function (k) {
      var v = "";
      try { v = getComputedStyle(document.documentElement).getPropertyValue(VARS[k]).trim(); } catch (e) { /* sin estilos */ }
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) v = FALLBACK[k];
      hex[k] = v; rgb[k] = hexToRgb(v);
    });
    return { hex: hex, rgb: rgb };
  }

  /* ---------- datos ---------- */
  function findTour(name) {
    var t = D.TOURS || [];
    for (var i = 0; i < t.length; i++) { if (t[i].name === name) return t[i]; }
    return null;
  }
  function checkedName(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    var s = el ? el.parentNode.querySelector("label strong") : null;
    return s ? clean(s.textContent) : "—";
  }
  function checkedNames(name) {
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll('input[name="' + name + '"]:checked'), function (el) {
      var s = el.parentNode.querySelector("label strong");
      if (s) out.push(clean(s.textContent));
    });
    return out;
  }
  function intField(id, min) {
    var el = $(id), v = el ? parseInt(el.value, 10) : NaN;
    return (isNaN(v) || v < min) ? min : v;
  }
  function textField(id, fb) { var el = $(id); var v = el ? clean(el.value) : ""; return v || fb; }
  function selText(id) {
    var el = $(id);
    if (!el || !el.options || el.selectedIndex < 0) return "—";
    return clean(el.options[el.selectedIndex].value) || clean(el.options[el.selectedIndex].text) || "—";
  }
  function quoteRef() {
    var key = "cg_cot_ref", ref = null;
    try { ref = sessionStorage.getItem(key); } catch (e) { /* sin sessionStorage */ }
    if (!ref) {
      ref = "COT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      try { sessionStorage.setItem(key, ref); } catch (e) { /* sin sessionStorage */ }
    }
    return ref;
  }

  // Arma el objeto que usan el visor, el PDF, la impresión y WhatsApp
  function buildDoc(o) {
    var totalNum = o.totalNum || parseMoney(o.totalStr);
    var usd = o.usdStr || ("aprox. US$ " + Math.round(totalNum / RATE).toLocaleString("en-US"));
    return {
      kind: o.kind, code: o.code, emitido: o.emitido, tour: o.tour, img: o.img,
      cliente: [
        ["Nombre", o.nombre], ["Correo", o.correo],
        ["Teléfono / WhatsApp", o.telefono], ["Ciudad de salida", o.origen]
      ],
      viaje: [
        ["Sección de la Muralla", o.tour], ["Fecha de salida", o.fecha],
        ["Noches en China", String(o.noches)], ["Viajeros", o.adultos + " adulto(s) / " + o.ninos + " niño(s)"],
        ["Vuelo", o.vuelo], ["Hospedaje", o.hospedaje],
        ["Extras", o.extras.length ? o.extras.join(", ") : "Ninguno"], ["Estado", o.estado]
      ],
      comentarios: o.comentarios || "",
      items: o.items,
      total: o.totalStr || fmt(totalNum),
      totalNum: totalNum,
      usd: usd,
      reserva30: totalNum > 0 ? fmt(totalNum * 0.3) : "",
      nota: o.nota
    };
  }

  var NOTA = "Precios referenciales en Lempiras, sujetos a disponibilidad de vuelos. Incluye ISV 15% sobre servicios de agencia. Tasa referencial 1 USD = L " + RATE.toFixed(2) + ".";

  // Desde el formulario (cotización en curso)
  function fromForm() {
    var items = [];
    Array.prototype.forEach.call(document.querySelectorAll("#summary-list li"), function (li) {
      var kids = Array.prototype.filter.call(li.children, function (e) { return clean(e.textContent); });
      if (kids.length >= 2) items.push([clean(kids[0].textContent), clean(kids[kids.length - 1].textContent)]);
      else if (clean(li.textContent)) items.push([clean(li.textContent), ""]);
    });
    var totalStr = $("summary-total") ? clean($("summary-total").textContent) : "L 0.00";
    var usdEl = $("summary-usd");
    var tourName = $("summary-name") ? clean($("summary-name").textContent) : selText("tour");
    return buildDoc({
      kind: "cotizacion", code: quoteRef(), emitido: todayLong(),
      nombre: textField("nombre", "Por completar"), correo: textField("correo", "Por completar"),
      telefono: textField("telefono", "Por completar"), origen: selText("origen"),
      tour: tourName, img: $("summary-img") ? $("summary-img").src : "",
      fecha: dateLong(textField("fecha", "")), noches: intField("noches", 1),
      adultos: intField("adultos", 1), ninos: intField("ninos", 0),
      vuelo: checkedName("vuelo"), hospedaje: checkedName("hospedaje"), extras: checkedNames("extras"),
      estado: "Cotización referencial", comentarios: textField("comentarios", ""),
      items: items, totalStr: totalStr, usdStr: usdEl ? clean(usdEl.textContent).replace(/≈/g, "aprox.") : "",
      nota: NOTA
    });
  }

  // Desde una reserva guardada en este dispositivo (cg_reservas)
  function fromSaved(code) {
    var r = null;
    try { r = (JSON.parse(localStorage.getItem("cg_reservas") || "{}") || {})[code]; } catch (e) { r = null; }
    if (!r) return null;
    var tour = findTour(r.tour);
    var items = (r.lines || []).map(function (l) { return [l[0], fmt(l[1])]; });
    return buildDoc({
      kind: "reserva", code: r.code || code, emitido: String(r.creado || "").split(",")[0] || todayLong(),
      nombre: r.nombre, correo: r.correo, telefono: r.telefono, origen: r.origen,
      tour: r.tour, img: tour ? String(tour.img).replace(/width=\d+/, "width=900") : "",
      fecha: dateLong(r.fecha), noches: r.noches, adultos: r.adultos, ninos: r.ninos,
      vuelo: r.vuelo, hospedaje: r.hospedaje, extras: r.extras || [],
      estado: r.estado || "Pendiente de confirmación", comentarios: r.comentarios || "",
      items: items, totalNum: +r.total || 0, totalStr: fmt(+r.total || 0), usdStr: "",
      nota: NOTA
    });
  }

  /* ---------- HTML del comprobante (pantalla e impresión) ---------- */
  function docHTML(d) {
    var B = brand().hex;
    var sans = "'Plus Jakarta Sans',Arial,sans-serif";
    var isRes = d.kind === "reserva";

    function eyebrow(t) {
      return '<div style="display:flex;align-items:center;gap:8px;font:800 11px ' + sans + ';letter-spacing:.16em;text-transform:uppercase;color:' + B.red + ';margin:26px 0 10px">' +
        '<span style="width:24px;height:2px;background:' + B.gold + ';display:inline-block"></span>' + esc(t) + '</div>';
    }
    function card(rows) {
      return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));border:1px solid ' + B.line + ';border-radius:14px;overflow:hidden;background:#fff">' +
        rows.map(function (r) {
          return '<div style="padding:11px 14px"><div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:' + B.muted + '">' +
            esc(r[0]) + '</div><div style="font-size:14px;font-weight:600;color:' + B.ink + ';word-break:break-word">' + esc(r[1]) + '</div></div>';
        }).join("") + "</div>";
    }
    var rows = d.items.length
      ? d.items.map(function (r, i) {
          return '<tr style="background:' + (i % 2 ? "#fff" : B.cream) + '"><td style="padding:10px 14px;font-size:13px;color:' + B.ink2 + '">' + esc(r[0]) +
            '</td><td style="padding:10px 14px;font-size:13px;text-align:right;font-weight:700;white-space:nowrap;color:' + B.ink + '">' + esc(r[1]) + "</td></tr>";
        }).join("")
      : '<tr><td colspan="2" style="padding:12px 14px;font-size:13px;color:' + B.muted + '">El detalle de costos de esta reserva no está disponible en este dispositivo.</td></tr>';

    var logo = '<span style="width:44px;height:44px;border-radius:12px;background:' + B.red + ';display:inline-flex;align-items:center;justify-content:center">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><polygon points="16,8 13.4,13.4 10.6,10.6" fill="#fff" stroke="none"/><polygon points="8,16 10.6,10.6 13.4,13.4" fill="' + B.gold + '" stroke="none"/></svg></span>';

    return '<div style="font-family:' + sans + ';color:' + B.ink + ';background:' + B.cream + ';max-width:780px;margin:0 auto">' +
      '<div style="background:' + B.ink + ';color:#fff;padding:22px 28px;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;align-items:center;border-bottom:4px solid ' + B.gold + '">' +
        '<div style="display:flex;align-items:center;gap:12px">' + logo +
          '<div><div style="font-weight:800;font-size:24px;line-height:1">Catracho<span style="color:' + B.gold + '">Go</span></div>' +
          '<div style="font-size:11px;opacity:.8;margin-top:5px">' + esc(TAGLINE) + '</div></div></div>' +
        '<div style="text-align:right"><div style="font-size:11px;font-weight:800;letter-spacing:.14em;color:' + B.gold + '">' + (isRes ? "COMPROBANTE DE RESERVA" : "COTIZACIÓN") + '</div>' +
        '<div style="font-size:22px;font-weight:800;letter-spacing:.04em">' + esc(d.code) + '</div>' +
        '<div style="font-size:11px;opacity:.8">' + esc(d.emitido) + "</div></div></div>" +
      (d.img ? '<div style="position:relative;height:150px;background:' + B.ink2 + '"><img src="' + esc(d.img) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.parentNode.style.display=\'none\'" />' +
        '<span style="position:absolute;left:28px;bottom:14px;background:rgba(28,21,19,.85);color:#fff;padding:6px 14px;border-radius:999px;font-weight:700;font-size:13px">' + esc(d.tour) + "</span></div>" : "") +
      '<div style="padding:4px 28px 28px">' +
        eyebrow("Datos del cliente") + card(d.cliente) +
        eyebrow("Detalle del viaje") + card(d.viaje) +
        (d.comentarios ? '<p style="margin:14px 0 0;font-size:13px;color:' + B.ink2 + '"><strong>Comentarios:</strong> ' + esc(d.comentarios) + "</p>" : "") +
        eyebrow("Resumen de costos") +
        '<table style="width:100%;border-collapse:collapse;border:1px solid ' + B.line + ';border-radius:14px;overflow:hidden"><thead><tr style="background:' + B.ink + ';color:#fff">' +
          '<th style="padding:10px 14px;text-align:left;font-size:11px;letter-spacing:.06em;text-transform:uppercase">Concepto</th>' +
          '<th style="padding:10px 14px;text-align:right;font-size:11px;letter-spacing:.06em;text-transform:uppercase">Monto</th></tr></thead><tbody>' + rows + "</tbody></table>" +
        '<div style="margin-top:14px;background:' + B.ink + ';color:#fff;border-radius:14px;padding:16px 20px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px">' +
          '<span style="font-weight:700">Total estimado</span><strong style="font-size:26px;color:' + B.gold + '">' + esc(d.total) + "</strong>" +
          '<span style="width:100%;text-align:right;font-size:12px;opacity:.8">' + esc(d.usd) + "</span></div>" +
        '<div style="margin-top:14px;background:' + B.goldSoft + ';border-left:4px solid ' + B.red + ';border-radius:12px;padding:12px 16px;font-size:12.5px;color:' + B.ink2 + ';line-height:1.55">' +
          '<strong style="color:' + B.red + '">Cómo se paga.</strong> ' + esc(PAY_TEXT) + (d.reserva30 ? " <strong>Reserva del 30%: " + esc(d.reserva30) + ".</strong>" : "") + "</div>" +
        (isRes ? '<p style="margin:12px 0 0;font-size:13px;font-weight:700;color:' + B.red + '">Un asesor te contactará en menos de 24 horas para confirmar tu viaje.</p>' : "") +
        '<p style="margin:12px 0 0;font-size:11px;color:' + B.muted + ';line-height:1.5">' + esc(d.nota) + "</p>" +
      "</div>" +
      '<div style="background:' + B.ink + ';color:#d8cdc7;padding:14px 28px;font-size:12px;display:flex;flex-wrap:wrap;gap:6px 20px;justify-content:center;border-top:3px solid ' + B.gold + '">' +
        "<span>Tel. " + esc(CONTACT.tel) + "</span><span>WhatsApp " + esc(CONTACT.wa) + "</span><span>" + esc(CONTACT.mail) + "</span><span>" + esc(CONTACT.city) + "</span></div>" +
      '<div style="background:' + B.ink + ';color:#a99c96;padding:0 28px 14px;font-size:10.5px;text-align:center">© 2026 CatrachoGo · Turismo responsable desde Honduras</div>' +
    "</div>";
  }

  /* ---------- PDF (jsPDF + autoTable) ---------- */
  function buildPDF(d) {
    var J = window.jspdf && window.jspdf.jsPDF;
    if (!J) return null;
    var B = brand().rgb;
    var doc = new J({ unit: "mm", format: "a4" });
    var W = 210, H = 297, M = 14, FOOT = 22;
    var hasTable = typeof doc.autoTable === "function";
    var WHITE = [255, 255, 255], SOFT = [216, 205, 199];
    var isRes = d.kind === "reserva";
    var y;

    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function ink(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function need(h) { if (y + h > H - FOOT) { doc.addPage(); y = 18; } }
    function eyebrow(label) {
      need(14);
      fill(B.gold); doc.rect(M, y - 1.4, 6, 0.7, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); ink(B.red);
      doc.text(pdfText(label).toUpperCase(), M + 8.5, y);
      y += 4;
    }

    /* encabezado */
    fill(B.ink); doc.rect(0, 0, W, 36, "F");
    fill(B.gold); doc.rect(0, 36, W, 2, "F");
    fill(B.red); doc.roundedRect(M, 11, 13, 13, 3, 3, "F");
    var cx = M + 6.5, cy = 17.5;
    stroke(WHITE); doc.setLineWidth(0.5); doc.circle(cx, cy, 4.2, "S");
    fill(WHITE); doc.triangle(cx + 2.4, cy - 2.4, cx + 0.8, cy + 0.8, cx - 0.8, cy - 0.8, "F");
    fill(B.gold); doc.triangle(cx - 2.4, cy + 2.4, cx - 0.8, cy - 0.8, cx + 0.8, cy + 0.8, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(20); ink(WHITE);
    doc.text("Catracho", M + 17, 19.5);
    var w1 = doc.getTextWidth("Catracho");
    ink(B.gold); doc.text("Go", M + 17 + w1, 19.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); ink(SOFT);
    doc.text(pdfText(TAGLINE), M + 17, 25.5);

    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); ink(B.gold);
    doc.text(isRes ? "COMPROBANTE DE RESERVA" : pdfText("COTIZACIÓN"), W - M, 13, { align: "right" });
    doc.setFontSize(16); ink(WHITE);
    doc.text(pdfText(d.code), W - M, 21, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); ink(SOFT);
    doc.text(pdfText(d.emitido), W - M, 27, { align: "right" });

    /* título de la sección elegida */
    y = 49;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); ink(B.red);
    fill(B.gold); doc.rect(M, y - 1.4, 6, 0.7, "F");
    doc.text(pdfText("SECCIÓN DE LA GRAN MURALLA"), M + 8.5, y);
    y += 7;
    doc.setFont("times", "bold"); doc.setFontSize(22); ink(B.ink);
    doc.text(pdfText(d.tour), M, y);
    y += 9;

    /* bloques de datos (parejas etiqueta/valor) */
    function pairs(rows) {
      var body = [];
      for (var i = 0; i < rows.length; i += 2) {
        var a = rows[i], b = rows[i + 1] || ["", ""];
        body.push([pdfText(a[0]), pdfText(a[1]), pdfText(b[0]), pdfText(b[1])]);
      }
      if (hasTable) {
        doc.autoTable({
          startY: y, body: body, theme: "grid", margin: { left: M, right: M, bottom: FOOT },
          styles: { fontSize: 8.8, cellPadding: 2, textColor: B.ink, lineColor: B.line, lineWidth: 0.2, overflow: "linebreak" },
          columnStyles: {
            0: { fontStyle: "bold", textColor: B.muted, fillColor: B.cream, cellWidth: 33 },
            1: { cellWidth: 55 },
            2: { fontStyle: "bold", textColor: B.muted, fillColor: B.cream, cellWidth: 33 },
            3: { cellWidth: "auto" }
          }
        });
        y = doc.lastAutoTable.finalY + 6;
      } else {
        doc.setFontSize(9);
        body.forEach(function (r) {
          need(6);
          ink(B.muted); doc.text(r[0], M, y); ink(B.ink); doc.text(r[1], M + 36, y);
          if (r[2]) { ink(B.muted); doc.text(r[2], 108, y); ink(B.ink); doc.text(r[3], 144, y); }
          y += 6;
        });
        y += 4;
      }
    }
    eyebrow("Datos del cliente"); pairs(d.cliente);
    eyebrow("Detalle del viaje"); pairs(d.viaje);

    if (d.comentarios) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      var cl = doc.splitTextToSize(pdfText(d.comentarios), W - 2 * M - 26);
      need(cl.length * 4.5 + 6);
      doc.setFont("helvetica", "bold"); ink(B.ink);
      doc.text("Comentarios:", M, y);
      doc.setFont("helvetica", "normal"); ink(B.ink2);
      doc.text(cl, M + 26, y);
      y += cl.length * 4.5 + 5;
    }

    /* tabla de costos */
    eyebrow("Resumen de costos");
    var rows = d.items.length
      ? d.items.map(function (r) { return [pdfText(r[0]), pdfText(r[1])]; })
      : [[pdfText("El detalle de costos de esta reserva no está disponible en este dispositivo."), ""]];
    if (hasTable) {
      doc.autoTable({
        startY: y, head: [["CONCEPTO", "MONTO"]], body: rows, theme: "grid", margin: { left: M, right: M, bottom: FOOT },
        headStyles: { fillColor: B.ink, textColor: WHITE, fontSize: 8.5, fontStyle: "bold", lineColor: B.ink },
        styles: { fontSize: 9, cellPadding: 2.3, textColor: B.ink2, lineColor: B.line, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: B.cream },
        columnStyles: { 1: { halign: "right", fontStyle: "bold", textColor: B.ink, cellWidth: 46 } }
      });
      y = doc.lastAutoTable.finalY + 7;
    } else {
      doc.setFontSize(9); ink(B.ink);
      rows.forEach(function (r) { need(6); doc.text(r[0], M, y); doc.text(r[1], W - M, y, { align: "right" }); y += 6; });
      y += 4;
    }

    /* total */
    var boxH = 22;
    need(boxH + 6);
    fill(B.ink); doc.roundedRect(M, y, W - 2 * M, boxH, 3, 3, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); ink(WHITE);
    doc.text("Total estimado", M + 6, y + 10.5);
    doc.setFontSize(19); ink(B.gold);
    doc.text(pdfText(d.total), W - M - 6, y + 11, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); ink(SOFT);
    doc.text(pdfText(d.usd), W - M - 6, y + 18.5, { align: "right" });
    y += boxH + 7;

    /* cómo se paga */
    var payTxt = PAY_TEXT + (d.reserva30 ? " Reserva del 30%: " + d.reserva30 + "." : "");
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.6);
    var pl = doc.splitTextToSize(pdfText(payTxt), W - 2 * M - 12);
    var payH = pl.length * 4.3 + 12;
    need(payH + 4);
    fill(B.goldSoft); doc.roundedRect(M, y, W - 2 * M, payH, 2.5, 2.5, "F");
    fill(B.red); doc.rect(M, y, 1.6, payH, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.6); ink(B.red);
    doc.text(pdfText("Cómo se paga"), M + 6, y + 6);
    doc.setFont("helvetica", "normal"); ink(B.ink2);
    doc.text(pl, M + 6, y + 11);
    y += payH + 6;

    if (isRes) {
      need(8);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); ink(B.red);
      doc.text(pdfText("Un asesor te contactará en menos de 24 horas para confirmar tu viaje."), M, y);
      y += 6;
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.8);
    var nl = doc.splitTextToSize(pdfText(d.nota), W - 2 * M);
    need(nl.length * 3.8 + 2);
    ink(B.muted);
    doc.text(nl, M, y);

    /* pie en todas las páginas */
    var pages = doc.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      fill(B.ink); doc.rect(0, H - 18, W, 18, "F");
      fill(B.gold); doc.rect(0, H - 18, W, 1.2, "F");
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); ink(SOFT);
      doc.text(pdfText("Tel. " + CONTACT.tel + "  ·  WhatsApp " + CONTACT.wa + "  ·  " + CONTACT.mail), W / 2, H - 10.5, { align: "center" });
      ink(B.gold);
      doc.text(pdfText("CatrachoGo · " + CONTACT.city + "  ·  Página " + p + " de " + pages), W / 2, H - 5.5, { align: "center" });
    }
    return doc;
  }

  var current = null; // comprobante abierto en el visor

  function downloadPDF(d) {
    d = d || current || fromForm();
    var pdf = null;
    try { pdf = buildPDF(d); } catch (e) { console.error("Error generando el PDF:", e); }
    if (!pdf) { toast('No se pudo generar el PDF. Usá "Imprimir" y elegí "Guardar como PDF".'); return; }
    try {
      pdf.save("Comprobante-CatrachoGo-" + d.code + ".pdf");
      toast("PDF descargado ✔");
    } catch (e) {
      try { window.open(pdf.output("bloburl"), "_blank"); } catch (e2) { toast('No se pudo descargar. Usá "Imprimir".'); }
    }
  }

  /* ---------- imprimir ---------- */
  function printDoc(d) {
    d = d || current || fromForm();
    var f = document.createElement("iframe");
    f.setAttribute("aria-hidden", "true");
    f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(f);
    var w = f.contentWindow, idoc = w.document;
    idoc.open();
    idoc.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Comprobante ' + esc(d.code) + "</title>" +
      '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">' +
      "<style>@page{size:A4;margin:8mm}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>" + docHTML(d) + "</body></html>");
    idoc.close();
    setTimeout(function () {
      try { w.focus(); w.print(); } catch (e) { toast("No se pudo abrir la impresión."); }
      setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 2500);
    }, 900);
  }

  /* ---------- WhatsApp ---------- */
  function sendWA(d) {
    d = d || current || fromForm();
    var lines = [
      "*CatrachoGo – " + (d.kind === "reserva" ? "Reserva " : "Cotización ") + d.code + "*",
      "Cliente: " + d.cliente[0][1],
      "Sección: " + d.tour,
      "Salida: " + d.viaje[1][1] + " · " + d.viaje[2][1] + " noche(s)",
      "Viajeros: " + d.viaje[3][1], ""
    ];
    d.items.forEach(function (r) { lines.push("• " + r[0] + (r[1] ? ": " + r[1] : "")); });
    lines.push("", "*Total: " + d.total + "*", d.usd);
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  }

  /* ---------- visor (ventana propia sobre la página) ---------- */
  var overlay = null;
  function onKey(e) { if (e.key === "Escape") closeViewer(); }
  function closeViewer() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  }
  function openViewer(d) {
    closeViewer();
    current = d;
    var B = brand().hex;
    var btn = "border:0;cursor:pointer;border-radius:999px;padding:11px 20px;font:700 14px 'Plus Jakarta Sans',Arial,sans-serif;display:inline-flex;align-items:center;gap:6px;";
    overlay = document.createElement("div");
    overlay.id = "cg-quote-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Comprobante");
    overlay.style.cssText = "position:fixed;top:0;right:0;bottom:0;left:0;z-index:2000;background:rgba(10,6,5,.78);display:flex;align-items:center;justify-content:center;padding:12px";
    overlay.innerHTML =
      '<div style="background:' + B.cream + ';border-radius:20px;width:100%;max-width:820px;max-height:96vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)">' +
        '<div style="background:' + B.ink + ';color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ' + B.gold + '">' +
          '<strong style="font:700 15px \'Plus Jakarta Sans\',Arial,sans-serif">' + (d.kind === "reserva" ? "Comprobante de reserva" : "Comprobante de cotización") + "</strong>" +
          '<button type="button" data-act="close" aria-label="Cerrar" style="background:transparent;color:#fff;border:0;font-size:28px;line-height:1;cursor:pointer">&times;</button></div>' +
        '<div style="overflow:auto;padding:14px;flex:1"><div style="border-radius:14px;overflow:hidden;box-shadow:0 8px 24px -12px rgba(60,20,10,.45)">' + docHTML(d) + "</div></div>" +
        '<div style="padding:12px 16px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;background:#fff;border-top:1px solid ' + B.line + '">' +
          '<button type="button" data-act="pdf" style="' + btn + "background:" + B.gold + ";color:" + B.ink + '"><i class="ri-download-2-line"></i> Descargar PDF</button>' +
          '<button type="button" data-act="print" style="' + btn + "background:#fff;color:" + B.red + ";border:2px solid " + B.red + '"><i class="ri-printer-line"></i> Imprimir</button>' +
          '<button type="button" data-act="wa" style="' + btn + 'background:#25d366;color:#fff"><i class="ri-whatsapp-line"></i> WhatsApp</button></div>' +
      "</div>";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) { closeViewer(); return; }
      var b = e.target.closest ? e.target.closest("[data-act]") : null;
      if (!b) return;
      var a = b.getAttribute("data-act");
      if (a === "close") closeViewer();
      else if (a === "pdf") downloadPDF(current);
      else if (a === "print") printDoc(current);
      else if (a === "wa") sendWA(current);
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
  }

  /* ---------- conectar botones ---------- */
  function on(id, fn) { var el = $(id); if (el) el.addEventListener("click", fn); }
  function init() {
    on("preview-quote-btn", function () { openViewer(fromForm()); });
    on("summary-quote-btn", function () { openViewer(fromForm()); });
    on("modal-quote", function () {
      var code = $("modal-code") ? clean($("modal-code").textContent) : "";
      var m = $("confirm-modal"); if (m) m.classList.remove("open");
      openViewer(fromSaved(code) || fromForm());
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.CGComprobante = { abrir: openViewer, pdf: downloadPDF, imprimir: printDoc, whatsapp: sendWA, build: buildPDF, deForm: fromForm, deReserva: fromSaved };
})();
