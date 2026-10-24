# Bloomy App Design Space

Laboratório local para desenhar o app dos responsáveis com **Flutter e os widgets originais de components_bloomy 6.41.2**. O chrome de revisão e as URLs vêm do pacote [`@brucesantos/design-space`](https://www.npmjs.com/package/@brucesantos/design-space) 0.14; o Flutter roda dentro do quadro dele.

## Abrir

Requer Node, pnpm 9 ou mais recente, Flutter 3.44.9 e acesso de leitura ao registro privado.

O projeto usa somente pnpm. Não rode `npm install` nem `npm ci`. O npm cria um `package-lock.json` paralelo e ignora as liberações de build do `pnpm-workspace.yaml`.

```sh
pnpm install --frozen-lockfile
# Configure uma vez; o valor do token fica somente no .env local:
dart pub token add https://gitea.sidedoor.tech/api/packages/bloomy/pub --env-var GITEA_PUB_TOKEN
pnpm run dev
```

URL: http://127.0.0.1:5217/home?scenario=home.default&viewport=mobile

O script lê `GITEA_PUB_TOKEN` do `.env` apenas para baixar dependências; não o injeta no JavaScript/Dart. `.env` é ignorado no Git e no pacote de entrega. Copie `.env.example` e preencha localmente em outra máquina.

## Editar

- `flutter_preview/lib/main.dart`: composição das telas, estados locais e amostras da biblioteca.
- `flutter_preview/lib/app_icons.dart`: mapeamento de ícones do app original.
- `flutter_preview/pubspec.lock`: versões reproduzíveis das dependências privadas.
- `src/workbench.ts`: fixtures, variações, controles por componente e textos de Informações. Não tem imports, porque o gerador da matriz e os testes Node o carregam direto.
- `src/app/`: tradução desses dados para o design-space (`catalog.ts`, `product.tsx`, `components.tsx`) e a ponte com o Flutter (`flutter.tsx`).
- `pnpm run build:native`: recompilar depois de editar Dart; atualize a prévia no navegador.
- `pnpm run dev:host`: iniciar somente o design-space quando o Flutter já está compilado.
- `pnpm run check`: matriz de variações, testes Node e vitest (contrato do design-space), análise Dart, testes de widgets, compilação Flutter e TypeScript/Vite.
- `pnpm run handoff -- baseline`: gerar fontes e patch ligados ao commit exato; exige Git limpo.

O build mantém todas as fontes de ícones. Tree shaking removeu glifos usados por getters da biblioteca privada nos testes visuais; não reative sem conferir as telas.

## Recorte

Início, Agenda, Conteúdos, Evolutivo, Configurações, Login, Envio de link, menu e biblioteca. Feed, Notificações e redefinição de senha têm composição baseada no código original, mas não foram mostrados integralmente nas gravações. Textos legais completos e reprodução de vídeo continuam fora do recorte.

A prévia não acessa backend clínico. Nomes e avatares são sintéticos. Login, permissões e troca de foto demonstram estados locais. Veja `HANDOFF.md` e `docs/VALIDATION.md` para evidências, oito rodadas e diferenças conhecidas.

O redesign React anterior permanece no histórico Git; foi substituído pelo laboratório Flutter. O `main` é publicado na Vercel; o `vercel.json` instala o Flutter, compila com pnpm e manda os caminhos do design-space para o `index.html`, sem capturar `/flutter/`.

## Ferramentas do ambiente

O chrome é o do design-space: busca em Telas e Componentes (Cmd/Ctrl+K), tamanhos Celular 375 × 812, Tablet, Desktop e Ajustar, girar, zoom 25–150%, revisão limpa, abrir o quadro em nova janela, copiar link, tema claro/escuro, **Variações** e **Informações**. A descrição de cada PR é escrita pelo motor a partir das variações (`.github/workflows/pr.yml`). A URL guarda a tela (`/home`), a variação (`scenario=home.populated`) e cada controle alterado (`c.feedState=ready`).

O produto acrescenta só o que o pacote não sabe: no preset Celular, a barra de status do iOS e o indicador de início são desenhados sobre a área segura de 62/34 que o Flutter reserva. O toque é sempre simulado (cursor circular), como era o padrão.

Decisões da migração para o pacote, em 16/10/2026:
- Os tamanhos de tela são os do pacote. Os presets iPhone 402 × 874, iPhone Max e Android saíram; os testes de widgets continuam em 402 × 874.
- Componentes isolados oferecem exemplos prontos: as variações do widget mais um exemplo por opção de controle, os mesmos casos da matriz testada no Flutter.
- Saiu o “Editar dados” em JSON, com salvar, carregar e exportar. Dado novo entra como variação em `src/workbench.ts`.
- O pacote não desativa opções. Quando uma opção não tem efeito, o motivo aparece na dica do controle (ao passar o mouse).
- Saíram o interruptor Hover e a página “Sobre este ambiente”; as versões aparecem sob o nome do produto.
- Links antigos (`?view=canvas&screen=agenda&fixture=week`) abrem a variação correspondente (`/agenda?scenario=agenda.week`). Links com dados personalizados (`data=`) abrem a variação padrão.

## Telas, componentes e variações

A lateral esquerda tem **Telas** e **Componentes**. Cada tela é uma rota; suas variações são os cenários `<tela>.<fixture>` de `variationIds`, com o comportamento esperado de `scenarioExpected`. Não há fluxos: o catálogo são telas e componentes. Em **Componentes**, `catalogSections` define as seções na ordem exibida: **Componentes**, com os widgets de `components_bloomy 6.41.2`; **Composições**, com as seções montadas em `flutter_preview/lib/main.dart`; e **Fundamentos**, com os tokens do tema. Por enquanto Fundamentos traz **Cores**, lidos diretamente do `components_bloomy` no `flutter_preview`. Dimensões e fontes entram depois.

Em **Variações**, os controles por componente vêm de `componentGroupsFor`. Cada variação fixa os valores dos controles que a sua fixture implica; alterar um controle mantém a variação, mas tira o destaque dela. O seletor de estado de rede do pacote também vale: Carregando e Lento mostram o carregamento, Erro mostra o erro e Vazio esvazia as seções. **Informações** mostra descrição, comportamento esperado, valores dos controles e os componentes usados pela tela.

`pnpm run check` gera a matriz de fixtures e a exercita no Flutter. Home, Feed e Agenda incluem a variação “Feed e atendimentos preenchidos”, com registros fictícios e cards originais CCardFeed e CTileScheduleParent. A Home também oferece somente feed e somente atendimentos. As duas sessões são em 23/09/2026, às 14h e 15h; outros dias da Agenda ficam vazios. A mídia do feed é uma ilustração de marca local, sem fotografia clínica. Compartilhar, abrir mídia e detalhes exibem avisos locais. Evolutivo mantém a amostra vazia.

Os avatares com foto usam os três retratos fornecidos pelo usuário: `avatar_mother.jpg` (mãe), `avatar_lucas.jpg` (Lucas) e `avatar_ana_lima.jpg` (Ana Lima), em `flutter_preview/assets/images`. Paula Costa e Bia Luz mantêm as iniciais. O card original `CCardFeed` exige imagem ou vídeo; não foi criado um estado sem mídia. A opção de vídeo demonstra a capa e o botão original, sem reprodução remota. `postText` escolhe amostras para o campo original `description`, sem truncamento artificial. Os controles de post/atendimento afetam todas as instâncias da amostra. Alterar um controle preserva os outros, e a configuração vai na URL.

Alterações de controles são enviadas ao Flutter por `postMessage`, com validação de origem e janela, sem recarregar o iframe. O estado e a rolagem são preservados (limitados ao tamanho do conteúdo). Trocar de tela, de componente ou entre Celular e os outros tamanhos recarrega a prévia. A navegação feita dentro do app (barra inferior) leva o chrome para a tela correspondente; telas que só existem no Flutter (termos, senha, contratos) ficam no quadro atual.

### Uso dos componentes

`pnpm run check` gera `src/component-usage.generated.json` a partir dos widgets montados pelos testes das telas e suas fixtures. O design-space usa esse índice para “Componentes usados” de cada tela e “Usado em” de cada componente. Não edite o JSON manualmente. Novas telas e estados precisam fazer parte do catálogo de fixtures para serem incluídos; widgets de fluxos ainda não cobertos pelos testes não entram no índice. As seções compostas são identificadas pelas suas `ValueKey`s.

### Aceite de termos

Em **Telas → Aceite de termos**, abra cada documento, toque em ACEITAR e depois em ASSINAR DOCUMENTOS. O painel Variações permite iniciar sem aceites, com um aceite ou com todos. A assinatura pode ser desenhada e refeita, mas é descartada; não há envio nem aceite jurídico real. Fonte: app 1.11.3+94 (não mostrado nas gravações 1.10.3+89). Textos legais demonstrativos. O app não possui cadastro livre: exige cadastro prévio na clínica e envia link para definição de senha no primeiro acesso.

### Envio de link

Em **Telas → Envio de link** está a tela que envia o link para criar ou redefinir a senha. No Login, Esqueci minha senha (etapa de senha) também abre essa tela. As variações cobrem somente WhatsApp, somente e-mail, os dois contatos e o estado após o envio, e os controles combinam contatos e envio. Com os dois contatos, o link do rodapé alterna o canal. ENVIAR mostra o aviso verde do app e passa para o estado após o envio, sem enviar nada. Telefone e e-mail são sintéticos e mascarados pelas mesmas regras do app. Fonte: app 1.11.3+94, sem mudanças até a 1.13.0+98, não mostrada nas gravações 1.10.3+89.

A tela mostra a proposta de redesign (detalhes em `HANDOFF.md`). A reprodução fiel do app está no commit `8e84c0b`.

No app, o título Definir Senha usa `CHeader.title`, que lança erro em components_bloomy 6.39.0 a 6.41.2. Em build de release, o erro vira uma caixa cinza que cobre o conteúdo abaixo do ícone. A prévia mostra o layout pretendido (detalhes em `HANDOFF.md`).
