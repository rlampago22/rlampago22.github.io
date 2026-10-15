export const email = 'marcusjr2204@gmail.com';
export const github = 'https://github.com/rlampago22';
export const projects = [
  {
    id: 'subchefe', title: 'Subchefe', short: 'Um pequeno passo, todos os dias.',
    category: 'Aplicações', color: '#75917c', label: 'ROTINA & HÁBITOS',
    description: 'Um check-in diário vira pontuação, progresso e comparativos de rotina.',
    detail: 'Aplicativo Android pessoal de acompanhamento de rotina e hábitos. Combina check-in diário, média móvel de sete dias, progressão por níveis, comparativos e análise opcional com Claude ou Groq. Os registros ficam no aparelho. Desenvolvido com apoio do Claude Code, sob minha direção de produto e com uso e testes reais. A demonstração web usa apenas registros fictícios e análise ilustrativa.',
    stack: ['React Native', 'TypeScript', 'Expo', 'Kotlin'], flow: ['Check-in', 'Progresso', 'Comparativos'],
    repository: null, demo: '#subchefe', featured: true,
  },
  {
    id: 'antigravity-handoff', title: 'Antigravity Handoff', short: 'Contexto que acompanha você.',
    category: 'Agentes de IA', color: '#a49acb', label: 'PONTE DE CONTEXTO',
    description: 'Leve o contexto do Antigravity para o Codex e continue de onde parou.',
    detail: 'Reúne objetivos, conversas recentes, estado do Git e artefatos em um documento Markdown para continuar o trabalho em outro agente sem reconstruir todo o contexto.',
    stack: ['Python', 'PowerShell', 'Shell'], flow: ['Antigravity', 'context.md', 'Codex'],
  },
  {
    id: 'antigravity-remote', title: 'Antigravity Remote', short: 'Seus agentes, a um toque.',
    category: 'Agentes de IA', color: '#749e8f', label: 'CONTROLE REMOTO',
    description: 'Acompanhe e controle agentes de desenvolvimento pelo Telegram.',
    detail: 'Uma interface remota para enviar instruções, acompanhar logs e receber notificações. Aproxima o trabalho dos agentes de uma conversa no Telegram.',
    stack: ['Python', 'Telegram API'], flow: ['Telegram', 'Comandos', 'Agente'],
  },
  {
    id: 'codex-handoff', title: 'Codex Handoff', short: 'Menos repetição. Mais contexto.',
    category: 'Agentes de IA', color: '#bc8c74', label: 'CONTINUIDADE ENTRE IAS',
    description: 'Transfira o essencial de uma sessão do Codex para Claude ou Gemini.',
    detail: 'Extrai o contexto relevante das sessões do Codex com Python e SQLite e organiza uma passagem de trabalho para outros assistentes, como Claude, Gemini e Cursor.',
    stack: ['Python', 'SQLite', 'JSON'], flow: ['Codex', 'Handoff', 'Claude / Gemini'],
  },
  {
    id: 'SISTEMA-SAN-RAFAEL', title: 'Sistema San Rafael', short: 'Gestão que simplifica a rotina.',
    category: 'Aplicações', color: '#819ab7', label: 'SOFTWARE APLICADO',
    description: 'Finanças condominiais organizadas em uma aplicação simples.',
    detail: 'Sistema para a rotina financeira de um condomínio: rateio, pagamentos, acompanhamento de inadimplência, fluxo de caixa e exportação de relatórios em PDF e CSV.',
    stack: ['Python', 'Streamlit'], flow: ['Lançamentos', 'Fluxo de caixa', 'Relatórios'],
  },
];

export const papers = [
  { label: 'SBSC · 2026', role: 'Primeiro autor', title: 'App SAE: Uma Tecnologia Social Voltada à Adesão Medicamentosa no Serviço de Atenção Especializada', url: 'https://sol.sbc.org.br/index.php/sbsc/article/view/42950', topic: 'Saúde Digital' },
  { label: 'ERBD · 2026', role: 'Coautor', title: 'Sistema de Recomendação em Tempo Real via Processamento de Fluxo sobre Bancos de Dados Distribuídos', url: 'https://sol.sbc.org.br/index.php/erbd/article/view/43874', topic: 'Dados & sistemas' },
  { label: 'SPRINGER', role: 'Coautor', title: 'Contributions of Software Engineering to Digital Health in Brazil for Older Adults', topic: 'Saúde Digital' },
];

export const spotifyProfile = 'https://open.spotify.com/user/31nehsiaqpbxu5wkyedxfudnewum';
export const playlists = [
  { id: '4JabFhTYjkve0tGDhpEuiJ', name: 'Vibez diferente' },
  { id: '2n4DgqprA3Bucr3rUGKslx', name: 'Gym' },
  { id: '3MiZHMMAEENx6Hkc4WOPXo', name: 'Latinas bebe' },
  { id: '2UXpAenvLTpxeYWxKhiEhQ', name: 'You had me at hello' },
];

// Cada interesse pode ganhar um vídeo do avatar: coloque o arquivo em
// public/assets/hobbies/ e preencha video/poster com o nome dele.
export const interests = [
  {
    id: 'psicologia', label: 'Psicologia', kicker: 'PAIXÃO',
    title: 'Entender as pessoas.',
    text: 'Sou apaixonado por psicologia: como pensamos, decidimos e criamos hábitos. Essa curiosidade aparece no que construo, do Subchefe à pesquisa em saúde.',
    tags: ['comportamento', 'hábitos', 'decisões'],
  },
  {
    id: 'pesca', label: 'Pesca', kicker: 'HOBBY',
    title: 'Linha na água, cabeça no lugar.',
    text: 'Pescar é o meu jeito de desacelerar. Paciência, silêncio e tempo para pensar.',
    video: 'hobbies/pesca.mp4', poster: 'hobbies/pesca-poster.jpg',
  },
  {
    id: 'esportes', label: 'Esportes', kicker: 'HOBBY',
    title: 'Bola no pé e time em campo.',
    text: 'Futebol e esporte fazem parte da rotina: disciplina, trabalho em equipe e um pouco de competição.',
    soon: 'Vídeo do avatar em campo chegando em breve.',
  },
  {
    id: 'musica', label: 'Música', kicker: 'TRILHA SONORA',
    title: 'O que toca enquanto eu construo.',
    text: 'Programando, estudando ou treinando, sempre tem uma playlist rolando. Estas são as minhas, direto do Spotify.',
    spotify: true,
  },
];
