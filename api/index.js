const express = require('express');
const app = express();
require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const { db } = require('../db/firebase.config.js'); // Import the database instance
const { doc, setDoc } =  require('firebase/firestore'); // Import the functions for adding a document to the database
const cors = require('cors');

port = process.env.PORT || 3000;
app.use(express.json());

// Allow requests from your frontend origin
app.use(cors({ origin: 'https://github-repository-analyzer-frontend.vercel.app' }));

//make a request to redirect to routes/gitLogin.js
app.use('/getRepo', require('./routes/getRepo'));
//app.use('/getrateLimit', require('./getrateLimit'));
app.use('/timetofirstcomment', require('./routes/timetofirstcomment'));
app.use('/calculatetimetomerge', require('./routes/calculatetimetomerge'));
app.use('/gitLogin', require('./routes/gitLogin.js'));
//app.use('/test', require('./test'));

// Define the route that redirects to gitLogin
app.get('/', (req, res) => {
  res.redirect('/gitLogin');
});

// app.listen(3000, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


module.exports = app;

// const octokit = new Octokit({
//   auth: process.env.TOKEN, // Replace with your GitHub token
// });

// export default async function handler(req, res) {
//   const data = { name: 'John Doe', age: 30 };
//   await setDoc(doc(db, 'users', 'some-user-id'), data);
//   res.status(200).json({ message: 'Data saved successfully' });
// } 


// Make a GET request to check your rate limit
// octokit.rest.rateLimit.get()
//   .then(({ data }) => {
//     // Extract rate limit information
//     const { limit, remaining, reset } = data.resources.core;
    
//     console.log(`API Rate Limit: ${limit}`);
//     console.log(`Remaining Requests: ${remaining}`);
//     console.log(`Reset Timestamp: ${reset}`);
//   })
//   .catch((error) => {
//     console.error("Error checking rate limit:", error);
//   });


// /*  EXPRESS */
// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config();
// app.use(cors());
// app.set("view engine", "ejs");
// const port = process.env.PORT || 2400;
// var access_token = "";



// // // const setupMiddleWare = (app) => {
// // //   console.log("Setting up middleware...");
// // //   app.use(
// // //     cors({
// // //       origin: "*",
// // //       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// // //       credentials: true,
// // //       allowedHeaders: "*", // Allow all headers (for debugging)
// // //       preflightContinue: true,
// // //     })
// // //   );
// // // };

// // // app.get("/repo", async (req, res) => {
// // //   const { data } = await axios.get(
// // //       `https://api.github.com/users/heshoom/repos`
// // //   );
// // //   res.send(data);
// // //   });

// // const setupRoutes = (app) => {
// //   app.use("/api", require("./api"));
// //   //app.use("/db", require("./db"));
// //   //app.use("/views", require("./views"));
// // };

// // const startServer = async (app, port) => {
// //   // //await sessionStore.sync();
// //   // //await db.sync({ force: false });
// //   // app.listen(port, () => console.log(`Server is on port:${port}`));
// //   // return app;
// //   await db.sync();
// //     app.listen(port, () => {
// //         console.log(`Server is running on port ${port}`);
// //     });
// //     return app;
// // };

// // const configureApp = async (port) => {
// //   // setupMiddleWare(app);
// //   setupRoutes(app);
// //   return await startServer(app, port);
// // };

// // configureApp(port);

// app.use(express.json());

// app.use("/api", require("./api"));
// .3
// app.get('/api',(req,res)=>{ 
//   res.send(`<h5 style="color:green"> 
//       Hey Geek! you just deployed serverless express api</h5>`) 
// }) 
// app.listen(port,()=>{ 
//   console.log(`Server started at http://localhost:${port}`) 
// }) 

// module.exports = app;
