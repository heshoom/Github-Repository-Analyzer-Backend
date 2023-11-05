const router = require('express').Router();
require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.TOKEN, // Replace with your GitHub token
});

// Make a GET request to check your rate limit
octokit.rest.rateLimit.get()
  .then(({ data }) => {
    // Extract rate limit information
    const { limit, remaining, reset } = data.resources.core;
    
    console.log(`API Rate Limit: ${limit}`);
    console.log(`Remaining Requests: ${remaining}`);
    console.log(`Reset Timestamp: ${reset}`);
  })
  .catch((error) => {
    console.error("Error checking rate limit:", error);
  });


router.use('/getRepo', require('./getRepo'));
//router.use('/getrateLimit', require('./getrateLimit'));
router.use('/timetofirstcomment', require('./timetofirstcomment'));
router.use('/calculatetimetomerge', require('./calculatetimetomerge'));
//router.use('/test', require('./test'));
module.exports = router;