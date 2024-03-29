import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "./svg/LogoutIcon";
import { logout } from "../../store/auth/auth";
import { useNavigate } from "react-router-dom";
import { dispatchSetSidebarState } from "../../store/sidebar";

const Sidebar = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const sidebarState = useSelector((state) => state.sidebarState);

  const authState = useSelector((state) => state.auth);

  function go(loc) {
    nav(loc);
    dispatch(dispatchSetSidebarState({ display: false }));
  }

  return (
    <div
      className='side-inner'
      style={{
        transform: sidebarState.display
          ? "translate(0)"
          : "translate(-300px, 0)",
        boxShadow: !sidebarState.display && "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* <div className="side-acontainer">
        <a className="side-a" href="/">
          Inventory One
        </a>
        <a className="side-a" href="/stores">
          Store Statistics
        </a>

        <a className="side-a" href="/keys">
          Key Checkout
        </a>

        <a className="side-a" href="/qr">
          QR Codes
        </a>

        <a className="side-a" href="/print">
          Print Forms
        </a>

        <a className="side-a" href="/calls">
          Call Logs
        </a>

        <a className="side-a" href="/employees">
          Employee Export
        </a>
      </div> */}

      {authState.id ? (
        <div className='side-acontainer'>
          <div className='side-a' onClick={() => go("/")}>
            Inventory One
          </div>
          <div className='side-a' onClick={() => go("/stores")}>
            Store Statistics
          </div>

          <div className='side-a' onClick={() => go("/keys")}>
            Key Tracker
          </div>

          <div className='side-a' onClick={() => go("/qr")}>
            QR Codes
          </div>

          {/* <div className="side-a" onClick={() => go("/print")}>
            Print Forms
          </div> */}

          <div className='side-a' onClick={() => go("/calls")}>
            Call Logs
          </div>

          {/* <div className="side-a" onClick={() => go("/employees")}>
            Employee Export
          </div> */}

          <div className='side-a' onClick={() => go("/time")}>
            Time Tracker
          </div>

          <div className='side-a' onClick={() => go("/visit")}>
            Store Visits Tracker
          </div>

          <div className='side-a' onClick={() => go("/cars")}>
            Car Tracker
          </div>
        </div>
      ) : (
        <div className='side-acontainer'>
          <div className='side-a' onClick={() => go("/keys")}>
            Key Tracker
          </div>

          <div className='side-a' onClick={() => go("/cars")}>
            Car Tracker
          </div>
        </div>
      )}

      {authState?.id && !authState.loading ? (
        <div className='side-user'>
          <div className='side-userin'>
            <div className='side-img'></div>
            <div className='side-infocol'>
              <div className='side-username side-ell'>{authState?.name}</div>
              <div className='side-email side-ell'>{authState?.email}</div>
            </div>

            <div className='grow' />

            <LogoutIcon
              oc={() => {
                dispatch(logout());
                window.location.href = "/login";
              }}
            />
          </div>
        </div>
      ) : (
        <div className='side-user'>
          <div className='side-userin'>
            <div className='side-log'>
              <span
                className='side-sp'
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
