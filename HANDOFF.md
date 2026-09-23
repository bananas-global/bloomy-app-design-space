# Paridade com o app real

Status: **candidata à revisão**. Nenhuma aprovação humana registrada.

## Referência e implementação

Fonte: sidedoor-tech/bloomy_app, commit `a61a468a3339d1f64c64cc5fbd02e0e786f8600f`, versão 1.11.3+94. Gravações fornecidas em 23/09/2026 mostram 1.10.3+89.

A prévia é Flutter 3.44.9 com imports reais de components_bloomy 6.39.0 e flutter_extension 6.2.0. CScaffold, CAppBarUser2, CBottomBarUser, CCalendarWeekly, CTextField, CTileParentContent, CMetricCurrentArea, CMetricPhase, CAvatarUpdater, CTileSettings e CButton são os widgets do pacote privado. Não há reconstrução CSS dessas telas.

Composição editável em `flutter_preview/lib/main.dart`. O cartão de conteúdo e os estados vazios são funções compartilhadas entre telas e biblioteca. O pacote não foi modificado no cache. O wrapper React cuida da moldura, seleção de tela e comentários exportáveis; a comunicação de navegação do iframe confere origem e janela de origem.

## Decisões de reprodução

- Quadro de 402 × 874, área segura superior 62 e inferior 34, data inicial 23/09/2026.
- Escala de texto 1,1 escolhida por comparação visual; não foi possível ler a configuração de acessibilidade do aparelho gravado.
- Tema, fontes e ícones originais. Fontes completas no build para preservar glifos eliminados pelo tree shaking.
- Marcações de calendário de 5, 6 e 7/9 e 10/10 reproduzem a amostra visível, sem assumir calendário operacional real.
- Galeria mantida em Configurações por aparecer no vídeo, embora o código mais novo tenha removido essa permissão.
- Dados sintéticos e avatares neutros. Fotos, e-mail, CPF e dados privados das gravações não foram incorporados.

## Limites

A paridade foi conferida visualmente; não é certificação pixel a pixel. Há diferenças de rasterização web/iOS, avatares, barra de sistema simulada, teclado nativo, versão do pacote e dados. O menu de seleção de paciente é uma demonstração simplificada. O calendário pode identificar o dia real do sistema além da seleção inicial fixa.

Não há backend, envio de arquivo, autenticação, alteração real de senha, permissão do sistema ou conteúdo clínico. Documentos legais e vídeo são recipientes explícitos, não cópias completas. Sobre é uma identificação simples. Não foram validados atendimentos preenchidos, devolutivas, erros de rede e estados ausentes dos vídeos. Feed, Notificações e redefinição de senha foram confrontados com o código, não certificados contra vídeo.

## Entrega

`npm run handoff -- baseline` gera ZIP dos fontes, patch binário, resumo e version.json com commit e base. `.env` e binários compilados ficam fora do Git/ZIP. O receptor precisa de acesso ao registro privado. Baseline e histórico preservam a versão React anterior.

Após revisão humana, registrar aprovador, data, escopo e commit aprovado. Não houve push, deploy nem modificação do app original.

## Ferramentas restauradas

Busca unificada, biblioteca de componentes isolados, viewport com presets e medidas livres, zoom e orientação, fixtures editáveis/salvas/exportáveis e links de contexto foram recuperados. O schema compartilhado do ambiente está em `src/workbench.ts`; o contrato correspondente no Flutter é `lib/preview_fixture.dart`. Os componentes e os dados continuam locais. O estado de busca e o JSON ainda não aplicado não entram no link; a fixture aplicada entra.

A biblioteca agora mostra o componente selecionado em vez de uma lista fixa. Referência continua sendo o estado inicial; fixtures de textos longos são instrumentos para explorar limites do componente original, não um compromisso de layout de produção.
