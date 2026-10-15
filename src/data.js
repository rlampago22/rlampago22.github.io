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
export const instagram = 'https://www.instagram.com/marcusqueroll/';

// Cada interesse tem um vídeo do avatar em public/assets/hobbies/.
// Para trocar, substitua o MP4 (720p, curto, sem áudio) e o JPG do primeiro quadro.
export const interests = [
  {
    id: 'psicologia', label: 'Psicologia', kicker: 'PAIXÃO',
    title: 'Entender as pessoas.',
    text: 'Sou apaixonado por psicologia: como pensamos, decidimos e criamos hábitos. Essa curiosidade aparece no que construo, do Subchefe à pesquisa em saúde.',
    video: 'hobbies/psicologia.mp4', poster: 'hobbies/psicologia-poster.jpg',
  },
  {
    id: 'pesca', label: 'Pesca', kicker: 'HOBBY',
    title: 'Linha na água, cabeça no lugar.',
    text: 'Pescar é o meu jeito de desacelerar. Paciência, silêncio e tempo para pensar.',
    video: 'hobbies/pesca.mp4', poster: 'hobbies/pesca-poster.jpg', focus: '35% center',
  },
  {
    id: 'esportes', label: 'Esportes', kicker: 'HOBBY',
    title: 'Bola no pé e time em campo.',
    text: 'Futebol e esporte fazem parte da rotina: disciplina, trabalho em equipe e um pouco de competição.',
    video: 'hobbies/esportes.mp4', poster: 'hobbies/esportes-poster.jpg',
  },
  {
    id: 'musica', label: 'Música', kicker: 'TRILHA SONORA',
    title: 'O que toca enquanto eu programo.',
    text: 'Programando, estudando ou treinando, sempre tem uma playlist rolando. Esta é uma das minhas.',
    video: 'hobbies/musica.mp4', poster: 'hobbies/musica-poster.jpg',
    playlist: { id: '4JabFhTYjkve0tGDhpEuiJ', name: 'Vibez diferente' },
  },
];

export const orcid = 'https://orcid.org/0009-0005-9192-0121';
export const graduationProgress = 50;

export const aboutText = 'Sou o Marcus Querol, natural de Uruguaiana, tenho 20 anos e estou na metade da graduação em Engenharia de Software na UNIPAMPA. Me interesso por inteligência artificial e por psicologia, e busco unir as duas: tecnologia que ajuda a criar hábitos melhores e que nos deixa mais conscientes do uso que fazemos dela.';

export const aboutFacts = [
  { id: 'origem', label: 'Origem', value: 'Uruguaiana, RS · hoje em Alegrete' },
  { id: 'curso', label: 'Curso', value: 'Engenharia de Software · UNIPAMPA' },
  { id: 'interesses', label: 'Interesses', value: 'Inteligência artificial × psicologia: hábitos e uso consciente da tecnologia' },
  { id: 'bolsas', label: 'Bolsista', value: 'PET-Saúde e-Cidadania · Apoio à Gestão Acadêmica' },
];

export const journey = [
  {
    id: 'pet-saude', date: 'AGO 2025 — ATUAL', role: 'Bolsista',
    title: 'PET-Saúde e-Cidadania', org: 'PET-Saúde: Informação e Saúde Digital · Pampa Conectado',
    context: 'O PET-Saúde (Programa de Educação pelo Trabalho para a Saúde), do Ministério da Saúde com o MEC, aproxima universidade, serviços do SUS e comunidade. Na edição Informação e Saúde Digital, a UNIPAMPA coordena o projeto Pampa Conectado, com as secretarias de saúde de Alegrete, Bagé, Itaqui, Jaguari e Uruguaiana.',
    group: 'O e-Cidadania trabalha entre tecnologia e serviços de saúde: letramento digital em saúde, saúde da pessoa idosa, visitas técnicas a unidades de Alegrete e Uruguaiana, cursos para cuidadores e profissionais do SUS e recursos educacionais abertos.',
    work: 'Levo a engenharia de software para o grupo: levantamento de requisitos com as equipes, prototipação de apps como o App SAE e pesquisa publicada. Também participei do VER-SUS em Uruguaiana.',
    tags: ['Saúde digital', 'Requisitos', 'App SAE', 'VER-SUS'],
  },
  {
    id: 'gestao', date: 'ABR 2026 — ATUAL', role: 'Bolsista',
    title: 'Apoio à Gestão Acadêmica', org: 'UNIPAMPA · Pró-Reitoria de Graduação (PROGRAD)',
    context: 'Bolsa da PROGRAD que apoia coordenações acadêmicas e de curso para aprimorar processos, qualificar o ingresso de novos alunos e combater a evasão e a retenção.',
    work: 'Automatizo processos acadêmicos com Python, Playwright e agentes de IA, tirando tarefas repetitivas das mãos da equipe.',
    tags: ['Python', 'Playwright', 'Automação', 'Agentes de IA'],
  },
  {
    id: 'graduacao', date: '2025 — 2028 · PREVISÃO', role: 'Graduação',
    title: 'Engenharia de Software', org: 'Universidade Federal do Pampa · Campus Alegrete',
    context: 'Formação conectada à pesquisa e à construção de software aplicado, com publicações no SBSC e no ERBD 2026.',
    progress: graduationProgress,
    tags: ['Pesquisa', 'Saúde digital', 'Dados'],
  },
];
