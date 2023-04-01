import { Fragment, useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import { Room } from "@material-ui/icons";
import Register from "./components/Register";
import Login from "./components/Login";
import Tasks from "./Tasks";
import Header from "./Header";
import AddNewTaskForm from "./Tasks/AddNewTaskForm";
import "./app.css";
import { Notify } from "./components/common/Notify";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 41.716667,
    longitude: 44.783333,
    zoom: 12,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [startTime, setStartTime] = useState("2023-01-01");
  const [endTime, setEndTime] = useState("2023-12-31");
  const [pinsLoading, setPinsLoading] = useState(false);

  const getPins = async () => {
    try {
      setPinsLoading(true);
      const allPins = await axios.get(process.env.REACT_APP_API_URL + "/pins");
      setPins(allPins.data);
      setPinsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      getPins();
    }
  }, [refreshData]);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handlePinDelete = async (id) => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_API_URL + `/pins/${id}`
      );
      if (res) {
        Notify({
          type: "success",
          title: "Notify",
          message: "Pin was successfully deleted",
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      Notify({
        type: "error",
        title: "title",
        message: "message",
      });
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Header
        setShowPins={setShowPins}
        setShowTasks={setShowTasks}
        setShowCompleted={setShowCompleted}
      />
      <div style={{ height: 50 }} />
      <hr
        style={{
          margin: "20px 20px",
          color: `${showTasks ? "#49d8be" : "#d25e8f"}`,
        }}
      />
      {showPins ? (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          width="100%"
          height="100%"
          transitionDuration="200"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={(viewport) => setViewport(viewport)}
          onDblClick={currentUsername && handleAddClick}
        >
          {pins
            .filter(
              (pin) =>
                pin.user === currentUsername &&
                pin.completed !== true &&
                moment(pin.time).format(dateFormat) >= startTime &&
                moment(pin.time).format(dateFormat) <= endTime
            )
            .map((pin, i) => (
              <Fragment key={i}>
                <Marker
                  latitude={pin.lat}
                  longitude={pin.long}
                  offsetLeft={-3.5 * viewport.zoom}
                  offsetTop={-7 * viewport.zoom}
                >
                  <Room
                    style={{
                      height: 300,
                      fontSize: 7 * viewport.zoom,
                      color:
                        currentUsername === pin.user ? "tomato" : "slateblue",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleMarkerClick(pin._id, pin.lat, pin.long)
                    }
                  />
                </Marker>
                {pin._id === currentPlaceId && (
                  <Popup
                    className="popup"
                    key={pin._id}
                    latitude={pin.lat}
                    longitude={pin.long}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setCurrentPlaceId(null)}
                    anchor="bottom-left"
                  >
                    <AddNewTaskForm
                      pin={pin}
                      pins={pins}
                      setPins={setPins}
                      setCurrentPlaceId={setCurrentPlaceId}
                      setRefreshData={setRefreshData}
                      refreshData={refreshData}
                      currentUsername={currentUsername}
                      newPlace={newPlace}
                      setNewPlace={setNewPlace}
                      handlePinDelete={handlePinDelete}
                    />
                  </Popup>
                )}
              </Fragment>
            ))}
          {newPlace && (
            <>
              <Marker
                latitude={newPlace.lat}
                longitude={newPlace.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: "tomato",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setNewPlace(null)}
                anchor="bottom-left"
              >
                  <AddNewTaskForm
                    newPlace={newPlace}
                    setNewPlace={setNewPlace}
                    pins={pins}
                    setPins={setPins}
                    currentUsername={currentUsername}
                    refreshData={refreshData}
                    setRefreshData={setRefreshData}
                  />
              </Popup>
            </>
          )}
          {currentUsername ? (
            <div>
              <div style={{ marginTop: 10, marginLeft: 20 }}>
                <RangePicker
                  onChange={(e) => {
                    if (e === null) {
                      setStartTime("2023-01-01");
                      setEndTime("2023-12-31");
                    } else {
                      setStartTime(e[0].format(dateFormat));
                      setEndTime(e[1].format(dateFormat));
                    }
                  }}
                />
              </div>
              <button className="button logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="buttons">
              <button
                className="button login"
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
              >
                Log in
              </button>
              <button
                className="button register"
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
              >
                Register
              </button>
            </div>
          )}
          {showRegister && !showLogin && (
            <Register setShowRegister={setShowRegister} />
          )}
          {showLogin && !showRegister && (
            <Login
              setShowLogin={setShowLogin}
              setCurrentUsername={setCurrentUsername}
              myStorage={myStorage}
            />
          )}
        </ReactMapGL>
      ) : null}
      {showCompleted || showTasks ? (
        <Tasks
          setPins={setPins}
          currentUsername={currentUsername}
          pins={pins}
          showCompleted={showCompleted}
          pinsLoading={pinsLoading}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          handlePinDelete={handlePinDelete}
        />
      ) : null}
    </div>
  );
}

export default App;
