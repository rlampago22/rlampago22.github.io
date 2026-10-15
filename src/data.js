export const email = 'marcusquerol.aluno@unipampa.edu.br';
export const github = 'https://github.com/rlampago22';
export const projects = [
  {
    id: 'subchefe', title: 'Subchefe', short: 'Um pequeno passo, todos os dias.',
    category: 'Aplicações', color: '#75917c', label: 'ROTINA & HÁBITOS',
    description: 'Um check-in diário vira pontuação, progresso e comparativos de rotina.',
    detail: 'Aplicativo Android pessoal de acompanhamento de rotina e hábitos. Combina check-in diário, média móvel de sete dias, progressão por níveis, comparativos e análise opcional com Claude ou Groq. Os registros ficam no aparelho, a lógica fica em funções puras cobertas por mais de 260 testes automatizados (node:test) e a entrega é feita por EAS Build (APK) e EAS Update (OTA). Desenvolvido com apoio do Claude Code, sob minha direção de produto e com uso e testes reais. A demonstração web usa apenas registros fictícios e análise ilustrativa.',
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
    description: 'Deixo o computador ligado e mando instruções para os agentes de qualquer lugar pelo Telegram. Até de Nárnia, se o PC estiver ligado.',
    detail: 'Um bot em Python para o Telegram: com o computador ligado, mando instruções em tempo real para os agentes do Google Antigravity de onde eu estiver, acompanho os logs ao vivo e recebo alertas de voz quando algo termina ou precisa de mim.',
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
    detail: 'Sistema para a rotina financeira de um condomínio, entregue para um cliente real (Edifício San Rafael, nov.–dez. 2025): rateio, pagamentos, acompanhamento de inadimplência, fluxo de caixa, dashboard com filtros e exportação de relatórios em PDF e CSV. Os requisitos foram levantados junto ao cliente.',
    stack: ['Python', 'Streamlit'], flow: ['Lançamentos', 'Fluxo de caixa', 'Relatórios'],
  },
  {
    id: 'rpc-peixes', title: 'RPC Peixes', short: 'Do dado à curva.',
    category: 'Aplicações', color: '#5f8aa3', label: 'SOFTWARE CIENTÍFICO',
    description: 'Análise da relação peso–comprimento de peixes, das medidas de campo à curva ajustada, em um único fluxo que roda no computador do pesquisador. O gráfico ao lado é a análise real do grumatã da Barragem Sanchurí, publicada nos anais do 18º SIEPE.',
    detail: 'Aplicação local para a biologia pesqueira organizar, validar e analisar dados biométricos. Recebe comprimento total e padrão, sexo e peso por digitação, colagem ou planilhas (XLSX, XLS e CSV), aponta registros inconsistentes e compara os modelos linear, potencial (W = a·L^b) e exponencial com R, R² e intervalos de confiança. Um clique no ponto do gráfico localiza o exemplar para corrigir ou excluir. Os projetos ficam em SQLite no próprio computador e os resultados saem em Excel, CSV, PNG, SVG ou PDF. Desenvolvido com programação assistida por IA (Codex), com requisitos, método e interpretação sob decisão humana, e orientação do Prof. Marcus Vinicius Morini Querol (NUPILABRU/UNIPAMPA). O RPC Peixes já analisou os dados do grumatã (Prochilodus lineatus) da Barragem Sanchurí, trabalho publicado nos anais do 18º SIEPE.',
    stack: ['Python', 'Streamlit', 'SQLite', 'SciPy'], flow: ['Biometria', 'Validação', 'Curva ajustada'],
    highlights: ['3 modelos de regressão', '25 testes automatizados', 'Local e offline'],
    image: 'projects/rpc-peixes-grafico.webp', imageAlt: 'Gráfico do RPC Peixes: relação peso–comprimento de 10 grumatãs da Barragem Sanchurí, com curva potencial ajustada e intervalo de confiança de 95%',
    repository: null, wide: true,
  },
];

