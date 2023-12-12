import { BadgePlus, ShieldPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { motion } from 'framer-motion';



const NewPattern = ({ Patterns, onPatternCreated }) => {
  const [isNewPatternModalOpen, setIsNewPatternModalOpen] = useState(false);
  const [newPattern, setNewPattern] = useState({
    name: "",
    code: "",
    imex: "",
    checkpoint: "",
});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("modal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isNewPatternModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewPatternModalOpen]);

  const openModal = () => {
    setIsNewPatternModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewPattern({
        name: "",
        code: "",
        imex: "",
        checkpoint: "",
    });
    setIsNewPatternModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPattern((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    const existingPattern = Patterns.find(
      (Pattern) => Pattern.code === newPattern.code
    );

    if (existingPattern) {
      toast.error("The Pattern code already exists.", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#9acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "98%",
          fontSize: "bold",
        },
      });    } else {
      closeModal();
      onPatternCreated(newPattern);

         // Show a success toast when a new vessel is created
         toast.success("New Pattern created successfully!", {
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
    }
  };


  return (
    <div>
    {isNewPatternModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
      >
        <motion.div
          id="modal"
          ref={modalRef}
          className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-xl grid border border-sky-700 shadow-md transition duration-500"
          initial={{ scale: 0, x: "-0%" }}
          animate={{ scale: 1, x: 0 }}
          exit={{ scale: 0, y: "0%" }}
          transition={{ duration: 0.05, ease: "easeInOut" }}
        >
          <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
            <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
              New Pattern
            </h2>
            <ShieldPlus className="shadow-xl text-sky-300  font-semibold" />
          </div>
          <form onSubmit={handleSubmit} className="">
            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Pattern Name
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="name"
                value={newPattern.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
              <span className="text-sm  font-semibold mb-1 text-white mr-2">
                Pattern Code
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="code"
                value={newPattern.code}
                onChange={handleInputChange}
                placeholder="Code"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
                <span className=" text-sm  font-semibold mb-1 text-white mr-2">
                  IMEX:
                </span>
                <select
                  className="px-2 py-1 cursor-pointer text-gray-500 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  name="imex"
                  value={newPattern.imex}
                  onChange={handleInputChange}
                  style={{ width: "235px" }} // Set a fixed width (adjust as needed)
                >
                  <option className="" value="">
                    Select IMEX
                  </option>
                  <option value="import">Import</option>
                  <option value="export">Export</option>
                </select>
              </div>

    


   

            <div className="flex justify-end">
              <button
                className={`px-4 py-1 bg-sky-800 text-white rounded-lg mr-2 shadow-md ${
                  isButtonClicked
                    ? "hover:bg-sky-900 hover:scale-95"
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

    <button
      className={`lg:mr-16 px-2 py-1 bg-sky-400 text-white rounded-lg shadow-md ${
        isButtonClicked
          ? "hover:bg-sky-700"
          : "hover:scale-[95%] hover:bg-sky-500"
      } transition`}
      onClick={openModal}
    >
      New Pattern
      <span className="text-xl"> +</span>
    </button>

    <ToastContainer autoClose={5000} />
  </div>
  );
};

export default NewPattern;
