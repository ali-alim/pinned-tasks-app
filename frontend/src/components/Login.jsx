import { useNavigate } from "react-router-dom";
import { Room } from "@material-ui/icons";
import { useRef, useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login({
  currentUsername,
  setCurrentUsername,
  myStorage,
}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/users/login",
        user
      );
      setCurrentUsername(res.data.username);
      myStorage.setItem("user", res.data.username);
      navigate.push("/");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div style={{ display: `${currentUsername ? "none" : "block"}` }}>
      <div className="loginContainer">
        <div className="logo">
          <Room className="logoIcon" />
          <span>Pinned Tasks App</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input autoFocus placeholder="username" ref={usernameRef} />
          <input
            type="password"
            min="6"
            placeholder="password"
            ref={passwordRef}
          />
          <button className="loginBtn" type="submit">
            Login
          </button>
          {error ? (
            <span className="failure">Something went wrong!</span>
          ) : null}
        </form>
      </div>
    </div>
  );
}
