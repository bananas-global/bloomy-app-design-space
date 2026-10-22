# Paridade com o app real

Status: **candidata à revisão**. Nenhuma aprovação humana registrada.

## Referência e implementação

Fonte: sidedoor-tech/bloomy_app, commit `a61a468a3339d1f64c64cc5fbd02e0e786f8600f`, versão 1.11.3+94. Gravações fornecidas em 23/09/2026 mostram 1.10.3+89.

A prévia é Flutter 3.44.9 com imports reais de components_bloomy 6.41.2, flutter_extension 6.4.0 e global_messages 6.1.4. CScaffold, CAppBarUser2, CBottomBarUser, CCalendarWeekly, CTextField, CTileParentContent, CMetricCurrentArea, CMetricPhase, CAvatarUpdater, CTileSettings e CButton são os widgets do pacote privado. Não há reconstrução CSS dessas telas.

Em 15/10/2026 as dependências privadas passaram de components_bloomy 6.39.0, flutter_extension 6.2.0 e global_messages 6.1.1 para as versões atuais. A 6.41.2 exige essas versões exatas. As mudanças que alcançam a prévia são estas:
- O `CButton2` ganhou `isIgnorePointer` e deixou o `InkWell` fora da árvore de semântica.
- O `CTileScheduleParent` ganhou `showFullStartDate`, que vem desligado por padrão. Ligado, o chip de horário mostra `dd mon HH:mm` em vez de `HH:mm`. O controle “Horário com data” expõe a opção nas variações do card, de Próximos atendimentos, do Início e da Agenda.
- O `CBottomBarCheckbox` foi removido. A prévia não o usava.
- O `flutter_extension` removeu o ícone vazio, que estava depreciado, e renomeou `EquatableMixin` para `Equatable`. Nenhum dos dois era usado aqui.

Composição editável em `flutter_preview/lib/main.dart`. O cartão de conteúdo e os estados vazios são funções compartilhadas entre telas e biblioteca. O pacote não foi modificado no cache. O chrome de revisão é o do pacote `@brucesantos/design-space` 0.14; `src/app/flutter.tsx` carrega o Flutter dentro do quadro dele, e a comunicação com o iframe confere origem e janela de origem.

## Decisões de reprodução

- Paridade conferida em 402 × 874, tamanho dos testes de widgets. A revisão usa os tamanhos do design-space (Celular 375 × 812); no Celular, área segura superior 62 e inferior 34. Data inicial 23/09/2026.
- Escala de texto 1,1 escolhida por comparação visual; não foi possível ler a configuração de acessibilidade do aparelho gravado.
- Tema, fontes e ícones originais. Fontes completas no build para preservar glifos eliminados pelo tree shaking.
- Marcações de calendário de 5, 6 e 7/9 e 10/10 reproduzem a amostra visível, sem assumir calendário operacional real.
- Galeria mantida em Configurações por aparecer no vídeo, embora o código mais novo tenha removido essa permissão.
- Dados sintéticos e três retratos fornecidos pelo usuário para mãe, Lucas e Ana Lima. Fotos, e-mail, CPF e dados privados das gravações não foram incorporados.

## Limites

A paridade foi conferida visualmente; não é certificação pixel a pixel. Há diferenças de rasterização web/iOS, avatares, barra de sistema simulada, teclado nativo, versão do pacote e dados. O menu de seleção de paciente é uma demonstração simplificada. O calendário pode identificar o dia real do sistema além da seleção inicial fixa.

Não há backend, envio de arquivo, autenticação, alteração real de senha, permissão do sistema ou conteúdo clínico. Documentos legais e vídeo são recipientes explícitos, não cópias completas. Sobre é uma identificação simples. Atendimentos preenchidos usam amostras sintéticas e o card original; não foram certificados contra gravações. Devolutivas e estados ausentes dos vídeos seguem fora da validação de paridade. Feed, Notificações, redefinição de senha e Envio de link foram confrontados com o código, não certificados contra vídeo.

