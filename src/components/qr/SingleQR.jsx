import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { makeGetRequest } from "../../requests/helperFunctions";

const SingleQR = () => {
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [selectedQr, setSelectedQr] = useState({});

  useEffect(() => {
    const id = params.id;

    console.log(id);

    async function fetchQr() {
      await makeGetRequest(`/qr/fetch/${id}`).then((res) => {
        setSelectedQr(res);

        setLoading(false);
      });
    }

    fetchQr();
  }, []);

  console.log(selectedQr);

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

      <div className='qr-u'>
        URL:&nbsp;
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

      <div className='qr-edit'>Edit Link</div>
    </div>
  );
};

export default SingleQR;
