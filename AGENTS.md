# Bloomy App Design Space

Ambiente local de criação para o app Flutter dos responsáveis. Leia README.md e HANDOFF.md.

- Telas e amostras usam os widgets reais de components_bloomy em flutter_preview/lib/main.dart.
- React é apenas a moldura, navegação do ambiente e revisão. Não recrie o app em CSS.
- Preserve dados sintéticos e ausência de chamadas ao backend clínico.
- Referências visuais: gravações 1.10.3+89; fonte consultada 1.11.3+94. Documente diferenças de versão.
- Dependências privadas usam GITEA_PUB_TOKEN no .env local, ignorado no Git. Nunca compile credenciais via dart-define/VITE_*.
- npm run build:native recompila Dart; npm run dev inicia tudo. npm run dev:host só atualiza a moldura.
- Antes de entregar execute npm run check e inspecione visualmente o fluxo alterado.
- Preserve acessibilidade, comentários locais exportáveis e mudanças do usuário.
- Git local autorizado. Não publique, faça push ou altere o app original sem autorização.
- A navegação do ambiente separa Telas e Componentes; Variações é o painel principal. Não recrie um catálogo obrigatório de fluxos/cenários.
- Cadastre fixtures em src/workbench.ts, associe apenas aos itens pertinentes e mantenha o contrato Flutter correspondente. A matriz de testes é gerada por scripts/generate-variation-cases.mjs.
