import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GetPg = () => {
  const [pgRooms, setPgRooms] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchPgs();
  }, []);

  const fetchPgs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/pg/getAllPgs"
      );
      setPgRooms(data);
    } catch (error) {
      console.error("Error fetching PGs:", error);
      toast.error("Error fetching PGs");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/pg/deletePg/${id}`);
      toast.success("PG deleted successfully");
      fetchPgs();
    } catch (error) {
      console.error("Error deleting PG:", error);
      toast.error("Error deleting PG");
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/pg/getPg/${id}`
      );
      setEditData(data);
    } catch (error) {
      console.error("Error fetching PG details:", error);
      toast.error("Failed to load PG details");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pg/updatePg/${editData._id}`,
        editData
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin PG Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pgRooms.map((pg) => (
          <div key={pg._id} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">
              {pg.name} - {pg.location}
            </h3>
            <p className="text-sm text-gray-600">
              Amenities: {pg.amenities.join(", ")}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{pg.price}</p>
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
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
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
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
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
