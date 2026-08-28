# Rota Nova — Plataforma de Mobilidade Urbana

<div align="center">

![Rota Nova Banner](https://img.shields.io/badge/Status-100%25%20Pronto-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OSM-199900?style=for-the-badge&logo=leaflet)
![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Ready-black?style=for-the-badge&logo=vercel)

**"Aceitou, Levou." — A plataforma de transporte sem restrição de CEP.**

</div>

---

## 📚 Documentações do Projeto

Para facilitar o uso, a entrega e o desenvolvimento, este repositório conta com três guias completos:

| Documento | Descrição |
| :--- | :--- |
| 📄 **[Sobre o Projeto](file:///c:/projetos/RotaNova/SOBRE_O_PROJETO.md)** | Visão geral do produto, regras de negócio, funcionalidades do passageiro, motorista e regulamento. |
| 💻 **[Guia do Desenvolvedor](file:///c:/projetos/RotaNova/GUIA_DESENVOLVEDOR.md)** | Instruções passo a passo de como baixar, instalar dependências (`npm install`), rodar localmente (`npm run dev`) e publicar na Vercel. |
| 🔌 **[Documentação da API](file:///c:/projetos/RotaNova/API_DOCUMENTATION.md)** | Especificações de endpoints REST, payloads JSON e arquitetura para conexão com o aplicativo mobile. |
| 🗄️ **[Schema do Banco de Dados (SQL)](file:///c:/projetos/RotaNova/database_schema.sql)** | Script DDL completo com todas as tabelas, índices e relacionamentos (PostgreSQL / MySQL / Supabase). |

---

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```

---

## 🌟 Destaques do Projeto

* 🗺️ **Mapa Interativo em Modo Escuro:** Integração com Leaflet + OpenStreetMap + OSRM sem marcas d'água de API.
* 🚦 **Simulador de Corridas em Tempo Real:** Animação de trânsito que acompanha ruas e rodovias reais em 15 segundos.
* 💳 **Painéis com Sincronização em Tempo Real:** Gastos de passageiros por categoria e extrato financeiro do motorista (Bruto, Taxa de 10%, Combustível e Lucro Líquido).
* 💾 **Persistência Dupla de Contas:** Perfis de passageiro e motorista salvos de forma independente no navegador.
* 🚀 **100% Pronto para Deploy:** Configurado com `vercel.json` para evitar erros de rota em SPA.
