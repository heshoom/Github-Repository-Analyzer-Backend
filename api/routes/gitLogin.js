const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  try {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;

    res.redirect(githubAuthUrl);
  } catch (error) {
    console.error(
      error,
      "An error occurred redirecting to the github login page."
    );
  }
});

//app.listen(port, () => console.log("App listening on port " + port));

// index.js

// Import the axios library, to make HTTP requests
const axios = require("axios");
const { Octokit } = require("@octokit/rest");
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

router.get("/github/callback", (req, res) => {
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    access_token = response.data.access_token; // Store access token
    res.redirect("https://github-repository-analyzer-frontend.vercel.app/UserInfo"); // Redirect to frontend
  }).catch(error => {
    console.error("Error exchanging code for access token:", error);
    res.status(500).send("Authentication failed.");
  });
});

router.get("/success", async function (req, res) {
  if (!access_token) {
    return res
      .status(401)
      .send("Access token is missing. Please authenticate first.");
  }

  try {
    const octokit = new Octokit({
      auth: access_token,
    });
    const { data } = await octokit.request("/user");
    res.send({ userData: data });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("An error occurred at /success.");
  }
});

router.get("/name", function (req, res) {
  res.status(200).send("Access Token: " + access_token);
});

// Make a get request for the user data
router.get("/username", async function (req, res) {
  try {
    const octokit = new Octokit({
      auth: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
    });

    const { data } = await octokit.request("/user");
    const username = data.login;

    // Send the username as JSON response
    res.json({ username });
  } catch (error) {
    // Handle any errors here
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

// Make a get request for the access token

router.get("/accesstoken", function (req, res) {
  try {
    res.json({ access_token });
  } catch (error) {
    console.error(error, "An error occurred getting the access token.");
  }
});

module.exports = router;

// app.get("/success", function (req, res) {
//   axios({
//     method: "get",
//     url: `https://api.github.com/user`,
//     headers: {
//       Authorization: "token " + access_token,
//     },
//   })
//     .then((response) => {
//       //console.log("access_token: ", access_token);
//       res.render("auth/success", { userData: response.data });
//     })

//     .catch((error) => {
//       // Handle any errors here
//       console.error(error);
//       res.status(500).send("An error occurred.");
//     });

// });
