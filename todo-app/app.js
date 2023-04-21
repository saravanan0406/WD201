const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { Model, Op } = require("sequelize");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
var csurf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const user = require("./models/user");

const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csurf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(flash());
app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        })
        .catch((error) => {
          return done(null, false, {
            message: "Account doesn't exist",
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(" user session Serializing", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Saravanan Todo-Manager",
    "csrfToken": request.csrfToken(),
  });
});


app.get("/todos",
connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  const loggedInUser = request.user.id;
  const overdueTodo = await Todo.overdueTodoItems(loggedInUser);
  const duetodayTodo = await Todo.duetodayTodoItems(loggedInUser);
  const duelaterTodo = await Todo.duelaterTodoItems(loggedInUser);
  const completedTodo = await Todo.markAsCompletedItems(loggedInUser);

  if (request.accepts("html")) {
    response.render("index", {
      title: "Saravanan Todo app",
      overdueTodo,
      duelaterTodo,
      duetodayTodo,
      completedTodo,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ overdueTodo, duetodayTodo, duelaterTodo });
  }
});


app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    "csrfToken": request.csrfToken(), //prettier-ignore
  });
});


app.get("/signout", (request, response) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get("/login", (request, response) => {
  response.render("login", {
    title: "Login",
    "csrfToken": request.csrfToken(), //prettier-ignore
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  }
);


app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(error);
      }
      response.redirect("todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.post("/todos",
connectEnsureLogin.ensureLoggedIn(),
async function (request, response)
{ 
console.log(request.user);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.get("/todos", async function (_request, response) {
  try {
    const todo = await Todo.getTodo();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.delete("/todos/:id",
connectEnsureLogin.ensureLoggedIn(),
async function (request, response) {
  console.log("We have to delete a Todo: ", request.params.id);

  try {
    await Todo.remove(request.params.id);
    return response.json(true);
  } catch (error) {
    return response.status(422).json(error);
  }
});

app.put("/todos/:id",
connectEnsureLogin.ensureLoggedIn(),
async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted",
connectEnsureLogin.ensureLoggedIn(),
async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
