const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo App", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy water",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Marks  as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy water",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/markASCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Fetches all todos", async () => {
    await agent.post("/todos").send({
      title: "Buy car",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy bike",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(4);
    expect(parsedResponse[3]["title"]).toBe("Buy bike");
  });

  test("Deletes a todo with the given ID", async () => {
    // FILL IN YOUR CODE HERE
    const response = await agent.post("/todos").send({
      title: "Buy Cycle",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(parsedResponse.id).toBeDefined();

    const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
    const parsedUpdateResponse = JSON.parse(deleteResponse.text);
    expect(parsedUpdateResponse).toBe(true);
  });
});
