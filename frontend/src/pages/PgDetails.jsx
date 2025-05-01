import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPg } from "../features/pgslice/pgSlice";
import Loader from "../animations/Loader";

const PgDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPg, status, error } = useSelector((store) => store.pg);

  useEffect(() => {
    if (id) {
      dispatch(getPg(id)).unwrap();
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-red-600 text-center mt-4">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-2xl">
      {selectedPg ? (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{selectedPg.name}</h2>
          <p className="text-gray-600 text-lg"><span className="font-semibold">Location:</span> {selectedPg.location}</p>
          <p className="text-gray-600"><span className="font-semibold">Contact Number:</span> {selectedPg.contactNumber}</p>
          <p className="text-gray-600"><span className="font-semibold">Email:</span> {selectedPg.email}</p>
          <p className="text-gray-600"><span className="font-semibold">Amenities:</span> {selectedPg.amenities}</p>
          <p className="text-gray-600"><span className="font-semibold">Price:</span> ₹{selectedPg.price}</p>
          <p className="text-gray-600">
            <span className="font-semibold">Availability:</span>{" "}
            <span className={selectedPg.availability ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {selectedPg.availability ? "Available" : "Not Available"}
            </span>
          </p>
          <p className="text-gray-700 leading-relaxed">{selectedPg.description}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Gallery</h3>
            {selectedPg.images?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedPg.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`PG ${selectedPg.name}`}
                    className="rounded-lg object-cover w-full h-60 shadow-md"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No Images Available</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No PG Found</p>
      )}
    </div>
  );
};

export default PgDetails;
