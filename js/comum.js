/* ==========================================================
   comum.js — funções usadas em todas as páginas
   - guarda os dados no próprio aparelho (localStorage)
   - calcula o preparo da família
   - recursos de acessibilidade e modo sem internet
   ========================================================== */
(function () {
  "use strict";

  var CHAVE = "mme:v1";
  var regras = MME.dados.regras;

  /* ---------- 1. Guardar e ler os dados ---------- */
  function estadoInicial() {
    return {
      perfil: null,
      mochila: {},                                   // { idDoItem: true }
      estoque: { meta: 3, agua: 0, alimentos: [] },   // alimentos: [{ id, qtd }]
      plano: {},
      prefs: { fonteGrande: false, contraste: false },
      previsao: null
    };
  }

  MME.ler = function () {
    var base = estadoInicial();
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && typeof salvo === "object") {
        Object.keys(base).forEach(function (k) {
          if (salvo[k] !== undefined && salvo[k] !== null) base[k] = salvo[k];
        });
      }
    } catch (e) { /* sem acesso ao armazenamento: segue com dados vazios */ }
    return base;
  };

  MME.salvar = function (estado) {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); return true; }
    catch (e) { return false; }
  };

  /* ---------- 2. Cálculos ---------- */
  MME.pessoas = function (p) {
    return p ? (p.adultos + p.criancas + p.bebes + p.idosos) : 0;
  };

  /* Grupos da mochila que valem para este perfil */
  MME.gruposMochila = function (p) {
    return MME.dados.mochila.filter(function (g) { return !g.se || g.se(p); });
  };

  MME.progressoMochila = function (estado) {
    var total = 0, feitos = 0;
    MME.gruposMochila(estado.perfil).forEach(function (g) {
      g.itens.forEach(function (i) { total++; if (estado.mochila[i.id]) feitos++; });
    });
    return { total: total, feitos: feitos, faltam: total - feitos, fracao: total ? feitos / total : 0 };
  };

  MME.aguaPorDia = function (p) {
    return MME.pessoas(p) * regras.litrosPorPessoaDia + (p.pets || 0) * regras.litrosPorPetDia;
  };

  MME.diasAgua = function (estado) {
    var porDia = MME.aguaPorDia(estado.perfil);
    return porDia ? estado.estoque.agua / porDia : 0;
  };

  MME.diasComida = function (estado) {
    var kcal = 0;
    estado.estoque.alimentos.forEach(function (a) {
      var item = MME.dados.alimentos.find(function (x) { return x.id === a.id; });
      if (item) kcal += item.kcal * a.qtd;
    });
    var porDia = MME.pessoas(estado.perfil) * regras.kcalPorPessoaDia;
    return porDia ? kcal / porDia : 0;
  };

  MME.progressoEstoque = function (estado) {
    var meta = estado.estoque.meta;
    var agua = Math.min(1, MME.diasAgua(estado) / meta);
    var comida = Math.min(1, MME.diasComida(estado) / meta);
    return { fracao: (agua + comida) / 2, agua: agua, comida: comida };
  };

  MME.progressoPlano = function (estado) {
    var obrig = MME.dados.camposPlano.filter(function (c) { return c.obrigatorio; });
    var feitos = obrig.filter(function (c) { return (estado.plano[c.id] || "").trim(); }).length;
    return { total: obrig.length, feitos: feitos, fracao: feitos / obrig.length };
  };

  /* Nota de preparo, de 0 a 100 */
  MME.preparo = function (estado) {
    if (!estado.perfil) return { pontos: 0, nivel: "Sem perfil" };
    var pontos = Math.round(
      10 +
      40 * MME.progressoMochila(estado).fracao +
      25 * MME.progressoEstoque(estado).fracao +
      25 * MME.progressoPlano(estado).fracao
    );
    var nivel = pontos >= 100 ? "Preparada" : pontos >= 70 ? "Quase pronta" : pontos >= 35 ? "No caminho" : "Começando";
    return { pontos: pontos, nivel: nivel };
  };

  /* Um só próximo passo, na ordem da jornada */
  MME.proximoPasso = function (estado) {
    var m = MME.progressoMochila(estado);
    if (m.faltam > 0) {
      return {
        icone: "mochila",
        titulo: m.feitos === 0 ? "Monte a mochila" : "Termine a mochila",
        texto: "Faltam " + m.faltam + " de " + m.total + " itens.",
        link: "mochila.html", botao: m.feitos === 0 ? "Começar a lista" : "Continuar a lista"
      };
    }
    var e = MME.progressoEstoque(estado);
    if (e.fracao < 1) {
      return {
        icone: "lata",
        titulo: "Confira água e comida",
        texto: "A meta é durar " + estado.estoque.meta + " dias.",
        link: "estoque.html", botao: "Conferir estoque"
      };
    }
    var pl = MME.progressoPlano(estado);
    if (pl.fracao < 1) {
      return {
        icone: "pin",
        titulo: "Combine o plano",
        texto: "Ponto de encontro e caminho de saída.",
        link: "plano.html", botao: "Fazer o plano"
      };
    }
    return {
      icone: "impressora",
      titulo: "Imprima o kit de papel",
      texto: "Plastifique e guarde na mochila.",
      link: "imprimir.html", botao: "Imprimir"
    };
  };

  /* ---------- 3. Pequenas ajudas de interface ---------- */
  MME.el = function (id) { return document.getElementById(id); };

  /* Evita que texto digitado pelo usuário vire código na página */
  MME.limpo = function (texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  MME.numero = function (n, casas) {
    return Number(n).toLocaleString("pt-BR", { maximumFractionDigits: casas === undefined ? 1 : casas });
  };

  MME.plural = function (n, um, varios) { return n + " " + (n === 1 ? um : varios); };

  /* Mensagem curta de confirmação. Leitores de tela leem em voz alta. */
  var relogioAviso;
  MME.avisar = function (texto) {
    var caixa = MME.el("avisos");
    if (!caixa) return;
    caixa.innerHTML = '<div class="msg">' + MME.ic("check") + MME.limpo(texto) + "</div>";
    clearTimeout(relogioAviso);
    relogioAviso = setTimeout(function () { caixa.innerHTML = ""; }, 4000);
  };

  /* Páginas que precisam do perfil: mostra o convite se ainda não existe */
  MME.exigirPerfil = function (estado) {
    if (estado.perfil) return true;
    var conteudo = MME.el("conteudo");
    conteudo.innerHTML =
      '<div class="container"><div class="cartao" style="max-width:36rem;margin:2rem auto;text-align:center">' +
      MME.bloco("pessoas", "azul", "g") +
      '<h1 style="margin-top:1rem">Primeiro, conte quem mora com você</h1>' +
      "<p>Leva 1 minuto. Com isso a lista fica certa para a sua casa.</p>" +
      '<a class="botao" href="index.html">Criar meu perfil</a></div></div>';
    return false;
  };

  /* Contadores com botões de + e − */
  function ligarContadores() {
    document.addEventListener("click", function (ev) {
      var botao = ev.target.closest(".contador button[data-passo]");
      if (!botao) return;
      var campo = botao.parentElement.querySelector("input");
      var passo = Number(botao.dataset.passo);
      var min = campo.min === "" ? 0 : Number(campo.min);
      var max = campo.max === "" ? 9999 : Number(campo.max);
      var valor = Math.min(max, Math.max(min, (Number(campo.value) || 0) + passo));
      campo.value = valor;
      campo.dispatchEvent(new Event("input", { bubbles: true }));
      campo.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* ---------- 4. Acessibilidade: texto maior e alto contraste ---------- */
  function aplicarPrefs(prefs) {
    document.documentElement.classList.toggle("fonte-grande", !!prefs.fonteGrande);
    document.documentElement.classList.toggle("contraste", !!prefs.contraste);
    var bF = MME.el("btn-fonte"), bC = MME.el("btn-contraste");
    if (bF) bF.setAttribute("aria-pressed", String(!!prefs.fonteGrande));
    if (bC) bC.setAttribute("aria-pressed", String(!!prefs.contraste));
  }

  function ligarPrefs() {
    [["btn-fonte", "fonteGrande", "Texto maior"], ["btn-contraste", "contraste", "Alto contraste"]]
      .forEach(function (cfg) {
        var botao = MME.el(cfg[0]);
        if (!botao) return;
        botao.addEventListener("click", function () {
          var estado = MME.ler();
          estado.prefs[cfg[1]] = !estado.prefs[cfg[1]];
          MME.salvar(estado);
          aplicarPrefs(estado.prefs);
          MME.avisar(cfg[2] + (estado.prefs[cfg[1]] ? " ligado" : " desligado"));
        });
      });
  }

  /* ---------- 5. Cabeçalho: família e cidade ---------- */
  function preencherChip(estado) {
    var chip = MME.el("chip-perfil");
    if (!chip) return;
    var p = estado.perfil;
    if (!p) {
      chip.innerHTML = '<span class="avatar">' + MME.ic("usuario") + '</span><span class="txt"><strong>Criar perfil</strong></span>';
      return;
    }
    var nome = p.nome ? "Família de " + p.nome : "Minha família";
    var inicial = (p.nome || "F").charAt(0).toUpperCase();
    chip.innerHTML =
      '<span class="avatar" aria-hidden="true">' + MME.limpo(inicial) + "</span>" +
      '<span class="txt"><strong>' + MME.limpo(nome) + "</strong>" +
      MME.limpo(p.cidade + ", " + p.uf) + "</span>";
    chip.setAttribute("aria-label", "Editar perfil: " + nome + ", " + p.cidade + ", " + p.uf);
  }

  /* ---------- 6. Sem internet ---------- */
  function mostrarConexao() {
    var el = MME.el("faixa-offline");
    if (el) el.hidden = navigator.onLine;
  }

  function registrarOffline() {
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () { /* segue sem modo offline */ });
    }
  }

  /* ---------- 7. Início ---------- */
  var estado = MME.ler();
  aplicarPrefs(estado.prefs); // antes de desenhar, para não piscar

  document.addEventListener("DOMContentLoaded", function () {
    aplicarPrefs(estado.prefs);
    ligarPrefs();
    ligarContadores();
    preencherChip(estado);
    mostrarConexao();
    window.addEventListener("online", mostrarConexao);
    window.addEventListener("offline", mostrarConexao);
    registrarOffline();
  });
})();
