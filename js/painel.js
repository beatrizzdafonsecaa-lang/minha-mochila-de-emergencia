/* ==========================================================
   painel.js — painel da família
   Interações:
   - carrossel "Para você agora": previsão, próximo passo e risco
     principal, sem a pessoa precisar rolar uma página longa
   - anel de preparo (responde "o quanto estou pronta?")
   - riscos que abrem e fecham (texto curto primeiro)
   - previsão do tempo da cidade pela API Open-Meteo
   ========================================================== */
(function () {
  "use strict";
  var el = MME.el, limpo = MME.limpo, ic = MME.ic, bloco = MME.bloco, regras = MME.dados.regras;
  var estado = MME.ler();
  if (!MME.exigirPerfil(estado)) return;
  var p = estado.perfil;

  /* ---------- Saudação ---------- */
  el("saudacao").textContent = p.nome ? "Olá, " + p.nome : "Olá!";
  var partes = [MME.plural(MME.pessoas(p), "pessoa", "pessoas")];
  if (p.pets) partes.push(MME.plural(p.pets, "animal", "animais"));
  el("resumo-familia").textContent = p.cidade + ", " + p.uf + " · " + partes.join(" e ");

  /* ---------- Nível de cada risco ---------- */
  function nivelRisco(id, prev) {
    var chuva = prev && prev.maxChuva >= regras.chuvaForteMm;
    var calor = prev && prev.maxTemp >= regras.calorForteC;
    if (id === "alagamento") {
      if (p.casa.rio || p.casa.alagou) return ["alto", "Risco alto", "Sua casa fica perto de rio ou em rua que já alagou." + (chuva ? " E há chuva forte prevista." : "")];
      if (chuva) return ["alto", "Chuva forte prevista", "Chuva forte pode alagar ruas mesmo longe de rios."];
      return ["atencao", "Fique de olho", "Chuva forte pode alagar ruas em qualquer cidade."];
    }
    if (id === "deslizamento") {
      if (p.casa.encosta) return ["alto", "Risco alto", "Sua casa fica em morro ou encosta." + (chuva ? " E há chuva forte prevista." : "")];
      return ["baixo", "Risco menor", "A casa não fica em encosta. Mesmo assim, conheça os sinais."];
    }
    if (id === "energia") return ["atencao", "Fique de olho", "Acontece em temporais e em dias de muito calor."];
    if (calor) return ["alto", "Calor forte previsto", "A previsão chega a " + Math.round(prev.maxTemp) + " °C."];
    return ["atencao", "Fique de olho", (p.idosos || p.bebes || p.criancas) ? "Crianças e idosos sofrem mais com o calor." : "Dias muito quentes estão mais comuns."];
  }

  function riscosOrdenados(prev) {
    var ordem = { alto: 0, atencao: 1, baixo: 2 };
    return MME.dados.riscos
      .map(function (r) { return { r: r, n: nivelRisco(r.id, prev) }; })
      .sort(function (a, b) { return ordem[a.n[0]] - ordem[b.n[0]]; });
  }

  /* ---------- Carrossel ---------- */
  function nomeDia(dataIso, i) {
    if (i === 0) return "Hoje";
    if (i === 1) return "Amanhã";
    var nome = new Date(dataIso + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  }

  function cartaoPasso() {
    var passo = MME.proximoPasso(estado);
    return '<article class="alerta-card azul">' +
      '<span class="tag">Próximo passo</span>' +
      '<div class="linha-topo">' + bloco(passo.icone, "branco") + "<div><h3>" + passo.titulo + "</h3><p>" + passo.texto + "</p></div></div>" +
      '<a class="botao claro" href="' + passo.link + '">' + passo.botao + "</a></article>";
  }

  function cartaoRisco(prev) {
    var x = riscosOrdenados(prev)[0];
    return '<article class="alerta-card azul">' +
      '<span class="tag">Sua casa</span>' +
      '<div class="linha-topo">' + bloco(x.r.icone, "branco") + "<div><h3>" + x.r.nome + "</h3><p>" + x.n[1] + ". " + limpo(x.n[2]) + "</p></div></div>" +
      '<a class="botao claro" href="plano.html">Ver para onde ir</a></article>';
  }

  function cartaoTempo(prev, antiga) {
    var corpo;
    if (!prev) {
      corpo = '<div class="linha-topo">' + bloco("chuva", "branco") + "<div><h3>Previsão indisponível</h3><p>Sem internet agora. As orientações continuam valendo.</p></div></div>";
    } else {
      var forte = prev.maxChuva >= regras.chuvaForteMm, quente = prev.maxTemp >= regras.calorForteC;
      var titulo = forte ? "Chuva forte prevista" : quente ? "Calor forte previsto" : "Sem chuva forte à vista";
      var icone = forte ? "chuva" : quente ? "termometro" : "sol";
      corpo = '<div class="linha-topo">' + bloco(icone, "branco") + "<div><h3>" + titulo + "</h3><p>" +
        limpo(p.cidade) + (antiga ? " · última previsão salva" : " · próximos 3 dias") + "</p></div></div>" +
        '<div class="dias">' + prev.dias.map(function (d, i) {
          return "<div><strong>" + nomeDia(d.data, i) + "</strong>" + ic(d.chuva >= 10 ? "chuva" : "sol") +
            MME.numero(d.chuva, 0) + " mm<br>" + Math.round(d.temp) + " °C</div>";
        }).join("") + "</div>";
    }
    return '<article class="alerta-card azul"><span class="tag">Tempo</span>' + corpo + "</article>";
  }

  function desenharCarrossel(prev, antiga) {
    var carrossel = el("carrossel");
    var cartoes = [cartaoTempo(prev, antiga), cartaoPasso(), cartaoRisco(prev)];
    carrossel.innerHTML = cartoes.join("");

    /* Pontinhos: mostram onde a pessoa está e levam ao cartão */
    var pontos = el("pontos");
    pontos.innerHTML = cartoes.map(function (_, i) {
      return '<button type="button" aria-label="Mostrar alerta ' + (i + 1) + " de " + cartoes.length + '"' + (i === 0 ? ' aria-current="true"' : "") + "></button>";
    }).join("");
    var botoes = pontos.querySelectorAll("button");
    var itens = carrossel.children;
    function marcar(atual) {
      botoes.forEach(function (b, i) {
        if (i === atual) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
    }
    botoes.forEach(function (b, i) {
      b.addEventListener("click", function () {
        marcar(i);
        carrossel.scrollTo({ left: itens[i].offsetLeft - itens[0].offsetLeft, behavior: "smooth" });
      });
    });
    carrossel.onscroll = function () {
      var passo = itens[1].offsetLeft - itens[0].offsetLeft;
      marcar(Math.round(carrossel.scrollLeft / passo));
    };
  }

  /* ---------- Anel de preparo ---------- */
  function desenharPreparo() {
    var prep = MME.preparo(estado);
    el("medidor-numero").textContent = prep.pontos;
    el("medidor-desc").textContent = "Preparo: " + prep.pontos + " de 100. " + prep.nivel + ".";
    el("medidor-nivel").textContent = prep.nivel;
    setTimeout(function () {
      el("medidor-arco").style.strokeDashoffset = String(314.16 * (1 - prep.pontos / 100));
    }, 80);

    var m = MME.progressoMochila(estado), e = MME.progressoEstoque(estado), pl = MME.progressoPlano(estado);
    var meta = estado.estoque.meta;
    var menorDias = Math.min(MME.diasAgua(estado), MME.diasComida(estado));
    var linhas = [
      { link: "mochila.html", icone: "mochila", nome: "Mochila", fracao: m.fracao, num: m.feitos + " de " + m.total },
      { link: "estoque.html", icone: "lata", nome: "Estoque", fracao: e.fracao, num: MME.numero(Math.min(menorDias, meta)) + " de " + meta + " dias" },
      { link: "plano.html", icone: "pin", nome: "Plano", fracao: pl.fracao, num: pl.feitos + " de " + pl.total }
    ];
    el("barras").innerHTML = linhas.map(function (l) {
      var pct = Math.round(l.fracao * 100);
      return '<li><a href="' + l.link + '">' + ic(l.icone) +
        '<span class="nome">' + l.nome + '</span><span class="num">' + l.num + "</span>" +
        '<span class="progresso' + (pct >= 100 ? " ok" : "") + '" aria-hidden="true"><span style="width:' + pct + '%"></span></span></a></li>';
    }).join("");
  }

  /* ---------- Riscos ---------- */
  function lista(itens) {
    return "<ul>" + itens.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
  }

  function desenharRiscos(prev) {
    el("riscos").innerHTML = riscosOrdenados(prev).map(function (x) {
      return '<details class="cartao risco"><summary>' + bloco(x.r.icone, x.r.classe) +
        '<div class="corpo"><h3>' + x.r.nome + '</h3><span class="etiqueta ' + x.n[0] + '">' + x.n[1] + "</span></div>" +
        ic("seta") + "</summary>" +
        '<div class="detalhe"><p class="porque">' + limpo(x.n[2]) + "</p>" +
        "<h4>Antes</h4>" + lista(x.r.antes) + "<h4>Na hora</h4>" + lista(x.r.durante) +
        '<a href="plano.html">Ver para onde ir</a></div></details>';
    }).join("");
  }

  /* ---------- Previsão (API Open-Meteo) ---------- */
  function mostrar(prev, antiga) {
    desenharCarrossel(prev, antiga);
    desenharRiscos(prev);
  }

  function buscarPrevisao() {
    var hoje = new Date().toISOString().slice(0, 10);
    if (estado.previsao && estado.previsao.buscadaEm === hoje) { mostrar(estado.previsao); return; }
    var nomeEstado = (MME.dados.estados.find(function (e) { return e[0] === p.uf; }) || [])[1];
    fetch("https://geocoding-api.open-meteo.com/v1/search?count=10&language=pt&countryCode=BR&name=" + encodeURIComponent(p.cidade))
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        var lugares = geo.results || [];
        var lugar = lugares.find(function (l) { return l.admin1 === nomeEstado; }) || lugares[0];
        if (!lugar) throw new Error("cidade não encontrada");
        return fetch("https://api.open-meteo.com/v1/forecast?daily=precipitation_sum,temperature_2m_max&timezone=auto&forecast_days=3" +
          "&latitude=" + lugar.latitude + "&longitude=" + lugar.longitude);
      })
      .then(function (r) { return r.json(); })
      .then(function (dados) {
        var d = dados.daily;
        var prev = { buscadaEm: hoje, dias: [], maxChuva: 0, maxTemp: -99 };
        d.time.forEach(function (data, i) {
          var chuva = d.precipitation_sum[i] || 0, temp = d.temperature_2m_max[i];
          prev.dias.push({ data: data, chuva: chuva, temp: temp });
          prev.maxChuva = Math.max(prev.maxChuva, chuva);
          prev.maxTemp = Math.max(prev.maxTemp, temp);
        });
        estado.previsao = prev;
        MME.salvar(estado);
        mostrar(prev);
      })
      .catch(function () { mostrar(estado.previsao, true); });
  }

  /* ---------- Telefones ---------- */
  el("telefones").innerHTML = MME.dados.telefones.map(function (t) {
    return '<li><a href="tel:' + t.numero + '"><strong>' + t.numero + "</strong>" + t.nome + "</a></li>";
  }).join("");

  desenharPreparo();
  mostrar(estado.previsao, true);
  buscarPrevisao();
})();
