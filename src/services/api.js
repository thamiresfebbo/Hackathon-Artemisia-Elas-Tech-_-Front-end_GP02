const BASE_URL =
  "https://crudcrud.com/api/7c952777d53341ffb639e8be39b888c0/transactions";

// =========================
// LISTAR TRANSAÇÕES
// =========================

export async function listarTransacoes() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar transações");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);

    return [];
  }
}

// =========================
// ADICIONAR TRANSAÇÃO
// =========================

export async function adicionarTransacao(transacao) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(transacao),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar transação");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
  }
}

// =========================
// DELETAR TRANSAÇÃO
// =========================

export async function deletarTransacao(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar transação");
    }

    return true;
  } catch (error) {
    console.error("Erro:", error);

    return false;
  }
}

// =========================
// ATUALIZAR TRANSAÇÃO
// =========================

export async function atualizarTransacao(id, transacao) {
  try {
    // crudcrud não aceita _id no PUT
    const { _id, ...dadosAtualizados } = transacao;

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar transação");
    }

    return true;
  } catch (error) {
    console.error("Erro:", error);

    return false;
  }
}
