# Bloomy App Design Space

Ambiente local de criação para o app Flutter dos responsáveis. Leia README.md e HANDOFF.md.

- Telas e amostras usam os widgets reais de components_bloomy em flutter_preview/lib/main.dart.
- O chrome de revisão e as URLs vêm do pacote @brucesantos/design-space (src/main.tsx). Não recrie ferramentas do chrome no produto nem o app em CSS. Para atualizar o motor, suba a versão do pacote.
- src/app/ traduz src/workbench.ts para o contrato do design-space e faz a ponte com o Flutter. A validação do pacote (tests/product.test.ts) precisa ficar sem erros e sem avisos.
- Preserve dados sintéticos e ausência de chamadas ao backend clínico.
- Referências visuais: gravações 1.10.3+89; fonte consultada 1.11.3+94. Documente diferenças de versão.
- Dependências privadas usam GITEA_PUB_TOKEN no .env local, ignorado no Git. Nunca compile credenciais via dart-define/VITE_*.
- O gerenciador de pacotes é pnpm, de qualquer versão a partir da 9. Não use npm, npx, yarn ou bun para instalar dependências ou rodar scripts. Use pnpm install, pnpm add e pnpm dlx. Não crie nem commite package-lock.json ou yarn.lock. Não fixe a versão do pnpm com packageManager. A liberação de scripts de build fica em pnpm-workspace.yaml (onlyBuiltDependencies e allowBuilds). Se o npm for usado por engano, apague package-lock.json e node_modules e rode pnpm install.
- pnpm run build:native recompila Dart; pnpm run dev inicia tudo. pnpm run dev:host só inicia o design-space, com o Flutter já compilado.
- Antes de entregar execute pnpm run check e inspecione visualmente o fluxo alterado.
- Preserve acessibilidade e mudanças do usuário.
- Git local autorizado. Não publique, faça push ou altere o app original sem autorização.
- Cada tela é uma rota, e suas variações são os cenários <tela>.<fixture>. Não crie fluxos (route.group) nem cenários que não sejam variações de uma tela.
- Cadastre fixtures em src/workbench.ts, associe apenas aos itens pertinentes (variationIds), escreva o comportamento esperado de cada variação de tela (scenarioExpected) e mantenha o contrato Flutter correspondente. src/workbench.ts não pode ter imports. A matriz de testes é gerada por scripts/generate-variation-cases.mjs.
- O comportamento esperado é o critério de aceite que os devs e os agentes de validação leem no PR: uma linha por comportamento que dá para conferir na tela, descrevendo o comportamento e não o dado da fixture ("o feed mostra o post com imagem", não "1 post de Lucas Santos").
- A descrição do PR é escrita pelo motor (design-space-pr, em .github/workflows/pr.yml) a cada push, a partir das variações; ver a decisão 0018 do motor. Nada nela se preenche à mão, e o bloco gerado não se edita: para mudar um critério, mude scenarioExpected e faça push.
