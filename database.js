const mysql = require("mysql2/promise");

async function initConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "",
      password: "",
      database: "",
    });
    console.log("Conectado ao banco de dados MySQL.");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}

module.exports = {
  initConnection,
};
