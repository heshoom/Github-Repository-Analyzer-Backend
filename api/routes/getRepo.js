const { Octokit } = require("@octokit/rest");
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//Authenticated requests
async function getAuthenticatedOctokit() {
  const { createOAuthAppAuth } = await import("@octokit/auth-oauth-app");
  
  return new Octokit({
    authStrategy: createOAuthAppAuth,
    auth: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
  });
}

// Initialize usernameResponse as null
let usernameResponse = null;

router.get("/repo", async (req, res) => {
  try {
    // Make a request to get the username
    usernameResponse = await axios.get("https://github-repository-analyzer-backend.vercel.app/gitLogin/username");
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

  if (!githubUsername) {
    return res.status(400).send("Username is required.");
  }

  try {
    // Fetch the repositories for the user
    const appOctokit = await getAuthenticatedOctokit();
    const response = await appOctokit.repos.listForUser({
      username: githubUsername,
    });

    // Send back the repository data
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).send("Failed to fetch repositories.");
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
