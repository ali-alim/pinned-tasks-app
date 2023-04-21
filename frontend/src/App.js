import React, { useState, lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./app.scss";
const Archive = lazy(() => import("./Pages/Archives/Archive"));
const Register = lazy(() => import("./components/Register"));
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Topic = lazy(() => import("./Pages/Topics/Topic"));
const Archives = lazy(() => import("./Pages/Archives"));
const Login = lazy(() => import("./components/Login"));
const Task = lazy(() => import("./Pages/Tasks/Task"));
const Topics = lazy(() => import("./Pages/Topics"));
const PinMap = lazy(() => import("./Pages/PinMap"));
const Tasks = lazy(() => import("./Pages/Tasks"));
const Home = lazy(() => import("./Pages/Home"));

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
    <div style={{ minHeight: "100vh", position: "relative"}}>
      {currentUsername ? (
        <div className="logout-div">
          <span style={{ fontSize: 17, fontWeight: 800 }}>
            Hi,{" "}
            <span style={{ color: "slateblue" }}>
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
      <div style={{ height: 50 }} />
      {currentUsername ? <Header /> : null}
      <Suspense
        fallback={
          <div style={{ marginLeft: 24, marginTop: 30 }}>Loading...</div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<Home currentUsername={currentUsername} />}
          />
          <Route
            path="/tasks"
            element={currentUsername ? <Tasks /> : <Home />}
          />
          <Route
            path="/tasks/:id/edit"
            element={currentUsername ? <Task /> : <Home />}
          />
          <Route
            path="/pins"
            element={currentUsername ? <PinMap /> : <Home />}
          />
          <Route
            path="/topics"
            element={currentUsername ? <Topics /> : <Home />}
          />
          <Route
            path="/topics/:id/edit"
            element={currentUsername ? <Topic /> : <Home />}
          />
          <Route
            path="/archives"
            element={currentUsername ? <Archives /> : <Home />}
          />
          <Route
            path="/archives/:id/edit"
            element={currentUsername ? <Archive /> : <Home />}
          />
          <Route
            path="/login"
            element={
              <Login
                currentUsername={currentUsername}
                setCurrentUsername={setCurrentUsername}
                myStorage={myStorage}
              />
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      {currentUsername ? <Footer /> : null}
    </div>
  );
}

export default App;
