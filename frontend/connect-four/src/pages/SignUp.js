import React, { useState } from "react";
import "../index.scss";
import Chevron from "../assets/chevron.svg";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [newAccountUsername, setnewAccountUsername] = useState("");
    const [newAccountPassword, setnewAccountPassword] = useState("");

    const navigation = useNavigate();

    return (
        <div className="login--page">
            <div className="login--holder">
                <h1 className="login--title">New Account</h1>
                <p className="login--username-label login--label">Username</p>
                <input
                    className="login--input"
                    type="text"
                    value={newAccountUsername}
                    onChange={(evt) => setnewAccountUsername(evt.target.value)}
                />
                <p className="login--password-label login--label">Password</p>
                <input
                    className="login--input"
                    type="text"
                    value={newAccountPassword}
                    onChange={(evt) => setnewAccountPassword(evt.target.value)}
                />
                <button className="login--button">Sign Up</button>
                <button
                    className="login--new-account-button login--return-button"
                    onClick={() => navigation("/login")}>
                    <img
                        className="login--return-icon"
                        src={Chevron}
                        alt="return to login"
                    />
                </button>
            </div>
        </div>
    );
}
