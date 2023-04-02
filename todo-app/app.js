const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { Model, Op } = require("sequelize");


app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodo = await Todo.gettodotest();
  if (request.accepts("html")) {
    response.render("index", { allTodo });
  } else {
    response.json(allTodo);
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async function (_request, response) {
  try {
    const todo = await Todo.gettodotest();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addtodotest(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {

  const todo = await Todo.findByPk(request.params.id);
  try {
    const deleteTodo = await todo.deleteTodo({ todo: request.params.id });
    return response.send(true);
  } catch (error) {
    console.log(error);
    return response.send(false);
  }
});

module.exports = app;
