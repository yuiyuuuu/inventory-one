import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { makeGetRequest } from "../../requests/helperFunctions";
import EditQROverlay from "./EditQROverlay";

const SingleQR = () => {
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [selectedQr, setSelectedQr] = useState({});

  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const id = params.id;

    async function fetchQr() {
      await makeGetRequest(`/qr/fetch/${id}`).then((res) => {
        setSelectedQr(res);

        setLoading(false);
      });
    }

    fetchQr();
  }, []);

  if (loading) {
    return (
      <div className='abs-loading'>
        <div className='lds-ring' id='spinner-form'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className='home-parent'>
      <img
        className='home-logo'
        src='/assets/logo.jpeg'
        style={{ cursor: "pointer" }}
        onClick={() => (window.location.href = `/qr`)}
      />
      <div className='home-krink'>QR - {selectedQr?.name}</div>
      <div className='qr-i'>
        <img src={`${selectedQr?.image}`} id='qrimg' className='qr-img' />
      </div>

      <div className='home-f home-lp'>
        Link
        <div className='grow' />
        <div className='home-add qr-edit' onClick={() => setShowEdit(true)}>
          Edit
        </div>
      </div>

      <div className='qr-u'>
        <a
          className='ellipsis qr-hov qr-ur'
          href={selectedQr?.link}
          target='_blank'
          rel='noreferrer'
          onClick={(e) => e.stopPropagation()}
        >
          {selectedQr?.link}
        </a>
      </div>

      {showEdit && (
        <EditQROverlay
          selectedQR={selectedQr}
          setShowEdit={setShowEdit}
          setSelectedQr={setSelectedQr}
        />
      )}
    </div>
  );
};

export default SingleQR;
