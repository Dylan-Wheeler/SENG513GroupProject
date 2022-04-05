import React, { useState } from "react";
import "../index.scss";
import { useNavigate } from "react-router-dom";

export default function LoginHolder() {
    const [loginUsername, setloginUsername] = useState("");
    const [loginPassword, setloginPassword] = useState("");

    const navigation = useNavigate();

    return (
        <div className="login--holder">
            <h1 className="login--title">Login</h1>
            <p className="login--username-label login--label">Username</p>
            <input
                className="login--input"
                type="text"
                value={loginUsername}
                onChange={(evt) => setloginUsername(evt.target.value)}
            />
            <p className="login--password-label login--label">Password</p>
            <input
                className="login--input"
                type="text"
                value={loginPassword}
                onChange={(evt) => setloginPassword(evt.target.value)}
            />
            <button className="login--button">Let's Play!</button>
            <button
                className="login--new-account-button"
                onClick={() => navigation("/signup")}>
                Make a New Account
            </button>
        </div>
    );
}