## Entrega

`pnpm run handoff -- baseline` gera ZIP dos fontes, patch binário, resumo e version.json com commit e base. `.env` e binários compilados ficam fora do Git/ZIP. O receptor precisa de acesso ao registro privado. Baseline e histórico preservam a versão React anterior.

Após revisão humana, registrar aprovador, data, escopo e commit aprovado. Publicação do código autorizada no repositório privado `bananas-global/bloomy-app-design-space`, na branch `main`. O `main` é publicado na Vercel; não houve modificação do app original.

## Ambiente de revisão

Desde 16/10/2026, o chrome e as URLs vêm do design-space real; antes eram uma reimplementação manual em `src/App.tsx`, que imitava uma versão antiga do pacote. `src/workbench.ts` continua sendo a fonte das fixtures, variações e controles, e `src/app/catalog.ts` traduz esses dados: cada tela é uma rota, cada variação é o cenário `<tela>.<fixture>` com o comportamento esperado de `scenarioExpected`, e cada widget do catálogo vira um componente com exemplos prontos. O contrato correspondente no Flutter continua em `lib/preview_fixture.dart`.

Decisões da migração (ver README): tamanhos de tela do pacote; componentes isolados só com exemplos prontos; sem o editor de dados em JSON; motivo de opção sem efeito na dica do controle; toque sempre simulado; sem a página “Sobre este ambiente”. Links antigos abrem a variação correspondente; os com dados personalizados abrem a padrão.

As gravações são apenas fontes visuais; fixtures de textos longos são instrumentos para explorar limites do componente original, não um compromisso de layout de produção. Nenhum catálogo de fluxos foi criado, pois as entradas são telas e componentes, não jornadas completas. Home, Feed, Agenda e suas peças isoladas compartilham controles por componente. O índice de uso dos componentes é gerado pelos testes Flutter. As amostras respeitam o posicionamento estrutural de cabeçalho e navegação inferior. Os posts usam a foto ilustrativa fornecida pelo usuário.

## Dados dos componentes e controles da prévia

As mensagens para o Flutter separam `data` de `preview`.
`data` usa nomes de propriedades da biblioteca; `preview` contém os seletores exclusivos do Design Space (fotos de exemplo, quantidades, estados de carregamento, plataforma e simulações).
Este objeto é uma fixture compartilhada de apresentação, não um DTO da API. O adaptador em `flutter_preview/lib/main.dart` constrói os objetos reais da biblioteca:

| Dado da fixture | Propriedade real utilizada |
| --- | --- |
| `legalGuardianName` | `CTileScheduleParentData.legalGuardianName`; no cabeçalho, `CAppBarUser2Data.name`; em perfis, `AvatarUserData.title` |
| `patientName` | `CTileScheduleParentData.patientName`, `CTileParentContentData.patientName`; no feed, `CCardFeedData.name` recebe `Name(patientName)`; em perfis, `AvatarUserData.title` |
| `title`, `description`, `contentType` | `CTileParentContentData` com os mesmos nomes; tipo convertido para o enum da biblioteca |
| `label`, `isEnabled` | `CButtonData` com os mesmos nomes |
| `status` | `CTileScheduleParentData.status`, convertido para `ScheduleStatus` |
| `roomName`, `unitName`, `hasProfessional`, `hasSupervisor`, `showFullStartDate` | `CTileScheduleParentData` com os mesmos nomes |

A fixture plana de `src/workbench.ts` combina esses dois grupos para os controles. A serialização os separa; não copie controles de `preview` para contratos do app. Seletores como `scheduleTime` geram datas sintéticas e `postText` gera um texto de amostra; fotos de amostra são convertidas em `CAvatarData.imageUrl`. Ações simuladas devem ser conectadas aos fluxos já existentes no app.

