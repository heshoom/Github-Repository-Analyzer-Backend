const express = require("express");
const router = express.Router();
const axios = require("axios");

const username = 'heshoom';
const token = process.env.TOKEN;

axios.get('https://api.github.com/rate_limit', {
  headers: {
    Authorization: "token " + token,
  },
})
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.error('Error checking rate limit:', error);
});

module.exports = router;