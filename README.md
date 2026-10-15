# Portfólio — Marcus Querol

Versão React do portfólio fornecido, com composição inspirada no hero 3D do MotionSites, retrato com boina bordô, avatar que reage ao cursor/toque, movimento dentro das letras e os componentes DecryptedText e Folder enviados nos anexos. Inclui cinco projetos e a demonstração web do Subchefe.

## Abrir

- Abra `exports/portfolio-marcus.html` diretamente no navegador. Esse arquivo reúne aplicação, estilos, retrato e logos. As fontes do Google carregam pela internet, com fontes locais alternativas.
- Para desenvolver: `npm install` e `npm run dev`.
- Para gerar a versão de produção e o HTML único: `npm run export`.
- Para experimentar o Subchefe, abra o portfólio por HTTP (`npm run dev` ou hospedagem estática). O HTML aberto diretamente como arquivo mostra as demais animações e informa como acessar a demo. A pasta `exports/demos` acompanha o HTML exportado; o pacote completo para hospedagem contém o site e a demo.
- Publicação: o site fica em `https://rlampago22.github.io`. Para atualizar, rode `npm run deploy`: o script faz o build e envia a pasta `dist` para a branch `gh-pages`, que o GitHub Pages serve. Faça também o push da `main` para manter o código-fonte em dia. O repositório precisa se chamar `rlampago22.github.io`, porque a demo do Subchefe usa caminhos a partir da raiz do domínio.

## Conteúdo e edição

- `src/data.js`: cinco projetos, tecnologias, descrições, artigos e contatos.
- `src/App.jsx`: hero, fluxo demonstrativo de IA, apresentação, trajetória, terminal e contato.
- `src/styles.css`: identidade visual e responsividade.
- `src/components/`: componentes React Bits adaptados dos prompts fornecidos, com teclado e pausa controlada pelo site.
- `public/assets/`: retrato otimizado em WebP e ícones SVG.
- `src/components/InteractiveAvatar.*`: inclinação com suavização, reação ao clique/toque e pausa.
- `src/components/KineticTitle.*`: brilho e textura de código recortados dentro das letras.
- `src/components/Interests.*`: seção “Fora do código” (psicologia, pesca, esportes e música). Cada interesse pode ter um vídeo do avatar: coloque o MP4 (H.264, curto, sem áudio) e um quadro em JPG em `public/assets/hobbies/` e preencha `video`/`poster` no item em `src/data.js`. A música usa o player incorporado do Spotify com as playlists públicas de Marcus.
- `src/components/SubchefeDemo.*`: apresentação do aplicativo e demonstração em um iframe em formato de celular.
- `public/demos/subchefe/`: interface web real do app, preparada a partir de uma cópia isolada, com registros fictícios em memória.
- `scripts/build-subchefe-demo.mjs`: reconstrói a demo a partir de `C:/Users/Querol/Documents/App_regulação`. Execute `npm run demo:build` antes de `npm run export` quando o app original mudar.

O painel de IA e o terminal são demonstrações locais. O formulário prepara uma mensagem no WhatsApp; o visitante revisa e envia no próprio aplicativo. A cópia de e-mail só confirma sucesso após a Clipboard API responder.

O Subchefe usa a própria interface e as regras do aplicativo: check-in, pontuação, média móvel, diário, gráficos, comparativos, níveis e paletas. A demo começa com 21 dias fictícios e guarda alterações somente em memória; reiniciar restaura o exemplo. API keys e chamadas externas de IA ficam desativadas e a análise exibida é um exemplo fixo claramente identificado. Notificações, voz e tempo de tela automático dependem do aplicativo Android e não fazem parte da demonstração. O app original e seus dados não são modificados. O desenvolvimento assistido por Claude Code é declarado na apresentação do projeto.

O avatar atual é o retrato transparente transformado em camadas com perspectiva. Para expressões faciais naturais, piscar, falar ou mostrar outros ângulos, será necessário um modelo GLB/GLTF com rig e animações; isso pode substituir a imagem no mesmo espaço do hero.

As animações iniciam automaticamente em cada visita, conforme solicitado. O avatar faz uma saudação após o retrato carregar e mantém a flutuação; o nome tem animação contínua dentro das letras. O botão do topo pausa e retoma tudo durante a visita. A pausa antiga salva no navegador é descartada, e o botão do avatar também permite retomar. A preferência explícita de autoplay do site prevalece sobre a configuração de reduzir movimento do sistema.

Foram mantidos os contatos, repositórios, formação, vínculos e publicações do HTML fornecido. Não foram acrescentados links fictícios de redes sociais; as playlists vêm do perfil público de Marcus no Spotify. As métricas de economia de tokens sem metodologia no documento original não foram repetidas. A tradução parcial PT/EN foi substituída por uma apresentação consistente em português. O retrato é uma imagem com movimento e perspectiva, não um modelo 3D volumétrico.

## Próximos ajustes sugeridos

1. Adicionar os links reais de LinkedIn, Currículo Lattes e ORCID.
2. Gravar os vídeos do avatar para Esportes e Psicologia e adicioná-los em `src/data.js`.
3. Adicionar capturas reais, demonstrações e resultados verificáveis nas pastas de projetos; completar o DOI/link do capítulo Springer.

## Referências e créditos

- Referência de composição: [MotionSites — 3D Portfolio](https://motionsites.ai/?prompt=3d-jack-portfolio-hero). Composição própria; nenhum código premium foi copiado.
- Animações: [React Bits](https://reactbits.dev/) — código dos anexos fornecidos; licença preservada em `licenses/React-Bits.txt` (MIT + Commons Clause).
- Logos: [Lobe Icons](https://github.com/lobehub/lobe-icons) — licença preservada em `licenses/Lobe-Icons.txt` (MIT).
- Ícones de interface: Lucide. Fontes: Space Grotesk, Manrope e IBM Plex Mono, via Google Fonts.
- Retrato e conteúdo inicial: arquivos fornecidos pelo usuário. Os arquivos originais em Downloads permanecem intactos.

## Verificação

`qa/check.cjs` reúne verificações de comportamento com Playwright CLI: filtros, teclado, pastas, diálogo, menu móvel, terminal, mensagem de contato, pausa/autoplay e larguras de 320 a 1440 px. Execute com o servidor local ativo usando `playwright-cli -s=qa run-code --filename=qa/check.cjs`.

`qa/subchefe-check.cjs` verifica carregamento por solicitação, fontes, check-in, atualização dos gráficos, análise ilustrativa, ausência de chamadas aos provedores de IA, registros em memória e reinício. Avatar e letras também foram conferidos por cursor, clique, teclado e movimento reduzido em desktop e celular.

`qa/autoplay-check.cjs` cobre a regressão do botão desabilitado: visita com uma pausa antiga salva e sistema em reduzir movimento, início automático, saudação, flutuação, letras, pausa manual, retomada pelo avatar e nova visita animada.
