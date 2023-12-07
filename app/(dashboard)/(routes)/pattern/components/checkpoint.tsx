import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const Checkpoints = ({ Patterns, onCheckpointCreated }) => {
  const [isCheckpointsModalOpen, setIsCheckpointsModalOpen] = useState(false);
  const [newCheckpoint, setNewCheckpoint] = useState({
    id: "",
    order: "",
    label: "",
    description: "",
    locationType: "",
    role: "",
    repeat: ""
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("checkpointModal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isCheckpointsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCheckpointsModalOpen]);

  const openModal = () => {
    setIsCheckpointsModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewCheckpoint({
      id: "",
      order: "",
      label: "",
      description: "",
      locationType: "",
      role: "",
      repeat: ""
    });
    setIsCheckpointsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCheckpoint((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic can be added here if needed

    closeModal();
    onCheckpointCreated(newCheckpoint);

    // Show a success toast when a new checkpoint is created
    toast.success("New checkpoint created successfully!", {
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
      {isCheckpointsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
        >
          <motion.div
            id="checkpointModal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-lg grid border border-sky-700 shadow-md transition duration-500"
            initial={{ scale: 0, x: "-0%" }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, y: "0%" }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
          >
            <div className="flex justify-between mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
                New Checkpoint
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Checkpoint ID
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="id"
                  value={newCheckpoint.id}
                  onChange={handleInputChange}
                  placeholder="ID"
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className="text-sm  font-semibold mb-1 text-white mr-2">
                  Order
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="order"
                  value={newCheckpoint.order}
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
                  value={newCheckpoint.label}
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
                  value={newCheckpoint.description}
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
                  value={newCheckpoint.locationType}
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
                  value={newCheckpoint.role}
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
                  value={newCheckpoint.repeat}
                  onChange={handleInputChange}
                  placeholder="Repeat"
                />
              </div>

              <div className="flex justify-end">
                <button
                  className={`px-4 py-1 bg-sky-400 text-white rounded-lg mr-2 shadow-md ${
                    isButtonClicked
                      ? "hover:bg-sky-500 hover:scale-95"
                      : "hover:scale-95"
                  }`}
                  type="submit"
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
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add the button to open the Checkpoints modal */}
      <button
        className={`lg:mr-16 px-2 py-1 w-full mb-4 bg-sky-400 text-white rounded-lg shadow-md ${
          isButtonClicked
            ? "hover:bg-sky-400"
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        New Checkpoint
        <span className="text-xl"> +</span>
      </button>

      <ToastContainer autoClose={5000} />
    </div>
  );
};

export default Checkpoints;
