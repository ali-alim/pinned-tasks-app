import { Fragment, useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room } from "@material-ui/icons";
import moment from "moment";
import AddNewTaskForm from "../Tasks/AddNewTaskForm";
const dateFormat = "YYYY-MM-DD";

const PinMap = ({
  pins,
  setPins,
  currentUsername,
  startTime,
  endTime,
  refreshData,
  setRefreshData,
  handlePinDelete,
  pinsLoading,
}) => {
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 41.716667,
    longitude: 44.783333,
    zoom: 12,
  });

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
            pin.user === currentUsername && pin?.lat &&
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
                  color: currentUsername === pin.user ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
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
            <div style={{ height: 270 }}>
              <AddNewTaskForm
                newPlace={newPlace}
                setNewPlace={setNewPlace}
                pins={pins}
                setPins={setPins}
                currentUsername={currentUsername}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
              />
            </div>
          </Popup>
        </>
      )}
    </ReactMapGL>
  );
};

export default PinMap;
