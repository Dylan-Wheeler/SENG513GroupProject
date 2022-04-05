import React, { useState } from "react";
import "../index.scss";

export default function LoginHolder() {
    const [loginUsername, setloginUsername] = useState("");
    const [loginPassword, setloginPassword] = useState("");

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
                value={loginUsername}
                onChange={(evt) => setloginUsername(evt.target.value)}
            />
            <button className="login--button">Sign Up</button>
            <button className="login--new-account-button">
                Make a New Account
            </button>
        </div>
    );
}
