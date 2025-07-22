import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addPg } from "../features/pgslice/pgSlice";

// Components & Icons (Assuming you have these set up)
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaTimes, FaUpload } from "react-icons/fa";

// A simple layout component for consistent page structure
const AdminLayout = ({ children }) => (
  <div className="bg-gray-900 min-h-screen">
    <Sidebar />
    <header className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </header>
    <main className="container mx-auto px-4 pt-28 sm:pt-32 pb-16">
      {children}
    </main>
  </div>
);

const AddPg = () => {
  // --- Your original logic starts here ---
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
    description: "",
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
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    
    dispatch(addPg({ ...pgData, images, amenities: pgData.amenities.split(',').map(a => a.trim()) }))
      .unwrap()
      .then(() => {
        toast.success("PG Added Successfully");
        setPgData({
          name: "", location: "", contactNumber: "", email: "", amenities: "",
          price: "", availability: true, description: ""
        });
        setImages([]);
        e.target.reset();
      })
      .catch(() => {
        toast.error("Error Adding PG");
      });
  };
  // --- Your original logic ends here ---
  
  // New UI logic for removing a previewed image
  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };
  
  // Consistent styling variables
  const inp_box_style = "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white transition duration-200";
  const label_style = "block text-sm font-medium text-gray-400 mb-1";

  return (
    <AdminLayout>
      <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Add New PG</h1>
        <form onSubmit={handleSubmit}>
          {/* --- Responsive Two-Column Grid for the Form --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={label_style}>PG Name</label>
              <input id="name" type="text" name="name" value={pgData.name} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div>
              <label htmlFor="location" className={label_style}>Location</label>
              <input id="location" type="text" name="location" value={pgData.location} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div>
              <label htmlFor="price" className={label_style}>Price (per month)</label>
              <input id="price" type="number" name="price" value={pgData.price} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div>
              <label htmlFor="contactNumber" className={label_style}>Contact Number</label>
              <input id="contactNumber" type="tel" name="contactNumber" value={pgData.contactNumber} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="email" className={label_style}>Email</label>
              <input id="email" type="email" name="email" value={pgData.email} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="amenities" className={label_style}>Amenities (comma separated)</label>
              <input id="amenities" type="text" name="amenities" value={pgData.amenities} onChange={handleChange} className={inp_box_style} required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className={label_style}>Description</label>
              <textarea id="description" name="description" value={pgData.description} onChange={handleChange} rows="4" className={inp_box_style} required />
            </div>
            
            {/* --- Enhanced Image Upload & Previews --- */}
            <div className="md:col-span-2 p-4 bg-gray-900/50 border border-dashed border-gray-600 rounded-lg">
              <label htmlFor="image-upload" className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer transition-colors">
                <FaUpload className="text-blue-400"/>
                <span className="text-white font-semibold">Upload Images</span>
              </label>
              <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={URL.createObjectURL(image)} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <input id="availability" type="checkbox" name="availability" checked={pgData.availability} onChange={handleChange} className="w-5 h-5 accent-blue-500 rounded" />
              <label htmlFor="availability" className="text-white font-medium">Is this PG currently available?</label>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding PG..." : "Add PG"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddPg;