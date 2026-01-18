/* ============================================================
 1. CONFIGURAÇÕES INICIAIS E VARIÁVEIS GLOBAIS
 ============================================================ */
const diasSemanaNome = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
let membrosGeral = JSON.parse(localStorage.getItem("membros_geral")) || [];
let membrosEspecial =
  JSON.parse(localStorage.getItem("membros_especial")) || [];

// Função executada ao abrir a página
window.onload = () => {
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark-mode");
  const hoje = new Date();
  document.getElementById("selecaoMes").value = hoje
    .toISOString()
    .substring(0, 7);
  preencherDatasPeloMes();
  renderizarMembros("geral");
  renderizarMembros("especial");

  // Criação dinâmica dos cards de Segunda a Domingo
  const containerDias = document.getElementById("diasSelecao");
  diasSemanaNome.forEach((dia, index) => {
    const isDefault = [0, 3, 6].includes(index); // Padrão: Dom, Qua, Sáb marcados
    containerDias.innerHTML += `
          <div class="day-card ${isDefault ? "active" : ""}" id="card-${index}" onclick="toggleCard(${index})">
              <span class="day-name">${dia}</span>
              <input type="checkbox" id="dia-${index}" ${isDefault ? "checked" : ""} style="display:none">
              <label class="label-pess">Pess.</label>
              <input type="number" id="qtd-${index}" value="1" min="1" onclick="event.stopPropagation()">
              <div class="especial-input-div" id="esp-div-${index}">
                  <label class="label-pess">Esp.</label>
                  <input type="number" id="qtd-esp-${index}" value="1" min="0" onclick="event.stopPropagation()">
              </div>
          </div>
      `;
  });
};

/* ============================================================
 2. FUNÇÕES DE GESTÃO DE MEMBROS (ADD / REMOVE / RENDER)
 ============================================================ */
function adicionarMembro(tipo) {
  const idCampo = tipo === "geral" ? "novoNome" : "novoNomeEsp";
  const input = document.getElementById(idCampo);
  const nome = input.value.trim();
  if (!nome) return;
  const novo = { nome: nome, disponivel: [0, 1, 2, 3, 4, 5, 6] };
  if (tipo === "geral") membrosGeral.push(novo);
  else membrosEspecial.push(novo);
  input.value = "";
  salvarDados();
  renderizarMembros(tipo);
}

function renderizarMembros(tipo) {
  const lista = document.getElementById(
    tipo === "geral" ? "listaMembrosGeral" : "listaMembrosEspecial",
  );
  const array = tipo === "geral" ? membrosGeral : membrosEspecial;
  lista.innerHTML = array.length
    ? ""
    : `<div style='text-align:center; color:#999; padding:10px; font-size:0.8em;'>Nenhum voluntário cadastrado.</div>`;
  array.forEach((m, idx) => {
    let botoesDias = "";
    diasSemanaNome.forEach((dia, dIdx) => {
      const ativo = m.disponivel.includes(dIdx);
      botoesDias += `<button class="mini-dia-btn ${ativo ? "active" : "inactive"}" onclick="toggleDiaMembro('${tipo}', ${idx}, ${dIdx})">${dia[0]}</button>`;
    });
    lista.innerHTML += `<div class="membro-item"><div class="membro-info"><span class="membro-nome">${m.nome}</span><div class="mini-dias">${botoesDias}</div></div><button onclick="removerMembro('${tipo}', ${idx})" style="border:none; background:none; cursor:pointer; color:var(--danger)">🗑️</button></div>`;
  });
}

function toggleDiaMembro(tipo, mIdx, dIdx) {
  const array = tipo === "geral" ? membrosGeral : membrosEspecial;
  const pos = array[mIdx].disponivel.indexOf(dIdx);
  if (pos > -1) array[mIdx].disponivel.splice(pos, 1);
  else array[mIdx].disponivel.push(dIdx);
  salvarDados();
  renderizarMembros(tipo);
}

function removerMembro(tipo, idx) {
  if (tipo === "geral") membrosGeral.splice(idx, 1);
  else membrosEspecial.splice(idx, 1);
  salvarDados();
  renderizarMembros(tipo);
}

/* ============================================================
 3. PERSISTÊNCIA E CONFIGURAÇÕES DE UI
 ============================================================ */
function salvarDados() {
  localStorage.setItem("membros_geral", JSON.stringify(membrosGeral));
  localStorage.setItem("membros_especial", JSON.stringify(membrosEspecial));
}

