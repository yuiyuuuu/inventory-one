import React, { useState } from "react";
import { useEffect } from "react";
import { makePutRequest } from "../../requests/helperFunctions";

const EditQROverlay = ({ selectedQR, setShowEdit, setSelectedQr, after }) => {
  const [editedQr, setEditedQr] = useState({});

  //error states
  const [noName, setNoName] = useState(false);
  const [invalidURL, setInvalidURL] = useState(false);

  async function handleSubmit() {
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

    if (!editedQr?.name) {
      setNoName(true);
      bad = true;
    }

    if (!editedQr?.link || !isValidHttpUrl(editedQr?.link)) {
      bad = true;
      setInvalidURL(true);
    }

    if (bad) return;

    await makePutRequest("/qr/editqr", editedQr)
      .then((res) => {
        if (res.id) {
          setSelectedQr(res);
          setShowEdit(false);

          if (after) {
            after(res);
          }
          alert("Updated");
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    if (!selectedQR.id) return;

    setEditedQr(selectedQR);
  }, [selectedQR]);

  return (
    <div className='home-createoverlay' onClick={() => setShowEdit(false)}>
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Edit QR</div>

        <div className='homec-inputcontainer'>
          {noName && <div className='ov-error homec-l'>Name is required</div>}
          <input
            placeholder='Name'
            className='homec-input'
            value={editedQr?.name}
            onChange={(e) =>
              setEditedQr((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>

        <div className='homec-inputcontainer'>
          {invalidURL && <div className='ov-error homec-l'>Invalid URL</div>}

          <input
            placeholder='URL'
            className='homec-input'
            value={editedQr?.link}
            onChange={(e) =>
              setEditedQr((prev) => {
                return { ...prev, link: e.target.value };
              })
            }
          />
        </div>
        <div
          className='homec-submit homec-but ov-submit'
          onClick={() => handleSubmit()}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default EditQROverlay;
