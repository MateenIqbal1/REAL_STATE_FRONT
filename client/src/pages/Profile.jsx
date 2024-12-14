import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { uploadImages } from "../redux/imageUploadSlice";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "react-toastify";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser ,error,token} = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.images);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setshowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate=useNavigate()

  // Handle file change and set file state
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Use Redux to upload the image
  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append("images", file); // Ensure the key matches what your backend expects
      console.log("Uploading file:", file); // Debugging line
      console.log("FormData content:", formData.get("image")); // Debugging line
  
      dispatch(uploadImages(formData))
        .then((response) => {
          if (response.payload && response.payload.length > 0) {
            const uploadedUrl = response.payload[0]; // Get the first URL
            setFormData((prev) => ({
              ...prev,
              avatar: uploadedUrl, // Update avatar URL
            }));
          }
          toast.success('successfully uploaded image')
        })
        .catch((error) => {
          console.error("Image upload failed:", error);
        });
    }
  }, [file, dispatch]);
  
  useEffect(() => {
    if (!userListings || userListings.length === 0) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [userListings]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData being sent:", formData); // Debugging line
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://realstate4-q8lsvtei.b4a.run/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), 
        credentials: "include", // Ensure credentials (cookies) are sent with the request

      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error(`update failed !!!${error}`)
        return
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success('Updated successfully')
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
  
      // Retrieve token from sessionStorage (or wherever it's stored)
  
      const res = await fetch(`https://realstate4-q8lsvtei.b4a.run/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // You can add this if necessary
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
        credentials: 'include', // Include cookies in the request (if using cookies for sessions)
      });
  
      const data = await res.json();
  
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
  
      dispatch(deleteUserSuccess(data));
      toast.success('Deleted successfully');
      sessionStorage.clear(); // Clear session storage after successful deletion
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("https://realstate4-q8lsvtei.b4a.run/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      sessionStorage.clear()
      toast.success('logged out successfully')
      navigate('/')
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setshowListingError(false);
  
      // Retrieve token from sessionStorage (or wherever it's stored)
  
      const res = await fetch(`https://realstate4-q8lsvtei.b4a.run/api/user/listings/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Optional: Add this if necessary
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
        credentials: 'include', // Include cookies in the request (if using cookies for sessions)
      });
  
      const data = await res.json();
  
      if (data.success === false) {
        setshowListingError(true);
        return;
      }
  
      setUserListings(data);
    } catch (error) {
      setshowListingError(true);
    }
  };
  

  const handleListingDelete = async (listingId) => {
    try {
      // Retrieve the token from sessionStorage (or wherever it's stored)
  
      const res = await fetch(`https://realstate4-q8lsvtei.b4a.run/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Optional, depending on the backend's requirements
          "Authorization": `Bearer ${token}`, // Include token in the Authorization header
        },
        credentials: 'include', // Include cookies in the request (if necessary)
      });
  
      const data = await res.json();
  
      if (data.success === false) {
        console.log(data.message);
        return;
      }
  
      // Update the state by filtering out the deleted listing
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
  
      toast.success("Deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  console.log(error,'this is error');
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
         <div className="self-center mt-2">
        {loading ? (
          <MoonLoader color="#008000" size={40} />
        ) : (
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
          />
        )}
      </div>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image upload (image must be less than 2mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully Uploaded</span>
          ) : null}
        </p>
        <input
  onChange={handleChange}
  type="text"
  placeholder="username"
  value={formData.username || currentUser.username || ""} // Fallback for initial load
  id="username"
  className="border p-3 rounded-lg"
/>

        <input
          onChange={handleChange}
          type="email"
          placeholder="email"
          value={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          readOnly
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:placeholder-opacity-80">
          Update
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer font-bold">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer font-bold">
          Sign Out
        </span>
      </div>

      <p className="text-green-700 mt-5">
        {updateSuccess ? "Updated Successfully" : " "}
      </p>
      <button onClick={handleShowListing} className="text-white font-bold font-serif w-full bg-[#FF0000] p-3 rounded-full">
        Show Your Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? toast.error('Error show listing!!! Please Login Again') : " "}
      </p>

      {userListings && userListings.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing images"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ):(
        showMessage && (
          <h1 className="text-center mt-7 text-2xl font-semibold">No Listings Found</h1>
        )
      )}
    </div>
  );
};

export default Profile;
