const Tasks = ({ pins, showCompleted = false }) => {
  const sortedArr = pins.sort((a, b) => new Date(a.time) - new Date(b.time));
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const tomorrow = new Date(today.getDate() + 1);
  const generateBorderColor = (pin) => {
    return new Date(pin.time).toDateString() === today.toDateString()
      ? "1px solid #D25E8F"
      : new Date(pin.time).toDateString() < tomorrow.toDateString()
      ? "1px solid #B877D4"
      : "1px solid #49D8BE";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!showCompleted
        ? sortedArr
            .filter((pin) => pin.completed !== true)
            .map((pin, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  border: generateBorderColor(pin),
                  padding: 15,
                  margin: "15px 20px",
                }}
              >
                <strong>Task:</strong> {pin.desc.substring(0, 31)}
                <br />
                <strong>Place:</strong> {pin.title}
                <br />
                <strong>Time:</strong> {new Date(pin.time).toLocaleDateString()}
                {new Date(pin.time).toDateString() === today.toDateString() ? (
                  <span style={{ color: "#D25E8F", marginLeft: 5 }}>Today</span>
                ) : new Date(pin.time).toDateString() <
                  tomorrow.toDateString() ? (
                  <span style={{ color: "#B877D4", marginLeft: 5 }}>
                    Tomorrow
                  </span>
                ) : (
                  <span style={{ color: "#49D8BE", marginLeft: 5 }}>
                    {daysOfWeek[new Date(pin.time).getDay()]}
                  </span>
                )}
              </div>
            ))
        : pins
            .filter((pin) => pin.completed === true)
            .map((pin, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  border: "1px solid black",
                  padding: 15,
                  margin: "15px 20px",
                }}
              >
                <strong>Task:</strong> {pin.desc.substring(0, 31)}
                <br />
                <strong>Place:</strong> {pin.title}
                <br />
                <strong>Time:</strong> {new Date(pin.time).toLocaleDateString()}
              </div>
            ))}
    </div>
  );
};

export default Tasks;
