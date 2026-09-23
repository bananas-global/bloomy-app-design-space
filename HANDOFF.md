# Acompanhar atendimentos

Status: **candidata à revisão**. Não há aprovação humana registrada.

## Referência

App Flutter `sidedoor-tech/bloomy_app`, commit `a61a468a3339d1f64c64cc5fbd02e0e786f8600f`, consultado em 23/09/2026.
Fontes: `lib/modules/home/home_screen.dart`, `lib/modules/schedules/schedules_screen.dart`, `show_schedule_details_dialog.dart`, `show_schedule_details_bottom_sheet.dart` e `schedule_details_manager.dart`.

## Recorte e proposta

Preserva o caminho real: próximos atendimentos → agenda → detalhes para agendados ou devolutiva para finalizados. Busca por paciente/sala e seleção de paciente usam a mesma fonte sintética. A organização visual é proposta, não reprodução pixel a pixel nem decisão aprovada. O app real tem outras áreas e seleção de múltiplos pacientes; aqui demonstramos todos ou um paciente. A semana é fixa em 21–27/09/2026.

## Biblioteca e integração

| Web compartilhado | Referência Flutter | Usos demonstrados |
|---|---|---|
| Button | CButton | ações no fluxo e biblioteca |
| ScheduleCard | CTileScheduleParent | Início e Agenda |
| Avatar | CAvatar | cartões, detalhes e navegação |
| Status | ScheduleStatus e estilo do tile | cartões e detalhes |

`src/components/ui.tsx` é a implementação comum. `src/style.css` contém os estilos. `src/data/fixtures.ts` é a única fonte de pacientes e atendimentos.

O app usa Flutter 3.44.9 e components_bloomy 6.39.0. O registro privado de pacotes respondeu HTTP 401 nesta máquina; o antigo repo GitHub flutter_packages não ficou acessível. Nenhum Flutter/Dart foi encontrado no PATH. Por isso esta versão usa React/Vite e não reutiliza binariamente widgets Dart. Engenharia precisa adaptar a proposta para a biblioteca existente. Conseguir acesso ao pacote e criar um laboratório Flutter continua sendo a alternativa para compartilhamento direto com produção; não fingimos ter resolvido essa parte.

Logo do clone atual do app; Nunito do checkout local do mesmo app. Nenhum dado clínico foi copiado.

## Pendências

- Aprovar ou revisar visual, hierarquia e recorte da navegação.
- Validar com responsáveis; não houve pesquisa com usuários nesta etapa.
- Implementar integração real, autenticação, carregamento, erros e demais estados na engenharia.
- Confirmar endereço a usar no mapa: o código consultado usa o endereço do profissional; não inferir endereço da unidade.
- Registro de leitura da devolutiva é uma chamada de backend no app real; não executada aqui.
- Mapa simulado, sem abrir coordenadas fictícias.
- Conteúdos, Evolutivo, Feed, contratos, notificações e configurações fora do recorte.
- Comentários são locais e exportáveis; não há sincronização, login de revisores ou aprovação multiusuário.

## Versão e aprovação

`npm run handoff -- baseline` gera commit, base de comparação, patch binário, resumo de diferenças e código ZIP em `handoff/<commit>/`. Exige árvore limpa para que a entrega corresponda exatamente ao Git. Exporte também os comentários pelo ambiente.

Após aprovação humana, registrar aqui aprovador, data, escopo e commit aprovado. Criar tag anotada `approved/<nome>` apontando para esse commit. Tag candidata ou baseline não é aprovação. Nunca rotular automaticamente como aprovado.

## Diferença demonstrada contra baseline

A data foi acrescentada uma vez em ScheduleCard e apareceu em Início, Agenda e Biblioteca. A versão baseline preserva o cartão sem essa data; a candidata acrescenta também ajustes de revisão/exportação e acessibilidade. Evidências e limites dos checks em docs/VALIDATION.md.
