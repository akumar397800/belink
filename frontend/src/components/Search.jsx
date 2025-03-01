import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {

    const navigate = useNavigate()
    const location = useLocation()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [isMobile] = useMobile()

    
  useEffect(() => {
    const isSearch = location.pathname === "/search"
    setIsSearchPage(isSearch) //
    },[location])
    const redirectToSearchPage = ()=> {
        navigate("/search")
    }
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-yellow-200">
      <div>
      {/* <button className="flex justify-center items-center h-full p-3 text-neutral-600 group-focus-within:text-amber-300">
        <FaSearch size={22} />
        </button> */}

        {
          (isMobile && isSearchPage) ? (
            <Link to="/" className="flex justify-center items-center h-full p-2 m-1 text-neutral-600 group-focus-within:text-amber-300 bg-white shadow-md">
          <FaArrowLeft size={22} />
        </Link>
          ) :
            (<button className="flex justify-center items-center h-full p-3 text-neutral-600 group-focus-within:text-amber-300">
        <FaSearch size={22} />
        </button>)
        }
        
      </div>
          
      <div className="w-full h-full">
        {
          !isSearchPage ? (
            //not in search page
            <div onClick={redirectToSearchPage} className="w-full h-full flex justify items-center">
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'Search "Milk"',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'Search "Paneer"',
            1000,
            'Search "Bread"',
            1000,
            'Search "Sugar"',
                      1000,
            'Search "Almond"',
                      1000,
            'Search "Nuts"',
                      1000,
            'Search "Groceries"',
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: "1em", display: "inline-block" }}
          repeat={Infinity}
        />
      </div>
          ): (
              //in search page
              <div className="w-full h-full">
                <input
                  type="text"
                  placeholder="Search for the atta-dal and more thing"

                  className="bg-transparent h-full w-full outline-none"
                />
              </div>
          )
        }
      </div>
      
    </div>
  );
};

export default Search;
