const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./connection");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.use(express.json());

app.post("/addCoach", (req, res) => {
  const name = req.body.name;
  const game = req.body.game;
  const price = req.body.price;
  const position = req.body.position;
  const rating = req.body.rating;
  const country = req.body.country;

  db.query(
    "INSERT INTO coaches (name, game, price, position, rating, country) VALUES (?,?,?,?,?,?)",
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

// app.post("/addReview", (req, res) => {
//   const review = req.body.review;

//   db.query(
//     "INSERT INTO reviews (review) VALUES (?)",
//     [review],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send("Values Inserted");
//       }
//     }
//   );
// });

app.get("/seeCoaches", (req, res) => {
  db.query("SELECT * FROM coaches", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/search", (req, res) => {
  var name = req.query.name;
  var sql = "SELECT * FROM coaches WHERE name LIKE '%" + name + "%'";
  con.query(sql, function (error, result) {
    if (error) console.log(error);
    res.json({ coaches: result });
  });
});

app.put("/updateCoaches", (req, res) => {
  const id = req.body.id;
  const rating = req.body.rating;
  db.query(
    "UPDATE coaches SET rating = ? WHERE id = ?",
    [rating, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/deleteCoaches/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM coaches WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
