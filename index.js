const express = require("express");
const Database = require("./database.js");
const app = express();
const port = 3333;

app.use(express.json());
Database.initConnection()
  .then((connection) => {
    app.post("/students", async (req, res) => {
      try {
        const { studentName, email, userName } = req.body;
        const CHECK_STUDENT_QUERY = "SELECT * FROM Students WHERE email = ?";
        const [existingStudent] = await connection.execute(
          CHECK_STUDENT_QUERY,
          [email]
        );

        if (existingStudent.length > 0) {
          return res
            .status(400)
            .json({ error: "Estudante já existe na base de dados." });
        }

        const INSERT_STUDENT_QUERY =
          "INSERT INTO Students (studentName, email, userName) VALUES (?,?, ?)";

        const [result] = await connection.execute(INSERT_STUDENT_QUERY, [
          studentName,
          email,
          userName,
        ]);

        console.log("Novo estudante criado:", result.insertId);
        res
          .status(201)
          .json({ id: result.insertId, studentName, email, userName });
      } catch (error) {
        console.error("Erro ao criar estudante:", error);
        res.status(500).send("Erro ao criar estudante.");
      }
    });
    ////////////////////////////////////////////////////////////////
    app.get("/", (req, res) => {
      res.send("API funcionando!");
    });
    ////////////////////////////////////////////////////////////////
    app.post("/projects", async (req, res) => {
      try {
        const { projectName, description } = req.body;

        const INSERT_QUERY =
          "INSERT INTO Projects (projectName, description) VALUES (?, ?)";

        const [result] = await connection.execute(INSERT_QUERY, [
          projectName,
          description,
        ]);
        console.log("Novo Projeto criado:", result.insertId);
        res.status(201).json({ id: result.insertId, projectName, description });
      } catch (error) {
        console.error("Erro ao criar projeto:", error);
        res.status(500).send("Erro ao criar projeto.");
      }
    });
    ////////////////////////////////
    app.post("/studentsProject", async (req, res) => {
      try {
        const { projectId, studentId } = req.body;
        const INSERT_QUERY =
          "INSERT INTO StudentsProject (projectId, studentId) VALUES (?, ?)";
        const [result] = await connection.execute(INSERT_QUERY, [
          projectId,
          studentId,
        ]);
        console.log("Novo studentsProject criado:", result.insertId);
        res.status(201).json({ id: result.insertId, projectId, studentId });
      } catch (error) {
        console.error("Erro ao criar relação StudentsProject:", error);
        res.status(500).send("Erro ao criar relação StudentsProject.");
      }
    });
    app.listen(port, () => {
      console.log(`✨ Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao iniciar o servidor:", error);
  });
