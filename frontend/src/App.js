import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Header from "./components/Header";
import Login from "./components/Login";
import PinMap from "./Pages/PinMap";
import Tasks from "./Pages/Tasks";
import Home from "./Pages/Home";
import "./app.css";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {currentUsername ? (
        <div className="logout-div">
          <span style={{ fontSize: 17, fontWeight: 800 }}>
            Hi,{" "}
            <span style={{ color: "tomato" }}>
              {currentUsername.toUpperCase()}!
            </span>
          </span>
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="buttons">
          <Link to="/login">
            <button className="button login">Log in</button>
          </Link>
          <Link to="/register">
            <button className="button register">Register</button>
          </Link>
        </div>
      )}
      <div style={{ height: 40 }} />
      {currentUsername ? <Header /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={currentUsername ? <Tasks /> : <Home />} />
        <Route path="/pins" element={currentUsername ? <PinMap /> : <Home />} />
        <Route
          path="/login"
          element={ <Login currentUsername={currentUsername} setCurrentUsername={setCurrentUsername} myStorage={myStorage} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
