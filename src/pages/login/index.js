import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import {
  signIn,
  defaultSignIn
} from './../../redux/authSlice';

import { getWindowDimensions } from './../../helper';

const Login = () => {
  const dispatch = useDispatch();
  const auth = useSelector(({ auth }) => auth);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const desktopSize = 1025;
  const [field, setField] = useState({
    username: {
      value: '',
      type: 'text',
      isError: false,
      errorMessage: '',
    },
    password: {
      value: '',
      type: 'password',
      isError: false,
      errorMessage: '',
    }
  });

  const onSubmit = () => {
    let resultValidateUsername = validateUsername(field?.username?.value);
    let resultValidatePassword = validatePassword(field?.password?.value);

    if (!resultValidateUsername?.isError && !resultValidatePassword?.isError) {
      dispatch(signIn({username: field?.username?.value, password: field?.password?.value}, windowDimensions?.width, desktopSize));
    } else {
      setField({
        username: {
          ...field?.username,
          isError: resultValidateUsername?.isError,
          errorMessage: resultValidateUsername?.errorMessage
        },
        password: {
          ...field?.password,
          isError: resultValidatePassword?.isError,
          errorMessage: resultValidatePassword?.errorMessage
        }
      })
    }
  }

  useEffect(() => {
    dispatch(defaultSignIn());

    const handleResize = () => setWindowDimensions(getWindowDimensions())
    window.addEventListener('resize', handleResize);

    return () => {
      dispatch(defaultSignIn());
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    let {
      isLoading,
      isError,
      isSuccess,
      errorMessage
    } = auth;

    if (!isLoading && isError) {
      alert(errorMessage??'Something went wrong!');
      dispatch(defaultSignIn());
    }

    if (!isLoading && isSuccess) {
      dispatch(defaultSignIn());
      //automatic redirect to dashboard / next authed path
    }
  }, [auth]);

  const validateUsername = (value) => {
    let result = {
      isError: false,
      errorMessage: '',
    }
    let name = 'Username';

    if(!value) {
      result.isError = true;
      result.errorMessage = `${name} is required`;
    }

    return result;
  }

  const validatePassword = (value) => {
    let result = {
      isError: false,
      errorMessage: '',
    }
    let name = 'Password';

    if(!value) {
      result.isError = true;
      result.errorMessage = `${name} is required`;
    }

    return result;
  }

  return (
    <form className="w-full tablet:w-[400px] h-fit p-10 rounded-md bg-white shadow-md drop-shadow-md flex flex-col gap-5">
      <span className="text-center font-bold mb-5">Login To Your Account</span>
      <div className="w-full">
        <input
          type="text"
          className={`h-[40px] rounded w-full outline-none bg-[#E8F0FF] px-2 borde ${field?.username?.isError ? 'border-red-400' : 'border-transparent'}`}
          placeholder="Username"
          value={field?.username?.value}
          onChange={(e) => {
            let resultValidate = validateUsername(e?.currentTarget?.value);
            setField({...field, username: {
              ...field.username,
              value: e?.currentTarget?.value,
              isError: resultValidate?.isError,
              errorMessage: resultValidate?.errorMessage,
            }})
          }}
        />
        <span className="text-red-400 text-xs">{field?.username?.isError ? field?.username?.errorMessage : ''}</span>
      </div>
      <div className="w-full mb-5">
        <div className="w-full h-[40px] flex flex-row bg-[#E8F0FF] rounded">
          <input
            type={field?.password?.type}
            className={`h-full rounded w-full bg-[#E8F0FF] outline-none px-2 borde ${field?.password?.isError ? 'border-red-400' : 'border-transparent'}`}
            placeholder="Password"
            value={field?.password?.value}
            autoComplete="on"
            onChange={(e) => {
              let resultValidate = validatePassword(e?.currentTarget?.value);
              setField({...field, password: {
                ...field.password,
                value: e?.currentTarget?.value,
                isError: resultValidate?.isError,
                errorMessage: resultValidate?.errorMessage,
              }})
            }}
          />
          <div
            className="w-[50px] h-full cursor-pointer rounded flex flex-row items-center justify-center"
            onClick={() => {
              setField({
                ...field,
                password: {
                  ...field?.password,
                  type: field?.password?.type === 'password' ? 'text' : 'password',
                }
              })
            }}
          >
            {field?.password?.type === 'password' ? <i className="fa-solid fa-lock"></i> : <i className="fa-solid fa-lock-open"></i>}
          </div>
        </div>
        <span className="text-red-400 text-xs">{field?.password?.isError ? field?.password?.errorMessage : ''}</span>
      </div>
      <div
        className="w-full h-[40px] bg-sky-600 rounded cursor-pointer flex items-center justify-center text-center font-bold text-white"
        onClick={onSubmit}
      >{auth?.isLoading ? 'Loading...' : 'LOGIN'}</div>
    </form>
  );
};

export default Login;
