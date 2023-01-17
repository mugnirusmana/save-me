import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Home = () => {
  const auth = useSelector(({ auth }) => auth);
  return (
    <div className="w-full h-screen flex flex-col text-center items-center justify-center">
      Home
      <Link
        to={auth?.token ? '/dashboard' : '/login'}
        className="inline-block px-6 py-2 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
      >{auth?.token ? 'Dashboard' : 'Login'}</Link>
    </div>
  );
};

export default Home;
