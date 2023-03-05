const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }

    function isDuesToday(dueDate){
        const today = new Date().toISOString().split("T")[0];
        return (
            dueDate == today
        );
    }
    function toString(all) {
        const dueDate = isDuesToday(all.dueDate)
        ? ""
        : all.dueDate;
        const status = all.completed ? "[x]" : "[ ]";
        return `${status} ${all.title} ${dueDate}`;
    }
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      return all.filter(
        (todo) => todo.dueDate <new Date().toISOString().split("T")[0]
      )
    }
  
    const dueToday = () => {
          // of overdue items accordingly.
      return all.filter(
        (todo) => todo.dueDate === new Date().toISOString().split("T")[0]
      )
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
    }
  
    const dueLater = () => {
          // of overdue items accordingly.
      return all.filter(
        (todo) => todo.dueDate > new Date().toISOString().split("T")[0]
      )
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
    }
  
    const toDisplayableList = (list) => {
        return list.map((todo)=> toString(todo)).join("\n");
      // Format the To-Do list here, and return the output string
      // as per the format given above.
    }
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
module.exports = todoList;