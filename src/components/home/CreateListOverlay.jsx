import React, { useEffect, useState } from "react";

import { makePostRequest } from "../requests/requestFunctions";
import { useDispatch, useSelector } from "react-redux";

import $ from "jquery";

import { dispatchSetAuth } from "../../store/auth/auth";

const CreateListOverlay = ({ setCreateListOverlay }) => {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [listName, setListname] = useState("");

  async function handleSubmit() {
    const obj = {
      userid: authState.id,
      name: listName,
    };
    await makePostRequest(`/list/create/${import.meta.env.VITE_ROUTEPASS}`, obj)
      .then((res) => {
        dispatch(dispatchSetAuth(res));
        setCreateListOverlay(false);
        alert("List Created");
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    $("#create-listname").focus(() => {
      $("#create-listname")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-listname").focusout(() => {
      $("#create-listname").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  return (
    <div
      className="home-createoverlay"
      onClick={() => setCreateListOverlay(false)}
    >
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Create List</div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Name"
            className="homec-input"
            id="create-listname"
            value={listName}
            onChange={(e) => setListname(e.target.value)}
          />
        </div>

        <button
          className="homec-submit homec-but"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateListOverlay;