O leitor do Flutter mantém compatibilidade com fixtures planas antigas e nomes antigos (`guardian`, `patient`, `contentTitle`, `contentDescription`, `buttonLabel`, `buttonEnabled`, `scheduleStatus`, `scheduleRoom`, `scheduleUnit`). Não há mudança nos contratos do app original.


## Proposta: edição pelo avatar

A implementação candidata está em `flutter_preview/lib/avatar_updater_candidate.dart`, baseada em `CAvatarUpdater` de components_bloomy 6.39.0, que não mudou até a 6.41.2. Preserva `CAvatarUpdaterData`, `IAvatarUpdaterStyle`, o callback `onAvatarTap` e a seleção de perfis. O app usa esta classe local no lugar da classe exportada pela biblioteca; a biblioteca instalada não foi alterada.

Referências Figma: [com foto](https://www.figma.com/design/SJGEgCu6BDmmhUfWGQ3N13/App-dos-Pais?node-id=2339-4997) e [com iniciais](https://www.figma.com/design/SJGEgCu6BDmmhUfWGQ3N13/App-dos-Pais?node-id=2339-5002).

A foto inteira abre a edição. O indicador mantém o ícone original, agora com 16 px em um círculo de 32 px no canto superior direito. O avatar principal mede 124 px, incluindo o contorno de 2 px. Os perfis secundários medem 52 px, avançam 26 px por item e ficam alinhados pela base da foto principal, com um aro externo de 3 px na cor do fundo. São exibidos até três perfis secundários; listas maiores mantêm o indicador de quantidade. A navegação entre perfis continua cíclica. Em larguras estreitas, somente o grupo secundário reduz para não sobrepor o avatar principal.

O nome fica centralizado abaixo de toda a linha, separado por 8 px, em Nunito Sans Black 20 px; nomes extensos podem quebrar em linhas. As iniciais usam a regra real `Name(title).abbreviation`, em Nunito Sans Black, 48 px no principal e 20 px nos secundários. As fotos continuam recebidas pelos dados de cada perfil, sem embutir as imagens demonstrativas do Figma no componente.

Mapeamento de cores para `BloomyColors`: nome `text.main`; contorno principal e indicador `text.op20`; ícone `primary.main`; fundo sem foto `primary.light`; iniciais `primary.dark`; indicador `background.light`; aro de separação `background.main`. O fundo usa o token existente do app (ligeiramente diferente do valor literal do Figma).

Aceite: tocar em qualquer ponto da foto abre o seletor Galeria/Câmera; teclado e leitor de tela identificam a ação como editar foto da pessoa selecionada; o estado desabilitado impede a edição; trocar de perfil mantém o nome, a foto e o destinatário da edição correspondentes. Na integração, transportar a composição e os estilos locais para a biblioteca, preservando o callback real de edição do aplicativo. Nenhuma alteração foi feita no app original ou no pacote instalado.

## Aceite dos termos e contratos

Tela `agreements` adicionada ao catálogo a partir de `modules/intro/accept_agreements_screen.dart`, `agreement_details_screen.dart` e `modules/signature/signature_bottom_sheet.dart` do app 1.11.3+94, commit `a61a468a3339d1f64c64cc5fbd02e0e786f8600f`. Não consta das gravações 1.10.3+89; referência de código, sem certificação visual por vídeo.

A composição usa CTileAgreement, CBottomBarButtons, CAppBarTitle e CSignature reais. Variações: nenhum documento aceito, um aceito e todos aceitos. A leitura marca apenas o documento aberto; assinar exige todos aceitos e um traço. Refazer limpa a assinatura. Fechar descarta os traços. A prévia não exporta assinatura nem registra aceite. Ao concluir, demonstra retorno ao Início com aviso local; o app real segue para Welcome, ainda fora deste recorte.

Títulos e textos legais são sintéticos: o app recebe documentos do backend. A leitura usa texto local com tipografia da tela original em vez do renderizador HTML remoto. A assinatura mantém o painel girado e os componentes originais. Adaptação em `flutter_preview/lib/agreements_preview.dart` e `local_signature.dart`, montada em `main.dart`.

Não foi encontrada tela de cadastro livre no app. Login informa que o responsável precisa estar previamente cadastrado na clínica. Quando não há senha cadastrada, encaminha para PasswordRecoveryScreen (Envio de Link / Definir Senha); a criação da senha acontece pelo link enviado. Essa constatação não autoriza criar um formulário de cadastro inexistente.

## Envio de link

Tela `password-recovery` adicionada ao catálogo a partir de `modules/authentication/password_recovery_screen.dart` e `password_recovery_manager.dart` do app 1.11.3+94, commit `a61a468a3339d1f64c64cc5fbd02e0e786f8600f`. Esses arquivos estão iguais na 1.13.0+98 (commit `b88c23b`, conferido em 16/10/2026). A tela não consta das gravações 1.10.3+89; é referência de código, sem certificação visual por vídeo.

O app abre a tela por Esqueci minha senha ou quando o login retorna `need_change_password`. O canal inicial é o WhatsApp quando o telefone é válido; senão, o e-mail. Com os dois válidos, aparece o link Trocar para email/whatsapp. Depois de ENVIAR, o texto passa para “Enviamos” e aparece a orientação de suporte. A composição usa CScaffold, CAppBarRow, CButtonBack, CText, CIcon (`CIconPasswordRecoveryStyle`), CHeader, CBottomBarButton e `showCSnackBarMessage` reais, com os mesmos textos, cores, tipografia e identificadores. Os erros do envio (“O reset de senha já foi solicitado”, em amarelo, e os demais, em vermelho) não viraram variações.

Diferenças da prévia:
- O app chama `CHeader.title(CHeaderTitleData('Definir Senha'), CHeaderTitleStyle())`. Em `CHeader.build`, o ramo de `CHeaderTitleData` faz `data as CHeaderContentData` e lança `TypeError` (components_bloomy 6.39.0 e 6.41.2 conferidos; o app usa 6.40.1). Em release, o Flutter troca o widget por uma caixa cinza que, dentro da coluna, cobre o texto, os links e o aviso, e só o ícone e o botão ENVIAR ficam visíveis. A prévia usa `CHeader.content` com o mesmo estilo, que desenha o layout pretendido. Essa é a única chamada de `CHeader.title` no app. Correção sugerida na biblioteca: fazer o cast para `CHeaderTitleData`.
- Telefone `(11) 98765-4321` e e-mail `responsavel@example.invalid` são sintéticos. Aparecem como `(11) *****-4321` e `re...@example.invalid`, pelas mesmas máscaras do app.
- Tocar no contato mostra um aviso local em vez de abrir o WhatsApp ou o e-mail. ENVIAR não chama o backend.
- O erro de digitação do app “(Redireciona para o whastapp)” foi mantido na reprodução fiel (commit `8e84c0b`); o redesign retirou o texto.
- Os links de contato e de troca de canal são `GestureDetector` sem semântica de botão, como no app; leitores de tela não os anunciam como ações.

### Redesign

A tela do catálogo mostra a proposta; a reprodução fiel do app está no commit `8e84c0b`. Ajustes pedidos em 16/10/2026:
- O bloco do ícone perdeu a faixa de fundo (`accent.main` a 5%) e fica sobre o fundo da tela. Só o círculo continua.
- No WhatsApp, o ícone e o círculo usam o verde da marca, `#25D366`, no ícone e a 10% no círculo. A biblioteca não tem esse token (o `success` é `#87C619`); o estilo local `_WhatsAppIconStyle` estende `CIconPasswordRecoveryStyle` e só troca a cor. O e-mail mantém o roxo original.
- O contato perdeu o texto entre parênteses, “(Redireciona para o whastapp)” e “(Abre o email)”, que quebrava linha e repetia o canal.
