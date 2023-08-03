import React, { useState } from "react";
import {
  makePutRequest,
  makePutRequestWithAuth,
} from "../../requests/helperFunctions";

const ShareOverlay = ({ currentList, setShowShareOverlay }) => {
  const [email, setEmail] = useState("");

  const [userNotFound, setUserNotFound] = useState(false);

  async function handleSubmit() {
    setUserNotFound(false);

    const obj = {
      id: currentList.id,
      email: email,
    };

    await makePutRequestWithAuth(
      `/list/sharelist`,
      obj,
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res === "user not found") {
          setUserNotFound(true);
          return;
        }

        if (res.list.id) {
          alert("List Shared with " + res.user.name);
          setShowShareOverlay(false);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  return (
    <div
      className='home-createoverlay'
      onClick={() => setShowShareOverlay(false)}
    >
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Share List</div>

        <div className='homec-inputcontainer'>
          {userNotFound && <div className='home-error'>User Not Found</div>}

          <input
            placeholder='Email'
            className='homec-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className='homec-submit homec-but'
          onClick={() => handleSubmit()}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareOverlay;
