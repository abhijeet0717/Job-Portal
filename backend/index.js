import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js"
import path from "path";

dotenv.config();
//by hitesh --> shuould use the hitesh one(by providing the parth)
// dotenv.config({
//     path: './.env'
// })
//dotenv is used to access the environment variables

// connect db
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();

const _dirname = path.resolve();


// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials:true
}
app.use(cors(corsOptions));

// api's route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//for hosting purpose as it serve the react build file (index.html which is generated in frontend/dist)

//first express.staic will work (as middleware) ,is the file is present in the dist folder, then it will serve it to the browser 
//the response can only be sent once (either by express.static or by app.get)
// so if the file is present in the dist folder, then it will serve it to the browser (and not go to the app.get) as returned from there
//if not then will go to the app.get and serve the index.html file
app.use(express.static(path.join(_dirname, "/frontend/dist"))); // it serve this folder to the broweser ( now browser have all the content)
//if not use, then only index.html will be avaible the js and css will not present
//so will give error, as when index.html will try to access the js and css file, it will not be present as it is not served to the browser
// <script type="module" crossorigin src="/assets/index-DstpddhA.js"></script> --> it wil send the the request to the server for this file ( it will be returned from the express.static as presnent in the build folder)
//<link rel="stylesheet" crossorigin href="/assets/index-D8b4DHJx.css"> --> again it will send the request to the server for this file ( it will be returned from the express.static as presnent in the build folder)

// but now since we are using express.static, it will serve the js and css file to the browser (and not give error)
//same as npx serve ( to serve the folder over the sever) --> to access the folder we need to write the path of the folder
//same is done by live server extension in vs code ( it serve the folder over the server)
//ex: ( for every file , we send the request to the server and it will return the file to the browser)
//that is the cause of waterfalling problem in react ( as first it will get index.html and then it will get the js and css file)
// 4/19/2025 11:24:46 AM ::1 GET /backend/src/index.html
// HTTP  4/19/2025 11:24:46 AM ::1 Returned 301 in 3 ms
// HTTP  4/19/2025 11:24:46 AM ::1 GET /backend/src/index
// HTTP  4/19/2025 11:24:46 AM ::1 Returned 301 in 1 ms
// HTTP  4/19/2025 11:24:46 AM ::1 GET /backend/src
//https://expressjs.com/en/starter/static-files.html
// For example, use the following code to serve images, CSS files, and JavaScript files in a directory named public:

// app.use(express.static('public'))
// Now, you can load the files that are in the public directory:

// http://localhost:3000/images/kitten.jpg
// http://localhost:3000/css/style.css
// http://localhost:3000/js/app.js
// http://localhost:3000/images/bg.png
// http://localhost:3000/hello.html



//this serves the index.html to every url ( now the code inside it handle it ,when to show login page , home page etc)
// the react router will handle it ( as react is single page website)
//the react router will change the contenet of index.html accoring to url we visit)
app.get('*', (_,res) => {//browser only send the GET request to the server automatically when we visit the url
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
//we use same concept AWS in S3 storage, we always send index.html to request
//This ensures that when users directly access routes like /about or /profile (or refresh these pages), 
// the server returns the main index.html file rather than a 404 error ( as it try to find in dist/about)

//summary:
//1. express.static serves the static files (js, css, images) to the browser and if the file is not present in the dist folder, then it will call the app.get('*') , else it will return the file and due to return it not go to the app.get('*')
//2. app.get('*') --> when the file is not found by express.static, it will call the app.get('*') and return the index.html file to the browser (and react router will handle it from there)
// it is same  error pages of aws ( if the page is not found, it will return the index.html file and react router will handle it from there)
//express.static as S3 storage which serve the static file

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