function verificarOutros() {
  const sel = document.getElementById("tipoEscala");
  const isLouvor = sel.value === "Louvor";
  document.getElementById("outroTipo").style.display =
    sel.value === "Outros" ? "block" : "none";
  document.getElementById("divLouvorEspecial").style.display = isLouvor
    ? "block"
    : "none";
  for (let i = 0; i < 7; i++)
    document.getElementById(`esp-div-${i}`).style.display = isLouvor
      ? "block"
      : "none";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
}

function toggleCard(index) {
  const cb = document.getElementById(`dia-${index}`);
  cb.checked = !cb.checked;
  document.getElementById(`card-${index}`).classList.toggle("active");
}

function preencherDatasPeloMes() {
  const [ano, mes] = document.getElementById("selecaoMes").value.split("-");
  document.getElementById("dataInicio").value = `${ano}-${mes}-01`;
  document.getElementById("dataFim").value = new Date(ano, mes, 0)
    .toISOString()
    .substring(0, 10);
}

/* ============================================================
 4. LÓGICA DE GERAÇÃO DA ESCALA (O CORAÇÃO DO APP)
 ============================================================ */
function gerarEscala() {
  if (membrosGeral.length === 0)
    return alert("Por favor, cadastre voluntários na equipe.");

  const deptoSelect = document.getElementById("tipoEscala");
  const isLouvor = deptoSelect.value === "Louvor";
  let nomeFinal = deptoSelect.options[deptoSelect.selectedIndex].text;

  if (deptoSelect.value === "Outros") {
    const outroNome = document.getElementById("outroTipo").value.trim();
    nomeFinal = outroNome ? "✨ " + outroNome : "Outros";
  }

  document.getElementById("tituloEscala").innerText = "ESCALA: " + nomeFinal;
  document.getElementById("tituloEscala").style.display = "block";
  const tbody = document.querySelector("#tabelaEscala tbody");
  tbody.innerHTML = "";

  let contagemGeral = {};
  let contagemEspecial = {};
  let dataAtual = new Date(
    document.getElementById("dataInicio").value + "T00:00:00",
  );
  const dataFimObj = new Date(
    document.getElementById("dataFim").value + "T00:00:00",
  );

  // Loop dia a dia pelo período selecionado
  while (dataAtual <= dataFimObj) {
    const diaSemana = dataAtual.getDay();

    // Se o dia da semana estiver marcado como ativo
    if (document.getElementById(`dia-${diaSemana}`).checked) {
      const qtdCong =
        parseInt(document.getElementById(`qtd-${diaSemana}`).value) || 1;
      const qtdEsp = isLouvor
        ? parseInt(document.getElementById(`qtd-esp-${diaSemana}`).value) || 0
        : 0;

      // Filtra quem pode trabalhar neste dia
      let aptosGeral = membrosGeral.filter((m) =>
        m.disponivel.includes(diaSemana),
      );
      let aptosEsp = membrosEspecial.filter((m) =>
        m.disponivel.includes(diaSemana),
      );

      // SORTEIO: Prioriza quem trabalhou menos vezes (equilíbrio)
      let escolhidosCong = aptosGeral
        .sort(
          (a, b) =>
            (contagemGeral[a.nome] || 0) - (contagemGeral[b.nome] || 0) ||
            Math.random() - 0.5,
        )
        .slice(0, qtdCong)
        .map((m) => {
          contagemGeral[m.nome] = (contagemGeral[m.nome] || 0) + 1;
          return m.nome;
        });

      let escolhidosEsp = isLouvor
        ? aptosEsp
            .sort(
              (a, b) =>
                (contagemEspecial[a.nome] || 0) -
                  (contagemEspecial[b.nome] || 0) || Math.random() - 0.5,
            )
            .slice(0, qtdEsp)
            .map((m) => {
              contagemEspecial[m.nome] = (contagemEspecial[m.nome] || 0) + 1;
              return m.nome;
            })
        : [];

      // Criação da linha na tabela
      const row = document.createElement("tr");
      row.dataset.isLouvor = isLouvor;
      row.innerHTML = `
              <td style="font-weight:700">${dataAtual.toLocaleDateString("pt-BR")}</td>
              <td style="color:#666">${diasSemanaNome[diaSemana]}</td>
              <td class="nomes-td">
                  ${isLouvor ? `<div class="cong-txt"><span class="badge-louvor bg-congregacional">Congregacional:</span> <span class="val">${escolhidosCong.join(", ") || "---"}</span></div>` : escolhidosCong.join(", ") || "---"}
                  ${escolhidosEsp.length > 0 ? `<div class="esp-txt" style="margin-top:5px;"><span class="badge-louvor bg-especial">Especial:</span> <span class="val">${escolhidosEsp.join(", ")}</span></div>` : ""}
              </td>
              <td class="col-acoes">
                  <button class="btn-icon" onclick="editarLinha(this)">✏️</button>
                  <button class="btn-icon" onclick="excluirLinha(this)">🗑️</button>
              </td>
          `;
      tbody.appendChild(row);
    }
    dataAtual.setDate(dataAtual.getDate() + 1);
  }
}

