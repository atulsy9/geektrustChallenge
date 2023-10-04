import React, { useEffect } from "react";
import "./User.css";
import axios from "axios";
import UserFooter from "./UserFooter";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Edit from "./Edit";

export default function User() {
  const BACKEND_URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  const [data, setData] = useState("");
  const [pageData, setPageData] = useState("");
  const [updateUser, setUpdateUser] = useState(-1);
  const [isMarked, setIsmarked] = useState([]);
  const [markAll, setMarkAll] = useState();

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    try {
      let res = await axios.get(BACKEND_URL);
      setData(res.data);
      localStorage.setItem("Data", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handelUserData = (data, startIdx, endIdx) => {
    setPageData(data.slice(startIdx, endIdx));
  };

  const modifiedDataAfterDelete = () => {
    let apiData = JSON.parse(localStorage.getItem("Data"));
    console.log(isMarked);
    isMarked.forEach((val1) => {
      let index = apiData.findIndex((val2) => val1 === val2.id);
      apiData.splice(index, 1);
      // console.log(index);
    });
    // console.log(apiData);
    localStorage.setItem("Data", JSON.stringify(apiData));
  };

  const handelDelete = (id) => {
    let apiData = JSON.parse(localStorage.getItem("Data"));
    let indexAtStorage = apiData.findIndex((value) => value.id === id);
    apiData.splice(indexAtStorage, 1);
    localStorage.setItem("Data", JSON.stringify(apiData));
    let newData = [...data];
    let index = newData.findIndex((value) => value.id === id);
    newData.splice(index, 1);
    setData(newData);
  };

  const handelSearch = (e) => {
    let apiData = JSON.parse(localStorage.getItem("Data"));
    const value = e.target.value;
    const toShow = apiData.filter(
      (ele) =>
        ele.name.includes(value) ||
        ele.email.includes(value) ||
        ele.role.includes(value)
    );
    setData(toShow);
  };

  const handelSubmit = (e) => {
    let apiData = JSON.parse(localStorage.getItem("Data"));
    let modified = apiData.map((val1) => {
      let obj = val1;
      data.forEach((val2) => {
        if (val1.id === val2.id) {
          return (obj = { ...val2 });
        }
      });
      return obj;
    });
    localStorage.setItem("Data", JSON.stringify(modified));
    e.preventDefault();
    setUpdateUser(-1);
  };

  const handelDeleteMarked = (e) => {
    modifiedDataAfterDelete();
    setMarkAll(false);
    let newArr = data.filter((val) => {
      return !isMarked.includes(val.id);
    });
    // console.log(e.target);
    setData(newArr);
    setIsmarked([]);
    // console.log(data);
  };

  const handelChange = (e, id) => {
    const { name, checked } = e.target;
    if (name === "selectAll") {
      markAll ? setMarkAll(false) : setMarkAll(true);
      let newData = pageData.map((value) => ({ ...value, isChecked: checked }));
      setPageData(newData);
      if (checked) {
        pageData.forEach((element) => {
          isMarked.push(element.id);
        });
      } else {
        setIsmarked([]);
      }
    } else {
      setMarkAll(false);
      let newData = pageData.map((value) =>
        value.name === name ? { ...value, isChecked: checked } : value
      );
      setPageData(newData);
      if (checked) {
        isMarked.push(id);
      } else {
        let newMarkedArr = isMarked.filter((val) => val !== id);
        setIsmarked(newMarkedArr);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, email or Role"
        className="searchBar"
        onChange={handelSearch}
      />
      {pageData.length ? (
        <form onSubmit={handelSubmit}>
          <table className="table">
            <tbody>
              <tr className="table-row">
                <th>
                  <input
                    type="checkbox"
                    name="selectAll"
                    checked={markAll}
                    onClick={handelChange}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
              {pageData.map((value) => {
                // console.log(pageData);
                return (
                  <tr className="data_table_row" key={value.id}>
                    {updateUser === value.id ? (
                      <Edit
                        UserData={data}
                        personData={value}
                        setUserData={setData}
                      />
                    ) : (
                      <>
                        <th>
                          <input
                            type="checkbox"
                            name={value.name}
                            value={value.id}
                            checked={value ? value.isChecked : false}
                            onClick={(e) => handelChange(e, value.id)}
                          />
                        </th>
                        <th>{value.name}</th>
                        <th>{value.email}</th>
                        <th>{value.role}</th>
                        <th>
                          <div className="flex">
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={(e) => {
                                setUpdateUser(value.id);
                              }}
                            >
                              <EditNoteIcon padding="1px" />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={(e) => {
                                handelDelete(value.id);
                              }}
                            >
                              <DeleteIcon
                                fontSize="small"
                                style={{ color: "red" }}
                              />
                            </IconButton>
                          </div>
                        </th>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>
      ) : (
        <div className="not_found">
          No data found! Please Reload the page and Search Again
        </div>
      )}
      <UserFooter
        UserData={data}
        fnc={handelUserData}
        setUserData={setData}
        handelDelete={handelDeleteMarked}
      />
    </div>
  );
}
