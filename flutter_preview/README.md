# Prévia Flutter Bloomy

Este laboratório importa components_bloomy diretamente. Consulte o README na raiz.
`lib/main.dart` compõe telas com dados sintéticos. `lib/preview_bridge*` recebe as fixtures do ambiente pai (`bloomy-fixture`) e avisa quando está pronto (`bloomy-ready`) e quando a navegação interna troca de tela (`bloomy-screen`). O ambiente pai é `src/app/flutter.tsx`, dentro do quadro do design-space. Não há tokens de API no código Flutter.

Após editar, execute `pnpm run build:native` na raiz e atualize a prévia. Para desenvolvimento Flutter isolado, exporte GITEA_PUB_TOKEN do .env da raiz e use as ferramentas Flutter habituais. Os testes de widgets rodam em 402 × 874; a revisão no navegador usa os tamanhos do design-space.
