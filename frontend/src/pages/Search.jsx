import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Banner from "../components/Banner";
import SidebarAction from "../actionfunctions/SidebarAction";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (!searchValue.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      const { data } = await axios.get(
        `http://localhost:5000/api/pg/searchPgs?query=${searchValue}`,
        {
          Authorization: `Bearer ${token}`,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(data);
    } catch (error) {
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Search PG by name, location, or amenities..."
              value={query}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 w-[75%] ml-48">
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((pg) => (
              <li key={pg._id} className="p-4 bg-white shadow-md rounded-lg">
                <h3 className="text-lg font-semibold">{pg.name}</h3>
                <p className="text-gray-600">📍 {pg.location}</p>
                <p className="text-gray-500">💰 Price: ₹{pg.price}</p>
                <p className="text-gray-500">
                  🛠️ Amenities: {pg.amenities.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="mt-4 text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
