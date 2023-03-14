const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;
describe("Todo test",()=>{
    beforeAll(async ()=>{
        await db.sequelize.sync({force: true });
        server = app.listen(3000,()=>{});
        agent = request.agent(server);
    });
    afterAll(async ()=>{
      try {
        await db.sequelize.close();
        server.close();
      } catch (error) {
        console.log(error);
      }
         
    });
    test("Creates a todo and responds with json at /todos POST endpoint", async () => {
        const response = await agent.post("/todos").send({
          title: "Buy milk",
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
      test("Marks a todo with the given ID as complete", async () => {
        const response = await agent.post("/todos").send({
          title: "Buy milk",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        const parsedResponse = JSON.parse(response.text);
        const todoID = parsedResponse.id;
    
        expect(parsedResponse.completed).toBe(false);
    
        const changeTodo = await agent
        .put(`/todos/${todoID}/markAsCompleted`)
        .send();
      const parseUpadteTodo = JSON.parse(changeTodo.text);
      expect(parseUpadteTodo.completed).toBe(true);
      });
      test('Fetching the all todos in the database', async () => {
         await agent.post("/todos").send({
            title: "Buy Gun",dueDate: new Date().toISOString(),completed: false,
          });
          await agent.post("/todos").send({
            title: "Buy Bullet",dueDate: new Date().toISOString(),completed: false,
          });
          await agent.post("/todos").send({
            title: "Buy Target",dueDate: new Date().toISOString(),completed: false,
          });
          const resp= await agent.get("/todos");
          const parse = JSON.parse(resp.text);
      
          expect(parse.length).toBe(4);
          expect(parse[3]["title"]).toBe("Buy Bullet");
      });
      test('Deletes an existing to-do and returns true', async () => {
        const response = await agent.post("/todos").send({
          title: "Buy a Awm",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        const parsedResponse = JSON.parse(response.text);
        const todo = parsedResponse.id;
    
        const res = await request(app).delete(`/todos/${todo}`);
        expect(res.body).toBe(true);

        const responds = await request(app).delete(`/todos/23224`);
        expect(responds.body).toBe(false);
      });
})