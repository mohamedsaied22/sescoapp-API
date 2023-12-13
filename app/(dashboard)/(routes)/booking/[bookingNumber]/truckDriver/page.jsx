"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { CalendarDays, ShieldX, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import TruckDriverData from "../../components/truckDriverData";
import { v4 as uuidv4 } from "uuid";
// import UpdateBooking from "../components/booking-update";

import useSWR from "swr";
import { POSTAPI, PUTAPI } from "/utities/test";

const BookingInfo = ({ params }) => {
  const [booking, setBooking] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const bookingNumber = params.bookingNumber;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://10.1.114.43:3030/api/booking/bookingNumber/" + bookingNumber,
    fetcher
  );

  useEffect(() => {
    console.log(data)
    setBooking(data);
  }, [data]);



  const handleAPIAddTruckDriver = async (truckDriver) => {
    try {
      const result = await POSTAPI("/api/booking/"+bookingNumber+"/truckDriver", truckDriver);
      console.log(result);
    

      if (result.statusCode === 400 && result.message.includes("bookingNumber")) {
        console.error(result.message)
        // Handle validation error
        // toast
      }else if (result.statusCode === 400) {
        // console.
      } else {
        
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







  // useEffect(() => {
  //   const bookings = JSON.parse(localStorage.getItem("Bookings")) || [];
  //   const foundBooking = bookings.find((c) => c.id === id);

  //   if (foundBooking) {
  //     setBooking(foundBooking);
  //     const bookingTrucks =
  //       JSON.parse(localStorage.getItem(`trucks_${id}`)) || [];
  //     foundBooking.trucks = bookingTrucks.length;
  //     setFilteredBookings(bookings);
  //   }

  //   const bookingTrucks =
  //     JSON.parse(localStorage.getItem(`trucks_${id}`)) || [];
  //   setTrucks(bookingTrucks);
  //   setFilteredTrucks(bookingTrucks);
  // }, [id]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  // const handleAPIUpdateBooking = async (updatedBooking) => {
  //   try {
  //     const { _id, code, ...booking } = updatedBooking;
  //     const result = await PUTAPI("/api/booking/" + _id, booking);

  //     if (result.statusCode === 400 && result.message.includes("code")) {
  //       // Handle validation error
  //       // toast
  //     } else {
  //       // setFilteredBookings(
  //       //   filteredBookings.map((booking) =>
  //       //   booking._id === _id ? updatedBooking : booking
  //       //   )
  //       // );
  //       setBooking(result)
  //       //toast
  //     }
  //   } catch (error) {
  //     console.error("Error booking contractor:", error);
  //     // Handle error
  //   }
  // };

  // const handleTruckCreated = (newTruck) => {
  //   newTruck.id = uuidv4();
  //   const updatedTrucks = [...trucks, newTruck];
  //   setTrucks(updatedTrucks);
  //   localStorage.setItem(`trucks_${id}`, JSON.stringify(updatedTrucks));

  //   const updatedBooking = {
  //     ...booking,
  //     trucks: booking.trucks + 1,
  //   };
  //   setBooking(updatedBooking);
  //   localStorage.setItem(`booking_${id}`, JSON.stringify(updatedBooking));

  //   setFilteredBookings((prevState) => {
  //     const index = prevState.findIndex((v) => v.id === updatedBooking.id);
  //     if (index !== -1) {
  //       prevState[index] = updatedBooking;
  //     }
  //     return [...prevState];
  //   });
  // };

  // const handleUpdateTruck = (updatedTruck) => {
  //   const truckIndex = trucks.findIndex(
  //     (truck) => truck.id === updatedTruck.id
  //   );

  //   if (truckIndex !== -1) {
  //     const updatedTrucks = [...trucks];
  //     updatedTrucks[truckIndex] = updatedTruck;
  //     setTrucks(updatedTrucks);

  //     const filteredTrucksIndex = filteredTrucks.findIndex(
  //       (truck) => truck.id === updatedTruck.id
  //     );

  //     if (filteredTrucksIndex !== -1) {
  //       const updatedFilteredTrucks = [...filteredTrucks];
  //       updatedFilteredTrucks[filteredTrucksIndex] = updatedTruck;
  //       setFilteredTrucks(updatedFilteredTrucks);
  //       localStorage.setItem(`trucks_${id}`, JSON.stringify(updatedTrucks));
  //     }
  //   }
  // };

  // const handleUpdateBooking = (updatedBooking) => {
  //   setBooking(updatedBooking);

  //   const bookingIndex = filteredBookings.findIndex(
  //     (booking) => booking.id === updatedBooking.id
  //   );

  //   if (bookingIndex !== -1) {
  //     const updatedBookings = [...filteredBookings];
  //     updatedBookings[bookingIndex] = updatedBooking;
  //     setFilteredBookings(updatedBookings);
  //     localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
  //   }
  // };




  return (
    <div>
      <Link href="/booking">
        <Heading
          title="Booking Management"
          description="Monitor all bookings in one place."
          icon={CalendarDays}
          iconColor="text-sky-400"
        />
      </Link>

      <div className="px-4 md:px-12 lg:px-32 space-y-4 grid  xl:grid-cols-1  gap-4">
        <Card className=" p-4  border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl ">
          <div className="  flex  items-center justify-center   ">
            <div className="w-full  ">
              <div className="flex text-lg  mb-2 bg-gray-100 shadow-xl p-2 items-center justify-center rounded-t-2xl font-semibold">
                <div className="text-left ">Booking Number: </div>
            {booking.bookingNumber || "..........."}
              </div>
              <div className="flex justify-between mb-2 shadow-md p-2 ">
                <div className="text-left text-sm">Work Order:</div>
                <div className="text-right ">
                  {booking.workOrderNumber || "..........."}
                </div>
              </div>
              <div className="flex justify-between mb-2 shadow-md p-2">
                <div className="text-left text-sm">Vessel:</div>
                <div className="text-right ">
                  {booking.vessel.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-sm">Cargo:</div>
                <div className="text-right ">
                  {booking.cargo.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-sm">Sub Cargo:</div>
                <div className="text-right ">
                  {booking.subCargo.name || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-sm">IMEX:</div>
                <div className="text-right ">
                  {booking.imex || "..........."}
                </div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">Number of Trucks:</div>
                  <div className="text-right ">
                    {booking.truckDriverList.length || "..........."}
                  </div>
                </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-sm">Opened At:</div>
                <div className="text-right text-sm ">{booking.openedAt}</div>
              </div>

              <div className="flex justify-between shadow-md p-2 ">
                <div className="text-left text-sm">Status:</div>
                <div className="text-right ">
                  {booking.status === "Closed" ? (
                    <>
                      <span className="text-red-500 flex items-center justify-center font-semibold">
                        <ShieldX className="mr-1" /> Closed
                      </span>
                      <div className="text-sm text-gray-500">
                        {booking.closedAt || "............."}
                      </div>
                    </>
                  ) : (
                    <div className=" flex items-center mt-4 ">
                      <span className="text-green-500 font-semibold mr-1 ">
                        <CheckSquare />{" "}
                      </span>
                      Open
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="flex justify-center mt-2">
            {/* <UpdateBooking
            booking={booking}
            onUpdateBooking={handleAPIUpdateBooking}
          /> */}
            {/* <CloseBooking
              booking={booking}
              onBookingClosed={handleBookingClosed}
            /> */}
          </div>
        </Card>
      </div>
      <div>
        <TruckDriverData
          selectedBooking={booking}
          trucks={filteredTrucks}
          onTruckCreated={handleAPIAddTruckDriver}
          //onUpdateTruck={handleUpdateTruck} // Pass the function here
        />
      </div>
    </div>
  );
};

export default BookingInfo;
