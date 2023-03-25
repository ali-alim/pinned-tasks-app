import "./../app.css";

const Header = ({ setShowPins, setShowTasks, setShowCompleted }) => {
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
            setShowCompleted(false);
          }}
        >
          PINS
        </button>
      </div>
      <div>
        <button
          className="completed-button"
          onClick={() => {
            setShowPins(false);
            setShowTasks(false);
            setShowCompleted(true);
          }}
        >
          COMPLETED
        </button>
      </div>
      <div>
        <button
          className="tasks-button"
          onClick={() => {
            setShowTasks(true);
            setShowPins(false);
            setShowCompleted(false);
          }}
        >
          TASKS
        </button>
      </div>
    </div>
  );
};

export default Header;
