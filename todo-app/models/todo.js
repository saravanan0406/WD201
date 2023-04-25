"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static getTodo() {
      return this.findAll();
    }

    static overdueTodoItems(userId) {
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static duetodayTodoItems(userId) {
      return this.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static markAsCompletedItems(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static duelaterTodoItems(userId) {
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: false,
          userId,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    deleteTodo({ todo }) {
      return this.destroy({
        where: {
          id: todo,
        },
      });
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    setCompletionStatus(boolean) {
      return this.update({ completed: boolean });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
