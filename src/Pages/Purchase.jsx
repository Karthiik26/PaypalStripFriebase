import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import { auth, database } from "../Firebase/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Success from "./Success";
import { loadStripe } from '@stripe/stripe-js';

const Purchase = ({dataarray, UserId }) => {

  const [GettingData,setGettingData] = useState([]);

  console.log(dataarray);
  
  const isImagePresent = (imgname) => GettingData?.includes(imgname);

  const nav = useNavigate();

  const [Data, setData] = useState({
    image1: "image-wonder",
    image2: "image-thunder",
  });

  // Creating an order directly with PayPal API -----------------------------------
  const calculatediscount = (data) => {
    if (InputData.Coupon === "CALAI") {
      const dis = data * 0.1;
      const total = data - dis;
      return total;
    } else {
      return data;
    }
  };

  // coupan code setup ---------------------------------------
  const [CoupanPaypal, setCoupanPaypal] = useState(false);

  const [InputData, setInputData] = useState({
    Coupon: "",
  });

  const HandleInputDataOnchange = (e) => {
    const { name, value } = e.target;
    setInputData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const HandleOnSubmitRegister = async (e) => {
    e.preventDefault();
    if (InputData.Coupon === "CALAI") {
      alert("You have Got Discount of 10%");
      setCoupanPaypal(false);
      setAllowPaypal(true);
    } else {
      setAllowPaypal(false);
      alert("Coupon Is Not Valid");
    }
  };

  const handlePayWithoutCoupon = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setCoupanPaypal(false);
    }, 100);
    setAllowPaypal(true);
  };

  // Paypal ---------------------------------------------
  const initialOptions = {
    clientId:
      "AaB9vVN-inMlP_CqyL0UVLRupblObT9h_pjinyX9oHYOrmmTeUh_1rDWJmAij0ilToDL_69AZX4fZCez",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
  };
  const purchaseId1 = uuidv4();

  // const [PaymentDonePaypal, setPaymentDonePaypal] = useState(false);
  const [AllowPaypal, setAllowPaypal] = useState(false);
  const [paymentButton, setpaymentButton] = useState(true);



  const [openSuccessMsg, setopenSuccessMsg] = useState(false);
  const [SuccessMsg, setSuccessMsg] = useState({
    OrderId: "",
  });

  const HandlePaypalPayment = () => {
    setCoupanPaypal(true);
  };

  // Creating Order and orderid
  const createOrder = async () => {
    try {
      const Dataimage = Data.image1;

      const response = await fetch(
        "https://api-m.sandbox.paypal.com/v2/checkout/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
              "AaB9vVN-inMlP_CqyL0UVLRupblObT9h_pjinyX9oHYOrmmTeUh_1rDWJmAij0ilToDL_69AZX4fZCez:EHK_nNEDHpxrPR_OAfux2FKy4x5m4vZoUNdLTFiZsdi3PrMT7wIITCSH2iyAhu8vZNBSZTrXztYZI6vY"
            )}`,
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: calculatediscount(10),
                },
                description: Dataimage,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (response.status !== 201) {
        console.log(data.error, "Failed to create order");
      }

      // console.log("Order created successfully:", data);

      return data.id;
    } catch (error) {
      console.error(error);
    }
  };

  //capture PayPal order
  const onApprove = async (data, action) => {
    try {
      const response = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
              "AaB9vVN-inMlP_CqyL0UVLRupblObT9h_pjinyX9oHYOrmmTeUh_1rDWJmAij0ilToDL_69AZX4fZCez:EHK_nNEDHpxrPR_OAfux2FKy4x5m4vZoUNdLTFiZsdi3PrMT7wIITCSH2iyAhu8vZNBSZTrXztYZI6vY"
            )}`,
          },
        }
      );

      setSuccessMsg(data.orderID);

      const details = await response.json();

      if (response.status !== 201) {
        // console.log(details.error || "Failed to capture order");
        alert(details.error || "Failed to capture order");
      }

      const { payer } = details;

      try {
        const Dataimage = Data.image1;

        const CheckUser = doc(database, "Users", UserId);

        await updateDoc(CheckUser, {
          Purchase: arrayUnion({
            imgdata: Dataimage,
            orderid: data.orderID || "",
            PaymentStatus: "Completed",
            PaymentDetails: details,
            timestamp: new Date(),
          }),
        });

        alert(`Transaction completed by ${payer.name.given_name}`);
        setCoupanPaypal(false);
        setAllowPaypal(false);
        setpaymentButton(false);
        // setPaymentDonePaypal(true);
        setopenSuccessMsg(true);
        setTimeout(() => {
          setopenSuccessMsg(false);
        }, 3000);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    } catch (error) {
      console.error("Error capturing order:", error);
    }
  };

  // Stripe
  const [PaymentDoneStrip, setPaymentDoneStrip] = useState(false);
  const [AllowStripe, setAllowStripe] = useState(false);

  // pk_test_51PgXNNRt2f1N5NuC8pXqoEwyLO5eZ8oSjxt6LQd1ludkh7Ybrcs0Y5Y0GwLnsWE4CI8S9SiGbNkkYlL937UKVDCV00ZOEk0ixZ

  const stripePromise = loadStripe('pk_test_51PgXNNRt2f1N5NuC8pXqoEwyLO5eZ8oSjxt6LQd1ludkh7Ybrcs0Y5Y0GwLnsWE4CI8S9SiGbNkkYlL937UKVDCV00ZOEk0ixZ');

  const HandleStripPayment = async () => {
   const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: 'prod_QXd0wCzSN1YRRu', 
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/',
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <>
      {/* Paypay & stripe cards */}
      <div className="flex gap-10 justify-center flex-col">

        {/* Paypal payment */}
        <div className="flex flex-row justify-center gap-20 mx-6 items-center ">
          <div>
            <img src={image1}  alt="" width={400} />
          </div>
          <div className="flex flex-col gap-6 font-sans font-bold">
            <div className="text-xl font-bold font-sans" >Title  : {Data.image1}</div>

            {
              dataarray?.Purchase?.find((item) => item.imgdata === "image-wonder") ? (
                  <button className="text-xl py-4 px-2 bg-green-400">
                      <a href={image1} download>Download </a>
                    </button>
              ): (

                      paymentButton && (
                        <button
                          onClick={HandlePaypalPayment}
                          className="text-xl py-4 px-2 text-white bg-blue-600"
                        >
                          Puchase To Download
                        </button>)
              )
            }

          </div>
        </div>

        <hr className="border border-black" />

        {/* strip paymeny */}
        <div className="flex flex-row justify-center gap-20 mx-6 items-center ">
          <div>
            <img src={image2} alt="" width={400} />
          </div>
          <div className="flex flex-col gap-6 font-sans font-bold">
          <div>{Data.image2}</div>
            <button
              onClick={HandleStripPayment}
              className="text-xl py-4 px-2 text-white bg-blue-600"
            >
              Puchase To Download
            </button>

            {PaymentDoneStrip && (
              <button className="text-xl py-4 px-2 bg-green-400">
                Download
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Paypal Setup */}
      <div>
        {AllowPaypal && (
          <div className="flex-col gap-5 absolute top-0 bottom-0 left-0 right-0 w-full bg-green-300 opacity-90 flex items-center justify-center h-screen">
            <div
              className="text-3xl text-red-800 cursor-pointer"
              onClick={() => setAllowPaypal(false)}
            >
              x
            </div>
            <div className="bg-white p-8 rounded-lg text-black">
              <div>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    style={styles}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Code */}
      <div>
        {CoupanPaypal && (
          <div className="flex-col gap-5 absolute top-0 bottom-0 left-0 right-0 w-full bg-gray-300 opacity-90 flex items-center justify-center h-screen">
            <div
              className="text-3xl text-red-800 cursor-pointer"
              onClick={() => setCoupanPaypal(false)}
            >
              x
            </div>
            <div className="bg-white p-8 rounded-lg text-black">
              <div className="text-3xl font-sans font-bold">
                {" "}
                Coupon code To Get Discount
              </div>
              <form onSubmit={HandleOnSubmitRegister}>
                <div className="flex flex-col justify-center gap-2 my-4">
                  <label htmlFor="Email" className="font-snas font-medium">
                    Enter Your Coupon
                  </label>
                  <input
                    type="text"
                    required
                    name="Coupon"
                    id="Coupon"
                    onChange={HandleInputDataOnchange}
                    className="py-2 px-3 text-xl border border-slate-400 rounded-lg focus:outline-blue-600"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-900 text-white font-bold rounded-full"
                  >
                    Add Coupan Code & Pay
                  </button>
                </div>
              </form>
              <div>
                <button
                  onClick={handlePayWithoutCoupon}
                  className="py-2 px-4 my-4 bg-green-900 text-white font-bold rounded-full"
                >
                  Pay Without Coupon Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

{/* // Success Message */}
      <div>
        {openSuccessMsg && (
          <Success SuccessMsg={SuccessMsg} />
        )}
      </div>
    </>
  );
};

export default Purchase;
