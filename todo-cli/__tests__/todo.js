const todoList = require("../todo");
const { all, markAsComplete, add, dueLater, dueToday, overdue } = todoList();
describe("Todolist", () => {
  beforeAll(() => {
    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
  });
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  var date = new Date();
  const tod = formattedDate(date);
  const yod = formattedDate(new Date(new Date().setDate(date.getDate() - 1)));
  const tow = formattedDate(new Date(new Date().setDate(date.getDate() + 1)));
  /* eslint-disable no-undef */
  test("add", () => {
    const todocount = all.length;
    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
    expect(all.length).toBe(todocount + 1);
  });
  test("complete item", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("overdue item", () => {
    add({
      title: "Test Todo",
      completed: false,
      dueDate: yod,
    });
    add({
      title: "Test",
      completed: false,
      dueDate: yod,
    });
    add({
      title: "Todo",
      completed: false,
      dueDate: yod,
    });
    expect(overdue().length).toBe(3);
  });
  test("today item", () => {
    add({
      title: "Test Todo",
      completed: false,
      dueDate: tod,
    });
    add({
      title: "Test",
      completed: false,
      dueDate: tod,
    });
    add({
      title: "Todo",
      completed: false,
      dueDate: tod,
    });
    expect(dueToday().length).toBe(5);
  });
  test("later item", () => {
    add({
      title: "Test Todo",
      completed: false,
      dueDate: tow,
    });
    add({
      title: "Test",
      completed: false,
      dueDate: tow,
    });
    add({
      title: "Todo",
      completed: false,
      dueDate: tow,
    });
    expect(dueLater().length).toBe(3);
  });
});
