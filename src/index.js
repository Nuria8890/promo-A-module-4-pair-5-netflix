const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// Configuración de motor de plantillas
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Configurar la conexion servidor - bbdd
async function getConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    database: "netflix",
    user: "root",
    password: "root",
  });
  await connection.connect();
  console.log(
    `Conexión establecida con la base de datos ${connection.threadId}`
  );
  return connection;
}

// Seleccionar todas las películas de la bbdd

server.get("/movies", async (req, res) => {
  const connection = await getConnection();
  let sql = "SELECT * FROM movies";
  const [results, fields] = await connection.query(sql);
  console.log("results", results);
  connection.end();
  if (results.length === 0) {
    res.status(404).json({
      status: "error",
      message: "No se encontraron películas",
    });
  } else {
    res.status(200).json({
      status: "success",
      message: results,
    });
  }
});

// Filtro por género NO FUNCIONA

server.get("/movies/filters", async (req, res) => {
  const connection = await getConnection();

  const genreFilterParam = req.query.genre;
  console.log("genreFilterParam", genreFilterParam);

  let sql = `SELECT * FROM movies WHERE genre = ?;`;

  const [results] = await connection.query(sql, [genreFilterParam]);

  console.log("results", results);

  connection.end();

  if (results.length === 0) {
    res.status(404).json({
      status: "error",
      message: `No se encontraron películas ni series con el género ${genreFilterParam}`,
    });
  } else {
    res.status(200).json({
      status: "success",
      message: results,
    });
  }
});

// Motor de plantillas

server.get("/movie/:movieId", async (req, res) => {
  const connection = await getConnection();
  const movieId = req.params.movieId;

  const query = "SELECT * FROM movies WHERE idMovies = ?;";
  const [foundMovie] = await connection.query(query, [movieId]);
  connection.end();

  if (foundMovie.length === 0) {
    res.status(404).json({
      status: "error",
      message: `No se encontraron películas ni series con el id ${movieId}`,
    });
  } else {
    res.render("movie", foundMovie[0]);
  }
});

// Registro
server.post("/api/register", async (req, res) => {
  /* - recoger el email y la contraseña que nos envía frontend
     - conectarnos a la DB
     - añadir los datos del usuario a nuestra base de datos
          - encriptar la contraseña
     - responder a frontend

  */
  console.log(req.body);
  const { user, email, name, password } = req.body;
  const connection = await getConnection();

  // encriptar la contraseña
  const passwordHashed = await bcrypt.hash(password, 10);
  console.log("passwordHashed", passwordHashed);
  // insertar el nuevo usuario en mi tabla de la DB
  const query =
    "INSERT INTO users (user, email, name, password) VALUES (?, ?, ?, ?)";
  const [result] = await connection.query(query, [
    user,
    email,
    name,
    passwordHashed,
  ]);
  // console.log(result);
  res.status(201).json({
    status: "success",
    id: result.insertId,
  });
});
