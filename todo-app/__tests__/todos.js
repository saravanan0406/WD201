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
        await db.sequelize.close();
        server.close(); 
    })
    test("Creates a todo and response", async () => {
        const response = await agent.post("/todos").send({
          title: "Buy bike",
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
      test("Marks as complete", async () => {
        const response = await agent.post("/todos").send({
          title: "Buy water",
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
      test('Fetching the all todos', async () => {
         await agent.post("/todos").send({
            title: "Buy ship",dueDate: new Date().toISOString(),completed: false,
          });
          await agent.post("/todos").send({
            title: "Buy bullet",dueDate: new Date().toISOString(),completed: false,
          });
          await agent.post("/todos").send({
            title: "Buy flight",dueDate: new Date().toISOString(),completed: false,
          });
          const resp= await agent.get("/todos");
          const parse = JSON.parse(resp.text);
      
          expect(parse.length).toBe(5);
          expect(parse[3]["title"]).toBe("Buy bullet");
      });
      test('Deletes an existing to-do', async () => {
        const response = await agent.post("/todos").send({
          title: "Buy a bike",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        const parsedResponse = JSON.parse(response.text);
        const todo = parsedResponse.id;
    
        const res = await request(app).delete(`/todos/${todo}`);
        expect(res.body).toBe(true);

        const responds = await request(app).delete(`/todos/23324`);
        expect(responds.body).toBe(false);
      });
})