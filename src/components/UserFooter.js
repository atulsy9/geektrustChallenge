import React from "react";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import "./UserFooter.css";

export default function UserFooter({ UserData, fnc, handelDelete }) {
  const USERS_PAGE = 10;
  let pageCount = Math.ceil(UserData.length / USERS_PAGE);
  const [page, setPage] = React.useState(1);
  // console.log(UserData);

  React.useEffect(() => {
    fnc(UserData, page * USERS_PAGE - USERS_PAGE, page * USERS_PAGE);
  }, [UserData]);

  const handleChange = (event, value) => {
    setPage(value);
    fnc(UserData, value * USERS_PAGE - USERS_PAGE, value * USERS_PAGE);
  };

  return (
    <div className="footer">
      <Button
        variant="contained"
        className="deleteButton"
        onClick={handelDelete}
      >
        Delete Selected
      </Button>
      <Pagination
        count={pageCount}
        page={page}
        className="pageCount"
        onChange={handleChange}
      />
    </div>
  );
}
