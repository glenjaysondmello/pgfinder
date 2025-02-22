import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import Banner from "../components/Banner";
import SidebarAction from "../actionfunctions/SidebarAction";

const Search = () => {
  const dispatch = useDispatch();
  const { query, results, loading, error } = useSelector(
    (store) => store.search
  );
  const { open } = useSelector((store) => store.sidebar);

  const handleSearchChange = () => {};

  return (
    <div>
      <Banner />
      <SidebarAction />
      <div className="w-[75%] ml-48 mt-20">
        <div className="relative flex items-center">
          <div className="relative w-full flex items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <IoIosSearch size={24} className="absolute left-4 text-gray-400" />
            <input
              type="text"
              className="w-full py-3 pl-12 pr-4 text-gray-700 bg-transparent rounded-lg outline-none transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search. . ."
              // value={query}
              // onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Search;
