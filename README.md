# Escala Coqueiral 📅

O **Escala Coqueiral** é um aplicativo web interativo projetado para o Departamento de Comunicação da **Igreja Adventista do Sétimo Dia em Coqueiral**. O sistema simplifica a criação, edição e exportação de escalas de voluntários para os diversos ministérios e departamentos da igreja.

Desenvolvido inteiramente como uma aplicação client-side (sem necessidade de backend), ele permite aos administradores gerenciar equipes, definir disponibilidades e gerar escalas de maneira justa e equilibrada de forma 100% automatizada.

---

## 🚀 Principais Funcionalidades

- **Gestão de Equipes**:
  - Cadastro de voluntários.
  - Definição personalizada de disponibilidade por dia da semana (ex: o voluntário X só pode aos Sábados e Quartas).
  - Persistência dos dados de membros no navegador usando `localStorage`.

- **Configuração Flexível de Período**:
  - Seleção do mês de referência com preenchimento automático das datas de início e fim.
  - Escolha dos dias da semana em que há atividades do departamento.
  - Definição da quantidade de voluntários necessária para cada dia.

- **Sorteio Inteligente e Equilibrado**:
  - Algoritmo de distribuição que prioriza voluntários que trabalharam menos vezes no período, promovendo um revezamento justo.
  - Validação automática de disponibilidade semanal para cada dia sorteado.

- **Modo Especial para Louvor**:
  - Suporte diferenciado para escalas de Louvor, permitindo gerenciar simultaneamente a equipe de **Louvor Congregacional** e de **Música Especial**.

- **Edição em Tempo Real**:
  - Tabela interativa que permite aos administradores editar ou excluir diretamente qualquer linha da escala gerada antes da exportação.

- **Exportação para PDF**:
  - Geração de arquivos PDF prontos para impressão ou compartilhamento digital (WhatsApp, e-mail).
  - Ajuste de layout automático (conversão temporária para modo claro e remoção de botões de controle/ações no PDF final).

- **Interface Moderna e Responsiva**:
  - Layout elegante e adaptável para dispositivos móveis e desktops.
  - Suporte a **Modo Escuro (Dark Mode)** com persistência de preferência do usuário.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web puras (Vanilla Web Stack) para garantir leveza, velocidade e facilidade de hospedagem:

- **HTML5**: Estrutura semântica do aplicativo.
- **CSS3**: Estilização moderna com variáveis CSS customizadas, animações e responsividade.
- **JavaScript (ES6+)**: Lógica de manipulação do DOM, algoritmo de sorteio e persistência de dados.
- **Bibliotecas Externas (via CDN)**:
  - [html2canvas](https://html2canvas.hertzen.com/): Utilizado para capturar a tabela e o cabeçalho renderizados.
  - [jsPDF](https://github.com/parallax/jsPDF): Utilizado para compilar a imagem capturada em um documento PDF formatado.

---

## 📂 Estrutura do Projeto

```text
escala-coqueiral/
├── css/
│   └── style.css      # Estilos globais, variáveis de tema (claro/escuro) e responsividade
├── js/
│   └── script.js      # Lógica de sorteio, gerenciamento de estado e exportação de PDF
├── img/
│   └── logo.svg       # Logotipo oficial utilizado no cabeçalho
├── index.html         # Estrutura principal do aplicativo web
└── README.md          # Documentação do projeto (este arquivo)
```

---

## 💻 Como Executar o Projeto

Como o aplicativo é totalmente executado no lado do cliente, não há necessidade de instalar dependências ou rodar servidores locais:

1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/3ie1M/escala-coqueiral.git
   ```
2. Navegue até a pasta do projeto e abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, Safari):
   ```bash
   cd escala-coqueiral
   # E abra o index.html dando dois cliques nele ou pelo terminal:
   xdg-open index.html
   ```

---

## 🤝 Créditos

Desenvolvido para apoiar as atividades locais da **Igreja Adventista do Sétimo Dia - Coqueiral**. Inspirado em projetos de escala da comunidade (como o *escala-boa-vista*).
