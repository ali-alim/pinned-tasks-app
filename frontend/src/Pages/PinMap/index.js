import axios from "axios";
import moment from "moment";
import { Room } from "@material-ui/icons";
import { Fragment, useEffect, useState } from "react";
import { Spin, Form, DatePicker, Row, Col } from "antd";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import AddNewTaskForm from "../Tasks/AddNewTaskForm";
import { Notify } from "../../components/common/Notify";

const dateFormat = "YYYY-MM-DD";
const myStorage = window.localStorage;

const { RangePicker } = DatePicker;

const PinMap = ({}) => {
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 41.716667,
    longitude: 44.783333,
    zoom: 12,
  });
  const [form] = Form.useForm();
  const [activePins, setActivePins] = useState([]);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [startTime, setStartTime] = useState("2023-01-01");
  const [endTime, setEndTime] = useState("2023-12-31");
  const [refreshData, setRefreshData] = useState(false);

  const getPins = async () => {
    try {
      setPinsLoading(true);
      const allPins = await axios.get(process.env.REACT_APP_API_URL + "/pins", {
        params: { user: currentUsername },
      });
      setActivePins(
        allPins?.data
          ?.filter(
            (pin) =>
              pin.completed !== true &&
              moment(pin.time).format(dateFormat) >= startTime &&
              moment(pin.time).format(dateFormat) <= endTime
          )
          ?.sort((a, b) => new Date(a.time) - new Date(b.time))
      );
      setPinsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPins();
  }, [refreshData, startTime]);

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
        form.resetFields();
      }
    } catch (err) {
      Notify({
        type: "error",
        title: "title",
        message: "message",
      });
    }
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

  return (
    <>
      {pinsLoading ? (
        <Row style={{ marginTop: 20 }} justify={"center"} gutter={24}>
          <Spin />
        </Row>
      ) : (
        <>
          <Row
            gutter={24}
            justify={"center"}
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Col span={21}>
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
            </Col>
          </Row>
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
            {activePins
              .filter(
                (pin) =>
                  pin.user === currentUsername &&
                  pin?.lat &&
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
                      anchor="bottom"
                    >
                      <AddNewTaskForm
                        hasLocation={true}
                        onDeleteAction = {handlePinDelete}
                        editPinData={pin}
                        activePins={activePins}
                        setActivePins={setActivePins}
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
                  anchor="bottom"
                >
                    <AddNewTaskForm
                      newPlace={newPlace}
                      setNewPlace={setNewPlace}
                      activePins={activePins}
                      setActivePins={setActivePins}
                      currentUsername={currentUsername}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                </Popup>
              </>
            )}
          </ReactMapGL>
        </>
      )}
    </>
  );
};

export default PinMap;
