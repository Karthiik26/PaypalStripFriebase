import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, database } from "../Firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

const Register = () => {
  const [InputData, setInputData] = useState({
    Name: "",
    Email: "",
    Password: "",
    Phone: "",
  });

  const nav= useNavigate()

  const HandleInputDataOnchange = (e) => {
    const { name, value } = e.target;
    setInputData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const HandleOnSubmitRegister = async (e) => {
    e.preventDefault();
    console.log(InputData);
    try {
      await createUserWithEmailAndPassword(
        auth,
        InputData.Email,
        InputData.Password
      );
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(database, "Users", user.uid), {
          Email:user.email,
          Name:InputData.Name,
          Phone:InputData.Phone,
          Purchase: []
        })
        console.log("User Registedd Successfullyy");
        nav('/Login');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-slate-400">
        <div className="bg-slate-50 border p-8 rounded-lg text-black w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="flex justify-center flex-col items-center gap-3">
            <h2 className="text-3xl font-sans font-bold">Register </h2>
            <h2 className="text-md font-serif font-semibold">Join With Us</h2>
          </div>

          <form onSubmit={HandleOnSubmitRegister}>
            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Name" className="font-snas font-medium">
                Enter Your Name
              </label>
              <input
                type="text"
                required
                name="Name"
                id="Name"
                className="py-2 px-3 text-xl border  border-slate-400 rounded-lg focus:outline-blue-600"
                onChange={HandleInputDataOnchange}
              />
            </div>
            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Email" className="font-snas font-medium">
                Enter Your Email
              </label>
              <input
                type="email"
                required
                name="Email"
                id="Email"
                className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
                onChange={HandleInputDataOnchange}
              />
            </div>

            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Phone" className="font-snas font-medium">
                Enter Your Phone Number
              </label>
              <input
                type="number"
                required
                name="Phone"
                id="Phone"
                className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
                onChange={HandleInputDataOnchange}
              />
            </div>

            <div className="flex flex-col justify-center gap-2 my-4">
              <label htmlFor="Password" className="font-snas font-medium">
                Enter Password
              </label>
              <input
                type="password"
                required
                name="Password"
                id="Password"
                className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
                onChange={HandleInputDataOnchange}
              />
            </div>

            <div className="flex flex-col justify-center gap-4 m-6">
              <button
                className="text-xl py-2.5 px-4 bg-blue-600 font-bold rounded-xl text-white"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
          <div className="flex flex-col justify-center gap-4">
            <NavLink to={"/Login"} className="text-lg">
              Already User ?{" "}
              <span className="text-blue-800 font-extrabold hover:text-blue-700 cursor-pointer">
                Login
              </span>{" "}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
