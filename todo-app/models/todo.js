'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static asso(models) {
      // define association here
    }
    static Todosget() {
      return this.findAll({ order: [["id", "ASC"]] });
    }
    static Todoadd({title,dueDate}){
      return this.create({title: title,dueDate: dueDate,completed: false})
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    delete() {
      return this.destroy();
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};