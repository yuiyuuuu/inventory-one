import React, { useState } from "react";
import { useSelector } from "react-redux";

import { makePostRequest } from "../../requests/helperFunctions";

const AddTrackerOverlay = ({ set }) => {
  const authstate = useSelector((state) => state.auth);

  const [name, setName] = useState(null);

  const [nameError, setNameError] = useState(false);

  async function handleSubmit() {
    setNameError(false);

    if (!name) {
      setNameError(true);
      return;
    }

    const obj = {
      name,
      userid: authstate.id,
    };

    await makePostRequest("time/create", obj)
      .then((res) => {
        if (res.id) {
          window.location.href = `time/${res.id}`;
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  return (
    <div className="home-createoverlay" onClick={() => set(false)}>
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Create Tracker</div>

        <div className="homec-inputcontainer">
          {nameError && (
            <div className="ov-error homec-l">Name is required</div>
          )}
          <input
            placeholder="Name"
            className="homec-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div
          className="homec-submit homec-but ov-submit"
          onClick={() => handleSubmit()}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default AddTrackerOverlay;
