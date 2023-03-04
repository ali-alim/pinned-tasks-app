import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import { Notify } from "./components/common/Notify";
import { Button, Col, Form, Input, Row } from "antd";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 41.716667,
    longitude: 44.783333,
    zoom: 12,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      user: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(API_URL + "/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      Notify({
        type: "success",
        title: "Notify",
        message: "Pin was successfully added",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePinDelete = async (id) => {
    try {
      const res = await axios.delete(API_URL + `/pins/${id}`);
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

  const getPins = async () => {
    try {
      const allPins = await axios.get(API_URL + "/pins");
      setPins(allPins.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    if (currentUsername) {
      getPins();
    }
  }, [refreshData, currentUsername]);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
          .filter((p) => p.user === currentUsername)
          .map((p) => (
            <>
              <Marker
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: currentUsername === p.user ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  className="popup"
                  key={p._id}
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="left"
                >
                  <Form
                    onFinish={async (values) => {
                      const data = {};
                      data["desc"] = values.desc;
                      data["title"] = values.title;

                      try {
                        const res = await axios.put(
                          API_URL + `/pins/${p._id}`,
                          data
                        );
                        setPins([...pins, res.data]);
                        Notify({
                          type: "success",
                          title: "Notify",
                          message: "Pin was successfully added",
                        });
                        setCurrentPlaceId(null);
                        setRefreshData(!refreshData);
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    initialValues={{
                      desc: p.desc,
                      title: p.title,
                    }}
                    layout="vertical"
                  >
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          label="Task"
                          name="desc"
                          style={{ marginBottom: 20 }}
                        >
                          <Input
                            className="desc"
                            onChange={(e) => setDesc(e.target.value)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          label="Place"
                          name="title"
                          style={{ marginBottom: 20 }}
                        >
                          <Input
                            className="desc"
                            onChange={(e) => setDesc(e.target.value)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <div className="stars">
                          {Array(p.rating).fill(<Star className="star" />)}
                        </div>
                      </Col>
                      <Col span={24}>
                        <span className="username">
                          Created by <b>{p.user}</b>
                        </span>
                        <span style={{ marginLeft: 5 }} className="date">
                          {format(p.createdAt)}
                        </span>
                      </Col>
                    </Row>
                    <Row
                      gutter={24}
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Col span={12}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handlePinDelete(p._id);
                          }}
                          className="submitButton"
                        >
                          Delete
                        </button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="submitButton"
                          style={{ backgroundColor: "#c12ef7" }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Popup>
              )}
            </>
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
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Task</label>
                  <textarea
                    placeholder="What should be done"
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Place</label>
                  <input
                    placeholder="Enter place"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Priority</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
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
    </div>
  );
}

export default App;
