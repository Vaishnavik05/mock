import { useState } from "react";
import api from "../services/api";
import "./AddMember.css";

function AddMember() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const save = async () => {
        await api.post("/members", {
            name,
            email,
            phone
        });

        alert("Member Added");
    };

    return (
        <div className="form-box">
            <h2>Add Member</h2>

            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={save}>
                Save
            </button>
        </div>
    );
}

export default AddMember;