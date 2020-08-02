import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './todolist.css';
import { faTrash,faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function TodoApp() {
  const [data, setData] = useState({ todoitem: [] });
  const [id, setId] = useState();
  useEffect(() => {
    gettodolist();
  }, []);

  const gettodolist = async () => {
    const result = await axios(
      'https://todolisttest-heroku.herokuapp.com/todo/todolist',
    );

    setData({ 
      todoitem: result.data.rows 
    });
  };

  const addItem = e => {
    const txt_list = e.target.value;
    if (e.key === 'Enter') {
      axios.post(`https://todolisttest-heroku.herokuapp.com/todo/todolist`, { todolist_text:txt_list })
      .then(res => {
        gettodolist();
      })
    }
  };

  const deleteItem = (id) => {
    axios.delete(`https://todolisttest-heroku.herokuapp.com/todo/todolist/${id}`)
    .then(res => {
      gettodolist();
    })
  }

  const itemDone = (id) => {
    axios.put(`https://todolisttest-heroku.herokuapp.com/todo/todolist/${id}`)
    .then(res => {
      gettodolist();
    })
  }

      return (
        <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center">My Todo</h5>
            <input type="text" className="form-control" placeholder="Input task name then tap Enter add" onKeyPress={addItem}/>
            <ul className="ul_custom">
              {data.todoitem.map(item => (
                <li className="list-group-item" key={item.id}>
                  <div className="item_todo ">
                    <input type="checkbox" className="form-check-input " onClick={() => itemDone(item.id)}/> <input type="text" className="test" defaultValue={item.todolist_text}/>
                    <a className="close" onClick={() => deleteItem(item.id)}> <FontAwesomeIcon icon={faTrash}/></a>
                    <a className="close"> <FontAwesomeIcon icon={faPen} /></a>
                  </div>
                </li>     
              ))}
            </ul>
        </div>
      </div>

      )
  }
  
  export default TodoApp;
  