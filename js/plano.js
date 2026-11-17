/* ==========================================================
   plano.js — rotas, abrigos e plano da família
   Interações:
   - escolher a situação mostra só o que fazer naquela hora
   - o plano é salvo no aparelho e vai para a folha de impressão
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el, limpo = MME.limpo;
  var estado = MME.ler();
  if (!MME.exigirPerfil(estado)) return;
  var p = estado.perfil;

  /* ---------- Situações ---------- */
  var situacoes = MME.dados.situacoes;
  /* Começa pelo risco mais provável da casa */
  var inicial = p.casa.encosta ? "deslizamento" : "alagamento";

  el("situacoes").innerHTML = situacoes.map(function (s) {
    return '<label><input type="radio" name="situacao" value="' + s.id + '"' + (s.id === inicial ? " checked" : "") + ">" +
      MME.bloco(s.icone, s.cor) + s.nome + "</label>";
  }).join("");

  function mostrarSituacao(id) {
    var s = situacoes.find(function (x) { return x.id === id; });
    var seu = "";
    if (id !== "energia" && id !== "calor") {
      var destino = estado.plano.abrigo || estado.plano.pontoPerto;
      seu = destino
        ? '<div class="aviso ok" style="margin:.75rem 0">' + MME.ic("pin") + '<p><strong>No seu plano:</strong> ' + limpo(destino) + "</p></div>"
        : '<div class="aviso" style="margin:.75rem 0">' + MME.ic("pin") + '<p>Lugar seguro ainda não anotado. <a href="#form-plano">Anotar agora</a></p></div>';
    }
    el("painel-situacao").innerHTML =
      "<h3>" + s.nome + ": para onde ir</h3>" +
      '<p class="onde-ir">' + s.ondeIr + "</p><p>" + s.explica + "</p>" + seu +
      "<h4>O que fazer</h4>" +
      '<ol class="passos">' + s.passos.map(function (x) { return "<li><span>" + x + "</span></li>"; }).join("") + "</ol>";
  }

  el("situacoes").addEventListener("change", function (ev) { mostrarSituacao(ev.target.value); });

  /* ---------- Formulário do plano ---------- */
  var precisaCuidado = p.criancas > 0 || p.bebes > 0 || p.idosos > 0 || p.mobilidade || p.pets > 0;
  var campos = MME.dados.camposPlano.filter(function (c) { return !c.soCuidado || precisaCuidado; });

  el("campos-plano").innerHTML = campos.map(function (c) {
    var id = "plano-" + c.id;
    var valor = limpo(estado.plano[c.id] || "");
    var comum = ' id="' + id + '" name="' + c.id + '" aria-describedby="ex-' + c.id + '"';
    var entrada = c.longo
      ? "<textarea" + comum + ' rows="3">' + valor + "</textarea>"
      : '<input type="' + (c.tipo || "text") + '"' + comum + ' value="' + valor + '"' + (c.tipo === "tel" ? ' inputmode="tel" autocomplete="off"' : "") + ">";
    return '<div class="campo"><label for="' + id + '">' + c.rotulo +
      (c.obrigatorio ? "" : ' <span class="suave">(opcional)</span>') + "</label>" + entrada +
      '<p class="ajuda" id="ex-' + c.id + '" style="margin:.3rem 0 0">' + c.exemplo + "</p></div>";
  }).join("");

  function lerFormulario() {
    campos.forEach(function (c) { estado.plano[c.id] = el("plano-" + c.id).value.trim(); });
  }

  function desenharProgresso() {
    var pl = MME.progressoPlano(estado);
    el("plano-texto").textContent = pl.feitos === pl.total
      ? "Plano completo"
      : pl.feitos + " de " + pl.total + " respostas preenchidas";
    var barra = el("plano-barra");
    barra.firstElementChild.style.width = Math.round(pl.fracao * 100) + "%";
    barra.classList.toggle("ok", pl.fracao >= 1);
    return pl;
  }

  /* Salva sozinho ao sair de cada campo: ninguém perde o que escreveu */
  el("form-plano").addEventListener("change", function () {
    lerFormulario();
    MME.salvar(estado);
    desenharProgresso();
  });

  el("form-plano").addEventListener("submit", function (ev) {
    ev.preventDefault();
    lerFormulario();
    MME.salvar(estado);
    var pl = desenharProgresso();
    mostrarSituacao(document.querySelector('input[name="situacao"]:checked').value);
    if (pl.fracao >= 1) {
      MME.avisar("Plano completo. Agora imprima.");
    } else {
      MME.avisar("Plano salvo. Faltam " + (pl.total - pl.feitos) + " respostas.");
    }
  });

  /* Mapa: link para o OpenStreetMap, sem carregar mapa pesado aqui */
  el("link-mapa").href = "https://www.openstreetmap.org/search?query=" + encodeURIComponent("escola, " + p.cidade + ", " + p.uf);

  mostrarSituacao(inicial);
  desenharProgresso();
})();
