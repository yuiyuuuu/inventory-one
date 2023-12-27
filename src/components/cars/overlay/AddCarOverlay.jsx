import React, { useState } from "react";

import { makePostRequestWithAuth } from "../../../requests/helperFunctions";
import { getToken } from "../../../requests/getToken";
import { useDispatch, useSelector } from "react-redux";
import { dispatchSetCarTrackers } from "../../../store/cartrackers/cars";
import { dispatchSetLoading } from "../../../store/global/loading";

const AddCarOverlay = ({ set }) => {
  const dispatch = useDispatch();

  const carTrackers = useSelector((state) => state.carTrackers);

  //name of car
  const [name, setName] = useState(null);

  //plate # of the car
  const [plate, setPlate] = useState(null);

  async function handleSubmit() {
    dispatch(dispatchSetLoading(true));

    await makePostRequestWithAuth("cars/create", { name, plate }, getToken())
      .then((res) => {
        if (res?.id) {
          dispatch(dispatchSetCarTrackers([...carTrackers, res]));
          dispatch(dispatchSetLoading(false));
          set(false);
        }
      })
      .catch((err) => {
        console.log(error);
        alert("Something went wrong, please try again");
        dispatch(dispatchSetLoading(false));
      });
  }

  return (
    <div className="home-createoverlay" onClick={() => set(false)}>
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Add Car</div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Name"
            className="homec-input"
            id="create-listname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Plate"
            className="homec-input"
            id="create-listname"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </div>

        <div className="homec-submit homec-but" onClick={() => handleSubmit()}>
          Add
        </div>
      </div>
    </div>
  );
};

export default AddCarOverlay;
