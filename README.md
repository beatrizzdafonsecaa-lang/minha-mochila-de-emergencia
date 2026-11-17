# Minha Mochila de Emergência

Protótipo navegável de CitizenTech que ajuda famílias de áreas de risco a se preparar **antes** de um alagamento, deslizamento, falta de energia ou calor extremo.

> Global Solution · FIAP

**Deploy:** _colocar aqui o link do GitHub Pages_
**Vídeo-pitch:** _colocar aqui o link do vídeo_

## Integrantes

| Nome completo | RM |
| --- | --- |
| _Nome 1_ | _RM_ |
| _Nome 2_ | _RM_ |

## O problema

Com o El Niño e as mudanças do clima, chuvas fortes, secas e ondas de calor ficam mais intensas. Muitas famílias são pegas de surpresa: sem água, sem comida, sem documentos à mão e sem saber por onde sair. As orientações da Defesa Civil existem, mas estão espalhadas, são genéricas e ninguém calcula o que **a sua casa** precisa.

## Quem é o cidadão beneficiado

Famílias que moram perto de rio ou em encosta, em que um adulto cuida de crianças ou de idosos e não tem tempo nem informação para se preparar.

**Persona (fictícia):** Dona Marta, 52 anos, mora com o marido, a mãe idosa e um neto em um bairro de encosta. Usa o celular, mas nunca montou um kit de emergência e não sabe para onde ir se chover forte.

## A solução e a jornada

| Passo | Página | O que a pessoa faz |
| --- | --- | --- |
| 1 | `index.html` · Perfil | Em 4 etapas curtas: quem mora na casa (e animais), cuidados especiais, onde a casa fica e um resumo para conferir. |
| 2 | `painel.html` · Painel | Vê o medidor de preparo, os riscos da região, a previsão do tempo e **um** próximo passo. |
| 3 | `mochila.html` · Mochila | Segue a lista feita para o perfil dela e marca o que já separou. |
| 4 | `estoque.html` · Estoque | Informa água e comida e descobre por quantos **dias** duram. |
| 5 | `plano.html` · Rotas e abrigos | Escolhe a situação, vê para onde ir e registra o plano da família. |
| + | `imprimir.html` · Imprimir | Imprime checklist, estoque, plano e mapa para desenhar. Funciona sem internet. |

## Interações em JavaScript e o problema que cada uma resolve

| Interação | Problema de experiência que resolve |
| --- | --- |
| Perfil em 4 etapas, uma pergunta por tela, com trilha de progresso | Um formulário longo cansa e assusta no celular; a pessoa vê quanto falta e responde uma coisa de cada vez. |
| Resumo final com botão "Mudar" em cada linha | A pessoa confere tudo antes de salvar e corrige só o que precisa, sem refazer o caminho. |
| Contadores com botões + e − | Digitar número no celular é difícil; botões grandes evitam erro. |
| Lista de cidades por estado (API do IBGE) | Evita erro de digitação no nome da cidade. |
| Conferência de cada etapa antes de avançar, com mensagem clara e foco no campo com erro | A pessoa sabe o que faltou e onde, sem perder o que já preencheu. |
| Foco levado ao título de cada nova etapa | Quem usa leitor de tela ouve a nova pergunta assim que a etapa muda. |
| Carrossel "Para você agora" (previsão do tempo, próximo passo e risco da casa) | Mostra o mais importante logo no topo, sem a pessoa precisar rolar uma página longa. |
| Anel de preparo (0 a 100) com barras de Mochila, Estoque e Plano | Responde de relance "o quanto estou pronta?" e o que falta. |
| Opções em azulejos com ícones no perfil | Tocar em um desenho é mais rápido que ler uma lista de caixas de marcar. |
| "Próximo passo" único | Quem não sabe por onde começar recebe só uma ação por vez. |
| Lista da mochila que muda conforme o perfil | Lista genérica não serve: bebê, idoso, pet e remédio contínuo geram itens próprios. |
| Marcar item, barra de progresso e "mostrar só o que falta" | Dá sensação de avanço e encurta a lista para quem já começou. |
| Estoque em "dias" | Litros e calorias não dizem nada; dias a família entende. |
| Escolha da situação em Rotas e abrigos | Em pânico não dá para ler muito: aparece só o que fazer naquela situação. |
| Plano salvo automaticamente no aparelho | Ninguém perde o que escreveu, mesmo sem internet. |
| Previsão de 3 dias (API Open-Meteo) com aviso de chuva ou calor forte | Liga a preparação ao que está para acontecer na cidade. |
| Folhas para imprimir escolhidas pela pessoa | Papel funciona quando falta luz e internet. |
| Texto maior e alto contraste | Ajuda quem tem baixa visão ou usa o celular no sol. |
| Modo sem internet (service worker) | O site abre e imprime mesmo offline, depois da primeira visita. |

