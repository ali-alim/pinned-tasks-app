import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddNewTaskForm from "../AddNewTaskForm";
import { Spin } from "antd";

const Task = () => {
  let { id } = useParams();

  const [pinLoading, setPinLoading] = useState(false);
  const [editPinData, setEditPinData] = useState({});

  const getSinglePin = async () => {
    try {
      setPinLoading(true);
      const singlePin = await axios.get(
        process.env.REACT_APP_API_URL + `/pins/${id}`
      );
      setEditPinData(singlePin.data);
      setPinLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSinglePin();
  }, [id]);

  return (
    <div style={{ margin: 24 }}>
      {pinLoading ? (
        <Spin />
      ) : (
        <AddNewTaskForm
          setEditPinData={setEditPinData}
          editPinData={editPinData}
          id={id}
        />
      )}
    </div>
  );
};

export default Task;
