import { BadgePlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const NewVessel = ({ vessels, onVesselCreated }) => {
  const [isNewVesselModalOpen, setIsNewVesselModalOpen] = useState(false);
  const [newVessel, setNewVessel] = useState({
    name: "",
    imo: "",
    grossTonnage: "",
    voyageList: "",
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

    if (isNewVesselModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewVesselModalOpen]);

  const openModal = () => {
    setIsNewVesselModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewVessel({
      name: "",
      imo: "",
      grossTonnage: "",
      voyageList: "",
    });
    setIsNewVesselModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVessel((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    const existingVessel = vessels.find(
      (vessel) => vessel.imo === newVessel.imo
    );

    if (existingVessel) {
      // Show an error toast if the vessel already exists
      toast.error("The Vessel IMO already exists.", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    } else {
      closeModal();
      onVesselCreated(newVessel);

      // Show a success toast when a new vessel is created
      toast.success("New Vessel created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    }
  };

  return (
    <div>
      {isNewVesselModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed  z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70"
        >
          {" "}
          <motion.div
            id="modal"
            ref={modalRef}
            className="bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
            initial={{ scale: 0, x: "-0%" }} // Initial position from left
            animate={{ scale: 1, x: 0 }} // Animate to the center
            exit={{ scale: 0, y: "0%" }} // Exit to the left
            transition={{ duration: 0.05, ease: "easeInOut" }} // Custom transition
          >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
              <h2 className="text-xl text-white drop-shadow-xl font-semibold mr-6">
                New Vessel
              </h2>
              <BadgePlus className="shadow-xl text-sky-400" />
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Vessel Name
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="name"
                  value={newVessel.name}
                  onChange={handleInputChange}
                  placeholder="name"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Vessel IMO
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="number"
                  name="imo"
                  value={newVessel.imo}
                  onChange={handleInputChange}
                  placeholder="IMO Number"
                  required
                />
              </div>

              <div className="flex justify-between items-center mb-4 shadow-md px-2">
                <span className="text-sm font-semibold mb-1 text-white mr-2">
                  Gross Tonnage
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="number"
                  name="grossTonnage"
                  value={newVessel.grossTonnage}
                  onChange={handleInputChange}
                  placeholder="Gross Tonnage"
                />
              </div>

              <div className="flex justify-end">
                <button
                  className={`px-4 py-1 bg-sky-400 text-white rounded-xl mr-2 shadow-md ${
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

      <button
        className={`lg:mr-16 px-2 py-1 bg-sky-400 text-white rounded-lg shadow-md ${
          isButtonClicked
            ? "hover:bg-sky-400"
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        New Vessel
        <span className="text-xl"> +</span>
      </button>

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default NewVessel;
