const express = require("express");
const router = express.Router();
const { Octokit } = require("@octokit/rest");

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.TOKEN,
});

// Define a route to calculate time to merge
router.get("/:owner/:repo", async (req, res) => {
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

    // Sort the pull requests by creation date (newest to oldest)
    allPullRequestsInfo.sort((a, b) => b.created_at - a.created_at);

    // Calculate the total average merge time
    const totalMergeTimeInMilliseconds = allPullRequestsInfo.reduce(
      (total, pullRequest) => {
        const mergeDate = pullRequest.merged_at;
        const createDate = pullRequest.created_at;
        const mergeTimeInMilliseconds = mergeDate - createDate;
        return total + mergeTimeInMilliseconds;
      },
      0
    );

    const averageMergeTimeInMinutes =
      totalMergeTimeInMilliseconds / allPullRequestsInfo.length / 1000 / 60;
    const averageMergeTimeDays = Math.floor(
      averageMergeTimeInMinutes / (60 * 24)
    );
    const averageMergeTimeHours = Math.floor(
      (averageMergeTimeInMinutes % (60 * 24)) / 60
    );
    const averageMergeTimeMinutes = Math.floor(averageMergeTimeInMinutes % 60);

    // Get the newest 5 pull requests
    const newest5PullRequests = allPullRequestsInfo.slice(0, 5);

    const latest30PullRequests = allPullRequestsInfo.slice(0, 30);

    // Calculate the average merge time for the newest 30 pull requests
    const averageMergeTimeInMinutesForLatest30 = latest30PullRequests.map(
      (pullRequest) => {
        const mergeDate = new Date(pullRequest.merged_at);
        const createDate = new Date(pullRequest.created_at);
        const mergeTimeInMilliseconds = mergeDate - createDate;
        const mergeTimeInMinutes = mergeTimeInMilliseconds / 1000 / 60;
        const mergeTimeDays = Math.floor(mergeTimeInMinutes / (60 * 24));
        const mergeTimeHours = Math.floor(
          (mergeTimeInMinutes % (60 * 24)) / 60
        );
        const mergeTimeMinutes = Math.floor(mergeTimeInMinutes % 60);

        return {
          number: pullRequest.number,
          days: mergeTimeDays,
          hours: mergeTimeHours,
          minutes: mergeTimeMinutes,
        };
      }
    );
    // Calculate the average merge time
    const totalMergeTimeInMinutes = averageMergeTimeInMinutesForLatest30.reduce(
      (acc, pr) => acc + pr.days * 24 * 60 + pr.hours * 60 + pr.minutes,
      0
    );
    const averageMergeTimeInMin =
      totalMergeTimeInMinutes / latest30PullRequests.length;

    // Convert average merge time to days, hours, and minutes
    const averageDays = Math.floor(averageMergeTimeInMin / (60 * 24));
    const averageHours = Math.floor((averageMergeTimeInMin % (60 * 24)) / 60);
    const averageMinutes = Math.floor(averageMergeTimeInMin % 60);

    const AMTIML30 = {
      days: averageDays,
      hours: averageHours,
      minutes: averageMinutes,
    };

    // Calculate the average merge time for the newest 5 pull requests
    const averageMergeTimesForNewest5 = newest5PullRequests.map(
      (pullRequest) => {
        const mergeDate = pullRequest.merged_at;
        const createDate = pullRequest.created_at;
        const mergeTimeInMilliseconds = mergeDate - createDate;
        const mergeTimeInMinutes = mergeTimeInMilliseconds / 1000 / 60;
        const mergeTimeDays = Math.floor(mergeTimeInMinutes / (60 * 24));
        const mergeTimeHours = Math.floor(
          (mergeTimeInMinutes % (60 * 24)) / 60
        );
        const mergeTimeMinutes = Math.floor(mergeTimeInMinutes % 60);

        return {
          number: pullRequest.number,
          days: mergeTimeDays,
          hours: mergeTimeHours,
          minutes: mergeTimeMinutes,
        };
      }
    );

    res.json({
      averageMergeTime: {
        total: {
          days: averageMergeTimeDays,
          hours: averageMergeTimeHours,
          minutes: averageMergeTimeMinutes,
        },
        newest5: averageMergeTimesForNewest5,
        latest30PullRequests: AMTIML30,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error calculating average merge time." });
  }
});

module.exports = router;
