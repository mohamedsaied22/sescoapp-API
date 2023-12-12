import { Edit } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Checkpoints from "./checkpoint-new";


const UpdatePattern = ({ pattern, onUpdatePattern }) => {
  const [isUpdatePatternModalOpen, setIsUpdatePatternModalOpen] =
    useState(false);
 

    const [updatePattern, setUpdatePattern] = useState({
    name: "",
    code: "",
    imex: "",
    checkpoint: "",
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

    if (isUpdatePatternModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdatePatternModalOpen]);

  useEffect(() => {
    setUpdatePattern(
      pattern || { name: "", code: "", imex: "", checkpoint: "" }
    );
  }, [pattern]);

  const openModal = () => {
    setIsUpdatePatternModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setIsUpdatePatternModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatePattern((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (pattern) {
      const updatedPatternWithId = { ...updatePattern, id: pattern.id };
      onUpdatePattern(updatedPatternWithId);
      closeModal();

      toast.success("Pattern updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff",
          color: "#ffffff",
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    } else {
      // Handle the case where pattern is undefined
      console.error("Pattern is undefined.");
    }
  };


  return (
    <div>
      {isUpdatePatternModalOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
      >
        <motion.div
        id="modal"
        ref={modalRef}
        className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
        initial={{ opacity: 0, x: "-100%" }} // Initial position from left
        animate={{ opacity: 1, x: 0 }} // Animate to the center
        exit={{ opacity: 0, x: "-100%" }} // Exit to the left
        transition={{ duration: 0.005, ease: "easeInOut" }} // Custom transition
      >
          <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
            <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6">
              Update Pattern
            </h2>
            <Edit className="shadow-xl text-sky-300  font-semibold" />
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
                value={updatePattern.name}
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
                value={updatePattern.code}
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
                  className="px-2 py-1 cursor-pointer text-gray-700 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  name="imex"
                  value={updatePattern.imex}
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
        className={`px-1 py-1 bg-sky-400 text-white rounded-lg shadow-xl mr-1 ${
          isButtonClicked
            ? "hover:bg-sky-600  "
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        <div className="flex p-1">
          update
          <Edit className="w-4 ml-1" />
        </div>
      </button>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default UpdatePattern;
