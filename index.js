const path = require("path");
const express = require("express");
const { connectToMongoDB } = require("./database");
const { fileURLToPath } = require("url");
const session = require("express-session");
const globalData = require("./middlewares/globalData")

const app = express();
const PORT = 3002;
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 }, // use 'true' if you're using HTTPS
  }),
);

// Routes
const studentRoute = require("./routers/student");
const adminRouter = require("./routers/admin")
const syllabusRouter = require("./routers/syllabusEtc")

connectToMongoDB("mongodb://127.0.0.1:27017/school-mgmt-sys").then(() =>
  console.log("MongoDB Connected"),
);

app.use(express.urlencoded({ extended: false }));
app.use(globalData)
// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/", studentRoute);
app.use("/", adminRouter);
app.use("/", syllabusRouter);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
