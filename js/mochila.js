/* ==========================================================
   mochila.js — lista da mochila de emergência
   Interações:
   - a lista muda conforme o perfil (criança, idoso, pet…)
   - marcar item salva na hora e atualiza a barra de progresso
   - "Mostrar só o que falta" encurta a lista
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el;
  var estado = MME.ler();
  if (!MME.exigirPerfil(estado)) return;

  var soFaltam = false;
  var form = el("lista-mochila");

  function desenharLista() {
    var grupos = MME.gruposMochila(estado.perfil);
    form.innerHTML = grupos.map(function (g) {
      var feitos = g.itens.filter(function (i) { return estado.mochila[i.id]; }).length;
      var itens = g.itens.filter(function (i) { return !soFaltam || !estado.mochila[i.id]; });
      if (!itens.length) return "";
      return '<fieldset class="cartao categoria"><legend class="cab-categoria">' +
        MME.bloco(g.icone, g.cor, "p") +
        '<span><span class="nome-cat">' + g.titulo + "</span>" + (g.se ? '<span class="para-voce">Para a sua família</span>' : "") + "</span>" +
        '<span class="conta' + (feitos === g.itens.length ? " ok" : "") + '" data-conta="' + g.id + '">' + feitos + "/" + g.itens.length + "</span></legend>" +
        itens.map(function (i) {
          var marcado = !!estado.mochila[i.id];
          return '<label class="opcao' + (marcado ? " feito" : "") + '">' +
            '<input type="checkbox" data-item="' + i.id + '" data-grupo="' + g.id + '"' + (marcado ? " checked" : "") + ">" +
            '<span class="txt"><span>' + i.texto + "</span>" + (i.dica ? "<small>" + i.dica + "</small>" : "") + "</span></label>";
        }).join("") + "</fieldset>";
    }).join("");
    if (!form.innerHTML) {
      form.innerHTML = '<p class="cartao">Tudo separado.</p>';
    }
  }

  function desenharProgresso() {
    var m = MME.progressoMochila(estado);
    var pct = Math.round(m.fracao * 100);
    el("mochila-texto").textContent = m.feitos + " de " + m.total + " itens separados";
    el("mochila-pct").textContent = pct + "%";
    var barra = el("mochila-barra");
    barra.firstElementChild.style.width = pct + "%";
    barra.setAttribute("aria-valuenow", String(pct));
    barra.classList.toggle("ok", pct >= 100);
    el("mochila-pronta").hidden = pct < 100;
    return m;
  }

  /* Marcar ou desmarcar um item */
  form.addEventListener("change", function (ev) {
    var caixa = ev.target;
    if (!caixa.dataset.item) return;
    if (caixa.checked) estado.mochila[caixa.dataset.item] = true;
    else delete estado.mochila[caixa.dataset.item];
    MME.salvar(estado);
    caixa.closest(".opcao").classList.toggle("feito", caixa.checked);

    /* Atualiza a contagem do grupo sem redesenhar (o foco do teclado não se perde) */
    var grupo = MME.dados.mochila.find(function (g) { return g.id === caixa.dataset.grupo; });
    var feitos = grupo.itens.filter(function (i) { return estado.mochila[i.id]; }).length;
    var conta = form.querySelector('[data-conta="' + grupo.id + '"]');
    conta.textContent = feitos + "/" + grupo.itens.length;
    conta.classList.toggle("ok", feitos === grupo.itens.length);

    var m = desenharProgresso();
    if (m.faltam === 0) MME.avisar("Mochila completa! Parabéns.");
    else if (caixa.checked) MME.avisar("Salvo. " + (m.faltam === 1 ? "Falta 1 item." : "Faltam " + m.faltam + " itens."));
  });

  el("btn-faltam").addEventListener("click", function () {
    soFaltam = !soFaltam;
    this.setAttribute("aria-pressed", String(soFaltam));
    this.textContent = soFaltam ? "Ver lista toda" : "Só o que falta";
    desenharLista();
  });

  desenharLista();
  desenharProgresso();
})();
