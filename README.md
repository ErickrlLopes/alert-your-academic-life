# Campus Companion

AlertCampus — Documentação Inicial
1. Visão geral
O AlertCampus é um aplicativo voltado para organização da vida acadêmica do estudante.
O sistema tem como objetivo permitir que o usuário acompanhe suas atividades acadêmicas, visualize prazos e receba alertas relacionados às suas obrigações.
A primeira versão será propositalmente simples, priorizando o funcionamento do fluxo principal antes da implementação de funcionalidades mais avançadas.
---
2. Objetivo
O aplicativo deverá ajudar o estudante a responder rapidamente:
- O que tenho para fazer?
- Qual é a próxima atividade?
- Qual atividade está próxima do prazo?
- Tenho alguma atividade atrasada?
- Quais atividades já foram concluídas?
---
3. Telas iniciais
3.1 Tela de Login
Será a porta de entrada do aplicativo.
Elementos
- Campo de e-mail/usuário;
- Campo de senha;
- Botão Entrar;
- Opção Criar conta;
- Opção Esqueci minha senha.
Fluxo
ABRIR APP
   ↓
LOGIN
   ↓
Informações válidas?
   ↓
SIM
   ↓
TELA DE ENTRADA
Caso os dados sejam inválidos:
LOGIN
   ↓
Dados inválidos
   ↓
Mensagem de erro
   ↓
Usuário tenta novamente
---
4. Tela de Entrada
Após realizar o login, o usuário será direcionado para a tela principal do aplicativo.
Essa tela deverá funcionar como um painel acadêmico, apresentando as informações mais importantes de forma rápida.
Estrutura sugerida
┌──────────────────────────────┐
│ Olá, Erick!                  │
│                              │
│ Próximas atividades          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Banco de Dados           │ │
│ │ Trabalho de Modelagem    │ │
│ │ Entrega: amanhã          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Engenharia de Software   │ │
│ │ Projeto                  │ │
│ │ Entrega: 28/08           │ │
│ └──────────────────────────┘ │
│                              │
│ Pendentes: 5                 │
│ Para hoje: 1                 │
│ Atrasadas: 2                 │
│                              │
│        [ + ]                 │
└──────────────────────────────┘
O botão "+" poderá futuramente permitir o cadastro rápido de uma nova atividade.
---
5. Atividades acadêmicas
A entidade principal do sistema será a atividade acadêmica.
Cada atividade deverá possuir informações suficientes para que o aplicativo consiga organizar os compromissos do estudante.
Informações
Atividade
----------------
ID
Título
Descrição
Disciplina
Tipo
Prioridade
Data de entrega
Horário de entrega
Status
Data de criação
Tipos de atividade
- Trabalho;
- Prova;
- Seminário;
- Exercício;
- Projeto;
- Apresentação;
- Outro.
Prioridade
- Baixa;
- Média;
- Alta.
Status
- Pendente;
- Concluída;
- Atrasada.
---
6. Organização da tela de entrada
A tela principal deverá priorizar as atividades que exigem maior atenção.
A ordem recomendada é:
1. Atividades para hoje
São as atividades cujo prazo termina no dia atual.
2. Atividades próximas
Atividades com prazo nos próximos dias.
3. Atividades atrasadas
Atividades cujo prazo passou e ainda não foram concluídas.
4. Resumo
Mostrar informações gerais:
Pendentes: 5
Hoje: 1
Atrasadas: 2
Concluídas: 12
---
7. Notificações
O aplicativo deverá futuramente utilizar as informações das atividades para gerar lembretes.
Exemplo:
Atividade:
Trabalho de Banco de Dados
Entrega:
28/08/2026
O sistema poderá avisar:
"Seu trabalho de Banco de Dados vence amanhã."
Após o prazo:
"A atividade Trabalho de Banco de Dados está atrasada."
A lógica exata das notificações será definida posteriormente.
---
8. Fluxo inicial do usuário
O fluxo principal será:
┌──────────────┐
│    ABRIR     │
│  APLICATIVO  │
└──────┬───────┘
       ↓
┌──────────────┐
│    LOGIN     │
└──────┬───────┘
       ↓
┌──────────────┐
│    ENTRADA   │
│    / HOME    │
└──────┬───────┘
       ↓
┌─────────────────────┐
│ Visualizar atividades│
└─────────────────────┘
---
9. MVP
A primeira versão do AlertCampus deverá ser focada no essencial.
Obrigatório
- [ ] Tela de login;
- [ ] Autenticação do usuário;
- [ ] Tela de entrada;
- [ ] Exibição das próximas atividades;
- [ ] Exibição de atividades atrasadas;
- [ ] Exibição de resumo das atividades;
- [ ] Cadastro de atividades;
- [ ] Alteração do status da atividade;
- [ ] Exclusão de atividade.
Posteriormente
- [ ] Cadastro de disciplinas;
- [ ] Calendário;
- [ ] Notificações;
- [ ] Filtros;
- [ ] Estatísticas;
- [ ] Personalização;
- [ ] Recursos inteligentes.
---
10. Regra principal do sistema
O conceito central do AlertCampus será:
«O usuário cadastra suas obrigações acadêmicas e o sistema organiza essas informações para mostrar o que merece sua atenção primeiro.»
Portanto, a tela de entrada não deve ser apenas uma lista de tarefas. Ela deve funcionar como um resumo da situação acadêmica atual do usuário.
---
11. Primeira etapa de desenvolvimento
A primeira implementação pode ser dividida em quatro entregas:
Etapa 1 — Login
Criar a tela e validar a entrada do usuário.
Etapa 2 — Entrada
Criar a tela principal e sua estrutura visual.
Etapa 3 — Atividades
Implementar cadastro, visualização, alteração e exclusão.
Etapa 4 — Inteligência do sistema
Implementar posteriormente a identificação de prazos, atrasos e notificações.
O objetivo inicial é conseguir executar o fluxo completo:
Login → Entrada → Visualizar atividade → Alterar atividade → Concluir atividade.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3be4ddab-6727-4160-aa33-698d391a42f0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
