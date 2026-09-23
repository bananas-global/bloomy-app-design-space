# Validação — 23/09/2026

## Oito rodadas de comparação e correção

| Rodada | Evidência / problema | Correção e conferência |
|---|---|---|
| 1 | Duas gravações e código original; o redesign React não representava o app | Acesso ao registro privado, Flutter 3.44.9 e dependências originais resolvidas. Tema, assets e estrutura de telas extraídos do código. |
| 2 | Primeira integração nativa abria a moldura recursivamente | Caminho explícito `/flutter/index.html`; prévia real visível no navegador. |
| 3 | Início e Agenda: texto menor, ícones ausentes e calendário sem marcações | Escala visual 1,1, área segura 62/34, fonte Cupertino e feriados sintéticos das datas visíveis. |
| 4 | Conteúdos e Evolutivo: margens e quebra dos chips divergiam | Margens de conteúdo 24, fontes originais, data de amostra 2025; cartões e gráficos originais. |
| 5 | Configurações: getters de ícones perdiam glifos no build otimizado | Build com fontes completas, confirmado cadeado/câmera/editar/setas; galeria com UIcons.gallery. Rolagem e avatar nativos mantidos. |
| 6 | Login comparado com fundo/logo da gravação e fluxo CPF/senha | Assets e widgets originais, versão de referência, sem backend. Campos e ações locais verificados. |
| 7 | Teste de entrada encontrou reutilização do controller; revisão não acompanhava navegação interna | Key separa os campos; ponte de navegação sincroniza contexto dos comentários. Testes carregam Nunito real para evitar falsos overflows da fonte de teste Ahem. |
| 8 | Regressão final em 402 × 874, navegação, busca, calendário e entrega | Conferência final dos ícones, mudança de data, telas e integração. Screenshots locais e pacote ligado ao commit. |

## Checks

- Flutter analyze: sem problemas.
- 10 testes Flutter: navegação Início → Agenda, filtro de Conteúdos, entrada CPF → senha → Início e renderização de sete telas em 402 × 874, com fontes reais.
- Flutter web release (sem tree shaking de ícones) e TypeScript/Vite compilados.
- Browser: telas principais renderizadas; links inferiores, data do calendário, campos do login, comentários e exportação conferidos.
- Credencial local excluída de Git e arquivos de saída; versão de entrega exige árvore limpa.

## O que não mede

Não há percentual de similaridade fabricado nem certificação pixel a pixel. As comparações foram visuais contra quadros das gravações. Diferenças de sistema, avatares sintéticos, teclado, versão e funcionalidades não gravadas estão em HANDOFF.md. Testes de widgets não substituem validação no iOS real ou integração clínica.

## Restauração das ferramentas do Design Space

A moldura foi comparada com o contrato/README do @brucesantos/design-space usado em `/Users/brunosantos/Documents/GitHub/bloomy-design-space`. Busca, deep links, viewport e fixtures foram adaptados ao Flutter sem modificar esse repositório ou importar seus cenários clínicos de backoffice.

- 4 testes Node: busca sem acento, validação de fixtures, round-trip de dados no link e limites do viewport.
- 19 testes Flutter: incluem dados personalizados, estado sem conteúdo, botão desabilitado e sete amostras isoladas, além dos dez checks anteriores.
- Browser: busca por “calendario” abre CCalendarWeekly; fixture vazia remove cartão; JSON personalizado altera responsável/paciente/conteúdo; link reaberto preserva os dados e viewport tablet 768 × 1024. Dimensão personalizada 430 × 932 confirmada no iframe; zoom apenas visual.
- Viewports grandes mantêm rolagem do canvas; a moldura é opcional e sua remoção também zera a área segura injetada no Flutter.
- O catálogo atual tem oito componentes e oito telas principais. A restauração não importa os 285 cenários ou a matriz de permissões do outro produto.

## Barra compacta — revisão do usuário

Removido o cabeçalho promocional em telas e biblioteca. Controles reunidos na barra de seleção de tela/viewport, sem campos de largura e altura. Reiniciar prévia permanece como botão de ícone com rótulo acessível. Em larguras menores, a barra permite rolagem horizontal sem criar uma segunda linha. Links antigos com dimensões personalizadas continuam abrindo; novas dimensões são escolhidas pelos presets ou pela rotação.

## Catálogo contextual de variações

- Duas abas à esquerda: Telas e Componentes; busca limitada à aba ativa. Painel direito abre em Variações; JSON recolhido; metadados e comentários em abas secundárias.
- 49 combinações geradas do catálogo TypeScript para testes Flutter. Todas verificam renderização em 402 × 874; assertions adicionais verificam carregamento, erro, calendário semanal, senha, campo preenchido/com erro, documento, seleção de navegação e permissões.
- 68 testes Flutter e 5 testes Node no total. A fixture desabilitada não aparece na Agenda; ao trocar para um item incompatível, a referência é restaurada.
- Navegador: erro de Conteúdos, botão desabilitado, alternância de abas, presets pertinentes ao cabeçalho, biblioteca e busca. Fixtures são estados de desenho, sem simulação de resposta de servidor.
