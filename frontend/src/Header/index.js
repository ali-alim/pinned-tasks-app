import "./../app.css";

const Header = ({ setShowPins, setShowTasks }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        margin: "20px 0px",
      }}
    >
      <div>
        <button
          className="pins-button"
          onClick={() => {
            setShowPins(true);
            setShowTasks(false);
          }}
        >
          PINS
        </button>
      </div>
      <div>
        <button
          className="tasks-button"
          onClick={() => {
            setShowTasks(true);
            setShowPins(false);
          }}
        >
          TASKS
        </button>
      </div>
    </div>
  );
};

export default Header;
