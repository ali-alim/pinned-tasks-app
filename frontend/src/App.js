import { useEffect, useState, useRef, Fragment } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Spin,
} from "antd";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Tasks from "./Tasks";
import Header from "./Header";
import "./app.css";
import { Notify } from "./components/common/Notify";
import PinMap from "./PinMap";
import AddNewTaskForm from "./Tasks/AddNewTaskForm";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [categoryForm] = Form.useForm();
  const [pins, setPins] = useState([]);
  const submitNewCategoryRef = useRef();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [startTime, setStartTime] = useState("2023-01-01");
  const [endTime, setEndTime] = useState("2023-12-31");
  const [pinsLoading, setPinsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [addNewTaskModal, setAddNewTaskModal] = useState(false);
  const [addNewCategoryModal, setAddNewCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
  const getCategories = async () => {
    try {
      setCategoriesLoading(true);
      const allCategories = await axios.get(
        process.env.REACT_APP_API_URL + "/categories"
      );
      setCategories(allCategories.data);
      setCategoriesLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      getPins();
      getCategories();
    }
  }, [refreshData]);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
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
  const handleCategoryDelete = async (id) => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_API_URL + `/categories/${id}`
      );
      if (res) {
        Notify({
          type: "success",
          title: "Notify",
          message: "Category was successfully deleted",
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
      {currentUsername ? (
        <Row
          gutter={24}
          justify="center"
          style={{
            margin: 15,
          }}
        >
          <Col span={16}>
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
          <Col span={8}>
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          </Col>
        </Row>
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
      <div
        style={{
          marginTop: 15,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
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
      </div>

      {currentUsername ? (
        <>
          <Header
            setShowPins={setShowPins}
            setShowTasks={setShowTasks}
            setShowCompleted={setShowCompleted}
            setShowHome={setShowHome}
          />
          <hr
            style={{
              margin: "20px 20px",
              color: `${showTasks ? "#49d8be" : "#d25e8f"}`,
            }}
          />
        </>
      ) : null}
      {showHome && currentUsername && !categoriesLoading ? (
        <Fragment>
          <Row gutter={24} justify="center">
            <div
              className="categories"
              style={{ marginBottom: 10 }}
              onClick={() => setAddNewCategoryModal(true)}
            >
              <PlusOutlined />
              <span style={{ marginRight: 5 }}>new category</span>
            </div>
          </Row>
          {categories.map((category, i) => (
            <Row
              gutter={24}
              key={i}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              <Col
                span={20}
                className="categories"
                onClick={() => {
                  setAddNewTaskModal(true);
                  setSelectedCategory(category.name.toLocaleLowerCase());
                }}
              >
                <span>{category?.name}</span>
              </Col>
              <Col span={4}>
                <Popconfirm
                  title="Are you sure you want to delete?"
                  placement="left"
                  onConfirm={() => handleCategoryDelete(category._id)}
                  okText="Yes"
                  cancel="No"
                >
                  <span
                    style={{ color: "red", cursor: "pointer", fontSize: 20 }}
                  >
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              </Col>
            </Row>
          ))}
        </Fragment>
      ) : showHome && currentUsername && categoriesLoading ? (
        <Row justify={"center"}>
          <Spin />
        </Row>
      ) : null}
      {showPins && currentUsername ? (
        <PinMap
          pins={pins}
          setPins={setPins}
          currentUsername={currentUsername}
          startTime={startTime}
          endTime={endTime}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          handlePinDelete={handlePinDelete}
          pinsLoading={pinsLoading}
        />
      ) : null}
      {(showCompleted || showTasks) && currentUsername ? (
        <Tasks
          setPins={setPins}
          currentUsername={currentUsername}
          pins={pins}
          showCompleted={showCompleted}
          pinsLoading={pinsLoading}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          handlePinDelete={handlePinDelete}
          addNewTaskModal={addNewTaskModal}
          setAddNewTaskModal={setAddNewTaskModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      ) : null}
      <Modal
        bodyStyle={{ height: 300 }}
        open={addNewTaskModal}
        onCancel={() => setAddNewTaskModal(false)}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => setAddNewTaskModal(false)}
      >
        <AddNewTaskForm
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          setAddNewTaskModal={setAddNewTaskModal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setPins={setPins}
          pins={pins}
          currentUsername={currentUsername}
        />
      </Modal>
      <Modal
        bodyStyle={{ height: 100 }}
        open={addNewCategoryModal}
        onCancel={() => setAddNewCategoryModal(false)}
        onOk={() => submitNewCategoryRef.current.click()}
      >
        <Form
          layout="vertical"
          form={categoryForm}
          onFinish={async (values) => {
            const data = {};
            data["name"] = values.name;
            try {
              const res = await axios.post(
                process.env.REACT_APP_API_URL + "/categories",
                data
              );
              Notify({
                type: "success",
                title: "Notify",
                message: "Category was successfully added",
              });
              setCategories([...categories, res.data]);
              setAddNewCategoryModal(false);
              setRefreshData(!refreshData);
              categoryForm.resetFields();
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <Form.Item label="Category Name" name="name">
            <Input />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            ref={submitNewCategoryRef}
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
}

export default App;
