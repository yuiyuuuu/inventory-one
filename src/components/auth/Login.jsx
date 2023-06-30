import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Atropos from "atropos";

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

  async function handleSubmit() {
    setUserNotFound(false);
    setWrongpassword(false);

    const obj = {
      email: emailInput,
      password: passInput,
    };

    dispatch(authenticate(obj)).then((res) => {
      if (res === "notfound") {
        setUserNotFound(true);
        return;
      }

      if (res === "wrongpassword") {
        setWrongpassword(true);
        return;
      }

      window.location.href = "/";
    });
  }

  useEffect(() => {
    if (screenWidth < 500) {
      return;
    }

    const myAtropos = Atropos({
      el: ".my-atropos",
      shadow: false,
    });

    atroRef.current = myAtropos;
  }, [screenWidth]);

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
                            Sign Up
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
    </div>
  );
};

export default Login;