## Acessibilidade

- HTML semântico: `header`, `nav`, `main`, `footer`, `section`, títulos em ordem.
- Link "Pular para o conteúdo" e foco visível em todos os elementos.
- Tudo funciona pelo teclado, inclusive os elementos criados com JavaScript (são botões, links, caixas de marcar e `details` nativos).
- `label` em todos os campos; erros com `role="alert"` e `aria-invalid`; confirmações em região `aria-live`.
- Contraste alto (texto principal 15:1 sobre o fundo) e botão de alto contraste.
- Botão de texto maior; áreas de toque com pelo menos 44 px.
- Ícones decorativos com `aria-hidden`; gráficos com texto alternativo.
- Linguagem simples, frases curtas, um assunto por tela.
- Respeita `prefers-reduced-motion`.

## Decisões de design

- **Leve e rápido:** sem framework, sem fontes externas e sem imagens pesadas. O site inteiro tem menos de 200 KB, pensando em quem tem pouca internet.
- **Jeito de aplicativo:** menu fixo embaixo no celular, perto do polegar; no computador o menu vai para o topo.
- **Inspirado em apps de serviço público:** cartões brancos sobre fundo azul claro, cartões azuis só para alertas e atalhos em grade com ícones coloridos.
- **Identidade própria:** ícones desenhados em SVG para o projeto (sem emojis), e linhas de relevo (curvas de nível) nos cartões azuis, lembrando morros e encostas.
- **Menos texto:** títulos curtos e uma frase de apoio por tela; o detalhe aparece só quando a pessoa abre.
- **Privacidade:** os dados ficam só no aparelho (`localStorage`). Não há cadastro nem senha.

## ODS relacionados

- **ODS 11 – Cidades e comunidades sustentáveis** (meta 11.5: reduzir o número de pessoas afetadas por desastres).
- **ODS 13 – Ação contra a mudança global do clima** (meta 13.1: reforçar a resiliência a riscos relacionados ao clima).

## Tecnologias

HTML, CSS e JavaScript puro. APIs públicas, sem chave: [IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades) e [Open-Meteo](https://open-meteo.com/).

## Organização do código

```
index.html, painel.html, mochila.html, estoque.html, plano.html, imprimir.html
css/estilo.css      estilos (inclui impressão e alto contraste)
js/dados.js         conteúdo: itens da mochila, alimentos, riscos, situações
js/comum.js         salvar dados, cálculos, acessibilidade, modo offline
js/perfil.js … js/imprimir.js   um arquivo por página
sw.js               guarda o site para abrir sem internet
```

## Como rodar no computador

Abra o `index.html` no navegador. Para testar o modo sem internet, use um servidor local:

```bash
npx http-server . -p 5173
```

## Limites do protótipo

- Os riscos são calculados a partir das respostas da pessoa e da previsão do tempo. **Não substituem** o mapeamento oficial de áreas de risco nem os alertas da Defesa Civil.
- Os "dias" do estoque são estimativa: 2 litros de água por pessoa por dia e média de 2.000 kcal por pessoa por dia.
- O site não tem a lista oficial de abrigos de cada cidade; ele orienta a confirmar pelo 199.

## Fontes

- Defesa Civil Nacional – recomendação de kit de emergência para 72 horas: [reportagem do SBT News](https://sbtnews.sbt.com.br/noticia/brasil/kit-de-emergencia-para-quem-vale-a-recomendacao)
- Alertas por SMS 40199: [Governo do RS](https://estado.rs.gov.br/como-se-cadastrar-para-receber-avisos-e-alertas-da-defesa-civil-no-celular) e [Governo do Paraná](https://www.parana.pr.gov.br/servicos/Seguranca/Defesa-Civil/Receber-alertas-da-Defesa-Civil-por-SMS-ERrZ4PN6)
- Ready.gov (governo dos EUA) – [Build a Kit](https://www.ready.gov/kit)
- Cruz Vermelha Americana – [Survival Kit Supplies](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html)
