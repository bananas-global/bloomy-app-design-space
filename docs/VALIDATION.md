# Verificação — 23/09/2026

- `npm run check`: TypeScript e build Vite passaram; três testes de integridade/seleção das fixtures passaram.
- Navegador integrado: Início → Ver tudo → Agenda; filtro Lia + Sala 03 retorna o mesmo atendimento a1.
- Agendado abre detalhes com paciente, profissional, data e horário correspondentes; mapa informa simulação.
- 22/09 abre atendimento finalizado e devolutiva sintética. Escape fecha o diálogo.
- 27/09 mostra estado vazio.
- Inspeção do cartão seleciona ScheduleCard sem abrir atendimento.
- Comentário criado, resolvido e preservado após reload.
- Exportação mostra texto completo; cópia para clipboard conferida. O primeiro download via Blob não foi confirmado pelo navegador integrado; foi substituído por exportação visível/copiável e link para salvar. O link para salvar não foi confirmado como arquivo baixado neste navegador.
- Largura 390 px: scrollWidth = 390; sem overflow horizontal.
- Mudança global: Button com raio de 24 px confirmado por estilo computado no fluxo e na Biblioteca.
- Mudança de código: data adicionada somente em ScheduleCard; texto “23 de setembro” confirmado em Início, Agenda e Biblioteca. A tag baseline preserva a versão anterior.
- Durante edição, houve aviso de root React duplicada. Entrada foi separada de App.tsx; recarga e atualização do editor conferidas sem novos erros.

Não foi executada uma auditoria completa de acessibilidade nem validação clínica. Não foram exercitados Flutter, API ou backend real.
