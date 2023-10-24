//Make a get request for the repo data
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// const User = process.env.USER;
// console.log("the username: ", User);

//Make a get request for the repo data
router.get("/repo", async (req, res) => {
  const username = await axios.get(`localhost:2400/username`);
  const { data } = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );
  res.send(data);
});

module.exports = router;
