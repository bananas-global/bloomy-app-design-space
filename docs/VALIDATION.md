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
