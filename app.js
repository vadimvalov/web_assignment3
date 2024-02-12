const express = require("express");
const path = require("path");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use("/", routes);

app.listen(PORT, function () {
  console.log("Server running on port: " + PORT);
});

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const userData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = data.redirectUrl;
        } else {
          alert(data.message);
        }
      });
  });

window.onload = function () {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated) {
    document.querySelector('a[href="/login"]').style.display = "none";
    document.querySelector('a[href="/signup"]').style.display = "none";
  } else {
    document.querySelector('a[href="/login"]').style.display = "block";
    document.querySelector('a[href="/signup"]').style.display = "block";
  }
};
