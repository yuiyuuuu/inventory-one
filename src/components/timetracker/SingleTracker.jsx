import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { makePostRequest } from "../../requests/helperFunctions";

const SingleTracker = () => {
  const params = useParams();

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makePostRequest("time/getone", {
        id: id,
        auth: window.localStorage.getItem("token"),
      }).then((res) => {
        console.log(res);
      });
    }

    f();
  }, []);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Time Tracker</div>
    </div>
  );
};

export default SingleTracker;
