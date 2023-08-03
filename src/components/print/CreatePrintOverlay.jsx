import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  makePostRequest,
  makePostRequestWithAuth,
} from "../../requests/helperFunctions";

const CreatePrintOverlay = ({ showCreatePrint, setShowCreatePrint }) => {
  const authState = useSelector((state) => state.auth);

  const [name, setName] = useState("");

  //error states
  const [noName, setNoName] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  async function handleCreate() {
    if (!name) {
      setNoName(true);
      return;
    }

    setNoName(false);
    setAlreadyExists(false);

    const obj = {
      userid: authState.id,
      name: name,
    };

    await makePostRequestWithAuth(
      `/print/createlist`,
      obj,
      import.meta.env.VITE_ROUTEPASS
    ).then((res) => {
      if (res === "already exists") {
        setAlreadyExists(true);
        return;
      }

      if (res?.id) {
        window.location.href = "/print/" + res.id;
      }
    });
  }

  return (
    <div
      className='home-createoverlay'
      onClick={() => setShowCreatePrint(false)}
    >
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Create Print List</div>

        {noName && (
          <div
            className='home-error'
            style={{ alignSelf: "start", marginBottom: "-10px" }}
          >
            Invalid Name
          </div>
        )}

        {alreadyExists && (
          <div
            className='home-error'
            style={{ alignSelf: "start", marginBottom: "-10px" }}
          >
            Name is not available
          </div>
        )}

        <div className='homec-inputcontainer'>
          <input
            placeholder='Name'
            className='homec-input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          className='homec-submit homec-but'
          onClick={() => handleCreate()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreatePrintOverlay;
