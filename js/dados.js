/* ==========================================================
   dados.js — conteúdo do site (dados simulados em JavaScript)
   Fontes das orientações: Defesa Civil (kit para 72 horas),
   Ready.gov e Cruz Vermelha. Links no README.
   ========================================================== */
window.MME = window.MME || {};

MME.dados = {
  /* Regras de cálculo, em um só lugar para ficar fácil de conferir */
  regras: {
    litrosPorPessoaDia: 2,   // água para beber (Defesa Civil: 6 L por pessoa para 72 h)
    litrosPorPetDia: 0.5,    // estimativa para um animal de porte médio
    kcalPorPessoaDia: 2000,  // média simples usada só para estimar "dias"
    chuvaForteMm: 50,        // chuva em 1 dia que acende o aviso de alagamento
    calorForteC: 35          // temperatura máxima que acende o aviso de calor
  },

  estados: [
    ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"], ["BA", "Bahia"],
    ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"], ["GO", "Goiás"],
    ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"],
    ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"], ["PI", "Piauí"],
    ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"], ["RS", "Rio Grande do Sul"],
    ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"], ["SP", "São Paulo"],
    ["SE", "Sergipe"], ["TO", "Tocantins"]
  ],

  telefones: [
    { numero: "199", nome: "Defesa Civil" },
    { numero: "193", nome: "Bombeiros" },
    { numero: "192", nome: "SAMU" },
    { numero: "190", nome: "Polícia" }
  ],

  /* ---------- Mochila ----------
     "se" diz para quem o grupo aparece. Sem "se", vale para todos. */
  mochila: [
    {
      id: "agua", titulo: "Água e comida", icone: "gota", cor: "agua",
      itens: [
        { id: "agua", texto: "Água potável: 1 garrafa de 1,5 litro por pessoa", dica: "O resto da água fica no estoque de casa." },
        { id: "comida", texto: "Comida que não estraga e não precisa cozinhar", dica: "Biscoito, barra de cereal, enlatados, leite em pó." },
        { id: "abridor", texto: "Abridor de latas manual" }
      ]
    },
    {
      id: "luz", titulo: "Luz e comunicação", icone: "lanterna", cor: "amarelo",
      itens: [
        { id: "lanterna", texto: "Lanterna", dica: "Prefira lanterna a vela: vela pode causar incêndio." },
        { id: "pilhas", texto: "Pilhas extras" },
        { id: "radio", texto: "Rádio a pilha", dica: "Para ouvir avisos se o celular parar." },
        { id: "carregador", texto: "Carregador de celular e bateria portátil carregada" },
        { id: "apito", texto: "Apito para pedir ajuda" }
      ]
    },
    {
      id: "saude", titulo: "Saúde e higiene", icone: "saude", cor: "vermelho",
      itens: [
        { id: "socorros", texto: "Kit de primeiros socorros", dica: "Curativos, gaze, esparadrapo e antisséptico." },
        { id: "remedios", texto: "Remédios para dor e febre" },
        { id: "higiene", texto: "Sabonete, álcool em gel e papel higiênico" },
        { id: "absorvente", texto: "Absorventes e itens de higiene pessoal" },
        { id: "lixo", texto: "Sacos de lixo", dica: "Também protegem roupas e documentos da água." }
      ]
    },
    {
      id: "docs", titulo: "Documentos e dinheiro", icone: "documento", cor: "azul",
      itens: [
        { id: "copias", texto: "Cópias dos documentos em saco plástico fechado", dica: "RG, CPF, certidões, cartão do SUS e comprovante de endereço." },
        { id: "dinheiro", texto: "Dinheiro em notas pequenas" },
        { id: "telefones", texto: "Lista de telefones importantes em papel", dica: "Você pode imprimir a sua na página Imprimir." },
        { id: "chaves", texto: "Cópia das chaves de casa" }
      ]
    },
    {
      id: "roupas", titulo: "Roupas e abrigo", icone: "roupa", cor: "roxo",
      itens: [
        { id: "muda", texto: "Uma muda de roupa por pessoa" },
        { id: "capa", texto: "Capa de chuva" },
        { id: "manta", texto: "Cobertor leve ou manta" },
        { id: "calcado", texto: "Calçado fechado e firme" }
      ]
    },
    {
      id: "remedio-continuo", titulo: "Remédio de uso contínuo", icone: "pilula", cor: "vermelho",
      se: function (p) { return p.remedio; },
      itens: [
        { id: "rc-remedio", texto: "Remédios de uso contínuo para 7 dias" },
        { id: "rc-receita", texto: "Cópia das receitas médicas" }
      ]
    },
    {
      id: "criancas", titulo: "Crianças", icone: "crianca", cor: "laranja",
      se: function (p) { return p.criancas > 0 || p.bebes > 0; },
      itens: [
        { id: "cr-cartao", texto: "Cartão com nome da criança e telefone do responsável", dica: "Coloque no bolso da criança." },
        { id: "cr-vacina", texto: "Cópia da carteira de vacinação" },
        { id: "cr-brinquedo", texto: "Um brinquedo ou livrinho", dica: "Ajuda a acalmar." }
      ]
    },
    {
      id: "bebes", titulo: "Bebês", icone: "mamadeira", cor: "laranja",
      se: function (p) { return p.bebes > 0; },
      itens: [
        { id: "bb-fralda", texto: "Fraldas e lenços umedecidos para 3 dias" },
        { id: "bb-leite", texto: "Leite ou fórmula e mamadeira limpa" },
        { id: "bb-pomada", texto: "Pomada para assadura" }
      ]
    },
    {
      id: "idosos", titulo: "Pessoas idosas", icone: "idoso", cor: "roxo",
      se: function (p) { return p.idosos > 0; },
      itens: [
        { id: "id-oculos", texto: "Óculos reserva" },
        { id: "id-aparelho", texto: "Pilhas do aparelho auditivo, se usar" },
        { id: "id-fralda", texto: "Fraldas geriátricas, se usar" }
      ]
    },
    {
      id: "mobilidade", titulo: "Deficiência ou dificuldade para andar", icone: "acessivel", cor: "azul",
      se: function (p) { return p.mobilidade; },
      itens: [
        { id: "mb-apoio", texto: "Bengala, muleta ou outro apoio perto da saída" },
        { id: "mb-bateria", texto: "Bateria ou carregador de equipamentos", dica: "Cadeira motorizada, aparelhos de saúde." },
        { id: "mb-ajuda", texto: "Nome e telefone de quem ajuda a sair de casa", dica: "Combine antes com um vizinho ou parente." }
      ]
    },
    {
      id: "pets", titulo: "Animais de estimação", icone: "pata", cor: "terra",
      se: function (p) { return p.pets > 0; },
      itens: [
        { id: "pt-racao", texto: "Ração para 3 dias e potinho de água" },
        { id: "pt-guia", texto: "Coleira com nome e telefone, guia ou caixa de transporte" },
        { id: "pt-vacina", texto: "Cópia da carteira de vacinação do animal" },
        { id: "pt-saco", texto: "Saquinhos para recolher as fezes" }
      ]
    },
    {
      id: "veiculo", titulo: "Veículo", icone: "carro", cor: "azul",
      se: function (p) { return p.veiculo; },
      itens: [
        { id: "vc-tanque", texto: "Tanque sempre pelo menos pela metade na época de chuva" },
        { id: "vc-doc", texto: "Cópia do documento do veículo e chave reserva" }
      ]
    }
  ],

  /* ---------- Estoque ----------
     kcal aproximadas por unidade, usadas só para estimar os dias. */
  alimentos: [
    { id: "arroz", nome: "Arroz (pacote de 1 kg)", kcal: 3600 },
    { id: "feijao", nome: "Feijão (pacote de 1 kg)", kcal: 3300 },
    { id: "macarrao", nome: "Macarrão (pacote de 500 g)", kcal: 1800 },
    { id: "farinha", nome: "Farinha de mandioca ou fubá (1 kg)", kcal: 3500 },
    { id: "leite", nome: "Leite em pó (lata ou saco de 400 g)", kcal: 2000 },
    { id: "sardinha", nome: "Sardinha ou atum (lata)", kcal: 220 },
    { id: "milho", nome: "Milho ou ervilha (lata)", kcal: 170 },
    { id: "feijao-pronto", nome: "Feijão pronto (caixinha ou lata)", kcal: 350 },
    { id: "biscoito", nome: "Biscoito (pacote de 200 g)", kcal: 900 },
    { id: "barra", nome: "Barra de cereal (unidade)", kcal: 100 },
    { id: "amendoim", nome: "Amendoim ou castanhas (500 g)", kcal: 2900 },
    { id: "doce", nome: "Goiabada ou rapadura (300 g)", kcal: 900 }
  ],

  /* ---------- Riscos ---------- */
  riscos: [
    {
      id: "alagamento", nome: "Alagamento", icone: "onda", classe: "agua",
      antes: [
        "Guarde documentos e remédios em lugar alto, dentro de saco plástico.",
        "Saiba qual é o caminho para um lugar mais alto.",
        "Não jogue lixo na rua: ele entope os bueiros."
      ],
      durante: [
        "Desligue a energia no quadro de luz e feche o gás.",
        "Não atravesse a água, nem a pé nem de carro.",
        "Evite contato com a água da enchente: ela transmite doenças.",
        "Se a água subir, saia para o lugar alto combinado."
      ]
    },
    {
      id: "deslizamento", nome: "Deslizamento", icone: "morro", classe: "terra",
      antes: [
        "Aprenda os sinais: rachaduras nas paredes ou no chão, portas emperrando, postes e árvores tortos, água barrenta descendo o morro.",
        "Não faça cortes no barranco e não jogue água ou lixo na encosta.",
        "Combine com os vizinhos como avisar uns aos outros."
      ],
      durante: [
        "Viu um sinal ou ouviu estalos? Saia de casa na hora.",
        "Vá para longe do morro, pelo caminho combinado.",
        "Ligue para a Defesa Civil (199) ou Bombeiros (193).",
        "Só volte quando a Defesa Civil liberar."
      ]
    },
    {
      id: "energia", nome: "Falta de energia", icone: "raio", classe: "amarelo",
      antes: [
        "Deixe a lanterna em um lugar que todos conheçam.",
        "Mantenha a bateria portátil do celular carregada.",
        "Tenha água guardada: a bomba pode parar junto com a luz."
      ],
      durante: [
        "Use lanterna, não vela.",
        "Tire os aparelhos da tomada para não queimarem quando a luz voltar.",
        "Abra a geladeira o mínimo possível.",
        "Economize a bateria do celular: use só para o necessário."
      ]
    },
    {
      id: "calor", nome: "Calor extremo", icone: "termometro", classe: "laranja",
      antes: [
        "Tenha água sempre à mão.",
        "Descubra o cômodo mais fresco da casa.",
        "Saiba onde há um lugar fresco perto: posto de saúde, igreja, mercado."
      ],
      durante: [
        "Beba água várias vezes, mesmo sem sede.",
        "Evite o sol entre 10h e 16h.",
        "Use roupas leves e molhe o corpo com pano úmido.",
        "Olhe mais vezes as crianças, os idosos e os animais.",
        "Tontura, confusão ou desmaio: ligue 192."
      ]
    }
  ],

  /* ---------- Rotas e abrigos: para onde ir em cada situação ---------- */
  situacoes: [
    {
      id: "alagamento", nome: "Alagamento", icone: "onda", cor: "agua",
      ondeIr: "Vá para um lugar alto.",
      explica: "Pode ser o andar de cima de uma casa firme, a casa de um parente em rua alta ou o abrigo da prefeitura.",
      passos: [
        "Pegue a mochila e desligue a energia e o gás.",
        "Saia antes de a água chegar ao joelho. Depois fica perigoso andar.",
        "Siga pelo caminho combinado, longe de rios e córregos.",
        "Chegando ao ponto de encontro, avise seu contato de emergência."
      ]
    },
    {
      id: "deslizamento", nome: "Deslizamento", icone: "morro", cor: "terra",
      ondeIr: "Saia da encosta, para longe do morro.",
      explica: "Vá para um lugar plano e aberto, fora do caminho por onde a terra pode descer.",
      passos: [
        "Viu rachadura nova, estalo ou água barrenta? Saia já. Não espere a chuva parar.",
        "Avise os vizinhos no caminho.",
        "Ajude primeiro crianças, idosos e quem tem dificuldade para andar.",
        "Ligue 199 e só volte quando a Defesa Civil liberar."
      ]
    },
    {
      id: "energia", nome: "Falta de energia", icone: "raio", cor: "amarelo",
      ondeIr: "Fique em casa, se ela estiver segura.",
      explica: "Sair no escuro pode ser mais perigoso. Saia só se alguém depender de aparelho ligado na tomada.",
      passos: [
        "Pegue a lanterna e tire os aparelhos da tomada.",
        "Veja se os vizinhos idosos ou sozinhos estão bem.",
        "Alguém usa aparelho de saúde elétrico? Vá para o local combinado ou ligue 192.",
        "Avise a companhia de energia pelo telefone da conta de luz."
      ]
    },
    {
      id: "calor", nome: "Calor extremo", icone: "termometro", cor: "laranja",
      ondeIr: "Vá para o lugar mais fresco que tiver.",
      explica: "O cômodo mais fresco da casa ou um lugar público com sombra e ventilação.",
      passos: [
        "Feche cortinas do lado do sol e abra as janelas à noite.",
        "Dê água para todos, de hora em hora.",
        "Molhe panos e passe no rosto, pescoço e braços.",
        "Pessoa confusa, muito quente ou desmaiando: ligue 192."
      ]
    }
  ],

  /* Campos do plano da família (usados na página Plano e na folha impressa) */
  camposPlano: [
    { id: "pontoPerto", rotulo: "Ponto de encontro perto de casa", exemplo: "Ex.: em frente à padaria da esquina", obrigatorio: true },
    { id: "pontoLonge", rotulo: "Ponto de encontro fora do bairro", exemplo: "Ex.: casa da tia Lúcia, no Centro", obrigatorio: true },
    { id: "abrigo", rotulo: "Lugar seguro ou abrigo", exemplo: "Ex.: Escola Municipal do bairro", obrigatorio: true },
    { id: "rota", rotulo: "Caminho de saída", exemplo: "Ex.: subir a Rua das Flores até a praça. Não passar pela ponte.", obrigatorio: true, longo: true },
    { id: "contatoNome", rotulo: "Contato de emergência: nome", exemplo: "Ex.: Lúcia (tia)", obrigatorio: true },
    { id: "contatoTel", rotulo: "Contato de emergência: telefone", exemplo: "Ex.: (81) 90000-0000", obrigatorio: true, tipo: "tel" },
    { id: "ajuda", rotulo: "Quem ajuda quem na hora de sair", exemplo: "Ex.: João leva a vó. Marta leva o neto e o cachorro.", longo: true, soCuidado: true }
  ]
};
