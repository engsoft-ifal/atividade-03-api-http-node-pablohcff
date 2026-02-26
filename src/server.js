import http from "http";

let requerimentos = [
  {
    id: 1,
    estudante: "Maria Silva",
    categoria: "Reparo",
    observacao: "Necessário reparar o computador da sala 101."
  },
  {
    id: 2,
    estudante: "João Santos",
    categoria: "Instalação de Software",
    observacao: "Solicito a instalação do software de edição de vídeo."
  },

];
let nextId = 3;

// Responder JSON
function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {

  // =========================
  // GET /health
  // =========================
  if (req.method === "GET" && req.url === "/health") {
    return sendJson(res, 200, { status: "ativo" });
  }

  // =========================
  // GET /
  // =========================
  if (req.method === "GET" && req.url === "/") {
    return sendJson(res, 200, requerimentos);
  }

 // =========================
// GET /:id
// =========================
if (req.method === "GET" && req.url.startsWith("/") && req.url !== "/" && req.url !== "/health") {

  const id = parseInt(req.url.slice(1));

  const item = requerimentos.find(r => r.id === id);

  if (!item) {
    return sendJson(res, 404, { erro: "Registro não encontrado" });
  }

  return sendJson(res, 200, item);
}

// =========================
// POST /
// =========================
if (req.method === "POST" && req.url === "/") {

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    let dados;

    // JSON inválido → 400
    try {
      dados = JSON.parse(body);
    } catch {
      return sendJson(res, 400, { erro: "JSON inválido" });
    }

    const { estudante, categoria, observacao } = dados;

    // Campo obrigatório ausente → 422
    if (!estudante || !categoria || !observacao) {
      return sendJson(res, 422, {
        erro: "Campos obrigatórios: estudante, categoria, observacao"
      });
    }

    const novo = {
      id: nextId++,
      estudante,
      categoria,
      observacao
    };

    requerimentos.push(novo);

    return sendJson(res, 201, novo);
  });

  return;
}

  // =========================
  // 404
  // =========================
  sendJson(res, 404, { erro: "Rota não encontrada" });

});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
