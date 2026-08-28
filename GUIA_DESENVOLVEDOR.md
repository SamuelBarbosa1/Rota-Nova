# Guia de Desenvolvimento & Instalação — Rota Nova

Este guia foi elaborado para a equipe de desenvolvimento que irá receber, instalar, modificar e integrar a plataforma **Rota Nova**.

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem & Framework:** JavaScript (ES6+), React 18
* **Build Tool:** Vite 5
* **Estilização:** Tailwind CSS (com utilitários modernos e Glassmorphism)
* **Mapas & Geocodificação:** Leaflet, OpenStreetMap, OSRM (Open Source Routing Machine), Nominatim
* **Ícones:** Lucide React
* **Roteamento:** React Router DOM (v6)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) versão 18.0.0 ou superior
* Gerenciador de pacotes `npm`, `yarn` ou `pnpm`
* [Git](https://git-scm.com/)

---

### 2. Clonar ou Baixar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd RotaNova
```

---

### 3. Instalar as Dependências
Execute o comando abaixo na raiz do projeto:
```bash
npm install
```

---

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O Vite iniciará o servidor local e exibirá a URL no terminal (normalmente `http://localhost:5173`). Abra o link em seu navegador.

---

### 5. Compilar para Produção (Build)
Para gerar os arquivos estáticos otimizados para produção:
```bash
npm run build
```
Os arquivos finais compilados serão gerados na pasta `/dist`.

Para testar a versão de produção localmente:
```bash
npm run preview
```

---

## 📁 Estrutura de Pastas do Projeto

```
RotaNova/
├── public/                 # Arquivos públicos e estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Navbar.jsx          # Barra de navegação com troca de perfil e login
│   │   ├── Footer.jsx          # Rodapé do site
│   │   ├── AuthModal.jsx       # Modal de autenticação (Cliente e Motorista)
│   │   ├── InteractiveMap.jsx  # Mapa dinâmico (Leaflet + OpenStreetMap + OSRM)
│   │   └── leaflet-styles.css  # Estilos customizados e filtro dark do mapa
│   ├── context/            # Contextos globais
│   │   └── AuthContext.jsx     # Gerenciamento de sessão, perfis e persistência
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.jsx            # Landing page com cotação rápida
│   │   ├── Cliente.jsx         # Painel do passageiro, mapa ao vivo e histórico
│   │   ├── Motorista.jsx       # Radar de chamadas, cockpit, finanças e entrevista
│   │   └── Regras.jsx          # Regulamento "Aceitou, Levou" e denúncias
│   ├── services/           # Camada de comunicação com APIs
│   │   └── api.js              # Métodos padronizados para integração mobile/backend
│   ├── App.jsx             # Roteamento principal com React Router
│   ├── index.css           # Configurações do Tailwind CSS e efeitos visuais
│   └── main.jsx            # Ponto de entrada da aplicação React
├── database_schema.sql     # Script SQL com schema relacional completo para o backend
├── API_DOCUMENTATION.md    # Especificação dos endpoints para integração mobile
├── SOBRE_O_PROJETO.md      # Apresentação do produto e funcionalidades
├── vercel.json             # Regras de rewrite SPA para deploy perfeito na Vercel
├── package.json            # Dependências e scripts do projeto
├── tailwind.config.js      # Configurações de tema e cores Tailwind
└── vite.config.js          # Configurações do Vite
```

---

## 🌐 Deploy no GitHub e na Vercel

O projeto está 100% preparado para ser publicado no **GitHub** e na **Vercel** sem nenhuma configuração adicional necessária:

### 1. Subindo para o GitHub
```bash
git add .
git commit -m "feat: entrega completa Rota Nova"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO_GITHUB>
git push -u origin main
```

### 2. Publicando na Vercel
1. Acesse o painel da [Vercel](https://vercel.com) e clique em **"Add New" > "Project"**.
2. Conecte sua conta do GitHub e importe o repositório **RotaNova**.
3. O Vercel detectará automaticamente o preset **Vite**:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Install Command:** `npm install`
4. Clique em **"Deploy"**.
5. Em menos de 1 minuto seu site estará online com HTTPS gratuito!

> 💡 **Nota sobre rotas (SPA):** O arquivo [`vercel.json`](file:///c:/projetos/RotaNova/vercel.json) já está incluído na raiz com as regras de reescrita (`rewrites`), garantindo que rotas diretas como `/cliente`, `/motorista` ou `/regras` nunca deem erro 404 ao recarregar a página.

---

## 📱 Integração com o Aplicativo Mobile

O time que desenvolver o app mobile pode consultar:
1. **[`database_schema.sql`](file:///c:/projetos/RotaNova/database_schema.sql)**: Modelo relacional para criar o banco de dados da aplicação.
2. **[`API_DOCUMENTATION.md`](file:///c:/projetos/RotaNova/API_DOCUMENTATION.md)**: Especificação de rotas e payloads JSON.
3. **[`src/services/api.js`](file:///c:/projetos/RotaNova/src/services/api.js)**: Cliente de API modular.
