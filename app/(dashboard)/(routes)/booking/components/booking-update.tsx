import { Edit } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";
import useSWR from "swr";
import { POSTAPI, PUTAPI } from "@/utities/test";

const UpdateBooking = ({ bookings, booking, onUpdateBooking }) => {
  const [isUpdateBookingModalOpen, setIsUpdateBookingModalOpen] =
    useState(false);
  const [updateBooking, setUpdateBooking] = useState({
    _id: "",
    bookingNumber: "",
    workOrderNumber: "",
    vessel: "",
    cargo: "",
    subCargo: "",
    imex: "",
  });

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  const [bookingNumber, setBookingNumber] = useState("");
  const generateNextBookingNumber = () => {
    const lastBooking = booking[booking.length - 1];
    if (lastBooking) {
      const lastBookingNumber = parseInt(lastBooking.bookingNumber, 10);
      const nextBookingNumber = String(lastBookingNumber + 1).padStart(2, "0");
      return nextBookingNumber;
    } else {
      return "01"; // Initial booking number
    }
  };

  const [vesselList, setVesselList] = useState([]);
  const [cargoList, setCargoList] = useState([]);
  const [subCargoList, setSubCargoList] = useState([]);
  const [unBookedVessels, setUnBookedVessels] = useState([]);
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const {
    data: openedVesselData,
    error,
    isLoading,
  } = useSWR("http://10.1.114.43:3030/api/vessel/opened", fetcher);
  const {
    data: cargoData,
    error: cargoError,
    isLoading: cargoIsLoading,
  } = useSWR("http://10.1.114.43:3030/api/cargo", fetcher);

  useEffect(() => {
    console.log(booking);
    const bk = {
      ...booking,
      cargo: booking ? booking.cargo.code : "",
      vessel: booking ? booking.vessel.imo : "",
      subCargo: booking ? booking.subCargo.code : "",
    };
    setUpdateBooking(bk);
  }, [booking]);
  useEffect(() => {
    
      
      if (!unbookedVessels.find((vessel) => vessel.imo === booking.vessel.imo))
        setUnBookedVessels([...unbookedVessels, booking.vessel]);
      console.log(unBookedVessels,unbookedVessels)
    
  }, [isUpdateBookingModalOpen]);
  useEffect(() => {
    setVesselList(openedVesselData || []);
  }, [openedVesselData]);
  useEffect(() => {
    setCargoList(cargoData || []);
  }, [cargoData]);

  useEffect(() => {
    if (updateBooking.cargo) {
      console.log(updateBooking.cargo);
      setSubCargoList(getCargo(updateBooking.cargo).subCargoList);
    }
  }, [updateBooking.cargo]);

  const getVessel = (imo: string) => {
    return vesselList.find((vessel) => vessel.imo === imo);
  };
  const getCargo = (code: string) => {
    return cargoList.find((cargo) => cargo.code === code);
  };
  const getSubCargo = (code: string) => {
    return subCargoList.find((subCargo) => subCargo.code === code);
  };

  const isVesselBooked = (vessel) =>
    bookings
      ? !!bookings.filter((booking) => booking.vessel.imo === vessel.imo).length
      : false;

  const unbookedVessels = vesselList?.filter((vessel) => !isVesselBooked(vessel));

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target)) {
        closeModal();
      }
    };

    if (isUpdateBookingModalOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUpdateBookingModalOpen]);

  const openModal = () => {
    // Check if the booking status is "Closed"
    if (booking.status === "Closed") {
      // Display a message or perform actions for a closed booking
      toast.warning("Cannot update a closed booking!", {
        position: toast.POSITION.TOP_RIGHT,
        // Other toast configuration options
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          // boxShadow: "0 0 -1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    } else {
      setIsUpdateBookingModalOpen(true);
      setIsButtonClicked(true);

      setBookingNumber(booking.bookingNumber);

      // Set the current day and time as "Opened At"
      const currentDateTime = new Date();
      const formattedDateTime = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`;
      setUpdateBooking((prevState) => ({
        ...prevState,
        openedAt: formattedDateTime,
      }));
    }
  };

  const closeModal = () => {
    setIsUpdateBookingModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateBooking((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedBookingWithId = { ...updateBooking, id: booking.id };

    const upBooking = {
      ...updateBooking,
      cargo: getCargo(updateBooking.cargo),
      subCargo: getSubCargo(updateBooking.subCargo),
      vessel: getVessel(updateBooking.vessel),
    };
    onUpdateBooking(upBooking);
    closeModal();

    // Show a success toast when an updated booking is created
    toast.success("Booking updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#8acaff", // Background color
        color: "#ffffff", // Text color
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
        borderRadius: "12px 0  12px 0",
        width: "96%",
        fontSize: "bold",
      },
    });
  };

  return (
    <div>
      {isUpdateBookingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed  z-50 inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70"
        >
          <motion.div
            id="modal"
            ref={modalRef}
            className=" bg-gradient-to-t from-gray-900 via-sky-900 to-sky-700 p-6 rounded-t-3xl grid border border-sky-700 shadow-md transition duration-500"
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
          >
            <div className="flex justify-center mb-8 shadow-xl bg-gradient-to-b from-sky-400 via-sky-700 to-sky-900 px-6 py-3 rounded-t-3xl">
              <h2 className="text-xl text-white drop-shadow-lg font-semibold mr-6 ">
                Update Booking
              </h2>
              <Edit className="shadow-xl text-lg text-sky-300  font-semibold" />
            </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
              <span className=" text-sm  font-semibold mb-1 text-white mr-2">
                Booking number:
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="bookingNumber"
                value={updateBooking.bookingNumber}
                onChange={handleInputChange}
                placeholder="Booking Number"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
              <span className=" text-sm  font-semibold mb-1 text-white mr-2">
                Work Order:
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="workOrderNumber"
                value={updateBooking.workOrderNumber}
                onChange={handleInputChange}
                placeholder="Work Order"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Vessel:
              </span>
              <select
                className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                name="vessel"
                value={updateBooking.vessel}
                onChange={handleInputChange}
                required
                style={{ width: "235px" }} // Set a fixed width (adjust as needed)
              >
                <option value="">Select Vessel</option>

                {unBookedVessels.map((vessel) => (
                  <option key={vessel.imo} value={vessel.imo}>
                    {vessel.name}
                  </option>
                ))}
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Cargo:
              </span>
              <select
                className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                name="cargo"
                value={updateBooking.cargo}
                onChange={handleInputChange}
                style={{ width: "235px" }} // Set a fixed width (adjust as needed)
              >
                <option value="">Select Cargo</option>
                {cargoList.map((cargo) => (
                  <option key={cargo.code} value={cargo.code}>
                    {cargo.name}
                  </option>
                ))}
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2">
              <span className="text-sm font-semibold mb-1 text-white mr-2">
                Sub Cargo:
              </span>
              <select
                className="px-2 py-1 cursor-pointer text-gray-600 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                name="subCargo"
                value={updateBooking.subCargo}
                onChange={handleInputChange}
                style={{ width: "235px" }} // Set a fixed width (adjust as needed)
              >
                <option className="" value="">
                  Select Sub Cargo
                </option>
                {subCargoList.map((subCargo) => (
                  <option key={subCargo.code} value={subCargo.code}>
                    {subCargo.name}
                  </option>
                ))}
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex justify-between items-center mb-4 shadow-md px-2 ">
              <span className=" text-sm  font-semibold mb-1 text-white mr-2">
                IMEX:
              </span>
              <select
                className="px-2 py-1 cursor-pointer text-gray-500 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                name="imex"
                value={updateBooking.imex}
                onChange={handleInputChange}
                style={{ width: "235px" }} // Set a fixed width (adjust as needed)
              >
                <option className="" value="">
                  Select IMEX
                </option>
                <option value="IMPORT">Import</option>
                <option value="EXPORT">Export</option>
              </select>
            </div>

            {/* <div className="flex justify-between items-center mb-4 shadow-md px-2 gap-4 ">
              <span className="text-sm font-semibold drop-shadow-lg mb-1 text-white mr-2">
                Trucks:
              </span>
              <input
                className="px-2 py-1 border border-gray-300 rounded-2xl mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                type="text"
                name="numberOfTrucks"
                value={updateBooking.numberOfTrucks}
                onChange={handleInputChange}
                placeholder="Number of Trucks"
              />
            </div> */}
            <div className="flex justify-end mt-4">
              <button
                className={`px-4 py-1 bg-sky-400 text-white rounded-lg mr-2 shadow-md ${
                  isButtonClicked
                    ? "hover:bg-sky-600 hover:scale-95"
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
        </motion.div>
      )}
      {booking.status !== "Closed" && ( // Add conditional rendering here
        <button
          className={` px-1 py-1 text-sm bg-sky-400 text-white rounded-lg shadow-lg  ${
            isButtonClicked
              ? "hover:bg-sky-400"
              : "hover:scale-[95%] hover:bg-sky-600"
          } transition`}
          onClick={openModal}
        >
          <div className="flex p-1">
            update
            <Edit className="w-4 ml-1" />
          </div>
        </button>
      )}

      <ToastContainer autoClose={5000} />
    </div>
  );
};

export default UpdateBooking;
