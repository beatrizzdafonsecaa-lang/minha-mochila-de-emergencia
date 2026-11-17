/* ==========================================================
   perfil.js — página inicial: perfil da família em 4 etapas
   Interações:
   - uma pergunta por tela, com trilha de progresso (menos cansaço)
   - contadores de + e − (menos digitação no celular)
   - lista de cidades do estado vinda da API do IBGE
   - conferência de cada etapa antes de avançar, com mensagens claras
   - resumo final para a pessoa conferir antes de salvar
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el;
  var estado = MME.ler();
  var form = el("form-perfil");
  var etapas = form.querySelectorAll(".etapa");
  var TOTAL = etapas.length;
  var atual = 1;
  var editando = !!estado.perfil;
  var CONTADORES = ["adultos", "idosos", "criancas", "bebes", "pets"];
  var MARCAS = ["mobilidade", "remedio", "veiculo"];

  /* Estados no seletor */
  MME.dados.estados.forEach(function (par) {
    var op = document.createElement("option");
    op.value = par[0]; op.textContent = par[1];
    el("uf").appendChild(op);
  });

  /* API do IBGE: cidades do estado escolhido.
     Se não houver internet, o campo continua aceitando texto livre. */
  function carregarCidades(uf) {
    var lista = el("lista-cidades");
    lista.innerHTML = "";
    if (!uf) return;
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + uf + "/municipios?orderBy=nome")
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (cidades) {
        var partes = document.createDocumentFragment();
        cidades.forEach(function (c) {
          var op = document.createElement("option");
          op.value = c.nome;
          partes.appendChild(op);
        });
        lista.appendChild(partes);
        el("ajuda-cidade").textContent = "Digite e escolha na lista.";
      })
      .catch(function () {
        el("ajuda-cidade").textContent = "Sem internet agora. Escreva o nome da cidade.";
      });
  }
  el("uf").addEventListener("change", function () { carregarCidades(this.value); });

  /* Lê o que está no formulário */
  function lerPerfil() {
    var p = { casa: {} };
    CONTADORES.forEach(function (c) { p[c] = Math.max(0, Math.floor(Number(el(c).value) || 0)); });
    MARCAS.forEach(function (m) { p[m] = el(m).checked; });
    p.uf = el("uf").value;
    p.cidade = el("cidade").value.trim();
    p.nome = el("nome").value.trim();
    p.casa.rio = el("casa-rio").checked;
    p.casa.encosta = el("casa-encosta").checked;
    p.casa.alagou = el("casa-alagou").checked;
    return p;
  }

  /* Preenche o formulário se o perfil já existe */
  function preencher(p) {
    CONTADORES.forEach(function (c) { el(c).value = p[c]; });
    MARCAS.forEach(function (m) { el(m).checked = !!p[m]; });
    el("uf").value = p.uf;
    el("cidade").value = p.cidade;
    el("nome").value = p.nome || "";
    el("casa-rio").checked = !!p.casa.rio;
    el("casa-encosta").checked = !!p.casa.encosta;
    el("casa-alagou").checked = !!p.casa.alagou;
    carregarCidades(p.uf);
    el("acoes-perfil").hidden = false;
    el("abertura").hidden = true;
    el("cabeca-editar").hidden = false;
  }
  if (editando) preencher(estado.perfil);

  /* ---------- Conferência de cada etapa ---------- */
  function marcarErro(idCampo, idErro, temErro) {
    el(idErro).hidden = !temErro;
    if (idCampo) el(idCampo).setAttribute("aria-invalid", String(temErro));
    return temErro;
  }

  function errosDaEtapa(n, p) {
    var erros = [];
    if (n === 1 && marcarErro(null, "erro-pessoas", MME.pessoas(p) < 1)) erros.push("adultos");
    if (n === 3) {
      if (marcarErro("uf", "erro-uf", !p.uf)) erros.push("uf");
      if (marcarErro("cidade", "erro-cidade", !p.cidade)) erros.push("cidade");
    }
    return erros;
  }

  function mostrarErros(erros) {
    var geral = el("erro-geral");
    if (!erros.length) { geral.hidden = true; return false; }
    geral.hidden = false;
    geral.innerHTML = MME.ic("alerta") + "<p><strong>Falta pouco.</strong> Confira " +
      (erros.length === 1 ? "o campo marcado" : "os " + erros.length + " campos marcados") + " em vermelho.</p>";
    el(erros[0]).focus();
    return true;
  }

  /* ---------- Resumo da última etapa ---------- */
  function linhaResumo(icone, cor, texto, etapa) {
    return "<li>" + MME.bloco(icone, cor, "p") + "<span>" + MME.limpo(texto) + "</span>" +
      '<button type="button" class="link-editar" data-ir="' + etapa + '">Mudar<span class="so-leitor">: ' + MME.limpo(texto) + "</span></button></li>";
  }

  function montarResumo(p) {
    var quem = [];
    if (p.adultos) quem.push(MME.plural(p.adultos, "adulto", "adultos"));
    if (p.idosos) quem.push(MME.plural(p.idosos, "idoso", "idosos"));
    if (p.criancas) quem.push(MME.plural(p.criancas, "criança", "crianças"));
    if (p.bebes) quem.push(MME.plural(p.bebes, "bebê", "bebês"));
    if (p.pets) quem.push(MME.plural(p.pets, "animal", "animais"));

    var cuidados = [];
    if (p.mobilidade) cuidados.push("dificuldade para andar");
    if (p.remedio) cuidados.push("remédio todo dia");
    if (p.veiculo) cuidados.push("carro ou moto");

    var casa = [];
    if (p.casa.rio) casa.push("perto de rio");
    if (p.casa.encosta) casa.push("em encosta");
    if (p.casa.alagou) casa.push("rua que já alagou");

    el("resumo").innerHTML =
      linhaResumo("pessoas", "azul", quem.join(", "), 1) +
      linhaResumo("saude", "vermelho", cuidados.length ? cuidados.join(", ") : "Nenhum cuidado especial", 2) +
      linhaResumo("pin", "verde", p.cidade + ", " + p.uf + (casa.length ? " · " + casa.join(", ") : ""), 3);
  }

  /* ---------- Troca de etapa ---------- */
  var NOMES = ["Quem mora", "Cuidados", "Endereço", "Conferir"];

  function irPara(n, focar) {
    atual = n;
    etapas.forEach(function (e) { e.hidden = Number(e.dataset.etapa) !== n; });
    form.querySelectorAll(".trilha li").forEach(function (li, i) {
      li.className = i + 1 < n ? "feita" : i + 1 === n ? "atual" : "";
    });
    el("etapa-texto").textContent = "Etapa " + n + " de " + TOTAL + " · " + NOMES[n - 1];
    el("btn-voltar").hidden = n === 1;
    el("btn-avancar").textContent = n < TOTAL ? "Continuar" : (editando ? "Salvar mudanças" : "Ver meu painel");
    el("erro-geral").hidden = true;
    if (n === TOTAL) montarResumo(lerPerfil());
    if (focar) {
      /* Leva o foco ao título da etapa: quem usa leitor de tela ouve a nova pergunta */
      var titulo = form.querySelector('.etapa[data-etapa="' + n + '"] h2');
      titulo.focus({ preventScroll: true });
      form.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  el("btn-voltar").addEventListener("click", function () { irPara(atual - 1, true); });

  el("resumo").addEventListener("click", function (ev) {
    var botao = ev.target.closest("[data-ir]");
    if (botao) irPara(Number(botao.dataset.ir), true);
  });

  /* "Começar" na abertura leva direto à primeira pergunta */
  var comecar = document.querySelector('#abertura a[href="#form-perfil"]');
  if (comecar) comecar.addEventListener("click", function (ev) {
    ev.preventDefault();
    irPara(1, true);
  });

  /* Continuar (ou Enter num campo) confere a etapa e avança; na última, salva */
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var p = lerPerfil();
    if (mostrarErros(errosDaEtapa(atual, p))) return;
    if (atual < TOTAL) { irPara(atual + 1, true); return; }

    /* Se a cidade mudou, a previsão guardada não vale mais */
    var antigo = estado.perfil;
    if (!antigo || antigo.cidade !== p.cidade || antigo.uf !== p.uf) estado.previsao = null;

    estado.perfil = p;
    if (MME.salvar(estado)) {
      location.href = "painel.html";
    } else {
      var geral = el("erro-geral");
      geral.hidden = false;
      geral.innerHTML = MME.ic("alerta") + "<p>Não foi possível salvar neste aparelho. Verifique se o navegador não está em modo anônimo.</p>";
    }
  });

  el("btn-apagar").addEventListener("click", function () {
    if (confirm("Apagar o perfil, a mochila, o estoque e o plano deste aparelho? Não dá para desfazer.")) {
      try { localStorage.removeItem("mme:v1"); } catch (e) { /* nada a apagar */ }
      location.reload();
    }
  });

  irPara(1, false);
})();
