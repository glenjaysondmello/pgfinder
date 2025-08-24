import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addPg, clearStatus } from "../features/pgslice/pgSlice";
import { AdminLayout } from "./AdminDashboard";
import { FaTimes, FaUpload } from "react-icons/fa";

const AddPg = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((store) => store.pg);
  const loading = status === "loading";
  const error = status === "failed";

  const [pgData, setPgData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    email: "",
    amenities: "",
    price: "",
    availability: true,
    description: "",
  });

  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newFiles]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "amenities") {
      setPgData({
        ...pgData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setPgData({
        ...pgData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    dispatch(addPg({ ...pgData, images }))
      .unwrap()
      .then(() => {
        toast.success("PG Added Successfully");
        setPgData({
          name: "",
          location: "",
          contactNumber: "",
          email: "",
          amenities: "",
          price: "",
          availability: true,
          description: "",
        });
        setImages([]);
        e.target.reset();
      })
      .catch((err) => {
        toast.error(err.message || "Error Adding PG");
        dispatch(clearStatus());
      });
  };

  const inp_box_style =
    "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white transition duration-200";
  const label_style = "block text-sm font-medium text-gray-400 mb-1";

  return (
    <AdminLayout>
      <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Add New PG</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={label_style}>PG Name</label>
              <input
                type="text"
                name="name"
                value={pgData.name}
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div>
              <label className={label_style}>Location</label>
              <input
                type="text"
                name="location"
                value={pgData.location}
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div>
              <label className={label_style}>Price (per month)</label>
              <input
                type="number"
                name="price"
                value={pgData.price}
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div>
              <label className={label_style}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={pgData.contactNumber}
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={label_style}>Email</label>
              <input
                type="email"
                name="email"
                value={pgData.email}
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={label_style}>Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                value={
                  Array.isArray(pgData.amenities)
                    ? pgData.amenities.join(", ")
                    : pgData.amenities
                }
                onChange={handleChange}
                className={inp_box_style}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className={label_style}>Description</label>
              <textarea
                name="description"
                value={pgData.description}
                onChange={handleChange}
                rows="4"
                className={inp_box_style}
                required
              />
            </div>

            <div className="md:col-span-2 p-4 bg-gray-900/50 border border-dashed border-gray-600 rounded-lg">
              <label
                htmlFor="image-upload"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer transition-colors"
              >
                <FaUpload className="text-blue-400" />
                <span className="text-white font-semibold">Upload Images</span>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview ${index}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <input
                type="checkbox"
                name="availability"
                checked={pgData.availability}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-500"
              />
              <label className="text-white font-medium">
                Is this PG currently available?
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding PG..." : "Submit New PG"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddPg;