import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import NewDriver from "./driver-new";
import UpdateDriver from "./driver-update";
import FilterDrivers from "./filter-drivers";
import Filters from "@/components/filteration";
import { POSTAPI, PUTAPI } from "@/utities/test";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriversData = ({
  selectedContractor,
  onDriverCreated,
  onUpdateDriver,
  onDeleteDriver,
}) => {
  // State for the general filter (search by name, nationalId, license)
  const [generalFilterValue, setGeneralFilterValue] = useState("");

  // State for the specific driver status filter (available, not available, maintenance)
  const [driverStatusFilter, setDriverStatusFilter] = useState("");

  // State to store filtered drivers based on both filters
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    setContractor(selectedContractor);
    setFilteredDrivers(selectedContractor.driverList);
  }, [selectedContractor]);
  // Wrap filterDrivers in useCallback to memoize the function
  // const filterDrivers = useCallback(
  //   (generalFilterValue, driverStatusFilter) => {
  //     if (generalFilterValue === "" && driverStatusFilter === "") {
  //       setFilteredDrivers(drivers);
  //     } else {
  //       const filtered = drivers.filter((driver) => {
  //         const lowerCaseGeneralFilter = generalFilterValue.toLowerCase();
  //         const lowerCaseStatusFilter = driverStatusFilter.toLowerCase();

  //         return (
  //           (driver.name.toLowerCase().includes(lowerCaseGeneralFilter) ||
  //             driver.nationalId.toLowerCase().includes(lowerCaseGeneralFilter) ||
  //             driver.license.toLowerCase().includes(lowerCaseGeneralFilter)) &&
  //           (driverStatusFilter === "" || driver.status.toLowerCase() === lowerCaseStatusFilter)
  //         );
  //       });

  //       setFilteredDrivers(filtered);
  //     }
  //   },
  //   [drivers]
  // );

  // useEffect(() => {
  //   // Trigger filterDrivers whenever the general filter or driver status filter changes
  //   filterDrivers(generalFilterValue, driverStatusFilter);
  // }, [generalFilterValue, driverStatusFilter, filterDrivers]);

  const handleDriverCreated = (newDriver) => {
    // Callback when a new driver is created
    onDriverCreated(newDriver);
    setDriverStatusFilter(""); // Clear the driver status filter
  };

  const searchDrivers = (searchValue) => {
    setFilteredDrivers(
      contractor.driverList.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          driver.nationalID.toLowerCase().includes(searchValue.toLowerCase()) ||
          driver.drivingLicense.toLowerCase().includes(searchValue.toLowerCase()) ||
          driver.driverStatus.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleAPIAddDriver = async (newDriver) => {
    console.log(newDriver);
    try {
      const result = await POSTAPI(
        "/api/contractor/" + contractor.code + "/driver",
        newDriver
      );
      console.log(result);

      if (result.statusCode == 403) {
        result.message.forEach((message) => {
          console.error(message.message);
          toast.error((message.message), {
            position: toast.POSITION.TOP_RIGHT,
            style: {
              background: "#8acaff", // Background color
              color: "#ffffff", // Text color
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
              borderRadius: "12px 0  12px 0",
              width: "96%",
              fontSize: "bold",
              marginTop: "4px",
              marginBottom: "4px"
          
            },
          });

        });
      } else {
        setContractor(result);
        onDriverCreated(result);
        setFilteredDrivers(result.truckList);
        //setFilteredTrucks([...filteredTrucks, result]);
        //toast
        toast.success("New Driver created successfully!", {
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

  const handleUpdateDriver = (updatedDriver) => {
    // Callback when a driver is updated
    onUpdateDriver(updatedDriver);
  };

  const handleDeleteDriver = (driver) => {
    // Callback when a driver is deleted
    onDeleteDriver(driver);
  };

  const handleGeneralFilterChange = (value) => {
    // Callback for the general filter (name, nationalId, license)
    setGeneralFilterValue(value);
  };

  const handleDriverStatusFilterChange = (status) => {
    // Callback for the driver status filter (available, not available, maintenance)
    searchDrivers(status);
  };

  if (contractor)
    return (
      <div className="p-4 border-black/5 transition rounded-xl">
        <div className="px-1 flex flex-col md:flex-row justify-center items-center">
          <div className="flex-1 mb-4">
            {/* Component for the general filters (name, nationalId, license) */}
            <Filters onFilterChange={searchDrivers} />
          </div>

          {/* Component for the specific driver status filter (available, not available, maintenance) */}
          <div className="mb-4">
            <FilterDrivers onFilterChange={handleDriverStatusFilterChange} />
          </div>

          {/* Component for creating a new driver */}
          <div className="mb-4">
            <NewDriver
              drivers={contractor.driverList}
              onDriverCreated={handleAPIAddDriver}
            />
          </div>
        </div>

        <div className="px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredDrivers.map((driver) => (
            <Card
              key={driver.nationalID}
              className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-center justify-center mb-4 cursor-pointer">
                <div className="w-full">
                  <div className="flex text-lg mb-2 shadow-lg p-2 items-center justify-center rounded-2xl font-semibold">
                    <div className="flex ">{driver.name || "..........."}</div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">nationalId:</div>
                    <div className="text-right ">
                      {driver.nationalID || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">license:</div>
                    <div className="text-right ">
                      {driver.drivingLicense || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">status:</div>
                    <div className="text-right ">
                      {driver.driverStatus || "..........."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start ">
                {/* <UpdateDriver
                driver={driver}
                onUpdateDriver={handleUpdateDriver}
              /> */}
                {/* <DeleteDriver
                driver={driver}
                onDeleteDriver={() => handleDeleteDriver(driver)}
              /> */}
              </div>
            </Card>
          ))}
        </div>
        <ToastContainer autoClose={10000} />

      </div>
    );
};

export default DriversData;
