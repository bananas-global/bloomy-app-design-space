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
- Dados sintéticos e três retratos fornecidos pelo usuário para mãe, Lucas e Ana Lima. Fotos, e-mail, CPF e dados privados das gravações não foram incorporados.

## Limites

A paridade foi conferida visualmente; não é certificação pixel a pixel. Há diferenças de rasterização web/iOS, avatares, barra de sistema simulada, teclado nativo, versão do pacote e dados. O menu de seleção de paciente é uma demonstração simplificada. O calendário pode identificar o dia real do sistema além da seleção inicial fixa.

Não há backend, envio de arquivo, autenticação, alteração real de senha, permissão do sistema ou conteúdo clínico. Documentos legais e vídeo são recipientes explícitos, não cópias completas. Sobre é uma identificação simples. Atendimentos preenchidos usam amostras sintéticas e o card original; não foram certificados contra gravações. Devolutivas e estados ausentes dos vídeos seguem fora da validação de paridade. Feed, Notificações e redefinição de senha foram confrontados com o código, não certificados contra vídeo.

## Entrega

`npm run handoff -- baseline` gera ZIP dos fontes, patch binário, resumo e version.json com commit e base. `.env` e binários compilados ficam fora do Git/ZIP. O receptor precisa de acesso ao registro privado. Baseline e histórico preservam a versão React anterior.

Após revisão humana, registrar aprovador, data, escopo e commit aprovado. Publicação do código autorizada no repositório privado `bananas-global/bloomy-app-design-space`, na branch `main`. Não houve deploy nem modificação do app original.

## Ferramentas restauradas

Busca unificada, biblioteca de componentes isolados, viewport com presets e medidas livres, zoom e orientação, fixtures editáveis/salvas/exportáveis e links de contexto foram recuperados. O schema compartilhado do ambiente está em `src/workbench.ts`; o contrato correspondente no Flutter é `lib/preview_fixture.dart`. Os componentes e os dados continuam locais. O estado de busca e o JSON ainda não aplicado não entram no link; a fixture aplicada entra.

A biblioteca agora mostra o componente selecionado em vez de uma lista fixa. As gravações são apenas fontes visuais; fixtures de textos longos são instrumentos para explorar limites do componente original, não um compromisso de layout de produção.

## Organização por item

As abas Telas/Componentes substituem Área de criação/Biblioteca Flutter. O painel Variações é contextual, e editar JSON é opcional. A matriz gerada cobre os estados dos widgets originais e os controles independentes têm testes de composição; estados de carregamento/erro ficam estáveis para revisão. Nenhum catálogo de fluxos foi criado, pois as entradas atuais são telas e componentes, não jornadas completas.

Home, Feed, Agenda e suas peças isoladas compartilham controles por componente. Sem a opção “Referência da gravação”. Consultar README para o contrato de compatibilidade, mídia obrigatória e avatares fornecidos.

## Revisão do ambiente

Laterais redimensionáveis, controles de viewport no cabeçalho, Handoff com cópia de link e texto, painel contextual de informações e variações para os 20 itens do catálogo. O índice de uso dos componentes é gerado pelos testes Flutter. As amostras respeitam o posicionamento estrutural de cabeçalho e navegação inferior. O modo sem hover simula toques e usa um cursor circular. Os posts usam a foto ilustrativa fornecida pelo usuário.


## Dados dos componentes e controles da prévia

Links, JSON editável/exportado e mensagens para Flutter separam `data` de `preview`.
`data` usa nomes de propriedades da biblioteca; `preview` contém os seletores exclusivos do Design Space (fotos de exemplo, quantidades, estados de carregamento, plataforma e simulações).
Este objeto é uma fixture compartilhada de apresentação, não um DTO da API. O adaptador em `flutter_preview/lib/main.dart` constrói os objetos reais da biblioteca:

