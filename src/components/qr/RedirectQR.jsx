import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import {
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../requests/helperFunctions";

const RedirectQR = () => {
  const params = useParams();

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makeGetRequestWithAuth(
        `/qr/fetchredirect/${id}`,
        import.meta.env.VITE_ROUTEPASS
      ).then((res) => {
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
