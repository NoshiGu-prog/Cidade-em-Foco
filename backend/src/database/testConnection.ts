import { sql } from "./connection.js";

async function testarConexao() {
  try {
    const resultado = await sql`
      select current_database() as banco, now() as horario
    `;

    console.log("Conexão com o banco realizada com sucesso!");
    console.log(resultado);

    await sql.end();
  } catch (erro) {
    console.error("Erro ao conectar com o banco:");
    console.error(erro);
  }
}

testarConexao();