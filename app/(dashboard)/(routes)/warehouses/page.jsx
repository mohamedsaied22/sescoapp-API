"use client";

import React, { useEffect, useState } from "react";
import { Combine } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import Pagination from "@/components/pagination";
import SortOptions from "./components/warehouse-sort";
import NewWarehouse from "./components/warehouse-new";
import UpdateWarehouse from "./components/warehouse-update";
import Filters from "@/components/filteration";
import useSWR from "swr";

import { POSTAPI, PUTAPI } from "../../../../utities/test";

export default function WarehousePage() {
  // States to manage warehouse data, pagination, sorting, and filtering
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const warehousesPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalWarehouses, setOriginalWarehouses] = useState([]);

  const [storedWarehouses, setStoredWarehouses] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  // Load warehouses from localStorage on component mount
  // useEffect(() => {
  //   const storedWarehouses = JSON.parse(localStorage.getItem("warehouses")) || [];
  //   setOriginalWarehouses(storedWarehouses.map(addSubsCount));
  //   setFilteredWarehouses(storedWarehouses.map(addSubsCount));
  // }, []);

  const { data, error, isLoading } = useSWR(
    "http://10.1.114.43:3030/api/warehouse",
    fetcher
  );

  useEffect(() => {
    setStoredWarehouses(data || []);
    //setOriginalUsers(storedUsers.map(addSubsCount));
    setFilteredWarehouses(data || []);
  }, [data]);

  const searchWarehouses = (searchValue) => {
    setFilteredWarehouses(
      storedWarehouses.filter(
        (warehouse) =>
          warehouse.number.toLowerCase().includes(searchValue.toLowerCase()) ||
          warehouse.code.toLowerCase().includes(searchValue.toLowerCase()) ||
          warehouse.branch.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };
  // Function to add subscription count to warehouses
  const addSubsCount = (warehouse) => {
    const warehouseSubs =
      JSON.parse(localStorage.getItem(`subs_${warehouse.id}`)) || [];
    warehouse.subs = warehouseSubs.length;
    return warehouse;
  };

  // Filter warehouses based on input value
  // const filterWarehouses = (filterValue) => {
  //   if (filterValue === "") {
  //     setFilteredWarehouses(originalWarehouses);
  //     setCurrentPage(1);
  //   } else {
  //     const lowerCaseFilterValue = filterValue.toLowerCase();
  //     const filtered = originalWarehouses.filter((warehouse) => {
  //       return (
  //         warehouse.name.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.code.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.branch.toLowerCase().includes(lowerCaseFilterValue) ||
  //         warehouse.location.toLowerCase().includes(lowerCaseFilterValue)
  //       );
  //     });

  //     setFilteredWarehouses(filtered);
  //     setCurrentPage(1);
  //   }
  // };

  // Sort warehouses based on selected option
  const sortWarehouses = (sortValue) => {
    setSortOption(sortValue);

    const sortedWarehouses = [...filteredWarehouses];

    switch (sortValue) {
      case "number":
        sortedWarehouses.sort((a, b) => a.number.localeCompare(b.number));
        break;
      case "code":
        sortedWarehouses.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "branch":
        sortedWarehouses.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      default:
        // No sorting
        break;
    }

    setFilteredWarehouses(sortedWarehouses);
    setCurrentPage(1);
  };
  // Handle sort change
  // const handleSortChange = (sortValue) => {
  //   setSortOption(sortValue);
  //   sortWarehouses(sortValue);
  // };

  const handleAPIAddWarehouse = async (newWarehouse) => {
    const warehouse = {
      ...newWarehouse,
      lat: parseInt(newWarehouse.lat),
      long: parseInt(newWarehouse.long),
    };
    const result = await POSTAPI("/api/warehouse", warehouse);
    console.log(result);
    if (result.statusCode === 400) {
      if (result.message.includes("code")) {
        // toast
      }
    } else {
      setFilteredWarehouses([...filteredWarehouses, result]);
      //toast
    }
  };

  // Handle creation of new warehouse
  const handleWarehouseCreated = (newWarehouse) => {
    newWarehouse.id = uuidv4();
    newWarehouse.subs = 0;

    const updatedWarehouses = [...filteredWarehouses, newWarehouse];
    setFilteredWarehouses(updatedWarehouses);
    setOriginalWarehouses(updatedWarehouses);
    localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
  };

  // Handle warehouse update
  const handleUpdateWarehouse = (updatedWarehouse) => {
    const warehouseIndex = filteredWarehouses.findIndex(
      (warehouse) => warehouse.id === updatedWarehouse.id
    );

    if (warehouseIndex !== -1) {
      const updatedWarehouses = [...filteredWarehouses];
      updatedWarehouses[warehouseIndex] = updatedWarehouse;
      setFilteredWarehouses(updatedWarehouses);
      setOriginalWarehouses(updatedWarehouses);
      localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
    }
  };

  const handleAPIUpdateWarehouse = async (updatedWarehouse) => {
    const { _id, code, ...warehouse } = updatedWarehouse;
    const wh = { ...warehouse, lat: +warehouse.lat, long: +warehouse.long };
    const result = await PUTAPI("/api/warehouse/" + _id, wh);
    console.log(result);
    if (result.statusCode === 400) {
      if (result.message.includes("code")) {
        // toast
      }
    } else {
      setFilteredWarehouses(
        filteredWarehouses.map((warehouse) =>
          warehouse._id === _id ? updatedWarehouse : warehouse
        )
      );
      //toast
    }
  };

  // Calculate pagination variables
  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = filteredWarehouses.slice(
    indexOfFirstWarehouse,
    indexOfLastWarehouse
  );
  const totalPages = Math.ceil(filteredWarehouses.length / warehousesPerPage);

  // Pagination functions
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

  // JSX content for displaying warehouses, sorting, filters, etc.
  return (
    <div className="">
      {/* Heading for the Warehouse Page */}
      <Heading
        title="Warehouse Logistics"
        description="Streamlining Warehouse Movement."
        icon={Combine}
        iconColor="text-sky-400"
      />

      {/* Filtering and sorting options */}
      <div className="px-1 flex flex-col md:flex-row mt-8 mb-2 justify-center items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={searchWarehouses} />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions sortOption={sortOption} onSortChange={sortWarehouses} />
        </div>
        <div className="mb-4 ">
          <NewWarehouse
            warehouses={filteredWarehouses}
            onWarehouseCreated={handleAPIAddWarehouse}
          />
        </div>
      </div>

      {/* Displaying warehouses */}
      <div className="px-4 md:px-8 mt-4 lg:px-16  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredWarehouses.map((warehouse, index) => (
          <Card
            key={warehouse._id} // Make sure to use a unique key for each card
            className="w-1/2 p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition rounded-2xl"
          >
            {/* Warehouse details */}
            <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full font- ">
                <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-right ">
                    {warehouse.number || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">code:</div>
                  <div className="text-right ">
                    {warehouse.code || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">lat:</div>
                  <div className="text-right ">
                    {warehouse.lat || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">long:</div>
                  <div className="text-right ">
                    {warehouse.long || ".................."}
                  </div>
                </div>

                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">Branch:</div>
                  <div className="text-right ">
                    {warehouse.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>

            {/* UpdateWarehouse component */}
            <div className="flex justify-center ">
              <UpdateWarehouse
                warehouse={warehouse}
                onUpdateWarehouse={handleAPIUpdateWarehouse}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination component */}
      <Pagination
        currentUsers={currentWarehouses}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
