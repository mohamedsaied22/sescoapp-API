import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { ShieldCheck, Pencil, Edit } from "lucide-react";

const UpdateCheckPoint = ({ checkPoint, onUpdateCheckPoint }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedCheckPoint, setUpdatedCheckPoint] = useState({
    id: "",
    order: "",
    label: "",
    description: "",
    locationType: "",
    role: "",
    repeat: "",
  });

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setUpdatedCheckPoint({
      id: checkPoint.id,
      order: checkPoint.order,
      label: checkPoint.label,
      description: checkPoint.description,
      locationType: checkPoint.locationType,
      role: checkPoint.role,
      repeat: checkPoint.repeat,
    });
  }, [checkPoint]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("updateModal");
      if (modalElement && !modalElement.contains(event.target)) {
        closeUpdateModal();
      }
    };

    if (isUpdateModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdateModalOpen]);

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCheckPoint((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdateCheckPoint(updatedCheckPoint);
    closeUpdateModal();

    // Show a success toast when a checkpoint is updated
    toast.success("Checkpoint updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#9acaff",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px 0  12px 0",
        width: "98%",
        fontSize: "bold",
      },
    });
  };

  return (
    <div>
      {isUpdateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
        >
          <motion.div
            id="updateModal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
            initial={{ opacity: 0, x: "-100%" }} // Initial position from left
            animate={{ opacity: 1, x: 0 }} // Animate to the center
            exit={{ opacity: 0, x: "-100%" }} // Exit to the left
            transition={{ duration: 0.005, ease: "easeInOut" }} // Custom transition
    
          
          
          
          >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-2xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                Update Checkpoint
              </h2>
              <Pencil className="shadow-xl text-white  font-semibold" />
            </div>
            <form onSubmit={handleUpdate} className="">
              {/* Similar input fields as in NewCheckpoint */}
              <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className="text-sm  font-semibold mb-1 text-white mr-2">
                  Order
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="order"
                  value={updatedCheckPoint.order}
                  onChange={handleInputChange}
                  placeholder="Order"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className=" text-sm  font-semibold mb-1 text-white mr-2">
                  Label
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="label"
                  value={updatedCheckPoint.label}
                  onChange={handleInputChange}
                  placeholder="Label"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Description
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="description"
                  value={updatedCheckPoint.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className="text-sm  font-semibold mb-1 text-white mr-2">
                  Location Type
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="locationType"
                  value={updatedCheckPoint.locationType}
                  onChange={handleInputChange}
                  placeholder="Location Type"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Role
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="role"
                  value={updatedCheckPoint.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Repeat
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="repeat"
                  value={updatedCheckPoint.repeat}
                  onChange={handleInputChange}
                  placeholder="Repeat"
                />
              </div>
  
            </form>
            {/* Existing code */}
            <div className="flex justify-end">
              <button
                className={`px-4 py-1 bg-sky-600 text-white rounded-lg mr-2 shadow-md ${
                  isButtonClicked
                    ? "hover:bg-sky-400 hover:scale-95"
                    : "hover:scale-95"
                }`}
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                onClick={closeUpdateModal}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <button
        className={`px-1 py-1 bg-sky-400 text-white rounded-lg shadow-xl mr-1 ${
            isButtonClicked
          ? "hover:bg-sky-400"
          : "hover:scale-[95%] hover:bg-sky-600"
      } transition`}
        onClick={openUpdateModal}
      >
       <div className="flex p-1">
          update
          <Edit className="w-4 ml-1" />
        </div>
      </button>

      <ToastContainer autoClose={5000} />
    </div>
  );
};

export default UpdateCheckPoint;
