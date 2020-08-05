import React, { useState, useEffect } from 'react';
import "./todolist.css";
import axios from 'axios';
import { faTrash,faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div
      className="list-group-item"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      <input type="checkbox" className="check_box" defaultChecked={todo.isCompleted} onClick={() => completeTodo(index)}/>
      {todo.todolist_text}
      <a onClick={() => removeTodo(todo.id)} className="close"><FontAwesomeIcon icon={faTrash}/></a>
      <a className="close"> <FontAwesomeIcon icon={faPen} /></a>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="form_todo">
      <input
        type="text"
        className="form-control" placeholder="Input task name then tap Enter add"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    gettodolist();
  }, []);

  const gettodolist = async () => {
    const result = await axios(
      'https://todolisttest-heroku.herokuapp.com/todo/todolist',
    );

    setTodos(result.data.rows);
  };

  const addTodo = todolist_text => {
    axios.post(`https://todolisttest-heroku.herokuapp.com/todo/todolist`, { todolist_text:todolist_text })
    .then(res => {
      gettodolist();
    })
  };

  const completeTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    const data = { 
      todolist_text:newTodos[index].todolist_text,
      isCompleted:newTodos[index].isCompleted 
    }
    axios.put(`https://todolisttest-heroku.herokuapp.com/todo/todolist/${newTodos[index]['id']}`,data)
    .then(res => {
      setTodos(newTodos);
    })
  };

  const removeTodo = id => {
    axios.delete(`https://todolisttest-heroku.herokuapp.com/todo/todolist/${id}`)
    .then(res => {
      gettodolist();
    })
  };

  return (
    <div className="app"> 
      <div className="container">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center header_todo">My Todo</h5>
            <TodoForm addTodo={addTodo} />
            {todos.map((todo, index) => (
              <Todo
                key={index}
                index={index}
                todo={todo}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;