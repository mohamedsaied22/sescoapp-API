"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { Ship } from "lucide-react";
import { Card } from "@/components/ui/card";
import VoyageData from "../components/voyageData";
import { v4 as uuidv4 } from "uuid";
import UpdateVessel from "../components/vessel-update";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useSWR from "swr";
 import { POSTAPI, PUTAPI } from "../../../../../utities/test";


const VesselInfo = ({ params }) => {
  const [vessel, setVessel] = useState(null);
  const [voyages, setVoyages] = useState([]);
  const [filteredVoyages, setFilteredVoyages] = useState([]);
  const [filteredVessels, setFilteredVessels] = useState([]);



  const id = params.id;


  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://10.1.114.43:3030/api/vessel/"+id,
    fetcher
  );
  useEffect(() => {
    
    setVessel(data || null);
    console.log(data)
  }, [data]);
  // useEffect(() => {
  //   const vessels = JSON.parse(localStorage.getItem("Vessels")) || [];
  //   const foundVessel = vessels.find((c) => c.id === id);

  //   if (foundVessel) {
  //     setVessel(foundVessel);
  //     const vesselVoyages =
  //       JSON.parse(localStorage.getItem(`voyages_${id}`)) || [];
  //     foundVessel.voyages = vesselVoyages.length;
  //     setFilteredVessels(vessels);
  //   }

  //   const vesselVoyages =
  //     JSON.parse(localStorage.getItem(`voyages_${id}`)) || [];
  //   setVoyages(vesselVoyages);
  //   setFilteredVoyages(vesselVoyages);
  // }, [id]);

  if (!vessel) {
    return <div>Loading...</div>;
  }



  const handleAPIAddVoyage = async (newVoyage) => {
    try {
      const result = await POSTAPI("/api/vessel/"+vessel.imo+"/voyage", newVoyage);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else if (result.statusCode === 403) {
        console.log(result.message);
        toast.error("There is voyage opened already", {
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
      } else {
        console.log("OK");
       

        setVessel(result);
        setFilteredVoyages(result.voyageList);

        toast.success("New voyage created successfully!", {
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
      }
    } catch (error) {
      console.error("Error adding vessel:", error);
      // Handle error
    }
  };

  const handleAPIUpdateVoyage = async (updatedVoyage) => {
    try {
      const result = await PUTAPI("/api/vessel/"+vessel.imo+"/voyage", updatedVoyage);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredVoyages(
          filteredVoyages.map((voyage) =>
            voyage.id === updatedVoyage.id ? updatedVoyage : voyage
          )
        );
        //toast
      }
    } catch (error) {
      console.error("Error updating vessel:", error);
      // Handle error
    }
  };

  const handleVoyageCreated = (newVoyage) => {
    newVoyage.id = uuidv4();
    const updatedVoyages = [...voyages, newVoyage];
    setVoyages(updatedVoyages);
    localStorage.setItem(`voyages_${id}`, JSON.stringify(updatedVoyages));

    const updatedVessel = {
      ...vessel,
      voyages: vessel.voyages + 1,
    };
    setVessel(updatedVessel);
    localStorage.setItem(`vessel_${id}`, JSON.stringify(updatedVessel));

    setFilteredVessels((prevState) => {
      const index = prevState.findIndex((v) => v.id === updatedVessel.id);
      if (index !== -1) {
        prevState[index] = updatedVessel;
      }
      return [...prevState];
    });
  };

  // const handleUpdateVoyage = (updatedVoyage) => {
  //   const voyageIndex = voyages.findIndex(
  //     (voyage) => voyage.id === updatedVoyage.id
  //   );

  //   if (voyageIndex !== -1) {
  //     const updatedVoyages = [...voyages];
  //     updatedVoyages[voyageIndex] = updatedVoyage;
  //     setVoyages(updatedVoyages);

  //     const filteredVoyagesIndex = filteredVoyages.findIndex(
  //       (voyage) => voyage.id === updatedVoyage.id
  //     );

  //     if (filteredVoyagesIndex !== -1) {
  //       const updatedFilteredVoyages = [...filteredVoyages];
  //       updatedFilteredVoyages[filteredVoyagesIndex] = updatedVoyage;
  //       setFilteredVoyages(updatedFilteredVoyages);
  //       localStorage.setItem(`voyages_${id}`, JSON.stringify(updatedVoyages));
  //     }
  //   }
  // };


  // const handleAPIUpdateVessel = async (updatedVessel) => {
  //   try {
  //     const { _id, code, ...vessel } = updatedVessel;
  //     const result = await PUTAPI("/api/vessel/" + _id, vessel);

  //     if (result.statusCode === 400 && result.message.includes("code")) {
  //       // Handle validation error
  //       // toast
  //     } else {
  //       setVessel(result);
  //       //toast
  //     }
  //   } catch (error) {
  //     console.error("Error updating vessel:", error);
  //     // Handle error
  //   }
  // };


  const handleAPIUpdateVessel = async (updatedVessel) => {
    try {
      const { _id, code, ...vessel } = updatedVessel;
      const result = await PUTAPI("/api/vessel/" + _id, vessel);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setVessel(result);
        //toast
      }
    } catch (error) {
      console.error("Error updating vessel:", error);
      // Handle error
    }
  };
  


  if(vessel) return (
    <div>
      <Link href="/vessels">
        <Heading
          title="Vessel Operations"
          description="Navigating Your Vessel Fleet."
          icon={Ship}
          iconColor="text-sky-400"
        />
      </Link>

      <div className="px-4 md:px-12 lg:px-32 space-y-4 grid  xl:grid-cols-2 gap-4">
      <Card className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-xl ">
          <div className="  flex items-center justify-center mb-4  ">
            <div className="w-full  ">
            <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                {/* <div className="text-left text-sm ">Name:</div> */}
                <div className="flex  ">{vessel.name || "..........."}</div>
              </div>
              <div className="flex justify-between mb-2 shadow-md p-2">
                <div className="text-left text-lg">IMO:</div>
                <div className="text-right ">{vessel.imo || "..........."}</div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-lg">Gross Tonnage:</div>
                <div className="text-right ">{vessel.grossTonnage || "..........."}</div>
              </div>
              <div className="flex justify-between shadow-md p-2">
                <div className="text-left text-lg">Number of Voyages:</div>
                <div className="text-right ">{vessel.voyageList.length}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
          <UpdateVessel vessel={vessel} onUpdateVessel={handleAPIUpdateVessel} />{" "}
          </div>
        </Card>
      
        {/* <Card className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl">
          <div className="flex flex-col items-center justify-end mb-4 p-2 shadow-md rounded-full ">
            <div className="text-center font-semibold text-xl">
              {vessel.name}
            </div>
            <div className=" font-light text-center text-sm">
              IMO: {vessel.IMO}
            </div>
          </div>

          <div className="flex justify-between font-semibold p-1">
            <span className="flex flex-col font-medium ">
              Tonnage:{" "}
              {vessel.grossTonnage !== "" ? vessel.grossTonnage : "......"}
            </span>

            <span className="flex flex-col font-medium">
              Voyages: {vessel.voyages}
            </span>
          </div>

          <div className="flex justify-center mt-2 ">
            <UpdateVessel vessel={vessel} onUpdateVessel={handleUpdateVessel} />{" "}
          </div>
        </Card> */}
      </div>

      <div>
        <VoyageData
          voyages={vessel.voyageList}
          onVoyageCreated={handleAPIAddVoyage}
          onUpdateVoyage={handleAPIUpdateVoyage}
        />
      </div>
      <ToastContainer autoClose={3000} />

    </div>
  );
};

export default VesselInfo;
