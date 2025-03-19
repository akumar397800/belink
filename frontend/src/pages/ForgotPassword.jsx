import React from "react";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToasterror";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
   
    email: ""
    });
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const validValue = Object.values(data).every((e1) => e1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    // for the popup toast when user regiser himself.
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
           
          email: "",
          
         
        });
        navigate("/verification-otp");
      }
      console.log("response", response);
    } catch (error) {
      AxiosToastError(error);
    }
    };
    
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        
        <p className="font-semibold text-lg">Forgot Password</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
           

          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-green-200"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your Email"
            ></input>
          </div>

        
          

          <button
            disabled={!validValue}
            className={`${
              validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }   text-white p-2 rounded font-semibold my-2 `}
          >
            Send OTP
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

export default ForgotPassword;
