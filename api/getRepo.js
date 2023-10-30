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

// Make a get request for all of the repositories for the user
router.get("/:username", async (req, res) => {
  const githubUsername = req.params.username;
  const token = process.env.TOKEN;
  if (githubUsername === null) {
    // If usernameResponse is not set, handle it gracefully
    res.status(500).send("Username is not available.");
    return;
  }

  try {
    //console.log("usernameResponse:", githubUsername);
    // Use the username from usernameResponse to make the request
    // const { data } = await axios.get(
    //   `https://api.github.com/users/${githubUsername}/repos`, {headers}
    // );
    const { data } = await axios({
      method: "get",
      url: `https://api.github.com/users/${githubUsername}/repos`,
      headers: {
        Authorization: "token " + token,
      },
  })
    res.send(data);
  } catch (error) {
    // Handle the error, log it, and send an appropriate response
    console.error("Error at /:username:", error.message);
    res.status(500).send("An error occurred.");
  }
});

/**
 * get a requested repo
 * params
 * user - current user's gitHub userName
 * owner - repo owner
 * reqrepo - name of the repo
 */

router.get("/:owner/:reqrepo", async (req, res, next) => {
  const { owner, reqrepo } = req.params;
  // const header = await accessTokenToHeader(req.headers.authorization, owner);
  const token = process.env.TOKEN;

  try {
    const response = await axios({
      method: "get",
      url: `https://api.github.com/repos/${owner}/${reqrepo}`,
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

