import { useState } from "react";
import api from "../services/api";
import "./AddBook.css";

function AddBook() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const save = async () => {
        await api.post("/books", {
            title,
            author,
            availability: true
        });

        alert("Book Added");
    };

    return (
        <div className="form-box">
            <h2>Add Book</h2>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />

            <button onClick={save}>
                Save
            </button>
        </div>
    );
}

export default AddBook;