import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import $ from "jquery";

import Atropos from "atropos";

import "./auth.scss";

const Login = () => {
  const atroRef = useRef(null);

  const screenWidth = useSelector((state) => state.screenWidth);

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
                      <div className='auth-title'>Welcome to Inventory One</div>
                      <form action='' className='auth-form'>
                        <div className='auth-inputBx'>
                          <input type='text' required='required' />
                          <span>Login</span>
                          <i className='fas fa-user-circle'></i>
                        </div>
                        <div className='auth-inputBx password'>
                          <input
                            id='password-input'
                            type='password'
                            name='password'
                            required='required'
                          />
                          <span>Password</span>

                          <i className='fas fa-key'></i>
                        </div>
                        <div className='auth-inputBx'>
                          <input type='submit' value='Log in' disabled />
                        </div>
                      </form>

                      <div className='auth-dha'>
                        Don't have an account{" "}
                        <a href='/signup' className='auth-redir'>
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
