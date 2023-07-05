import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Atropos from "atropos";

import "./auth.scss";

import { signup } from "../../store/auth/auth";
import { dispatchSetLoading } from "../../store/global/loading";

import NameSvg from "./svg/NameSvg";

const Signup = () => {
  const atroRef = useRef(null);

  const dispatch = useDispatch();

  const screenWidth = useSelector((state) => state.screenWidth);

  const authState = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  //error states
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [noPass, setNoPass] = useState(false);
  const [noName, setNoName] = useState(false);
  const [noEmail, setNoEmail] = useState(false);

  function squareAnimation() {} // add last/ later

  async function handleSubmit(e) {
    e.preventDefault();

    let missing = false;

    //set error states to false
    setEmailExistsError(false);
    setNoName(false);
    setNoPass(false);
    setNoEmail(false);

    //set loading to true
    dispatch(dispatchSetLoading(true));

    if (!name || !name.length) {
      setNoName(true);
      missing = true;
    }

    if (!passInput || !passInput.length) {
      setNoPass(true);
      missing = true;
    }

    if (!emailInput || !emailInput.length) {
      setNoEmail(true);
      missing = true;
    }

    if (missing) return;

    const obj = {
      email: emailInput,
      password: passInput,
      name: name,
    };

    dispatch(signup(obj)).then((resp) => {
      if (resp === "email-exists") {
        setEmailExistsError(true);
        return;
      }

      //has user, has id in result = successful
      if (resp?.id) {
        squareAnimation(); // add this later
        window.location.href = "/";
      }
    });

    dispatch(dispatchSetLoading(false));
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

  if (authState.id) {
    return (window.location.href = "/");
  }

  return (
    <div className='auth-parent'>
      <div className='auth-inner'>
        <div className='auth-sqcontainer'>
          <div className='square'></div>
          <div className='square'></div>
          <div className='square'></div>
          <div className='square2'></div>
          <div className='square2'></div>
          <div className='square2'></div>
        </div>

        <div class='atropos my-atropos'>
          <div class='atropos-scale'>
            <div class='atropos-rotate'>
              <div class='atropos-inner'>
                <div className='auth-box'>
                  <div className='container'>
                    <div className='form'>
                      <a
                        href='https://chicagocitysports.com/'
                        rel='noopener noreferrer'
                        target='_blank'
                        style={{ alignSelf: "center" }}
                      >
                        <img
                          src='/assets/loginlogo.jpeg'
                          className='auth-logo'
                        />
                      </a>
                      <div className='auth-title'>Sign Up</div>
                      <div className='auth-form'>
                        {noName && (
                          <div className='auth-error'>Name is required</div>
                        )}

                        <div className='auth-inputBx'>
                          <input
                            type='text'
                            required='required'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          />
                          <span>Name</span>
                          <NameSvg />{" "}
                        </div>

                        {emailExistsError && (
                          <div className='auth-error'>Email already exists</div>
                        )}

                        <div className='auth-inputBx'>
                          <input
                            type='text'
                            required='required'
                            onChange={(e) => setEmailInput(e.target.value)}
                            value={emailInput}
                          />
                          <span>Email</span>
                          <i className='fas fa-user-circle'></i>
                        </div>
                        <div className='auth-inputBx password'>
                          <input
                            id='password-input'
                            type='password'
                            name='password'
                            required='required'
                            value={passInput}
                            onChange={(e) => setPassInput(e.target.value)}
                          />
                          <span>Password</span>

                          <i className='fas fa-key'></i>
                        </div>
                        <div className='auth-inputBx'>
                          <button
                            onClick={(e) => {
                              handleSubmit(e);
                            }}
                            className='auth-sub'
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>

                      <div className='auth-dha'>
                        Already have an account?{" "}
                        <a href='/login' className='auth-redir'>
                          Login
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

export default Signup;
