# Bloomy App Design Space

Laboratório local para desenhar o app dos responsáveis com **Flutter e os widgets originais de components_bloomy 6.39.0**. React/Vite fornece apenas a moldura e a revisão.

## Abrir

Requer Node, Flutter 3.44.9 e acesso de leitura ao registro privado.

```sh
npm ci
# Configure uma vez; o valor do token fica somente no .env local:
dart pub token add https://gitea.sidedoor.tech/api/packages/bloomy/pub --env-var GITEA_PUB_TOKEN
npm run dev
```

URL: http://127.0.0.1:5217/?view=canvas&screen=home

O script lê `GITEA_PUB_TOKEN` do `.env` apenas para baixar dependências; não o injeta no JavaScript/Dart. `.env` é ignorado no Git e no pacote de entrega. Copie `.env.example` e preencha localmente em outra máquina.

## Editar

- `flutter_preview/lib/main.dart`: composição das telas, estados locais e amostras da biblioteca.
- `flutter_preview/lib/app_icons.dart`: mapeamento de ícones do app original.
- `flutter_preview/pubspec.lock`: versões reproduzíveis das dependências privadas.
- `src/App.tsx` e `src/native-space.css`: ambiente, comentários e exportação.
- `npm run build:native`: recompilar depois de editar Dart; atualize a prévia no navegador.
- `npm run dev:host`: iniciar somente a moldura quando Flutter já está compilado.
- `npm run check`: análise Dart, testes de widgets, compilação Flutter e TypeScript/Vite.
- `npm run handoff -- baseline`: gerar fontes e patch ligados ao commit exato; exige Git limpo.

O build mantém todas as fontes de ícones. Tree shaking removeu glifos usados por getters da biblioteca privada nos testes visuais; não reative sem conferir as telas.

## Recorte

Início, Agenda, Conteúdos, Evolutivo, Configurações, Login, menu e biblioteca. Feed, Notificações e redefinição de senha têm composição baseada no código original, mas não foram mostrados integralmente nas gravações. Textos legais completos e reprodução de vídeo continuam fora do recorte.

A prévia não acessa backend clínico. Nomes e avatares são sintéticos. Login, permissões e troca de foto demonstram estados locais. Veja `HANDOFF.md` e `docs/VALIDATION.md` para evidências, oito rodadas e diferenças conhecidas.

O redesign React anterior permanece no histórico Git; foi substituído pelo laboratório Flutter. Nenhum push ou deploy foi feito.
