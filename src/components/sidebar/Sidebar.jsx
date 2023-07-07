import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "./svg/LogoutIcon";
import { logout } from "../../store/auth/auth";

const Sidebar = () => {
  const dispatch = useDispatch();

  const sidebarState = useSelector((state) => state.sidebarState);

  const authState = useSelector((state) => state.auth);

  return (
    <div
      className="side-inner"
      style={{
        transform: sidebarState.display
          ? "translate(0)"
          : "translate(-300px, 0)",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="side-acontainer">
        <a className="side-a" href="/">
          Inventory One
        </a>
        <a className="side-a" href="/stores">
          Inventory Stores
        </a>

        <a className="side-a" href="/keys">
          Inventory Keys
        </a>

        <a className="side-a" href="/qr">
          Inventory QR
        </a>
      </div>

      {authState?.id && !authState.loading ? (
        <div className="side-user">
          <div className="side-userin">
            <div className="side-img"></div>
            <div className="side-infocol">
              <div className="side-username side-ell">{authState?.name}</div>
              <div className="side-email side-ell">{authState?.email}</div>
            </div>

            <div className="grow" />

            <LogoutIcon
              oc={() => {
                dispatch(logout());
                window.location.href = "/login";
              }}
            />
          </div>
        </div>
      ) : (
        <div className="side-user">
          <div className="side-userin">
            <div className="side-log">
              <span
                className="side-sp"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
