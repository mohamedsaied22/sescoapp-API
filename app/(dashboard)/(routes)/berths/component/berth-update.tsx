import { Edit } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion"; // Import motion from framer-motion

const UpdateBerth = ({ berth, onUpdateBerth }) => {
  const [isUpdateBerthModalOpen, setIsUpdateBerthModalOpen] = useState(false);
  const [updateBerth, setUpdateBerth] = useState({
    _id: "",
    number: "",
    code: "",
    lat: "",
    long: "",
    branch: "",
  });

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target)) {
        closeModal();
      }
    };

    if (isUpdateBerthModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdateBerthModalOpen]);

  useEffect(() => {
    setUpdateBerth(berth);
  }, [berth]);

  const openModal = () => {
    setIsUpdateBerthModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setIsUpdateBerthModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateBerth((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedBerthWithId = { ...updateBerth, id: berth.id };
    onUpdateBerth(updatedBerthWithId);
    closeModal();

    toast.success("Berth updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#9acaff", // Background color
        color: "#ffffff", // Text color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
        borderRadius: "12px 0  12px 0",
        width: "98%",
        fontSize: "bold",
      },
    });
  };

  return (
    <div>
      {isUpdateBerthModalOpen && (
        <div
         className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
          {" "}
          <motion.div
            id="modal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
            initial={{ opacity: 0, x: "-100%" }} // Initial position from left
            animate={{ opacity: 1, x: 0 }} // Animate to the center
            exit={{ opacity: 0, x: "-100%" }} // Exit to the left
            transition={{ duration: 0.005, ease: "easeInOut" }} // Custom transition
          >
            <div className="flex justify-between mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                Update Berth
              </h2>
              <Edit className="shadow-xl text-sky-400" />
            </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Berth Number
              </span>
              <input
                className=" cursor-not-allowed bg-sky-800 text-white px-2 py-1 border border-sky-600 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="number"
                value={updateBerth.number}
                onChange={handleInputChange}
                placeholder="number"
                required
                disabled
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
              <span className="text-sm  font-semibold mb-1 text-white mr-2">
                Berth Code
              </span>
              <input
                className=" cursor-not-allowed bg-sky-800 text-white px-2 py-1 border border-sky-600 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="code"
                value={updateBerth.code}
                onChange={handleInputChange}
                placeholder="Code"
                required
                disabled
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Latitude
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="number"
                name="lat"
                value={updateBerth.lat}
                onChange={handleInputChange}
                placeholder="Latitude"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Longitude
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="number"
                name="long"
                value={updateBerth.long}
                onChange={handleInputChange}
                placeholder="Longitude"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Branch
              </span>
              <select
                className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                name="branch"
                value={updateBerth.branch}
                onChange={handleInputChange}
                style={{ width: "233px" }} // Set a fixed width (adjust as needed)
              >
                <option value="" selected hidden>Branch</option>
                <option value="Damietta">Damietta</option>
                <option value="El-Dekheila">El-Dekheila</option>
                <option value="Abu Qir">Abu Qir</option>
                <option value="El-Adabia">El-Adabia</option>
                <option value="PortSaid">PortSaid</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className={`px-4 py-1 bg-sky-400 text-white rounded-lg mr-2 shadow-md ${
                  isButtonClicked
                    ? "hover:bg-sky-500 hover:scale-95"
                    : "hover:scale-95"
                }`}
                onClick={handleSubmit}
              >
                Save
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <button
        className={`px-1 py-1 bg-sky-400 text-white rounded-lg shadow-xl mr-1 ${
          isButtonClicked
            ? "hover:bg-sky-600  "
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        <div className="flex p-1">
          update
          <Edit className="w-4 ml-2" />
        </div>
      </button>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default UpdateBerth;
