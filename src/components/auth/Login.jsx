import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Atropos from "atropos";

import $ from "jquery";

import "./auth.scss";

import { authenticate } from "../../store/auth/auth";

const Login = () => {
  const atroRef = useRef(null);

  const dispatch = useDispatch();

  const screenWidth = useSelector((state) => state.screenWidth);
  const authState = useSelector((state) => state.auth);

  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  //error states
  const [noUsername, setNoUsername] = useState(false);

  const [userNotFound, setUserNotFound] = useState(false);
  const [wrongpassword, setWrongpassword] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    // setLoading(true);
    setUserNotFound(false);
    setWrongpassword(false);

    setTimeout(() => {
      $("#auth-spinner").addClass("scale");
    }, 1000);
    setTimeout(() => {
      setLoading(false);
    }, 10000);

    const obj = {
      email: $("#email-input").val(),
      password: $("#password-input").val(),
    };

    dispatch(authenticate(obj)).then((res) => {
      if (res === "notfound") {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      if (res === "wrongpassword") {
        setWrongpassword(true);
        setLoading(false);
        return;
      }

      // window.location.href = "/";
    });
  }

  const enterListener = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        handleSubmit($());
      }
    },
    [emailInput, passInput]
  );

  useEffect(() => {
    $(document).keydown(enterListener);

    return () => {
      $(document).off();
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 500) {
      if (!atroRef.current) return;
      atroRef.current.destroy();
      return;
    }

    if (authState.loading !== "false" && authState?.id) return;

    $(document).ready(() => {
      const myAtropos = Atropos({
        el: ".my-atropos",
        shadow: false,
      });

      atroRef.current = myAtropos;
    });
  }, [screenWidth, authState]);

  const [scale, setScale] = useState(false);

  if (authState.loading && authState.loading !== "false") {
    return (
      <div className="abs-loading">
        <div className="lds-ring" id="spinner-form">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (authState.id) {
    return (window.location.href = "/");
  }

  return (
    <div className="auth-parent">
      <div className="auth-inner">
        <div className="auth-sqcontainer">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square2"></div>
          <div className="square2"></div>
          <div className="square2"></div>
        </div>

        <div class="atropos my-atropos">
          <div class="atropos-scale">
            <div class="atropos-rotate">
              <div class="atropos-inner">
                <div className="auth-box">
                  <div className="container">
                    <div className="form">
                      <a
                        href="https://chicagocitysports.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ alignSelf: "center" }}
                      >
                        <img
                          src="/assets/loginlogo.jpeg"
                          className="auth-logo"
                        />
                      </a>
                      <div className="auth-title">
                        Welcome to{" "}
                        <span style={{ fontWeight: "bold" }}>
                          Inventory One
                        </span>
                      </div>
                      <div className="auth-form">
                        {(userNotFound || wrongpassword) && (
                          <div className="auth-error">
                            Wrong Email or Password
                          </div>
                        )}
                        <div className="auth-inputBx">
                          <input
                            type="text"
                            id="email-input"
                            required="required"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                          />
                          <span>Email</span>
                          <i className="fas fa-user-circle"></i>
                        </div>

                        <div className="auth-inputBx password">
                          <input
                            id="password-input"
                            type="password"
                            name="password"
                            required="required"
                            value={passInput}
                            onChange={(e) => setPassInput(e.target.value)}
                          />
                          <span>Password</span>

                          <i className="fas fa-key"></i>
                        </div>
                        <div className="auth-inputBx">
                          <button
                            onClick={() => {
                              handleSubmit();
                            }}
                            className="auth-sub"
                          >
                            Login
                          </button>
                        </div>
                      </div>

                      <div className="auth-dha">
                        Don't have an account?{" "}
                        <a href="/signup" className="auth-redir">
                          Sign up
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="abc" style={{ display: !loading && "none" }}>
        <div className={`lds-default spin`} id="auth-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
