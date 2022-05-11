const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "employeesystem",
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const game = req.body.game;
  const price = req.body.price;
  const position = req.body.position;
  const rating = req.body.rating;
  const country = req.body.country;

  db.query(
    "INSERT INTO employees (name, game, price, position, rating,country) VALUES (?,?,?,?,?,?)",
    [name, game, price, position, rating, country],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
