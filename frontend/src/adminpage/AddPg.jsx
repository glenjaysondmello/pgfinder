import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addPg } from "../features/pgslice/pgSlice";

const AddPg = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((store) => store.pg);
  const loading = status === "loading";

  const [pgData, setPgData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    amenities: "",
    price: "",
    availability: true,
  });

  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPgData({
      ...pgData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(addPg({ ...pgData, images }))
      .then(() => {
        toast.success("PG Added Successfully");
      })
      .catch(() => {
        toast.error("Error Adding PG");
      });

    setPgData({
      name: "",
      location: "",
      contactNumber: "",
      email: "",
      amenities: "",
      price: "",
      availability: true,
    });
    setImages([]);
  };

  const inp_box_style =
    "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-purple-900 flex items-center justify-center p-4">
      <div className="dark-animated-container">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Add New PG
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="PG Name"
            value={pgData.name}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={pgData.location}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={pgData.contactNumber}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={pgData.email}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={pgData.amenities}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={pgData.price}
            onChange={handleChange}
            className={inp_box_style}
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={pgData.availability}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-white text-sm">Available</label>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={inp_box_style}
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transform hover:scale-[1.02] transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add PG"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPg;
