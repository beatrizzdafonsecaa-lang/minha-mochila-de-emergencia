/* ==========================================================
   imprimir.js — folhas de papel para quando faltar luz ou internet
   Interação: escolher as folhas, ver como ficam e imprimir.
   Funciona sem internet (as folhas são montadas no aparelho).
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el, limpo = MME.limpo, num = MME.numero;
  var estado = MME.ler();
  if (!MME.exigirPerfil(estado)) return;
  var p = estado.perfil;
  var familia = (p.nome ? "Família de " + p.nome : "Minha família") + " · " + p.cidade + ", " + p.uf;
  var hoje = new Date().toLocaleDateString("pt-BR");

  function rodape() {
    return '<p class="rodape-folha">' + limpo(familia) + " · Feito em " + hoje +
      " · Defesa Civil 199 · Bombeiros 193 · SAMU 192 · Revise a cada 6 meses.</p>";
  }

  /* ---------- Folha 1: mochila ---------- */
  function folhaMochila() {
    var html = "<h2>Checklist da mochila de emergência</h2><p>Marque o que já está na mochila. Deixe a mochila perto da porta.</p>";
    MME.gruposMochila(p).forEach(function (g) {
      html += "<h3>" + g.titulo + '</h3><ul class="caixas">' + g.itens.map(function (i) {
        return '<li class="' + (estado.mochila[i.id] ? "sim" : "") + '"><span>' + i.texto + "</span></li>";
      }).join("") + "</ul>";
    });
    return html + rodape();
  }

  /* ---------- Folha 2: estoque ---------- */
  function folhaEstoque() {
    var est = estado.estoque;
    var html = "<h2>Estoque de casa</h2>" +
      "<p>Meta: <strong>" + est.meta + " dias</strong> para " + MME.plural(MME.pessoas(p), "pessoa", "pessoas") +
      (p.pets ? " e " + MME.plural(p.pets, "animal", "animais") : "") + ".</p>" +
      "<table><tbody>" +
      "<tr><th>Água guardada</th><td>" + num(est.agua, 0) + " litros (dura cerca de " + num(Math.floor(MME.diasAgua(estado) * 10) / 10) + " dias)</td></tr>" +
      "<tr><th>Água necessária para a meta</th><td>" + num(Math.ceil(MME.aguaPorDia(p) * est.meta), 0) + " litros</td></tr>" +
      "<tr><th>Comida guardada</th><td>dura cerca de " + num(Math.floor(MME.diasComida(estado) * 10) / 10) + " dias</td></tr>" +
      "</tbody></table>" +
      "<h3>Alimentos</h3><table><thead><tr><th>Alimento</th><th style=\"width:18%\">Quantidade</th><th style=\"width:26%\">Validade</th></tr></thead><tbody>";
    est.alimentos.forEach(function (a) {
      var item = MME.dados.alimentos.find(function (x) { return x.id === a.id; });
      html += "<tr><td>" + item.nome + "</td><td>" + a.qtd + '</td><td class="linha"></td></tr>';
    });
    /* Linhas em branco para completar à mão */
    for (var i = 0; i < Math.max(4, 8 - est.alimentos.length); i++) {
      html += '<tr><td class="linha"></td><td></td><td></td></tr>';
    }
    html += "</tbody></table><p>Anote a validade a caneta. Use primeiro o que vence antes e reponha.</p>";
    return html + rodape();
  }

  /* ---------- Folha 3: plano ---------- */
  function folhaPlano() {
    var html = "<h2>Plano da família</h2><p>Todos de casa devem saber este plano de cor.</p><table><tbody>";
    MME.dados.camposPlano.forEach(function (c) {
      var valor = (estado.plano[c.id] || "").trim();
      html += "<tr><th>" + c.rotulo + '</th><td class="linha">' + limpo(valor) + "</td></tr>";
    });
    html += "</tbody></table><h3>Telefones</h3><table><tbody><tr>" +
      MME.dados.telefones.map(function (t) { return "<td><strong>" + t.numero + "</strong> " + t.nome + "</td>"; }).join("") +
      "</tr></tbody></table><h3>Para onde ir</h3><table><tbody>" +
      MME.dados.situacoes.map(function (s) {
        return "<tr><th>" + s.nome + "</th><td><strong>" + s.ondeIr + "</strong> " + s.passos[0] + "</td></tr>";
      }).join("") + "</tbody></table>";
    return html + rodape();
  }

  /* ---------- Folha 4: mapa para desenhar ---------- */
  function folhaMapa() {
    return "<h2>Mapa do caminho de saída</h2>" +
      "<p>Desenhe a caneta: sua casa, as ruas em volta, o caminho de saída e os pontos de encontro. " +
      "Faça junto com a família, andando pelo caminho de verdade.</p>" +
      '<div class="quadro-mapa" role="img" aria-label="Quadro em branco com linhas para desenhar o mapa à mão"></div>' +
      '<ul class="legenda"><li>■ Casa</li><li>★ Ponto de encontro</li><li>▲ Abrigo</li><li>→ Caminho de saída</li><li>✕ Evitar (rio, ponte, barranco)</li></ul>' +
      rodape();
  }

  var folhas = [
    { id: "mochila", nome: "Checklist da mochila", icone: "mochila", cor: "azul", monta: folhaMochila },
    { id: "estoque", nome: "Estoque de casa", icone: "lata", cor: "laranja", monta: folhaEstoque },
    { id: "plano", nome: "Plano e telefones", icone: "pin", cor: "verde", monta: folhaPlano },
    { id: "mapa", nome: "Mapa para desenhar", icone: "mapa", cor: "roxo", monta: folhaMapa }
  ];

  /* Veio de outra página pedindo uma folha? Ex.: imprimir.html?folha=mochila */
  var pedida = new URLSearchParams(location.search).get("folha");
  function marcadaDeInicio(id) {
    if (!pedida) return true;
    return id === pedida || (pedida === "plano" && id === "mapa");
  }

  el("opcoes-folhas").innerHTML = folhas.map(function (f) {
    return '<label class="azulejo"><input type="checkbox" value="' + f.id + '"' +
      (marcadaDeInicio(f.id) ? " checked" : "") + ">" +
      '<span class="marca-sel">' + MME.ic("check") + "</span>" +
      MME.bloco(f.icone, f.cor, "p") + f.nome + "</label>";
  }).join("");

  function escolhidas() {
    return Array.prototype.map.call(
      document.querySelectorAll("#opcoes-folhas input:checked"), function (c) { return c.value; });
  }

  function desenhar() {
    var ids = escolhidas();
    el("folhas").innerHTML = folhas
      .filter(function (f) { return ids.indexOf(f.id) >= 0; })
      .map(function (f) { return '<article class="folha">' + f.monta() + "</article>"; })
      .join("") || '<p class="cartao">Escolha pelo menos uma folha.</p>';
  }

  el("opcoes-folhas").addEventListener("change", desenhar);

  el("btn-imprimir").addEventListener("click", function () {
    if (!escolhidas().length) { MME.avisar("Escolha pelo menos uma folha."); return; }
    window.print();
  });

  desenhar();
})();
