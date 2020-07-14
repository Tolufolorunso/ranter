const express = require("express");
const sass = require("node-sass-middleware");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const { appTime, globalError } = require("./middlewares/middleware");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRoutes");

const app = express();

// // Middlewares
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  sass({
    src: __dirname + "/sass",
    dest: __dirname + "/public",
    debug: true,
    outputStyle: "compressed",
    prefix: "/stylesheets",
  })
);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((c) => console.log("DATABASE connection successfull"))
  .catch(() => console.log("not connected to db"));

// app.use(globalError);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("serving on port 4000");
});
