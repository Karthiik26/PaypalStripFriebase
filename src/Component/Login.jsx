import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";

const Login = () => {  const [InputData, setInputData] = useState({
    Email: "",
    Password: "",
  });

  const HandleInputDataOnchange = (e) => {
    const { name, value } = e.target;
    setInputData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };
  const nav= useNavigate();

  const HandleOnSubmitRegister = async (e) => {
    e.preventDefault();
    console.log(InputData);
    try {
      const userCheck = await signInWithEmailAndPassword(auth, InputData.Email, InputData.Password);
      console.log(userCheck);
      console.log("User Logged Successfully");
      nav('/')
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <>
      <div className="flex items-center justify-center h-screen bg-slate-400">
        <div className="bg-slate-50 p-8 rounded-lg text-black w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="flex justify-center flex-col items-center gap-3">
            <h2 className="text-3xl font-sans font-bold">Welcome Back !! </h2>
            <h2 className="text-2xl font-serif font-semibold">Login</h2>
          </div>
          <form onSubmit={HandleOnSubmitRegister} >
            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Email" className="font-snas font-medium">
              Enter Your Email
              </label>
              <input
                type="email"
                required
                name="Email"
                onChange={HandleInputDataOnchange}
                id="Email"
                className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
              />
            </div>

            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Password" className="font-snas font-medium">
              Enter Your Password
              </label>
              <input
                type="password"
                required
                onChange={HandleInputDataOnchange}
                name="Password"
                id="Password"
                className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
              />
            </div>

            <div className="flex flex-col justify-center gap-4 m-6">
              <button className="text-xl py-2.5 px-4 bg-blue-600 font-bold rounded-xl text-white" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="flex flex-col justify-center gap-4">
            <NavLink to={'/Register'} className="text-lg" >
              New User ? <span className="text-blue-800 font-extrabold hover:text-blue-700 cursor-pointer" >Register</span>{" "}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
