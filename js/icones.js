/* ==========================================================
   icones.js — conjunto de ícones do site (desenhados à mão em SVG)
   Uso no HTML: <svg class="ic"><use href="#i-mochila"/></svg>
   Uso no JS:   MME.ic("mochila")
   A parte com class="f" é o preenchimento suave (duas cores).
   ========================================================== */
(function () {
  "use strict";
  var desenhos = {
    casa: '<path class="f" d="M4.5 10 12 4l7.5 6v10.5h-15z"/><path d="M3 11 12 3.5 21 11M5 9.5v11h5v-6h4v6h5v-11"/>',
    mochila: '<rect class="f" x="5" y="7" width="14" height="14" rx="4"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7M9 7h6a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a4 4 0 0 1 4-4zM8.5 14h7v3.5h-7z"/>',
    gota: '<path class="f" d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/><path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5zM9.5 14.5A2.5 2.5 0 0 0 12 17"/>',
    pin: '<path class="f" d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    impressora: '<rect class="f" x="3" y="9" width="18" height="8" rx="2"/><path d="M7 9V3.5h10V9M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6.5H7z"/>',
    sino: '<path class="f" d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
    onda: '<path class="f" d="M3 14c2 0 2-1.5 4.5-1.5S10 14 12 14s2.5-1.5 4.5-1.5S19 14 21 14v6H3z"/><path d="M3 14c2 0 2-1.5 4.5-1.5S10 14 12 14s2.5-1.5 4.5-1.5S19 14 21 14M3 18.5c2 0 2-1.5 4.5-1.5s2.5 1.5 4.5 1.5 2.5-1.5 4.5-1.5 2.5 1.5 4.5 1.5M7.5 10V8L12 4.5 16.5 8v2"/>',
    morro: '<path class="f" d="M2.5 20 9 9l4 6 2.5-3 6 8z"/><path d="M2.5 20 9 9l4 6 2.5-3 6 8zM16 4.5l.8 2M19.5 6l-1 1.5M13 3.5l.3 2"/>',
    raio: '<path class="f" d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
    termometro: '<path class="f" d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 9v7.5M17 5h2.5M17 8.5h2.5"/>',
    telefone: '<path class="f" d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    lanterna: '<path class="f" d="M7 3h10v5l-2 3v9.5H9V11L7 8z"/><path d="M7 3h10v5l-2 3v9.5H9V11L7 8zM7 6h10M12 14v2"/>',
    saude: '<rect class="f" x="3.5" y="6.5" width="17" height="13" rx="2.5"/><path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5M6 6.5h12A2.5 2.5 0 0 1 20.5 9v8a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 17V9A2.5 2.5 0 0 1 6 6.5zM12 10v6M9 13h6"/>',
    documento: '<path class="f" d="M6 3h8l4 4v14H6z"/><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15.5h6"/>',
    roupa: '<path class="f" d="M8 3.5 3.5 6.5l2 4L7 9.5v11h10v-11l1.5 1 2-4L16 3.5a4 4 0 0 1-8 0z"/><path d="M8 3.5 3.5 6.5l2 4L7 9.5v11h10v-11l1.5 1 2-4L16 3.5a4 4 0 0 1-8 0z"/>',
    pilula: '<rect class="f" x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/>',
    crianca: '<circle class="f" cx="12" cy="6" r="2.5"/><circle cx="12" cy="6" r="2.5"/><path d="M7 11l5-1.5 5 1.5M12 9.5v5M9 21l3-6.5 3 6.5"/>',
    mamadeira: '<path class="f" d="M8 9h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/><path d="M8 9h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM9 9V7h6v2M10.5 7l.5-3.5h2l.5 3.5M8 13h3M8 16.5h3"/>',
    idoso: '<circle class="f" cx="10" cy="5" r="2.2"/><circle cx="10" cy="5" r="2.2"/><path d="M10 7.5v7L7.5 21M10 14.5l3 6.5M10 9.5l-3 3M10 9.5l4.5 2M16 11.5V21"/>',
    acessivel: '<circle cx="12" cy="4.5" r="1.8"/><path d="M7 8.5h10M12 8.5v5h4l2 5.5M9.5 11.5a5 5 0 1 0 6 6.5"/>',
    pata: '<path class="f" d="M12 12c-3 0-5.5 4-5 6.5S10 20 12 20s5.5 1 5-1.5S15 12 12 12z"/><path d="M12 12c-3 0-5.5 4-5 6.5S10 20 12 20s5.5 1 5-1.5S15 12 12 12z"/><ellipse cx="6.5" cy="10" rx="1.7" ry="2.2"/><ellipse cx="10" cy="6" rx="1.7" ry="2.2"/><ellipse cx="14" cy="6" rx="1.7" ry="2.2"/><ellipse cx="17.5" cy="10" rx="1.7" ry="2.2"/>',
    carro: '<path class="f" d="M3.5 12.5l2-5A2 2 0 0 1 7.4 6h9.2a2 2 0 0 1 1.9 1.5l2 5V17h-17z"/><path d="M3.5 12.5l2-5A2 2 0 0 1 7.4 6h9.2a2 2 0 0 1 1.9 1.5l2 5V17h-17zM3.5 12.5h17"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    lata: '<path class="f" d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11z"/><ellipse cx="12" cy="6.5" rx="7" ry="2.5"/><path d="M5 6.5v11c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-11M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    mapa: '<path class="f" d="M3 6l6-2.5L15 6l6-2.5V18l-6 2.5L9 18l-6 2.5z"/><path d="M3 6l6-2.5L15 6l6-2.5V18l-6 2.5L9 18l-6 2.5zM9 3.5V18M15 6v14.5"/>',
    pessoas: '<circle class="f" cx="9" cy="8" r="3"/><circle cx="9" cy="8" r="3"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14a5.5 5.5 0 0 1 3 5.5"/>',
    adulto: '<circle class="f" cx="12" cy="7.5" r="3.5"/><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
    alerta: '<path class="f" d="M12 3.5 2.5 20h19z"/><path d="M12 3.5 2.5 20h19zM12 10v4.5M12 17.2v.3"/>',
    escudo: '<path class="f" d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6zM8.5 12l2.5 2.5 4.5-5"/>',
    abrigo: '<path class="f" d="M4 10h16v10.5H4z"/><path d="M2.5 10.5 12 4l9.5 6.5M4 10v10.5h16V10M10 20.5v-5h4v5"/>',
    seta: '<path d="M9 5.5l6.5 6.5L9 18.5"/>',
    contraste: '<circle cx="12" cy="12" r="8.5"/><path class="s" d="M12 3.5a8.5 8.5 0 0 1 0 17z"/>',
    lixeira: '<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14"/>',
    chuva: '<path class="f" d="M7 15a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.5 1.5A3.3 3.3 0 0 1 17 15z"/><path d="M7 15a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.5 1.5A3.3 3.3 0 0 1 17 15zM8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
    sol: '<circle class="f" cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    usuario: '<circle class="f" cx="12" cy="9" r="3.5"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3.5"/><path d="M6 18.5a7 7 0 0 1 12 0"/>',
    mensagem: '<path class="f" d="M4 5h16v11H9l-5 4z"/><path d="M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5"/>'
  };

  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">' +
    Object.keys(desenhos).map(function (nome) {
      return '<symbol id="i-' + nome + '" viewBox="0 0 24 24">' + desenhos[nome] + "</symbol>";
    }).join("") + "</svg>";
  document.body.insertAdjacentHTML("afterbegin", sprite);

  window.MME = window.MME || {};
  /* Ícone decorativo (o texto ao lado já explica) */
  MME.ic = function (nome, classe) {
    return '<svg class="ic' + (classe ? " " + classe : "") + '" aria-hidden="true" focusable="false"><use href="#i-' + nome + '"/></svg>';
  };
  /* Ícone dentro de um quadradinho colorido, como no app de referência */
  MME.bloco = function (nome, cor, tamanho) {
    return '<span class="bloco ' + (cor || "azul") + (tamanho ? " " + tamanho : "") + '">' + MME.ic(nome) + "</span>";
  };
})();
