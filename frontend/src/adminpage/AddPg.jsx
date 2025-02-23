import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddPg = () => {
  const [pgData, setPgData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    amenities: "",
    price: "",
    availability: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPgData({
      ...pgData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatData = {
      ...pgData,
      amenities: pgData.amenities.split(",").map((a) => a.trim()),
      price: Number(pgData.price),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pg/addPg", formatData, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("PG added successfully");
      setPgData({
        name: "",
        location: "",
        contactNumber: "",
        email: "",
        amenities: "",
        price: "",
        availability: true,
      });
    } catch (error) {
      console.log("Error adding PG:", error);
      toast.error("Error adding PG");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New PG</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="PG Name"
            value={pgData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={pgData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={pgData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={pgData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={pgData.amenities}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={pgData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="availability"
              checked={pgData.availability}
              onChange={handleChange}
              className="mr-2"
            />
            Available
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add PG
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPg;
