const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const port = process.env.PORT || 3000;

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
