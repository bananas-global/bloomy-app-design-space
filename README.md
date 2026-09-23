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

## Ferramentas do ambiente

- Busca por telas ou componentes na aba ativa, incluindo nomes e usos; aceita termos sem acento. Cmd/Ctrl+K foca a busca.
- Biblioteca com oito amostras isoladas dos widgets reais e origem no pacote.
- Viewports celular, tablet e desktop; girar, zoom 25–150% e moldura opcional. Os controles ficam em uma única barra, sem campos de largura/altura. O zoom altera só a visualização; largura/altura chegam ao Flutter.
- Fixtures de referência, sem conteúdos, textos longos e botão desabilitado. Editor JSON validado, salvamento local, restauração e exportação. Os campos e seus usos aparecem no painel.
- URL preserva tela/componente, fixture, dados personalizados, dimensões, zoom e moldura. Copiar link e exportar revisão preservam esse contexto. Dados personalizados ficam no endereço: use somente dados sintéticos.

Essas ferramentas reproduzem as funções úteis do `bloomy-design-space` na moldura Flutter; não importam o motor de cenários de backoffice nem alteram aquele projeto.

## Telas, componentes e variações

A lateral esquerda tem duas abas, **Telas** e **Componentes**, com busca no catálogo ativo. Fluxos ainda não têm catálogo próprio. Revisão/handoff fica no topo.

O painel direito abre em **Variações** e filtra as fixtures pelo item selecionado. **Informações** e **Comentários** são secundários. O JSON fica recolhido em **Editar dados**; salvar/carregar é separado por tela/componente. Links personalizados anteriores continuam aceitos com valores padrão para os campos novos.

O catálogo está em `variationIds` e `fixtures` de `src/workbench.ts`. Existem 49 combinações para 8 telas e 8 componentes: referência, texto longo, vazio, carregamento/erro, mês/semana, CPF/senha, permissões, busca preenchida/erro, seleção de navegação, vídeo/documento e botão desabilitado, somente onde se aplicam. São estados sintéticos locais; carregamento e erro permanecem até trocar a variação.

`npm run check` gera a matriz de fixtures e a exercita no Flutter. Não há novos atendimentos ou dados clínicos inventados; Agenda e Evolutivo mantêm suas amostras vazias. Modelar listas preenchidas é uma ampliação distinta.
