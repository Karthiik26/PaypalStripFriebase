import React, { useEffect, useState } from "react";
import Purchase from "./Purchase";
import { auth, database } from "../Firebase/firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const WelcomePage = ({ data, UserId }) => {
  const nav = useNavigate();

  const HandleLogout = async () => {
    await auth.signOut();
    nav("/Login");
  };
  console.log(data);


  return (
    <>
      <div className="text-right bg-orange-200">
        <button
          onClick={HandleLogout}
          className="text-xl bg-red-400 mx-8 my-4 px-10 py-4 font-sans font-bold tracking-wider text-white rounded-3xl"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-screen bg-orange-200 ">
        <div className=" bg-white shadow-xl p-6 rounded-lg text-black w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="flex justify-center flex-col items-center gap-3">
            <h2 className="text-3xl font-sans font-bold">
              Welcome {data?.Name}
            </h2>
            <div className="font-sans font-bold">
{
  data?.Purchase?.map(item=>(
    <div className="flex gap-4" >

    <div>{item.imgdata}</div>
    {item.PaymentStatus === "Completed" ? (
      <div className="text-green-900" >Purchased</div>
    ) : ( <div className="text-red-400" > Not Purchased</div>) }
    </div>
  ))
}

            </div>
          </div>
        </div>
        <div className="bg-white shadow-xl p-8 my-5 md:w-1/2 lg:w-1/3 xl:w-1/2  rounded-2xl">
          <Purchase dataarray={data} UserId={UserId} />
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
