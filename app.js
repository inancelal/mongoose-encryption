//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const uri =
  "mongodb+srv://demo1:asd123@demo1.ept6dzj.mongodb.net/?retryWrites=true&w=majority";

// Mongoose bağlantısı
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const user = mongoose.model("user", userSchema, "userCollections");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new user({
    email: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then(() => {
      console.log("Email ve parola kaydedildi");
      res.render("secrets");
    })
    .catch((err) => {
      console.error("kaydedilemedi", err);
    });
});

app.post("/login", function (req, res) {
    const loggedUserName = req.body.username;
    const loggedUserPassword = req.body.password;
  
    user.findOne({ email: loggedUserName })
      .then((foundUser) => {
        if (foundUser) {
          if (foundUser.password === loggedUserPassword) {
            res.render("secrets");
          } else {
            console.log("Yanlış parola");
          }
        } else {
          console.log("Kullanıcı bulunamadı");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  

app.listen(3000, function (req, res) {
  console.log("server goes on");
});
