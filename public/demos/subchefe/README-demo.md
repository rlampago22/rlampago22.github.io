# Subchefe no portfólio

Snapshot isolado do aplicativo Android existente. Apenas src, assets, package.json e tsconfig são copiados; docs pessoais, .git, .env, backups e o módulo de chaves original ficam fora. Não modifica o aplicativo original.

21 dias fictícios são gerados em memória. Check-in, diário, pontuação, gráficos, comparativos, níveis e paletas usam as telas e regras do app. Recarregar recomeça a demonstração. Não lê nem grava AsyncStorage ou outros dados reais.

A tela de análise apresenta um texto ilustrativo local claramente identificado. API keys, chamadas de IA, voz, abertura, notificações, medição nativa de uso e atualizações Android estão desativadas/indisponíveis. Nenhuma chave é necessária.

Exportação Expo SDK 57: web.output single + experiments.baseUrl /demos/subchefe. Hospede os arquivos em /demos/subchefe/. O app é uma SPA; navegue internamente, ou configure fallback para index.html no host. O portfólio envia rotas via postMessage com origem e parent conferidos.

Recriar a demo: node scripts/build-subchefe-demo.mjs [caminho-do-app-original]. Os node_modules originais são usados por uma junction temporária somente neste snapshot. Resultado: public/demos/subchefe; Vite copia ao dist. O HTML standalone precisa ser servido por HTTP para executar esta demo.