/* ============================================================
 5. FUNÇÕES DE EDIÇÃO E EXPORTAÇÃO
 ============================================================ */
function editarLinha(btn) {
  const row = btn.closest("tr");
  const td = row.querySelector(".nomes-td");
  if (row.dataset.isLouvor === "true") {
    const congAtual = td.querySelector(".cong-txt .val")?.innerText || "";
    const espAtual = td.querySelector(".esp-txt .val")?.innerText || "";
    const novoCong = prompt("Editar Congregacional:", congAtual);
    if (novoCong !== null) {
      td.querySelector(".cong-txt .val").innerText = novoCong;
      const divEsp = td.querySelector(".esp-txt .val");
      if (divEsp) {
        const novoEsp = prompt("Editar Especial:", espAtual);
        if (novoEsp !== null) divEsp.innerText = novoEsp;
      }
    }
  } else {
    const novo = prompt("Ajustar voluntários:", td.innerText);
    if (novo !== null) td.innerText = novo;
  }
}

async function baixarEscala() {
  const { jsPDF } = window.jspdf;
  
  // 1. Salva estado do tema e força modo claro
  const wasDarkMode = document.body.classList.contains("dark-mode");
  document.body.classList.remove("dark-mode");

  // 2. Cria container temporário para impressão
  const printContainer = document.createElement("div");
  printContainer.style.position = "absolute";
  printContainer.style.top = "-9999px";
  printContainer.style.left = "0";
  printContainer.style.width = "800px"; // Largura fixa para garantir layout
  printContainer.style.background = "#ffffff";
  printContainer.style.padding = "20px";
  
  // Clone do Header
  const headerOrig = document.querySelector(".header-app");
  const headerClone = headerOrig.cloneNode(true);
  headerClone.classList.remove("no-capture"); // Garante que apareça
  headerClone.style.borderRadius = "0 0 30px 30px"; // Mantém estilo
  const controls = headerClone.querySelector(".side-controls");
  if (controls) controls.remove(); // Remove botões laterais do clone

  // Clone da Tabela
  const tabelaOrig = document.getElementById("escalaResultado");
  const tabelaClone = tabelaOrig.cloneNode(true);
  
  // Remove a coluna "Ações" do clone para não aparecer no PDF
  tabelaClone.querySelectorAll(".col-acoes").forEach(el => el.remove());
  
  // Centraliza a coluna "Responsáveis" (cabeçalho e corpo)
  // Cabeçalho (3ª coluna)
  const headers = tabelaClone.querySelectorAll("th");
  if (headers[2]) headers[2].style.textAlign = "center";
  
  // Corpo (células com classe .nomes-td)
  tabelaClone.querySelectorAll(".nomes-td").forEach(el => {
    el.style.textAlign = "center";
  });
  
  printContainer.appendChild(headerClone);
  printContainer.appendChild(tabelaClone);
  document.body.appendChild(printContainer);

  // 3. Aguarda renderização e gera PDF
  setTimeout(() => {
    html2canvas(printContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff" // Garante fundo branco
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      
      // Construção do nome do arquivo
      const deptoSelect = document.getElementById("tipoEscala");
      let nomeArquivoPart = deptoSelect.value;
      if (nomeArquivoPart === "Outros") {
          nomeArquivoPart = document.getElementById("outroTipo").value.trim() || "Outros";
      }
      const mes = document.getElementById("selecaoMes").value;
      const nomeFinalArquivo = `Escala-${nomeArquivoPart}-${mes}.pdf`;

      pdf.save(nomeFinalArquivo);

      // 4. Limpeza e restauração
      document.body.removeChild(printContainer);
      if (wasDarkMode) document.body.classList.add("dark-mode");
    });
  }, 100);
}

function excluirLinha(btn) {
  if (confirm("Remover este dia?")) btn.closest("tr").remove();
}

function limparTudo() {
  if (
    confirm(
      "Isso apagará todos os membros cadastrados e a escala. Deseja continuar?",
    )
  ) {
    localStorage.clear();
    location.reload();
  }
}
