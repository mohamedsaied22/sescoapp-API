import React, { useState, useEffect, useRef } from "react";
import { BadgePlus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import useSWR ,{useSWRConfig} from "swr";
import { POSTAPI } from "@/utities/test";

const NewTruck = ({ trucks, onTruckCreated }) => {
  const { mutate } = useSWRConfig()
  const [isNewTruckModalOpen, setIsNewTruckModalOpen] = useState(false);
  const [newTruckDriver, setNewTruckDriver] = useState({
    contractor: "",
    truckType: "",
    truck: "",
    driver: "",
    cleanlinessChecked: false,
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const [contractorList, setContractorList] = useState([]);
  const [truckList, setTruckList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [selectedTruckType, setSelectedTruckType] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState(null);

  const filteredTrucks = truckList
    ? truckList.filter((truck) => truck.truckType === newTruckDriver.truckType)
    : [];

  const getContractor = (code) =>
    contractorList.find((contractor) => contractor.code === code);

  const getTruck = (truckNumber) =>
    truckList.find((truck) => truck.number === truckNumber);

  const getDriver = (nationalID) => {
    console.log(nationalID,driverList);
    return driverList.find((driver) => driver.nationalID === nationalID);
  };

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const {
    data: contractorData,
    error,
    isLoading,
  } = useSWR("http://10.1.114.43:3030/api/contractor", fetcher);
  const {
    data: cargoData,
    error: cargoError,
    isLoading: cargoIsLoading,
  } = useSWR("http://10.1.114.43:3030/api/cargo", fetcher);

  useEffect(() => {
    console.log(contractorData);
    if (contractorData) {
      setContractorList(contractorData || []);
    }
  }, [contractorData]);

  useEffect(() => {
    console.log(newTruckDriver.contractor);
    if (newTruckDriver.contractor) {
      const contractor = getContractor(newTruckDriver.contractor);
      setDriverList(contractor.driverList.filter(driver => driver.driverStatus === 'AVAILABLE'));
      setTruckList(contractor.truckList.filter(truck => truck.truckStatus === 'AVAILABLE'));
    }
  }, [newTruckDriver.contractor]);

  const handleCheckboxChanged = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    setChecked(false); // Reset checkbox state whenever modal opens
    if (isNewTruckModalOpen) {
      setIsButtonClicked(true);
    }
  }, [isNewTruckModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("modal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isNewTruckModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewTruckModalOpen]);

  const openModal = () => {
    setIsNewTruckModalOpen(true);
  };


  

  const closeModal = () => {
    setNewTruckDriver({
      contractor: "",
      truckType: "",
      truck: "",
      driver: "",
      cleanlinessChecked: false,
    });
    setIsNewTruckModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTruckDriver((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checked) {
      toast.error("Please confirm cleanliness checking.", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#6acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow:
            "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
      return;
    }

    const { driverList, truckList, ...contractor } = getContractor(
      newTruckDriver.contractor
    );

    console.log(getDriver(newTruckDriver.driver));
    const truckDriver = {
      contractor: contractor,
      truck: getTruck(newTruckDriver.truck),
      driver: getDriver(newTruckDriver.driver),
    };

    console.log(truckDriver);
    closeModal();
    onTruckCreated(truckDriver);

    const data = await mutate('http://10.1.114.43:3030/api/contractor')
    console.log(data)
    toast.success("New truck driver created successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#6acaff", // Background color
        color: "#ffffff", // Text color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
        borderRadius: "12px 0  12px 0",
        width: "96%",
        fontSize: "bold",
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("trucks", JSON.stringify(trucks));
  }, [trucks]);
  if (contractorData)
    return (
      <div>
        {isNewTruckModalOpen && (
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
              className=" bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
              initial={{ scale: 0, x: "-0%" }} // Initial position from left
              animate={{ scale: 1, x: 0 }} // Animate to the center
              exit={{ scale: 0, y: "0%" }} // Exit to the left
              transition={{ duration: 0.05, ease: "easeInOut" }} // Custom transition
            >
              <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
                <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6 ">
                  New Truck Driver
                </h2>
                <BadgePlus className="text-sky-400" />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-4 shadow-md px-2">
                  <label
                    htmlFor="contractor"
                    className="text-sm font-semibold mb-1 text-white mr-2"
                  >
                    Contractor
                  </label>
                  <select
                    className="px-2 py-1 border rounded-lg mb-2"
                    name="contractor"
                    // id="contractor"
                    value={newTruckDriver.contractor}
                    onChange={handleInputChange}
                    style={{ width: "235px" }} // Set a fixed width (adjust as needed)
                    required
                  >
                    {/* Populate with options */}
                    <option value="">Select Contractor</option>
                    {contractorList.map((contractor) => (
                      <option key={contractor.code} value={contractor.code}>
                        {contractor.name}
                      </option>
                    ))}
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="flex justify-between items-center mb-4 shadow-md px-2">
                  <label
                    htmlFor="driver"
                    className="text-sm font-semibold mb-1 text-white mr-2"
                  >
                    Driver Name
                  </label>
                  <select
                    className="px-2 py-1 border rounded-lg mb-2"
                    name="driver"
                    id="driver"
                    value={newTruckDriver.driver}
                    onChange={handleInputChange}
                    style={{ width: "235px" }} // Set a fixed width (adjust as needed)
                  >
                    {/* Populate with options */}
                    <option value="">Select Driver Name</option>
                    {driverList.map((driver) => (
                      <option key={driver.nationalID} value={driver.nationalID}>
                        {driver.name}
                      </option>
                    ))}
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="flex justify-between items-center mb-4 shadow-md px-2">
                  <label
                    htmlFor="truckType"
                    className="text-sm font-semibold mb-1 text-white mr-2"
                  >
                    Truck Type
                  </label>
                  <select
                    className="px-2 py-1 border rounded-lg mb-2"
                    name="truckType"
                    id="truckType"
                    value={newTruckDriver.truckType}
                    onChange={handleInputChange}
                    style={{ width: "235px" }} // Set a fixed width (adjust as needed)
                  >
                    {/* Populate with options */}
                    <option value="" hidden selected disabled>
                      Select Truck Type
                    </option>
                    <option value="FLIPPER">قلاب</option>
                    <option value="TRELLA">تريلا </option>
                    <option value="TRELLA_FARSH">تريلا فرش</option>
                    <option value="TRELLA_FLIPPER">تريلا قلاب</option>
                    <option value="FLIPPER_LASEH">قلاب لاسية</option>
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="flex justify-between items-center mb-4 shadow-md px-2">
                  <label
                    htmlFor="truck"
                    className="text-sm font-semibold mb-1 text-white mr-2"
                  >
                    Truck Number
                  </label>
                  <select
                    className="px-2 py-1 border rounded-lg mb-2"
                    name="truck"
                    id="truck"
                    value={newTruckDriver.truck}
                    onChange={handleInputChange}
                    style={{ width: "235px" }} // Set a fixed width (adjust as needed)
                    required
                  >
                    {/* Populate with options */}
                    <option value="">Select Truck Number</option>
                    {filteredTrucks.map((truck) => (
                      <option key={truck.number} value={truck.number}>
                        {truck.number}
                      </option>
                    ))}
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="flex justify-center mb-4">
                  <label
                    className="mb-1 text-sky-200 cursor-pointer"
                    htmlFor="cleanlinessCheckbox"
                  >
                    Cleanliness Checked
                  </label>
                  <input
                    id="cleanlinessCheckbox"
                    className={`ml-2 cursor-pointer ${
                      checked ? "rotate checked" : ""
                    }`}
                    type="checkbox"
                    checked={checked}
                    onChange={handleCheckboxChanged}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    className={`px-4 py-1 ${
                      checked
                        ? "bg-sky-400 transition-all duration-300"
                        : "bg-gray-600"
                    } text-black rounded-lg mr-2`}
                    type="submit"
                    disabled={!checked}
                    style={{
                      cursor: checked ? "pointer" : "not-allowed",
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="px-2 py-1 bg-gray-300 rounded-lg"
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
          New Truck Driver
          <span className="text-xl"> +</span>
        </button>{" "}
        <ToastContainer autoClose={3000} />
      </div>
    );
};

export default NewTruck;
