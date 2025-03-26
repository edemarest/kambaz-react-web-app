import { useState, useEffect } from "react";
import * as client from "./client";
import { FormControl, ListGroup } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const fetchTodos = async () => {
        const todos = await client.fetchTodos();
        setTodos(todos);
    };
    const createTodo = async () => {
        const todos = await client.createTodo();
        setTodos(todos);
    };
    const postTodo = async () => {
        const newTodo = await client.postTodo({ title: "New Posted Todo", completed: false, });
        setTodos([...todos, newTodo]);
    };
    const deleteTodo = async (todo: any) => {
        await client.deleteTodo(todo);
        const newTodos = todos.filter((t) => t.id !== todo.id);
        setTodos(newTodos);
    };
    const editTodo = (todo: any) => {
        const updatedTodos = todos.map(
            (t) => t.id === todo.id ? { ...todo, editing: true } : t);
        setTodos(updatedTodos);
    };
    const updateTodo = async (todo: any) => {
        await client.updateTodo(todo);
        setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    };
    useEffect(() => {
        fetchTodos();
    }, []);
    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            <h4>Todos  <FaPlusCircle onClick={createTodo} className="text-success float-end fs-3"
                id="wd-create-todo" />
                <FaPlusCircle onClick={postTodo} className="text-primary float-end fs-3 me-3" id="wd-post-todo" />
            </h4>
            <ListGroup>
                {todos.map((todo) => (
                    <ListGroup.Item key={todo.id}>
                        <FaPencil onClick={() => editTodo(todo)} className="text-primary float-end me-2 mt-1" />
                        <FaTrash onClick={() => client.removeTodo(todo)}
                            className="text-danger float-end mt-1" id="wd-remove-todo" />
                        <TiDelete onClick={() => deleteTodo(todo)} className="text-danger float-end me-2 fs-3" id="wd-delete-todo" />
                        <input type="checkbox" className="form-check-input me-2"
                            defaultChecked={todo.completed} onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />
                        {!todo.editing ? (
                            <span
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            >
                                {todo.title}
                            </span>
                        ) : (
                            <FormControl
                                className="w-50 float-start"
                                value={todo.title}
                                onChange={(e) => {
                                    const updated = todos.map((t) =>
                                        t.id === todo.id ? { ...t, title: e.target.value } : t
                                    );
                                    setTodos(updated);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        updateTodo({ ...todo, editing: false });
                                    }
                                }}
                                onBlur={() => updateTodo({ ...todo, editing: false })}
                            />
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup> <hr />
        </div>
    );
}
