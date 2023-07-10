import React, { useState } from "react";

import QRCode from "./qr";
import { useSelector } from "react-redux";
import { makePostRequest, makePutRequest } from "../requests/requestFunctions";

const CreateQROverlay = ({ setShowCreateOverlay }) => {
  const authState = useSelector((state) => state.auth);

  const [qrName, setQrName] = useState("");
  const [qrRedirectLink, setQrRedirectLink] = useState("");

  //error states
  const [noName, setNoName] = useState(false);
  const [invalidURL, setInvalidURL] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setNoName(false);
    setInvalidURL(false);

    let bad = false;

    function isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    }

    if (!qrName) {
      setNoName(true);
      bad = true;
    }

    if (!qrRedirectLink || !isValidHttpUrl(qrRedirectLink)) {
      bad = true;
      setInvalidURL(true);
    }

    if (bad) {
      setLoading(false);
      return;
    }

    const obj = {
      name: qrName,
      url: qrRedirectLink,
      user: authState?.id,
    };

    await makePostRequest("/qr/create", obj)
      .then(async (res) => {
        const div = document.createElement("div");

        new QRCode(div, {
          text: `${window.location.protocol}//${window.location.host}/r/${res.id}`,
        });

        const qrsrc = div.children[0].toDataURL("image/png");

        const o = {
          id: res.id,
          src: qrsrc,
        };

        await makePutRequest("/qr/addimg", o).then((res) => {
          if (res?.id) {
            window.location.href = `${window.location.protocol}//${window.location.host}/qr/${res.id}`;
            setLoading(false); //just in case, prob not gonna do anything tho lol
          }
        });
      })
      .catch(() => {
        alert("Something went wrong, try again");
        setLoading(false);
      });
  }

  return (
    <div
      className='home-createoverlay'
      onClick={() => setShowCreateOverlay(false)}
    >
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Create QR</div>

        <div className='homec-inputcontainer'>
          {noName && <div className='ov-error homec-l'>Name is required</div>}
          <input
            placeholder='Name'
            className='homec-input'
            value={qrName}
            onChange={(e) => setQrName(e.target.value)}
          />
        </div>

        <div className='homec-inputcontainer'>
          {invalidURL && <div className='ov-error homec-l'>Invalid URL</div>}

          <input
            placeholder='URL'
            className='homec-input'
            value={qrRedirectLink}
            onChange={(e) => setQrRedirectLink(e.target.value)}
          />
        </div>

        <div
          className='homec-submit homec-but ov-submit'
          onClick={() => handleSubmit()}
        >
          Create
        </div>
      </div>

      {loading && (
        <div className='submit-loading'>
          <div className='lds-ring' id='spinner-form'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQROverlay;
