# Verificação da atualização — 14/10/2026

- Build Vite passou.
- Snapshot isolado do Subchefe passou na checagem TypeScript sem erros.
- 24 verificações do portfólio passaram: filtros para cinco projetos, navegação, pastas, diálogos, terminal, formulário, preferência de movimento e larguras de 320 a 1440 px.
- 11 verificações da demo passaram: carregamento sob demanda, fontes e ícones, pontuação, salvar check-in, gráficos/comparativos, análise ilustrativa, ausência de chamadas Anthropic/Groq, armazenamento em memória, reinício e navegação sem erros JavaScript.
- Na revisão visual, avatar respondeu ao cursor/clique, nome respondeu ao teclado e os dois obedeceram à pausa/movimento reduzido. Textura SVG foi decodificada e validada.
- Ajuste de layout conferido: em tela de 390 px, texto e área da demonstração ficam entre x=20 e x=370; celular entre x=25 e x=365.
- O repositório original do app apresentou `git status --short` vazio após a geração da demo.

Os testes de interface foram executados em navegador com dimensões de desktop e celular. Notificações e tempo de tela nativos do Android não fazem parte desta demo web. A análise de IA é um exemplo local, identificado na interface.

## Correção do autoplay

O controle anterior combinava pausa salva e configuração do sistema, impedindo que o botão reativasse o movimento. Avatar, letras, pastas e descriptografia agora seguem o controle único do site. Cada nova visita começa ativa e a saudação do avatar inicia após a imagem carregar.

As 11 verificações de `qa/autoplay-check.cjs` passaram, incluindo início sem clique com `prefers-reduced-motion: reduce`, pausa antiga salva, botão habilitado, pausa/retomada e desktop/celular sem erros JavaScript.
