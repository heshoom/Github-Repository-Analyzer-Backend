const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Initialize usernameResponse as null
let usernameResponse = null;

router.get("/repo", async (req, res) => {
  try {
    // Make a request to get the username
    usernameResponse = await axios.get("http://localhost:2400/username");
    res.redirect("/fetchrepo"); // Redirect to the /fetchrepo route
  } catch (error) {
    // Handle the error, log it, and send an appropriate response
    console.error("Error:", error.message);
    res.status(500).send("An error occurred.");
  }
});

router.get("/:username", async (req, res) => {
  const githubUsername = req.params.username;
  if (githubUsername === null) {
    // If usernameResponse is not set, handle it gracefully
    res.status(500).send("Username is not available.");
    return;
  }

  try {
    //console.log("usernameResponse:", githubUsername);
    // Use the username from usernameResponse to make the request
    const { data } = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`
    );
    res.send(data);
  } catch (error) {
    // Handle the error, log it, and send an appropriate response
    console.error("Error at /:username:", error.message);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router;
