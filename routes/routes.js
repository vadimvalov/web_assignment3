const express = require("express");
const axios = require("axios");
const path = require("path");
const { client, connectToDatabase } = require("../db/db.js");
const API_KEY = "c729575ecda087361cbbd60a490904bc";
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const session = require("express-session");

let history = [];
router.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

router.get("/history", function (req, res) {
  const isAuthenticated = !!req.session.user;
  if (isAuthenticated) {
    res.render("history", { history: history });
  } else {
    res.redirect("/login");
  }
});

router.get("/admin", async (req, res) => {
  try {
    await connectToDatabase();
    const users = await client.db("users").collection("users").find().toArray();
    res.render(path.join(__dirname, "..", "public", "admin.ejs"), {
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/admin/create", async (req, res) => {
  try {
    await connectToDatabase();
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await client
      .db("users")
      .collection("users")
      .insertOne({
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin === "true",
      });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/admin/makeAdmin/:userId", async (req, res) => {
  try {
    await connectToDatabase();
    const { userId } = req.params;
    await client
      .db("users")
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { isAdmin: true } });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error making user admin:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/admin/update/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const { id } = req.params;
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await client
      .db("users")
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { username, email, password: hashedPassword } }
      );
    res.redirect("/admin");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/admin/delete/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const { id } = req.params;
    await client
      .db("users")
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/signup", function (req, res) {
  res.render(path.join(__dirname, "..", "public", "signup.ejs"));
});

router.get("/login", function (req, res) {
  res.render(path.join(__dirname, "..", "public", "login")); // Используйте res.render вместо res.sendFile
});

router.get("/", function (req, res) {
  const isAuthenticated = !!req.session.user;
  res.render("index", {
    translations: JSON.stringify(translations),
    isAuthenticated: isAuthenticated,
    history: history,
  });
});

router.get("/ping", function (req, res) {
  res.status(200);
  res.send("pong");
});

router.get("/weather/:city", function (req, res) {
  const city = req.params.city;
  const lang = req.query.lang || "en"; // Используйте параметр запроса lang
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`; // Используйте lang в URL

  axios
    .get(url)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        res
          .status(500)
          .send({ message: "No response received from the weather service" });
      } else {
        res
          .status(500)
          .send({ message: "Error in making request to the weather service" });
      }
    });
});

router.get("/wallet/:address", function (req, res) {
  const address = req.params.address;
  const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=5`;

  axios
    .get(url)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        res
          .status(500)
          .send({ message: "No response received from the balance service" });
      } else {
        res
          .status(500)
          .send({ message: "Error in making request to the balance service" });
      }
    });
});

router.get("/BTC/price", function (req, res) {
  const url = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";

  axios
    .get(url)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        res
          .status(500)
          .send({ message: "No response received from the BTC price service" });
      } else {
        res
          .status(500)
          .send({
            message: "Error in making request to the BTC price service",
          });
      }
    });
});
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Missing required fields" });
    }

    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.db("users").collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    res.status(200).send({ success: true, redirectUrl: "/" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ success: false, message: "Error registering user" });
  }
});

router.get("/logout", function (req, res) {
  delete req.session.user;
  req.session.destroy(function (err) {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/login");
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    await connectToDatabase();
    const user = await client
      .db("users")
      .collection("users")
      .findOne({ username });

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      return res
        .status(200)
        .send({ success: true, redirectUrl: user.isAdmin ? "/admin" : "/" });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/auth/status", async (req, res) => {
  try {
    await connectToDatabase();
    const user = await client
      .db("users")
      .collection("users")
      .findOne({ ip: req.ip });
    if (user) {
      res.send({ isAuthenticated: true, username: user.username });
    } else {
      res.send({ isAuthenticated: false });
    }
  } catch (error) {
    console.error("Error checking authentication status:", error);
    res.status(500).send({ isAuthenticated: false });
  }
});

module.exports = router;
