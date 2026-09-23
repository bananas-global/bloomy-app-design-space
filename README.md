# bloomy-app-design-space

Primeira versão local de um espaço para criar, experimentar, revisar e fazer handoff do app Bloomy dos responsáveis legais.

## Abrir

Requer Node 22+.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:5217. Para verificar: `npm run check`.

## Experimente em dois minutos

1. No Início, abra um atendimento. Feche e escolha **Ver tudo**.
2. Na Agenda, selecione Lia e busque **Sala 03**. Os dados são os mesmos do Início.
3. Limpe a busca e selecione **22 de setembro**. Abra a sessão finalizada para ler a devolutiva fictícia.
4. Ative **Inspecionar** e clique num cartão: o painel mostra a peça, arquivo e equivalente Flutter.
5. Ative **Botões arredondados** e visite a Biblioteca: a mesma mudança aparece nos usos do Button. É uma experiência temporária, não salva no código.
6. Deixe um comentário, resolva/reabra e exporte a revisão. Comentários ficam só neste navegador.

## Criar e editar

Peça ao agente: “Abra o fluxo Acompanhar atendimentos e torne o horário mais visível no ScheduleCard. Confira Início, Agenda e Biblioteca.”

- `src/screens/FamilyApp.tsx`: composição do fluxo.
- `src/components/ui.tsx`: peças comuns; não duplicar por tela.
- `src/data/fixtures.ts`: dados sintéticos compartilhados.
- `src/style.css`: aparência e tokens.
- `src/App.tsx`: ambiente, inspeção, biblioteca e revisão.

Não precisa escrever cenários, modelar backend nem preencher matrizes para criar uma tela. Acrescente somente dados e componentes que a proposta precisa. Anote decisões relevantes e lacunas em HANDOFF.md.

## Histórico, comparação e recuperação

```sh
git log --oneline
git diff baseline..HEAD
git switch -c experimento/nova-ideia
# Após conferir as alterações:
git add src HANDOFF.md
git commit -m "Melhora a leitura dos horários"
npm run handoff -- baseline
```

Para consultar uma versão anterior sem sobrescrever o trabalho: `git worktree add ../bloomy-app-design-space-revisao <commit>`.
Para desfazer um commit preservando o histórico: `git revert <commit>` (com árvore limpa e após revisar o escopo).
A aprovação é humana, com commit explícito; consulte HANDOFF.md. O script de entrega não aprova nem publica.

## Escolha e limites

O app real é Flutter, não React nem Phoenix. A biblioteca privada components_bloomy não estava acessível. Esta versão usa React/Vite para uma experiência web leve, com reuso real dentro do Design Space e mapeamento para Flutter. Há adaptação de engenharia entre os dois; não é uma exportação direta de produção.

O motor antigo não é dependência. Neste recorte, seu catálogo obrigatório e regras executáveis adicionariam trabalho sem ajudar a criação. Git, componentes comuns e uma nota de entrega bastam. O custo desta escolha é manter um pequeno ambiente próprio; não há ainda colaboração em tempo real, revisão visual de commits lado a lado nem aprovação integrada.

Nenhum remoto, publicação ou deploy foi criado. Para aparecer como projeto salvo no Codex, adicione esta pasta pela interface do app; a ferramenta desta sessão não registra projetos existentes.
