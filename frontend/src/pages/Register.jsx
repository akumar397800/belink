import React from "react";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/SummaryApi";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    const handleSubmit = async(e) => { 
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error(
                "Password and Confirm Password must be the same"
            )
            return
        }

        const response = await Axios({
            ...SummaryApi.register
        })
        console.log("response" ,response)
        
    }
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p>Welcome to Belink </p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-green-200"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your Nmae"
            ></input>
          </div>

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

          <div className="grid gap-1">
            <label htmlFor="password">Password</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-green-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoFocus
                className="w-full outline-none"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter the password"
              ></input>
            </div>
            <div
              onClick={() => setShowPassword((preve) => !preve)}
              className="cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword">confirmPassword</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-green-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                autoFocus
                className="w-full outline-none"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="COnfirm Password"
              ></input>
            </div>
            <div
              onClick={() => setShowConfirmPassword((preve) => !preve)}
              className="cursor-pointer"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          <button disabled={!validValue} className={`${validValue?"bg-green-800 hover:bg-green-700":"bg-gray-500"}   text-white p-2 rounded font-semibold my-2 `}>
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
