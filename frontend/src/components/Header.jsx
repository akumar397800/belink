import React from "react";
import logo from "../assets/logo.png";
import loggo from "../assets/loggo.jpg";
import Search from "./Search";
import { Link, useNavigate, useLocation } from "react-router";
import { FaRegUser } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPages = location.pathname === "/search";

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <header className="h-24 lg:h-20 shadow-md sticky top-0 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPages && isMobile) && (
        <div className="container mx-auto flex items-center h-full px-3 justify-between">
          {/**logo */}
          <Link to={"/"}>
            <img
              src={loggo}
              width={70}
              height={13}
              alt="logo"
              className="hidden lg:block"
            />
            <img
              src={loggo}
              width={70}
              height={13}
              alt="logo"
              className="lg:hidden"
            />
          </Link>
          {/**Serach*/}
          <div className="hidden lg:block">
            <Search />
          </div>
          {/**Login */}
          <div>
            {/* This user icon only display in mobile only */}
            <button className="text-neutral-500 lg:hidden">
              <FaRegUser size={26} />
            </button>
            {/* This Login to cart only visible in desktop only */}
            <div className="hidden lg:flex items-center gap-10">
              <button onClick={redirectToLogin} className="text-lg-px-2">Login </button>
              <button className="flex items-center gap-2 bg-green-700 hover:bg-green-900 px-3 py-3 rounded text-white">
                {/* {add to cart } */}
                <div className="animate-bounce">
                  <FaShoppingCart size={26}/>
                </div>
                <div className="font-bold">
                  <p>My cart</p>
                  
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden ">
        <Search />
      </div>
    </header>
  );
};

export default Header;
