import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import CreateListOverlay from "./CreateListOverlay";

import "./home.scss";

const Home = () => {
  const nav = useNavigate();

  const authState = useSelector((state) => state.auth);

  const [createListOverlay, setCreateListOverlay] = useState(false);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory One</div>

      <div className="home-f home-lp">
        <span>Your Lists</span>
        <div className="grow" />
        {(!authState.loading || authState.loading === "false") &&
          authState?.id && (
            <div
              className="home-add home-create"
              onClick={() => setCreateListOverlay(true)}
            >
              Create
            </div>
          )}
      </div>

      {(authState?.loading === "false" || !authState.loading) &&
        (!authState?.id ? (
          <div className="home-none">
            <a className="home-siredir" href="/login">
              Log in
            </a>{" "}
            to view and create lists
          </div>
        ) : authState?.lists?.length > 0 ? (
          <div className="home-mapcontainer">
            {authState?.lists.map((list) => (
              <div
                className="home-mapch"
                onClick={() => nav(`/lists/${list.id}`)}
              >
                <span className="ellipsis" style={{ maxWidth: "90%" }}>
                  {list?.name}
                </span>

                <div className="grow" />
                <div
                  className="mitem-caret"
                  style={{ transform: "rotate(-90deg)" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="home-none">You have no lists</div>
        ))}

      {(authState?.loading === "false" || !authState.loading) &&
        authState?.id && <div className="home-f">Shared Lists</div>}
      {authState?.loading === "false" || !authState.loading ? (
        authState?.id ? (
          authState?.sharedLists?.length > 0 ? (
            <div className="home-mapcontainer"></div>
          ) : (
            <div className="home-none">You have no shared lists</div>
          )
        ) : (
          ""
        )
      ) : (
        ""
      )}

      {createListOverlay && (
        <CreateListOverlay setCreateListOverlay={setCreateListOverlay} />
      )}
    </div>
  );
};

export default Home;
