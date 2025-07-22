import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchPgs,
  deletePg,
  getPg,
  updatePg,
} from "../features/pgslice/pgSlice";
import Loader from "../animations/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaEye, FaEdit, FaTrash, FaTimes, FaPlusCircle } from "react-icons/fa";

const GetPg = () => {
  const dispatch = useDispatch();
  const { pgRooms, status } = useSelector((store) => store.pg);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchPgs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this PG?"))
      return;
    try {
      await dispatch(deletePg(id)).unwrap();
      toast.success("PG Deleted Successfully");
      dispatch(fetchPgs());
    } catch (error) {
      toast.error("Failed to delete PG");
    }
  };

  const handleEdit = async (id) => {
    try {
      const pgData = await dispatch(getPg(id)).unwrap();
      setEditData({ ...pgData, imagesToDelete: [], newImages: [] });
    } catch (error) {
      toast.error("Failed to load PG details for editing");
    }
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      await dispatch(updatePg(editData)).unwrap();
      toast.success("PG updated successfully");
      setEditData(null);
      dispatch(fetchPgs());
    } catch (error) {
      toast.error(error.message || "Failed to update PG details");
    }
  };

  const handleImageToggleForDelete = (image) => {
    const isMarked = editData.imagesToDelete.includes(image);
    const updatedImagesToDelete = isMarked
      ? editData.imagesToDelete.filter((img) => img !== image)
      : [...editData.imagesToDelete, image];
    setEditData({ ...editData, imagesToDelete: updatedImagesToDelete });
  };

  const renderPgGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {pgRooms.map((pg) => (
        <div
          key={pg._id}
          className="bg-gray-800 rounded-xl shadow-lg flex flex-col"
        >
          <img
            src={
              pg.images?.[0] ||
              "https://via.placeholder.com/400x300.png?text=No+Image"
            }
            alt={pg.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white truncate">{pg.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{pg.location}</p>
            <div className="flex-grow mt-2">
              <p className="text-lg text-green-400 font-semibold">
                ₹{pg.price} / month
              </p>
              <p
                className={`text-sm font-semibold ${
                  pg.availability ? "text-green-400" : "text-red-400"
                }`}
              >
                {pg.availability ? "Available" : "Booked"}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 border-t border-gray-700 pt-3">
              <Link
                to={`/search/pg/${pg._id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 font-semibold px-3 py-2 rounded-md transition-colors duration-200"
              >
                <FaEye />
                <span className="hidden sm:inline">View</span>
              </Link>
              <button
                onClick={() => handleEdit(pg._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-semibold px-3 py-2 rounded-md transition-colors duration-200"
              >
                <FaEdit />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(pg._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 font-semibold px-3 py-2 rounded-md transition-colors duration-200"
              >
                <FaTrash />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold">Edit PG Details</h3>
          <button
            onClick={() => setEditData(null)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Location
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Price
              </label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Contact Number
              </label>
              <input
                type="tel"
                value={editData.contactNumber}
                onChange={(e) =>
                  setEditData({ ...editData, contactNumber: e.target.value })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Amenities (comma separated)
              </label>
              <input
                type="text"
                value={editData.amenities.join(", ")}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    amenities: e.target.value.split(",").map((a) => a.trim()),
                  })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Description
              </label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows="3"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Availability
              </label>
              <select
                value={editData.availability}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    availability: e.target.value === "true",
                  })
                }
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-300">
              Manage Images
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Click on an image to mark it for deletion.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {editData.images?.map((image) => (
                <div
                  key={image}
                  className="relative cursor-pointer group"
                  onClick={() => handleImageToggleForDelete(image)}
                >
                  <img
                    src={image}
                    alt="PG"
                    className="w-full h-24 object-cover rounded-md"
                  />
                  {editData.imagesToDelete.includes(image) && (
                    <div className="absolute inset-0 bg-red-700/60 flex items-center justify-center rounded-md">
                      <FaTrash className="text-white text-2xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  newImages: Array.from(e.target.files),
                })
              }
              className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-700">
          <button
            onClick={() => setEditData(null)}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-semibold transition-colors"
          >
            Update PG
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <Sidebar />
      <header className="fixed top-0 left-0 w-full z-30">
        <Navbar />
      </header>

      <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Admin PG Management
          </h1>
          <Link
            to="/admin/addpg"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200"
          >
            <FaPlusCircle /> Add New PG
          </Link>
        </div>

        {status === "loading" && (
          <div className="flex justify-center pt-20">
            <Loader />
          </div>
        )}
        {status === "failed" && (
          <div className="text-center pt-20">
            <p className="text-red-500">Error loading PGs.</p>
          </div>
        )}
        {status === "succeeded" && renderPgGrid()}
      </main>

      {editData && renderEditModal()}
    </div>
  );
};

export default GetPg;
