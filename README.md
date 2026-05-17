# REATIVA

Plataforma SaaS de reativação de clientes e CRM.

## Deploy no Netlify

### Opção 1: Deploy pelo Netlify CLI

1. Instale o Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Faça login:
```bash
netlify login
```

3. Inicie o deploy:
```bash
netlify deploy --prod
```

### Opção 2: Deploy pelo Netlify Dashboard

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Conecte seu repositório GitHub/GitLab/Bitbucket
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Clique em "Deploy site"

### Opção 3: Deploy manual

1. Faça o build:
```bash
npm run build
```

2. Arraste a pasta `dist` para o Netlify Drop em [app.netlify.com/drop](https://app.netlify.com/drop)

## Variáveis de Ambiente

Configure no Netlify (Settings > Environment variables):

```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_KEY=sua_chave_supabase
VITE_STRIPE_KEY=sua_chave_stripe
```

## Desenvolvimento Local

```bash
npm install
npm run dev
```

## Estrutura

```
src/
├── components/     # Componentes React
├── hooks/          # Custom hooks
├── lib/            # Serviços e utilitários
├── pages/          # Páginas da aplicação
└── index.css       # Estilos globais Tailwind
```
