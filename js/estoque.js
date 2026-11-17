/* ==========================================================
   estoque.js — água e comida de casa
   Interação principal: transformar litros e pacotes em "dias",
   porque dias é o que a família entende.
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el, num = MME.numero;
  var estado = MME.ler();
  if (!MME.exigirPerfil(estado)) return;
  var p = estado.perfil;
  var est = estado.estoque;

  /* Opções de alimentos */
  MME.dados.alimentos.forEach(function (a) {
    var op = document.createElement("option");
    op.value = a.id; op.textContent = a.nome;
    el("alimento").appendChild(op);
  });

  el("meta").value = String(est.meta);
  el("agua").value = est.agua;
  el("agua-regra").textContent = "Sua casa usa " + num(MME.aguaPorDia(p)) + " litros por dia";

  function barra(id, fracao) {
    var b = el(id);
    b.firstElementChild.style.width = Math.round(Math.min(1, fracao) * 100) + "%";
    b.classList.toggle("ok", fracao >= 1);
  }

  function diasTexto(dias) {
    return num(Math.floor(dias * 10) / 10) + " <small>" + (dias >= 1 && dias < 2 ? "dia" : "dias") + "</small>";
  }

  function desenhar() {
    var meta = est.meta;

    /* Água */
    var dAgua = MME.diasAgua(estado);
    el("agua-dias").innerHTML = diasTexto(dAgua);
    var faltaLitros = Math.ceil(MME.aguaPorDia(p) * meta - est.agua);
    el("agua-frase").innerHTML = faltaLitros > 0
      ? "Faltam <strong>" + num(faltaLitros, 0) + " litros</strong> para a meta."
      : "Cobre a meta de " + meta + " dias.";
    barra("agua-barra", dAgua / meta);

    /* Comida */
    var dComida = MME.diasComida(estado);
    el("comida-dias").innerHTML = diasTexto(dComida);
    el("comida-frase").innerHTML = dComida >= meta
      ? "Cobre a meta de " + meta + " dias."
      : "Faltam <strong>" + num(Math.ceil((meta - dComida) * 10) / 10) + " dias</strong> para a meta.";
    barra("comida-barra", dComida / meta);

    /* Lista de alimentos */
    el("comida-vazia").hidden = est.alimentos.length > 0;
    el("lista-comida").innerHTML = est.alimentos.map(function (a) {
      var item = MME.dados.alimentos.find(function (x) { return x.id === a.id; });
      return "<li><span><strong>" + a.qtd + "×</strong> " + item.nome + "</span>" +
        '<button type="button" class="btn-tirar" data-remover="' + a.id + '" aria-label="Remover ' + item.nome + '">' + MME.ic("lixeira") + "</button></li>";
    }).join("");
  }

  function salvar() { MME.salvar(estado); desenhar(); }

  el("meta").addEventListener("change", function () {
    est.meta = Number(this.value);
    salvar();
  });

  el("agua").addEventListener("input", function () {
    est.agua = Math.max(0, Number(this.value) || 0);
    salvar();
  });

  el("form-comida").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var id = el("alimento").value;
    var qtd = Math.max(1, Math.floor(Number(el("qtd").value) || 1));
    var existente = est.alimentos.find(function (a) { return a.id === id; });
    if (existente) existente.qtd += qtd;
    else est.alimentos.push({ id: id, qtd: qtd });
    el("qtd").value = 1;
    salvar();
    MME.avisar("Adicionado. A comida agora dura " + num(Math.floor(MME.diasComida(estado) * 10) / 10) + " dias.");
  });

  el("lista-comida").addEventListener("click", function (ev) {
    var botao = ev.target.closest("[data-remover]");
    if (!botao) return;
    est.alimentos = est.alimentos.filter(function (a) { return a.id !== botao.dataset.remover; });
    salvar();
    MME.avisar("Item removido.");
    el("alimento").focus(); /* devolve o foco a um lugar que ainda existe */
  });

  desenhar();
})();