export const papers = [
  { label: 'SBSC · 2026', role: 'Primeiro autor', title: 'App SAE: Uma Tecnologia Social Voltada à Adesão Medicamentosa no Serviço de Atenção Especializada', url: 'https://sol.sbc.org.br/index.php/sbsc/article/view/42950', topic: 'Saúde Digital · artigo completo' },
  { label: 'ERBD · 2026', role: 'Coautor', title: 'Sistema de Recomendação em Tempo Real via Processamento de Fluxo sobre Bancos de Dados Distribuídos', url: 'https://sol.sbc.org.br/index.php/erbd/article/view/43874', topic: 'Dados & sistemas · artigo completo' },
  { label: 'SPRINGER · 2026', role: 'Coautor', title: 'Contributions of Software Engineering to Digital Health in Brazil for Older Adults', url: 'https://doi.org/10.1007/978-3-032-23747-7', topic: 'Saúde Digital · capítulo em Gerontechnology VII (IWoG 2025, Évora)' },
  { label: 'SIEPE · 2026', role: 'Primeiro autor', title: 'Desenvolvimento de Software para Análise da Relação Peso-Comprimento em Peixes', topic: 'Software científico · resumo (RPC Peixes)' },
  { label: 'SIEPE · 2026', role: 'Coautor', title: 'Relação Peso-Comprimento de Prochilodus lineatus na Barragem Sanchurí, Bioma Pampa', url: 'https://periodicos.unipampa.edu.br/index.php/SIEPE/article/view/123331', topic: 'Ictiologia · Anais do 18º SIEPE (Pesquisa), com análise no RPC Peixes' },
  { label: 'SIEPE · 2026', role: 'Primeiro autor', title: 'Dimensão Cultural no Cuidado em Saúde: Relato de Experiência no VER-SUS', url: 'https://periodicos.unipampa.edu.br/index.php/SIEPE/article/view/123838', topic: 'Saúde coletiva · Anais do 18º SIEPE (Cultura)' },
  { label: 'PET-SAÚDE DIGITAL · 2026', role: 'Primeiro autor', title: 'Território, Cuidado e Tecnologia: Relato de Experiência no VER-SUS', url: 'https://repositorio.unipampa.edu.br/server/api/core/bitstreams/f0478db0-bb3d-4a5a-97a0-6845b65188e6/content', topic: 'II Mostra PET-Saúde Digital Pampa Conectado' },
  { label: 'PET-SAÚDE DIGITAL · 2026', role: 'Coautor', title: 'Engenharia de Software Integrada à Saúde Digital no SUS: Relato de Experiência no PET-Saúde e-Cidadania', url: 'https://repositorio.unipampa.edu.br/server/api/core/bitstreams/f0478db0-bb3d-4a5a-97a0-6845b65188e6/content', topic: 'II Mostra PET-Saúde Digital Pampa Conectado' },
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
export const lattes = 'https://lattes.cnpq.br/5322341445729243';
export const graduationProgress = 50;

export const aboutText = 'Sou o Marcus Querol, natural de Uruguaiana, tenho 20 anos e estou na metade da graduação em Engenharia de Software na UNIPAMPA, Campus Alegrete. Já tenho experiência com desenvolvimento de sistemas, automação de processos e engenharia de requisitos, em projetos acadêmicos, de extensão e com cliente real. Me interesso por inteligência artificial e por psicologia e quero unir as duas em tecnologia que ajude a criar hábitos melhores e a usar a própria tecnologia com mais consciência. É nessas áreas que busco minha próxima oportunidade.';

export const aboutFacts = [
  { id: 'origem', label: 'Origem', value: 'Uruguaiana, RS · hoje em Alegrete' },
  { id: 'curso', label: 'Curso', value: 'Engenharia de Software · UNIPAMPA, Campus Alegrete (noturno)' },
  { id: 'interesses', label: 'Interesses', value: 'Inteligência artificial × psicologia: hábitos e uso consciente da tecnologia' },
  { id: 'bolsas', label: 'Bolsista', value: 'PET-Saúde e-Cidadania · Apoio à Gestão Acadêmica' },
];

export const journey = [
  {
    id: 'pet-saude', date: 'AGO 2025 — ATUAL', role: 'Monitor bolsista',
    title: 'PET-Saúde e-Cidadania', org: 'PET-Saúde: Informação e Saúde Digital · Pampa Conectado',
    context: 'O PET-Saúde (Programa de Educação pelo Trabalho para a Saúde), do Ministério da Saúde com o MEC, aproxima universidade, serviços do SUS e comunidade. Na edição Informação e Saúde Digital, a UNIPAMPA coordena o projeto Pampa Conectado, com as secretarias de saúde de Alegrete, Bagé, Itaqui, Jaguari e Uruguaiana.',
    group: 'O e-Cidadania trabalha entre tecnologia e serviços de saúde: letramento digital em saúde, saúde da pessoa idosa, visitas técnicas a unidades de Alegrete e Uruguaiana, cursos para cuidadores e profissionais do SUS e recursos educacionais abertos.',
    work: 'Levo a engenharia de software para o grupo: visitas de campo, levantamento de necessidades, Documento de Requisitos de Software (SRS) e prototipação mobile com IA generativa do App SAE, que virou artigo no SBSC 2026. Também participei do VER-SUS em Uruguaiana.',
    tags: ['Saúde digital', 'Requisitos', 'App SAE', 'VER-SUS'],
  },
  {
    id: 'gestao', date: 'ABR 2026 — ATUAL', role: 'Bolsista',
    title: 'Apoio à Gestão Acadêmica', org: 'Coordenação de Engenharia de Software · UNIPAMPA/PROGRAD',
    context: 'Bolsa da PROGRAD que apoia coordenações acadêmicas e de curso para aprimorar processos, qualificar o ingresso de novos alunos e combater a evasão e a retenção.',
    work: 'Na coordenação de Engenharia de Software, criei uma automação em Python e Playwright que acessa o sistema GURI, baixa os planos de ensino e os organiza no Google Drive. Também pratico Git, testes, requisitos e agentes autônomos com Agno.',
    tags: ['Python', 'Playwright', 'Google Drive API', 'Agno'],
  },
  {
    id: 'graduacao', date: '2025 — 2028 · PREVISÃO', role: 'Graduação',
    title: 'Engenharia de Software', org: 'Universidade Federal do Pampa · Campus Alegrete',
    course: 'Bacharelado que forma para todo o ciclo de vida do software: requisitos, arquitetura, construção, testes, qualidade e gestão de projetos. Estou na metade do curso e levo para a sala o que aprendo na pesquisa e nas bolsas, e vice-versa.',
    progress: graduationProgress,
    extra: 'Residência em TIC 16 (BRISA, SOFTEX, MCTI e UNIPAMPA, 180 h, 2025), VER-SUS (84 h, 2026), IA e Ferramentas e Git no VS Code (UNIPAMPA, 2026) e Python 3 (Curso em Vídeo).',
    tags: ['Requisitos', 'Arquitetura', 'Testes', 'Gestão de projetos'],
  },
];

export const toolGroups = [
  { id: 'ia', title: 'IA no fluxo de trabalho', note: 'Engenharia assistida por IA, skills e contexto que passa de uma ferramenta para a outra.', items: [{ name: 'Claude Code & API Anthropic', logo: 'claude' }, { name: 'OpenAI Codex & ChatGPT', logo: 'openai' }, { name: 'Gemini', logo: 'gemini' }, { name: 'Google Antigravity' }, { name: 'Agno (agentes)' }, { name: 'Groq' }, { name: 'NotebookLM' }, { name: 'Ollama' }, { name: 'Rork' }, { name: 'Vídeos com IA' }] },
  { id: 'automacao', title: 'Automação', items: [{ name: 'Python' }, { name: 'Playwright' }, { name: 'APIs REST (Google Drive, Telegram, LLMs)' }, { name: 'PowerShell & Shell' }, { name: 'Excel avançado' }] },
  { id: 'linguagens', title: 'Linguagens', items: [{ name: 'Python' }, { name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'Kotlin' }, { name: 'Java' }, { name: 'SQL' }, { name: 'HTML & CSS' }] },
  { id: 'apps', title: 'Apps & web', items: [{ name: 'React' }, { name: 'React Native' }, { name: 'Expo & EAS' }, { name: 'Vite' }, { name: 'Streamlit' }, { name: 'Bootstrap' }, { name: 'GSAP & Motion' }] },
  { id: 'qualidade', title: 'Dados, testes & entrega', items: [{ name: 'SQLite' }, { name: 'PostgreSQL' }, { name: 'SQL Server' }, { name: 'pytest' }, { name: 'node:test' }, { name: 'Git, GitHub & GitLab' }, { name: 'GitHub Pages' }] },
  { id: 'ambiente', title: 'Ambiente', items: [{ name: 'VS Code' }, { name: 'IntelliJ IDEA' }, { name: 'Warp' }] },
];

export const languages = [
  { name: 'Português', level: 'Nativo', value: 5 },
  { name: 'Inglês', level: 'Intermediário', value: 3 },
  { name: 'Espanhol', level: 'Básico', value: 1 },
];

// Demonstrações de landing pages feitas com IA. Os prints ficam em public/assets/landings/.
export const landings = [
  { id: 'jazean', name: 'JAZEAN', kind: 'Café especial · loja', domain: 'jazean · estudo', description: 'Landing e loja de café de origem única: xícara 3D que gira ao arrastar, parallax, seções de terroir, torra e preparo, carrinho e versão em português.', stack: ['React', 'TypeScript', 'Tailwind', 'Three.js'] },
  { id: 'clinica', name: 'Instituto Alegrete', kind: 'Clínica · Alegrete', domain: 'instituto-alegrete · estudo', description: 'Versão sóbria e editorial para uma clínica, com especialidades, inovação, assistente virtual e agendamento.', stack: ['HTML', 'Tailwind', 'JavaScript'] },
];
