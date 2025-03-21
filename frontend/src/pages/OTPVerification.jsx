import React from "react";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToasterror";
import { Link, useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [data, setData] = useState(["","","","","",""]);
  // const inputRef
  
  
  const validValue = data.every(e1=>e1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    // for the popup toast when user regiser himself.
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["","","","","",""]);
        // navigate("/verification-otp");
      }
      console.log("response", response);
    } catch (error) {
      AxiosToastError(error);
    }
    };
    
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        
        <p className="font-semibold text-lg">Enter OTP</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
           

          <div className="grid gap-1">
            <label htmlFor="otp">Enter OTP</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {
                data.map((element, index) => {
                  return (
                    <input
                      key={"otp"+index}
              type="text"
                      id="otp"
                      value={data[index]}
                      onChange={(e) => {
                        const value = e.target.value
                        console.log(value)
                        const newData = [...data]
                        newData[index] = value
                        setData(newData)
                      }}
              maxLength={1}
              autoFocus
              className="bg-blue-50 w-full text-center font-semibold max-w-16 p-2 border rounded outline-none focus:border-green-200"
               ></input>
                  )
                })
              }
            </div>
            
          </div>

        
          

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }   text-white p-2 rounded font-semibold my-2 `}
          >
            Verify OTP
          </button>
        </form>

        <p>
         Already have account?
          <Link to={"/login"} className="font-semibold text-green-600 hover:text-green-900">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OTPVerification;
