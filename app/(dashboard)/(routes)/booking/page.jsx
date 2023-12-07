"use client";

// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { CalendarDays, CheckSquare, ShieldX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Pagination from "@/components/pagination";
import Filters from "@/components/filteration";
import SortOptions from "./components/booking-sorting";
import NewBooking from "./components/booking-new";
import UpdateBooking from "./components/booking-update";
import DeleteBooking from "./components/booking-delete";
import CloseBooking from "./components/booking-closed";



import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";

// Main component for BookingsPage
export default function BookingsPage() {
  // State variables
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [originalBookings, setOriginalBookings] = useState([]);
  const [closedBookings, setClosedBookings] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [bookingList, setBookingList] = useState([]);

  // Constants
  const bookingsPerPage = 18;


  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://10.1.114.43:3030/api/booking/",
    fetcher
  );

  useEffect(() => {
    setBookingList(data || []);
    setFilteredBookings(data || []);
  }, [data]);



  const searchBookings = (searchValue) => {
    setFilteredBookings(
      bookingList.filter(
        (booking) =>
          booking.bookingNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.workOrderNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.vessel.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.cargo.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.subCargo.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.imex.toLowerCase().includes(searchValue.toLowerCase()) ||
          booking.bookingStatus.toLowerCase().includes(searchValue.toLowerCase()) 
          
      )
    );
  };

  const handleAPIAddBooking = async (booking) => {
    try {
      const result = await POSTAPI("/api/booking", booking);
      console.log(result);
    

      if (result.statusCode === 400 && result.message.includes("bookingNumber")) {
        console.error(result.message)
        // Handle validation error
        // toast
      }else if (result.statusCode === 400) {
        // console.
      } else {
        setFilteredBookings([...filteredBookings, result]);
        //toast
        toast.success("New Booking Created successfully!", {
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
    } catch (error) {
      console.error("Error adding contractor:", error);
      // Handle error
    }
  };

  const handleAPIUpdateBooking = async (updatedBooking) => {
    try {
      const { _id, code, ...booking } = updatedBooking;
      const result = await PUTAPI("/api/booking/" + _id, booking);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredBookings(
          filteredBookings.map((booking) =>
          booking._id === _id ? updatedBooking : booking
          )
        );
        //toast
      }
    } catch (error) {
      console.error("Error booking contractor:", error);
      // Handle error
    }
  };

  // Effect to load bookings from local storage
  // useEffect(() => {
  //   const storedBookings = JSON.parse(localStorage.getItem("Bookings")) || [];
  //   const updatedBookings = storedBookings.map(addSubsCount);
  //   setOriginalBookings(updatedBookings);
  //   setFilteredBookings(updatedBookings);
  // }, []);

  // // Effect to update bookings with voyages count
  // useEffect(() => {
  //   const storedBookings = JSON.parse(localStorage.getItem("Bookings")) || [];
  //   const updatedBookings = storedBookings.map((booking) => {
  //     const bookingVoyages =
  //       JSON.parse(localStorage.getItem(`bookings_${booking.id}`)) || [];
  //     booking.voyages = bookingVoyages.length;
  //     return booking;
  //   });
  //   setFilteredBookings(updatedBookings);
  // }, []);

  // Helper function to add subs count to a booking
  // const addSubsCount = (booking) => {
  //   const bookingSubs =
  //     JSON.parse(localStorage.getItem(`subs_${booking.id}`)) || [];
  //   booking.subs = bookingSubs.length;
  //   return booking;
  // };

  // Function to filter bookings based on input value
  // const filterBookings = (filterValue) => {
  //   if (filterValue === "") {
  //     setFilteredBookings(originalBookings);
  //     setCurrentPage(1);
  //   } else {
  //     const lowerCaseFilterValue = filterValue.toLowerCase();
  //     const filtered = originalBookings.filter((booking) => {
  //       // Check if any property of the booking contains the filter value
  //       return Object.values(booking).some((value) =>
  //         String(value).toLowerCase().includes(lowerCaseFilterValue)
  //       );
  //     });

  //     setFilteredBookings(filtered);
  //     setCurrentPage(1);
  //   }
  // };

  // Function to sort bookings based on the selected option
  // const sortBookings = (option) => {
  //   let sortedBookings = [...filteredBookings];

  //   switch (option) {
  //     // Add sorting cases as needed
  //     case "name":
  //       sortedBookings.sort((a, b) => a.name.localeCompare(b.name));
  //       break;
  //     case "IMO":
  //       sortedBookings.sort((a, b) => a.IMO.localeCompare(b.IMO));
  //       break;
  //     case "tonnage":
  //       sortedBookings.sort((a, b) => {
  //         const tonnageA = parseFloat(a.grossTonnage) || 0;
  //         const tonnageB = parseFloat(b.grossTonnage) || 0;
  //         return tonnageB - tonnageA;
  //       });
  //       break;
  //     default:
  //       // No sorting
  //       break;
  //   }

  //   setFilteredBookings(sortedBookings);
  // };


  // Function to handle sort changes
  const handleSortChanges = (sortValue) => {
    setSortOption(sortValue);

    switch (sortValue) {
      case "all":
        //setFilteredBookings(originalBookings.filter(filterBySearch));
        searchBookings('')
        break;
      case "closed":
        searchBookings('CLOSED')

        // setFilteredBookings(
        //   originalBookings.filter((booking) => booking.bookingStatus === "CLOSED")
        // );
        break;
      case "opened":
        searchBookings('OPENED')

        // setFilteredBookings(
        //   originalBookings.filter((booking) => booking.bookingStatus !== "CLOSED")
        //   setFilteredBookings(searchBookings('CLOSED'))
        // );
        break;
      default:
        // No sorting
        break;
    }
  };

  // Function to filter bookings based on search value
  const filterBySearch = (booking) => {
    const lowerCaseFilterValue = searchValue.toLowerCase();
    return Object.values(booking).some((value) =>
      String(value).toLowerCase().includes(lowerCaseFilterValue)
    );
  };

  // Function to handle sort change
  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortBookings(sortValue);
  };

  // Function to handle pagination
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle the creation of a new booking
  const handleBookingCreated = (newBooking) => {
    newBooking.id = uuidv4();
    newBooking.voyages = 0;

    const updatedBookings = [...filteredBookings, newBooking];
    setFilteredBookings(updatedBookings);
    setOriginalBookings(updatedBookings); // Update originalBookings
    localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
    localStorage.setItem(`bookings_${newBooking.id}`, JSON.stringify([]));
  };

  // Function to handle the update of a booking
  const handleUpdateBooking = (updatedBooking) => {
    const bookingIndex = filteredBookings.findIndex(
      (booking) => booking.id === updatedBooking.id
    );

    if (bookingIndex !== -1) {
      const updatedBookings = [...filteredBookings];
      updatedBookings[bookingIndex] = updatedBooking;
      setFilteredBookings(updatedBookings);
      setOriginalBookings(updatedBookings); // Update originalBookings
      localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
    }
  };

  // Function to handle the deletion of a booking
  const handleDeleteBooking = (booking) => {
    const updatedBookings = filteredBookings.filter((q) => q.id !== booking.id);
    setFilteredBookings(updatedBookings);
    localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
  };

  // Function to handle the closure of a booking
  const handleBookingClosed = (closedBooking) => {
    setClosedBookings((prevClosedBookings) => [
      ...prevClosedBookings,
      closedBooking,
    ]);

    const updatedBooking = { ...closedBooking, status: "Closed" };
    handleUpdateBooking(updatedBooking);
  };

  // Calculate pagination values
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);




  
  // JSX structure for the component
  return (
    <div className="">
      {/* Heading */}
      <Heading
        title="Booking Management"
        description="Monitor all bookings in one place.."
        icon={CalendarDays}
        iconColor="text-sky-400"
      />

      {/* Filter and Sorting Controls */}
      <div className="px-4 md:px-12 mb-4 flex flex-col md:flex-row mt-8 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={searchBookings} />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChanges}
          />
        </div>
        <div className="mb-4">
          <NewBooking
            bookings={filteredBookings}
            onBookingCreated={handleAPIAddBooking}
          />
        </div>
      </div>

      {/* Display Bookings */}
      <div className="px-4 md:px-12 lg:px-16 ">
        <div className="overflow-x-auto max-w-screen-lg">
          <table className="w-full divide-y bg-white shadow-xl rounded-xl ">
            {" "}
            <thead className=" bg-gray-300 text-gray-700 rounded-xl border border-gray-300 shadow-xl">
              <tr>
                <th className="py-3 px-6 text-center">NO</th>
                <th className="py-3 px-6 text-center">Work Order</th>
                <th className="py-3 px-6 text-center">Vessel</th>
                <th className="py-3 px-6 text-center">Cargo</th>
                <th className="py-3 px-6 text-center">Sub Cargo</th>
                <th className="py-3 px-6 text-center">IMEX</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking, index) => (
             <tr
             key={index}
             className={`border border-gray-300 ${
               index % 2 === 0 ? "bg-white" : "bg-gray-200"
             } hover:bg-sky-100 hover:shadow-md transition-all`}
             // onClick={() => {
             //   // Redirect to the booking details page
             //   window.location.href = `/booking/${booking.id}`;
             // }}
             style={{ cursor: "pointer" }}
           >
                  <Link
                    href={`/booking/${booking.bookingNumber}`}
                    key={index}
                    legacyBehavior
                  >

                    <td className=" text-center">
                      {booking.bookingNumber || "..........."}
                    </td>
                  </Link>
                  <td className=" text-center">
                    {booking.workOrderNumber || "..........."}
                  </td>
                  <td className="text-center px-2">
                    {booking.vessel.name || "..........."}
                  </td>
                  <td className="text-center px-2">
                    {booking.cargo.name || "..........."}
                  </td>
                  <td className="text-center">
                    {booking.subCargo.name || "..........."}
                  </td>
                  <td className="text-center">
                    {booking.imex || "..........."}
                  </td>
                  <td className="py-2 px-6 text-center">
                    {booking.status === "Closed" ? (
                      <div className="text-red-500 font-semibold flex">
                        <ShieldX className="inline-block mr-1" />
                        Closed
                      </div>
                    ) : (
                      <div className="text-green-500 font-semibold flex">
                        <CheckSquare className="inline-block mr-1" />
                        Open
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-6 text-center">
                    <div className="flex items-center justify-center">
                      <UpdateBooking
                        bookings={filteredBookings}
                        booking={booking}
                        onUpdateBooking={handleAPIUpdateBooking}
                      />
                      {/* <DeleteBooking
                      booking={booking}
                      onDeleteBooking={() => handleDeleteBooking(booking)}
                    /> */}
                      <CloseBooking
                        booking={booking}
                        onBookingClosed={handleBookingClosed}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentUsers={currentBookings}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
