document.addEventListener("DOMContentLoaded", () => {
  const FIREBASE_URL =
    "https://formulario-d0e01-default-rtdb.firebaseio.com/registros.json";
  const tabelaRegistros = document
    .getElementById("tabela-registros")
    ?.querySelector("tbody"); // Verifica se existe o tbody

  const formulario = document.getElementById("form-cadastro"); // Corrigido para usar o ID correto

  // Função para carregar registros
  const carregarRegistros = async () => {
    try {
      const response = await fetch(FIREBASE_URL, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        if (tabelaRegistros) {
          tabelaRegistros.innerHTML = ""; // Limpa a tabela antes de adicionar os novos registros
          if (data) {
            Object.keys(data).forEach((id) => {
              const registro = data[id];
              const tr = document.createElement("tr");
              tr.innerHTML = `
                            <td>${registro.nome}</td>
                            <td>${registro.email}</td>
                            <td>${registro.telefone}</td>
                            <td>
                                <button onclick="editarRegistro('${id}', '${registro.nome}', '${registro.email}', '${registro.telefone}')">Editar</button>
                                <button onclick="excluirRegistro('${id}')">Excluir</button>
                            </td>
                        `;
              tabelaRegistros.appendChild(tr);
            });
          } else {
            tabelaRegistros.innerHTML =
              '<tr><td colspan="5">Nenhum registro encontrado.</td></tr>';
          }
        }
      } else {
        alert("Erro ao carregar registros. Verifique a URL do Firebase.");
      }
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      if (tabelaRegistros) {
        tabelaRegistros.innerHTML =
          '<tr><td colspan="5">Erro ao conectar com o servidor.</td></tr>';
      }
    }
  };

  // Função para manipular a submissão do formulário e enviar os dados para o Firebase
  formulario?.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    const usuario = {
      nome: formulario.nome.value,
      email: formulario.email.value,
      telefone: formulario.telefone.value,
    };

    // Enviar dados via POST para o Firebase
    try {
      const response = await fetch(FIREBASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        alert("Registro enviado com sucesso!");
        carregarRegistros(); // Recarrega os registros após envio
        formulario.reset(); // Limpa o formulário após envio
      } else {
        alert("Erro ao enviar registro.");
      }
    } catch (error) {
      console.error("Erro ao enviar registro:", error);
    }
  });

  // Função para excluir um registro
  window.excluirRegistro = async (id) => {
    if (confirm("Deseja excluir este registro?")) {
      try {
        const response = await fetch(
          `${FIREBASE_URL.replace(".json", "")}/${id}.json`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Registro excluído com sucesso!");
          carregarRegistros(); 
        } else {
          alert("Erro ao excluir registro.");
        }
      } catch (error) {
        console.error("Erro ao excluir registro:", error);
      }
    }
  };

  // Função para imprimir a tabela
  window.imprimirTabela = () => {
    window.print();
  };

  // Carregar registros ao iniciar
  if (tabelaRegistros) {
    carregarRegistros();
  }
});
