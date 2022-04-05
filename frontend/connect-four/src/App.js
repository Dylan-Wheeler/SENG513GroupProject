import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import NewAccount from "./pages/NewAccount";
import Home from "./pages/Home";
import InGame from "./pages/InGame";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<NewAccount />} />
                <Route path="/home" element={<Home />} />
                <Route path="/in-game" element={<InGame />} />
            </Routes>
        </div>
    );
}

export default App;
