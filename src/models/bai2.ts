import { useState, useEffect } from 'react';

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export default function bai2Model() {
    // Initialize todos from localStorage if available
    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const storedTodos = localStorage.getItem('todos');
            return storedTodos ? JSON.parse(storedTodos) : [];
        } catch (error) {
            console.error('Failed to parse todos from localStorage', error);
            return [];
        }
    });

    // Sync todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            text,
            completed: false,
        };
        setTodos((prev) => [...prev, newTodo]);
    };

    const deleteTodo = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const editTodo = (id: number, newText: string) => {
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
        );
    };

    const toggleTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    return {
        todos,
        addTodo,
        deleteTodo,
        editTodo,
        toggleTodo,
    };
};
