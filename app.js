require("dotenv").config();

const express = require("express");
const sass = require("node-sass-middleware");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const AppError = require("./middlewares/appError");
const globalErrorHandler = require("./controllers/errorController");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRoutes");

const app = express();

// Middlewares

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

app.use(
  session({
    secret: "my secret",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(flash());

app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new AppError("not found", 404));
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

//Handling unhandle routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Routes not found. Can't find ${req.originalUrl} on this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("serving on port 4000");
});
