import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import BannerAction from "../actionfunctions/BannerAction";

const GetPg = () => {
  const [pgRooms, setPgRooms] = useState([]);
  const [editData, setEditData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPgs();
  }, []);

  // Fetch all PGs
  const fetchPgs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/pg/getAllPg",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPgRooms(data);
    } catch (error) {
      console.error("Error fetching PGs:", error);
      toast.error("Error fetching PGs");
    }
  };

  // Delete PG
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/pg/deletePg/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("PG deleted successfully");
      fetchPgs();
    } catch (error) {
      console.error("Error deleting PG:", error);
      toast.error("Error deleting PG");
    }
  };

  // Fetch PG details for editing
  const handleEdit = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/pg/getPg/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setEditData({ ...data, imagesToDelete: [], newImages: [] });
    } catch (error) {
      console.error("Error fetching PG details:", error);
      toast.error("Failed to load PG details");
    }
  };

  const handleUpdate = async () => {
    if (!editData) return;

    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("location", editData.location);
    formData.append("price", editData.price);
    formData.append("amenities", editData.amenities.join(", "));
    formData.append("availability", editData.availability);
    formData.append("contactNumber", editData.contactNumber);
    formData.append("email", editData.email);

    editData.imagesToDelete.forEach((image) =>
      formData.append("imagesToDelete", image)
    );

    editData.newImages.forEach((image) => formData.append("newImages", image));

    try {
      await axios.patch(
        `http://localhost:5000/api/pg/updatePg/${editData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("PG details updated successfully");
      setEditData(null);
      fetchPgs();
    } catch (error) {
      console.error("Error updating PG:", error);
      toast.error("Error updating PG");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <BannerAction />
      <h2 className="text-3xl font-bold text-white flex items-center justify-center mt-36 mb-12">
        Admin PG Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pgRooms.map((pg) => (
          <div key={pg._id} className="bg-white p-4 shadow-md rounded-lg">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {pg.images?.length > 0 ? (
                pg.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`PG ${pg.name}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-3">
                  No Images Available
                </p>
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {pg.name} - {pg.location}
            </h3>
            <p className="text-sm text-gray-600">
              Amenities: {pg.amenities.join(", ")}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{pg.price}</p>
            <p className="text-sm text-gray-600">
              Availability: {pg.availability ? "Available" : "Not Available"}
            </p>
            <p className="text-sm text-gray-600">Contact: {pg.contactNumber}</p>
            <p className="text-sm text-gray-600">Email: {pg.email}</p>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(pg._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pg._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-2">Edit PG Details</h3>
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">Location</label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">Amenities</label>
            <input
              type="text"
              value={editData.amenities.join(", ")}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amenities: e.target.value.split(", "),
                })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">Price</label>
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">Availability</label>
            <input
              type="text"
              value={editData.availability}
              onChange={(e) =>
                setEditData({ ...editData, availability: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">
              Contact Number
            </label>
            <input
              type="tel"
              value={editData.contactNumber}
              onChange={(e) =>
                setEditData({ ...editData, contactNumber: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />

            <h4 className="text-sm font-semibold">
              Current Images
              <br />
              (Select the Images If you want to Delete them){" "}
            </h4>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {editData.images?.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt="PG"
                    className="w-full h-20 object-cover rounded"
                  />
                  <input
                    type="checkbox"
                    className="absolute top-0 right-0 m-1"
                    onChange={(e) => {
                      const updatedImages = e.target.checked
                        ? [...editData.imagesToDelete, image]
                        : editData.imagesToDelete.filter(
                            (img) => img !== image
                          );
                      setEditData({
                        ...editData,
                        imagesToDelete: updatedImages,
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full p-2 border rounded mb-2"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  newImages: [...editData.newImages, ...e.target.files],
                })
              }
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditData(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetPg;
