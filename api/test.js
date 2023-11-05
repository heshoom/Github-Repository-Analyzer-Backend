const express = require("express");
const router = express.Router();
const { Octokit } = require("@octokit/rest");
const axios = require("axios");

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.TOKEN,
});

router.get("/average-merge-time/:owner/:repo", async (req, res) => {
    const owner = req.params.owner;
    const repo = req.params.repo;
    const perPage = 100; // Adjust the number of pull requests per page as needed
  
    try {
      // Initialize an array to store information about pull requests
      let allPullRequestsInfo = [];
      let page = 1;
  
      // Use a loop to fetch all pages of pull requests
      while (true) {
        const response = await octokit.pulls.list({
          owner,
          repo,
          state: "all", // Include all pull requests
          per_page: perPage,
          page,
        });
  
        const pagePullRequests = response.data;
  
        // Map the data to include only the pull request number, merge date, and creation date, and exclude null merge dates
        const mappedData = pagePullRequests
          .filter((pullRequest) => pullRequest.merged_at !== null)
          .map((pullRequest) => ({
            number: pullRequest.number,
            merged_at: new Date(pullRequest.merged_at),
            created_at: new Date(pullRequest.created_at),
          }));
  
        allPullRequestsInfo = allPullRequestsInfo.concat(mappedData);
  
        // Check if there are more pages
        if (pagePullRequests.length < perPage) {
          break; // No more pages to fetch
        }
  
        page++;
      }
  
      // Calculate the average merge time in days, hours, and minutes format
      const totalMergeTimeInMilliseconds = allPullRequestsInfo.reduce((total, pullRequest) => {
        const mergeDate = pullRequest.merged_at;
        const createDate = pullRequest.created_at;
        const mergeTimeInMilliseconds = mergeDate - createDate;
        return total + mergeTimeInMilliseconds;
      }, 0);
  
      const averageMergeTimeInMinutes = totalMergeTimeInMilliseconds / allPullRequestsInfo.length / 1000 / 60;
      const averageMergeTimeDays = Math.floor(averageMergeTimeInMinutes / (60 * 24));
      const averageMergeTimeHours = Math.floor((averageMergeTimeInMinutes % (60 * 24)) / 60);
      const averageMergeTimeMinutes = Math.floor(averageMergeTimeInMinutes % 60);
  
      res.json({
        averageMergeTime: {
          days: averageMergeTimeDays,
          hours: averageMergeTimeHours,
          minutes: averageMergeTimeMinutes,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Error calculating average merge time." });
    }
  });
  

// Initialize Octokit with your GitHub token

router.get("/all-pull-requests/:owner/:repo", async (req, res) => {
    const owner = req.params.owner;
    const repo = req.params.repo;
    const perPage = 100; // Adjust the number of pull requests per page as needed
  
    try {
      // Initialize an array to store information about pull requests
      let allPullRequestsInfo = [];
      let page = 1;
  
      // Use a loop to fetch all pages of pull requests
      while (true) {
        const response = await octokit.pulls.list({
          owner,
          repo,
          state: "all", // Include all pull requests
          per_page: perPage,
          page,
        });
      
        const pagePullRequests = response.data;
        // Map the data to include only the pull request number and merge date, and exclude null merge dates
        const mappedData = pagePullRequests
          .filter((pullRequest) => pullRequest.merged_at !== null)
          .map((pullRequest) => ({
            number: pullRequest.number,
            merged_at: pullRequest.merged_at,
          }));
      
        allPullRequestsInfo = allPullRequestsInfo.concat(mappedData);
      
        // Check if there are more pages
        if (pagePullRequests.length < perPage) {
          break; // No more pages to fetch
        }
      
        page++;
      }
      const pullRequestCount = allPullRequestsInfo.length;
  
      res.json({pullRequestCount, allPullRequestsInfo});
    } catch (error) {
        console.log("Error retrieving pull requests.", error)
      res.status(500).json({ error: "Error retrieving pull requests." });
    }
  });

module.exports = router;

