import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    fetch(`${API_BASE}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("What?: ", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(`${API_BASE}/todo/complete/${id}`).then((res) =>
      res.json()
    );
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.isCompleted = data.isCompleted;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const confirm = window.confirm(
      "Do you really want to delete this task?"
    );
    if (!confirm) return;
    await fetch(`${API_BASE}/todo/delete/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    setTodos((todos) => todos.filter((todo) => todo._id !== id));
  };

  const addTodo = async () => {
    if (!newTodo) return alert("Check again!");
    const data = await fetch(`${API_BASE}/todo/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo }),
    }).then((res) => res.json());
    setTodos((todos) => [...todos, data]);
    setNewTodo("");
    setPopupActive(false);
  };

  return (
    <div className="App">
      <h1>Kenstate, Allied</h1>
      <h4>Schedule Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={`todo ${todo.isCompleted ? "is-completed" : ""}`}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(!popupActive)}>
        +
      </div>
      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div id="content">
            <h3>Enter a task to perform</h3>
            <input
              type="text"
              id="input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <button id="button" onClick={addTodo}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
