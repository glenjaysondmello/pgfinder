import React, { useEffect} from "react";
import { IoIosSearch } from "react-icons/io";
import SidebarAction from "../actionfunctions/SidebarAction";
import { Link } from "react-router-dom";
import Loader from "../animations/Loader";
import BannerAction from "../actionfunctions/BannerAction";
import { useDispatch, useSelector } from "react-redux";
import { searchPgs, setQuery } from "../features/search/searchPgSlice";

const Search = () => {
  const dispatch = useDispatch();
  const {query, results, loading, error} = useSelector((store) => store.search);

  useEffect(() => {
    if(query.trim()) {
      dispatch(searchPgs(query));
    }
  }, [query, dispatch]);

  return (
    <div>
      <BannerAction/>
      <SidebarAction />
      <div className="w-[75%] ml-48 mt-60">
        <div className="relative flex items-center">
          <div className="relative w-full flex items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <IoIosSearch size={24} className="absolute left-4 text-gray-400" />
            <input
              type="text"
              className="w-full py-3 pl-12 pr-4 text-gray-700 bg-transparent rounded-lg outline-none transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search PG by name, location, or amenities..."
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
            />
          </div>
        </div>
      </div>

      {loading && <div className="flex items-center justify-center mt-60"><Loader/></div>}
      {error && <p className="mt-4 text-red-500 flex items-center justify-center">Error</p>}

      <div className="mt-6 w-[75%] ml-48">
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((pg) => (
              <li key={pg._id} className="p-4 bg-white shadow-md rounded-lg">
                <Link to={`/search/pg/${pg._id}`}>
                  <h3 className="text-lg font-semibold">{pg.name}</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {pg.images?.length > 0 ? (
                      pg.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`PG ${pg.name}`}
                          className="w-full h-28 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 col-span-3">
                        No Images Available
                      </p>
                    )}
                  </div>
                  <p className="text-gray-600">📍 {pg.location}</p>
                  <p className="text-gray-500">💰 Price: ₹{pg.price}</p>
                  <p className="text-gray-500">
                    🛠️ Amenities: {pg.amenities.join(", ")}
                  </p>
                </Link>
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
