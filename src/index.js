const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

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
