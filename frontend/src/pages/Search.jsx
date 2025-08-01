import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  searchPgs,
  setQuery,
  clearResults,
} from "../features/search/searchPgSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../animations/Loader";
import { IoIosSearch } from "react-icons/io";
import { FaMapMarkerAlt, FaRupeeSign, FaThList } from "react-icons/fa";

const Search = () => {
  const dispatch = useDispatch();
  const { query, results, loading, error } = useSelector(
    (store) => store.search
  );

  // const { currentUser } = useSelector((store) => store.auth);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(searchPgs(debouncedQuery));
    } else {
      dispatch(clearResults());
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(setQuery(""));
  //   return () => dispatch(clearResults(""));
  // }, [currentUser, dispatch]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Sidebar />
      <header className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 pt-32 sm:pt-40 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Search for PGs
          </h1>
          <div className="relative w-full flex items-center bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out">
            <IoIosSearch size={24} className="absolute left-4 text-gray-400" />
            <input
              type="text"
              className="w-full py-3.5 pl-12 pr-4 text-gray-200 bg-transparent rounded-lg outline-none"
              placeholder="Search by name, location, or amenities..."
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-12">
          {loading && (
            <div className="flex flex-col items-center justify-center pt-20">
              <Loader />
              <p className="mt-4 text-gray-400">Searching...</p>
            </div>
          )}
          {error && (
            <div className="text-center pt-20">
              <p className="text-red-500 text-lg">
                Something went wrong. Please try again.
              </p>
            </div>
          )}
          {!loading &&
            !error &&
            (results.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((pg) => (
                  <li key={pg._id}>
                    <Link
                      to={`/search/pg/${pg._id}`}
                      className="block bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1.5"
                    >
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={
                            pg.images?.[0] ||
                            "https://via.placeholder.com/400x300.png?text=No+Image"
                          }
                          alt={`PG ${pg.name}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white truncate">
                          {pg.name}
                        </h3>
                        <div className="mt-3 space-y-2 text-gray-400 text-sm">
                          <p className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-400" />
                            <span className="truncate">{pg.location}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <FaRupeeSign className="text-green-400" />
                            <span>{pg.price} / month</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <FaThList className="text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {pg.amenities.join(", ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              debouncedQuery && (
                <div className="text-center pt-20">
                  <p className="text-gray-400 text-lg">
                    No results found for "{debouncedQuery}"
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try searching for a different location or amenity.
                  </p>
                </div>
              )
            ))}
        </div>
      </main>
    </div>
  );
};

export default Search;

// useEffect(() => {
//   return () => {
//     dispatch(setQuery(""));
//     dispatch(clearResults());
//   };
// }, [dispatch]);

// useEffect(() => {
//   if (query.trim()) {
//     dispatch(searchPgs(query));
//   }
// }, [query, dispatch]);