| Dado da fixture | Propriedade real utilizada |
| --- | --- |
| `legalGuardianName` | `CTileScheduleParentData.legalGuardianName`; no cabeçalho, `CAppBarUser2Data.name`; em perfis, `AvatarUserData.title` |
| `patientName` | `CTileScheduleParentData.patientName`, `CTileParentContentData.patientName`; no feed, `CCardFeedData.name` recebe `Name(patientName)`; em perfis, `AvatarUserData.title` |
| `title`, `description`, `contentType` | `CTileParentContentData` com os mesmos nomes; tipo convertido para o enum da biblioteca |
| `label`, `isEnabled` | `CButtonData` com os mesmos nomes |
| `status` | `CTileScheduleParentData.status`, convertido para `ScheduleStatus` |
| `roomName`, `unitName`, `hasProfessional`, `hasSupervisor` | `CTileScheduleParentData` com os mesmos nomes |

A estrutura interna plana do editor combina esses dois grupos somente para renderizar controles. A serialização os separa; não copie controles de `preview` para contratos do app. Seletores como `scheduleTime` geram datas sintéticas e `postText` gera um texto de amostra; fotos de amostra são convertidas em `CAvatarData.imageUrl`. Ações simuladas devem ser conectadas aos fluxos já existentes no app.

O leitor mantém compatibilidade com fixtures planas antigas e nomes antigos (`guardian`, `patient`, `contentTitle`, `contentDescription`, `buttonLabel`, `buttonEnabled`, `scheduleStatus`, `scheduleRoom`, `scheduleUnit`). Novos links e exportações usam o formato separado. Não há mudança nos contratos do app original.


## Proposta: edição pelo avatar

A implementação candidata está em `flutter_preview/lib/avatar_updater_candidate.dart`, baseada em `CAvatarUpdater` de components_bloomy 6.39.0. Preserva `CAvatarUpdaterData`, `IAvatarUpdaterStyle`, o callback `onAvatarTap` e a seleção de perfis. O app usa esta classe local no lugar da classe exportada pela biblioteca; a biblioteca instalada não foi alterada.

Referências Figma: [com foto](https://www.figma.com/design/SJGEgCu6BDmmhUfWGQ3N13/App-dos-Pais?node-id=2339-4997) e [com iniciais](https://www.figma.com/design/SJGEgCu6BDmmhUfWGQ3N13/App-dos-Pais?node-id=2339-5002).

A foto inteira abre a edição. O indicador mantém o ícone original, agora com 16 px em um círculo de 32 px no canto superior direito. O avatar principal mede 124 px, incluindo o contorno de 2 px. Os perfis secundários medem 52 px, avançam 26 px por item e ficam alinhados pela base da foto principal, com um aro externo de 3 px na cor do fundo. São exibidos até três perfis secundários; listas maiores mantêm o indicador de quantidade. A navegação entre perfis continua cíclica. Em larguras estreitas, somente o grupo secundário reduz para não sobrepor o avatar principal.

O nome fica centralizado abaixo de toda a linha, separado por 8 px, em Nunito Sans Black 20 px; nomes extensos podem quebrar em linhas. As iniciais usam a regra real `Name(title).abbreviation`, em Nunito Sans Black, 48 px no principal e 20 px nos secundários. As fotos continuam recebidas pelos dados de cada perfil, sem embutir as imagens demonstrativas do Figma no componente.

Mapeamento de cores para `BloomyColors`: nome `text.main`; contorno principal e indicador `text.op20`; ícone `primary.main`; fundo sem foto `primary.light`; iniciais `primary.dark`; indicador `background.light`; aro de separação `background.main`. O fundo usa o token existente do app (ligeiramente diferente do valor literal do Figma).

Aceite: tocar em qualquer ponto da foto abre o seletor Galeria/Câmera; teclado e leitor de tela identificam a ação como editar foto da pessoa selecionada; o estado desabilitado impede a edição; trocar de perfil mantém o nome, a foto e o destinatário da edição correspondentes. Na integração, transportar a composição e os estilos locais para a biblioteca, preservando o callback real de edição do aplicativo. Nenhuma alteração foi feita no app original ou no pacote instalado.
