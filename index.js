const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require('cors');

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

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
