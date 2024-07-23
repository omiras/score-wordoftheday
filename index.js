const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Ruta raiz
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>API de Puntuaciones</title>
  </head>
  <body>
      <h1>Bienvenido a la API de Puntuaciones de PIMEC 2023</h1>
      <p>Para obtener la información de puntuaciones, realiza una petición GET a:</p>
      <p><a href="/scores">https://score-word-of-the-dat.onrender.com/scores</a></p>
  </body>
  </html>`);
});

// Ruta para obtener la información desde el archivo CSV
app.get("/scores", (req, res) => {
  const scores = [];

  // Lee el archivo CSV
  fs.createReadStream("scores.csv")
    .pipe(csv({ separator: "," }))
    .on("data", (row) => {
      scores.push(row);
    })
    .on("end", () => {
      // Ordena el array de puntuaciones de mayor a menor
      scores.sort((a, b) => b.puntos - a.puntos);

      res.json(scores);
    });
});

app.get("/vbeta/api/score", (req, res) => {
  // Simula alta demanda con un 99% de probabilidad de error
  const randomChance = Math.random();

  if (randomChance < 0.90) {
    // Simula un mensaje de error en JSON con un código HTTP adecuado
    res.status(503).json({
      error: "There is high demand for requests to the API. Please try again later."
    });
  } else {
    // Lee el archivo CSV y responde con los datos
    const scores = [];

    fs.createReadStream("scores.csv")
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        scores.push(row);
      })
      .on("end", () => {
        // Transforma los campos a `name` y `score`
        const transformedScores = scores.map(row => ({
          name: row.nombre,  // Asumiendo que el CSV tiene una columna llamada `nombre`
          score: row.puntos   // Asumiendo que el CSV tiene una columna llamada `puntos`
        }));

        // Ordena el array de puntuaciones de mayor a menor
        transformedScores.sort((a, b) => b.score - a.score);

        res.json(transformedScores);
      });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
