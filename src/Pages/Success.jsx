import React from "react";

const Success = ({ SuccessMsg }) => {
  return (
    <>
      <div className="flex-col gap-5 absolute top-0 bottom-0 left-0 right-0 w-full bg-yellow-300 opacity-95 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg text-black">
          <h3 className="text-2xl font-bold font-serif">
            successfully Purchased One Image Know You Can Download Purchased
            Image
          </h3>
          <h3 className="text-xl font-bold font-serif">Your Order Id : {SuccessMsg}</h3>
        </div>
      </div>
    </>
  );
};

export default Success;
