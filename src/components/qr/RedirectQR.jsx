import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { makeGetRequest } from "../../requests/helperFunctions";

const RedirectQR = () => {
  const params = useParams();

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makeGetRequest(`/qr/fetch/${id}`).then((res) => {
        if (res.id) {
          window.location.href = res.link;
        } else {
          //redirects to google just in case
          window.location.href = "https://www.google.com/";
        }
      });
    }

    f();
  }, []);

  return "";
};

export default RedirectQR;
