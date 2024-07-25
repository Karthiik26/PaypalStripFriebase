import React, { useEffect, useState } from "react";
import WelcomePage from "../Pages/WelcomePage";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../Firebase/firebase";

const Home = () => {

  const [GettingData, setGettingData] = useState({})
  const [UserId, setUserId] = useState()

  const FetUsersDetails = () => {
    auth.onAuthStateChanged(async (user) => {
      const CheckEmail = doc(database, "Users", user.uid);
      const Getdata = await getDoc(CheckEmail);
      if (Getdata.exists()) {
        setGettingData(Getdata.data());
        setUserId(user.uid)
      }  
    });
  };

  useEffect(() => {
    FetUsersDetails();
  }, []);


  return (
    <>
      <WelcomePage data={GettingData} UserId={UserId} />
    </>
  );
};

export default Home;
