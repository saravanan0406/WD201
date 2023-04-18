const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { Todo } = require("./models");
const path = require("path");
var cookieParser = require("cookie-parser");
var csurf = require("tiny-csrf");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser("shh! some secret string"));
app.set("view engine", "ejs");
app.use(csurf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.get("/", async (request, response) => {
  const overdueTodo = await Todo.overdueTodoItems();
  const duetodayTodo = await Todo.duetodayTodoItems();
  const duelaterTodo = await Todo.duelaterTodoItems();
  const completedTodo = await Todo.markAsCompletedItems();

  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo application",
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

app.get("/todos", async function (_request, response) {
  try {
    const todo = await Todo.getTodo();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  try {
    await Todo.remove(request.params.id);
    return response.json(true);
  } catch (error) {
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
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
