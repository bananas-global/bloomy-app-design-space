# Bloomy App Design Space

Ambiente local de criação para o app Flutter dos responsáveis. Leia README.md e HANDOFF.md.

- Telas e amostras usam os widgets reais de components_bloomy em flutter_preview/lib/main.dart.
- React é apenas a moldura, navegação do ambiente e revisão. Não recrie o app em CSS.
- Preserve dados sintéticos e ausência de chamadas ao backend clínico.
- Referências visuais: gravações 1.10.3+89; fonte consultada 1.11.3+94. Documente diferenças de versão.
- Dependências privadas usam GITEA_PUB_TOKEN no .env local, ignorado no Git. Nunca compile credenciais via dart-define/VITE_*.
- O gerenciador de pacotes é pnpm, de qualquer versão a partir da 9. Não use npm, npx, yarn ou bun para instalar dependências ou rodar scripts. Use pnpm install, pnpm add e pnpm dlx. Não crie nem commite package-lock.json ou yarn.lock. Não fixe a versão do pnpm com packageManager. A liberação de scripts de build fica em pnpm-workspace.yaml (onlyBuiltDependencies e allowBuilds). Se o npm for usado por engano, apague package-lock.json e node_modules e rode pnpm install.
- pnpm run build:native recompila Dart; pnpm run dev inicia tudo. pnpm run dev:host só atualiza a moldura.
- Antes de entregar execute pnpm run check e inspecione visualmente o fluxo alterado.
- Preserve acessibilidade, comentários locais exportáveis e mudanças do usuário.
- Git local autorizado. Não publique, faça push ou altere o app original sem autorização.
- A navegação do ambiente separa Telas e Componentes; Variações é o painel principal. Não recrie um catálogo obrigatório de fluxos/cenários.
- Cadastre fixtures em src/workbench.ts, associe apenas aos itens pertinentes e mantenha o contrato Flutter correspondente. A matriz de testes é gerada por scripts/generate-variation-cases.mjs.
