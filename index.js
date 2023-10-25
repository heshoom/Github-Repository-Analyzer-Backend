// index.js

/*  EXPRESS */
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.set("view engine", "ejs");
const port = process.env.PORT || 2400;
var access_token = "";

app.get("/", function (req, res) {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}`;

  res.redirect(githubAuthUrl);
});

//app.listen(port, () => console.log("App listening on port " + port));

// index.js

// Import the axios library, to make HTTP requests
const axios = require("axios");
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Declare the callback route
// app.get("/github/callback", (req, res) => {
//   // The req.query object has the query params that were sent to this route.
//   const requestToken = req.query.code;

//   axios({
//     method: "post",
//     url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
//     // Set the content type header, so that we get the response in JSON
//     headers: {
//       accept: "application/json",
//     },
//   }).then((response) => {
//     access_token = response.data.access_token;
//     res.redirect("/success");
//   });
// });

app.get("/github/callback", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    access_token = response.data.access_token;
    res.redirect("http://localhost:3000/UserInfo");
  });
});

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

app.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  })
    .then((response) => {
      //console.log("access_token: ", access_token);
      res.send({ userData: response.data });
    })

    .catch((error) => {
      // Handle any errors here
      console.error(error);
      res.status(500).send("An error occurred.");
    });
});

app.get("/name", function (req, res) {
  res.status(200).send("Access Token: " + access_token);
});

// Make a get request for the user data
app.get("/username", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  })
    .then((response) => {
      const userData = response.data;
      const username = userData.login;

      // Send the username as JSON response
      res.json({ username });
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error);
      res.status(500).send("An error occurred.");
    });
});

// Make a get request for the access token

app.get("/accesstoken", function (req, res) {
  try {
    res.json({ access_token });
  } catch (error) {
    console.error(error, "An error occurred getting the access token.");
  }
  
});

// const setupMiddleWare = (app) => {
//   console.log("Setting up middleware...");
//   app.use(
//     cors({
//       origin: "*",
//       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//       credentials: true,
//       allowedHeaders: "*", // Allow all headers (for debugging)
//       preflightContinue: true,
//     })
//   );
// };

// app.get("/repo", async (req, res) => {
//   const { data } = await axios.get(
//       `https://api.github.com/users/heshoom/repos`
//   );
//   res.send(data);
//   });

const setupRoutes = (app) => {
  app.use("/api", require("./api"));
  //app.use("/views", require("./views"));
};

const startServer = async (app, port) => {
  //await sessionStore.sync();
  //await db.sync({ force: false });
  app.listen(port, () => console.log(`Server is on port:${port}`));
  return app;
};

const configureApp = async () => {
  // setupMiddleWare(app);
  setupRoutes(app);
  return await startServer(app, port);
};

configureApp(port);

module.exports = app;
