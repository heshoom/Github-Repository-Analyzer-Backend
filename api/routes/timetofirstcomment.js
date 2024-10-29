const express = require("express");
const router = express.Router();
const { Octokit } = require("@octokit/rest");

// Initialize Octokit
const octokit = new Octokit({
    auth: process.env.TOKEN,
});

// Define a route to calculate time to first comment
router.get("/:owner/:repo", async (req, res) => {
    const owner = req.params.owner;
    const repo = req.params.repo;
  
    try {
      // Get the list of pull requests for the repository
      const pullRequestsResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls",
        {
          owner,
          repo,
        }
      );
  
      const pullRequests = pullRequestsResponse.data;
  
      // Initialize variables to calculate the average
      let totalTimeToFirstComment = 0;
      let totalPullRequests = 0;
  
      // Iterate through each pull request
      for (const pullRequest of pullRequests) {
        const commentsResponse = await octokit.issues.listComments({
          owner,
          repo,
          issue_number: pullRequest.number, // Issue number is the same as pull request number
        });
  
        const comments = commentsResponse.data;
  
        // Check if there are any comments
        if (comments.length > 0) {
          const createdAt = new Date(pullRequest.created_at);
          const firstCommentDate = new Date(comments[0].created_at);
  
          if (createdAt && firstCommentDate) {
            const timeToFirstComment = (firstCommentDate - createdAt) / (1000 * 60 * 60); // Convert milliseconds to hours
            totalTimeToFirstComment += timeToFirstComment;
            totalPullRequests++;
          }
        }
      }
  
      if (totalPullRequests > 0) {
        let averageTimeToFirstComment = totalTimeToFirstComment / totalPullRequests;
      
        // Format averageTimeToFirstComment
        let formattedTime = '';
        if (averageTimeToFirstComment >= 168) {
          const weeks = Math.floor(averageTimeToFirstComment / 168);
          formattedTime += `${weeks} week${weeks > 1 ? 's' : ''} `;
          averageTimeToFirstComment %= 168;
        }
        if (averageTimeToFirstComment >= 24) {
          const days = Math.floor(averageTimeToFirstComment / 24);
          formattedTime += `${days} day${days > 1 ? 's' : ''} `;
          averageTimeToFirstComment %= 24;
        }
        const hours = Math.floor(averageTimeToFirstComment);
        const minutes = Math.round((averageTimeToFirstComment - hours) * 60);
        formattedTime += `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
      
        res.json({ formattedTime });
      } else {
        res.json({ error: "No comments found on any pull request." });
      }
    } catch (error) {
      res.status(500).json({ error: "Error retrieving pull requests or comments." });
      console.log("Error retrieving pull requests or comments.", error);
    }
  });
  
  module.exports = router;
