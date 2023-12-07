"use client";

import { useEffect, useState } from "react";
import { Combine } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { POSTAPI, PUTAPI } from "../../../../utities/test";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import Filters from "@/components/filteration";
import NewCargo from "./components/cargo-new";
import UpdateCargo from "./components/cargo-update";
import Pagination from "@/components/pagination";
import SortOptions from "./components/cargo-sorting";

export default function CargoPage() {
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cargosPerPage = 15;
  const [sortOption, setSortOption] = useState("");
  const [storedCargos, setStoredCargos] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://10.1.114.43:3030/api/cargo",
    fetcher
  );

  useEffect(() => {
    setStoredCargos(data || []);
    setFilteredCargos(data || []);
  }, [data]);

  const searchCargos = (searchValue) => {
    setFilteredCargos(
      storedCargos.filter(
        (cargo) =>
          cargo.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          cargo.code.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleAPIAddCargo = async (newCargo) => {
    try {
      const result = await POSTAPI("/api/cargo", newCargo);
      console.log(result);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredCargos([...filteredCargos, result]);
        //toast
      }
    } catch (error) {
      console.error("Error adding cargo:", error);
      // Handle error
    }
  };

  const handleAPIUpdateCargo = async (updatedCargo) => {
    try {
      const { _id, code, ...cargo } = updatedCargo;
      const result = await PUTAPI("/api/cargo/" + _id, cargo);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredCargos(
          filteredCargos.map((cargo) =>
            cargo._id === _id ? updatedCargo : cargo
          )
        );
        //toast
      }
    } catch (error) {
      console.error("Error updating cargo:", error);
      // Handle error
    }
  };

  const sortCargos = (option) => {
    let sortedCargos = [...filteredCargos];
  
    switch (option) {
      case "name":
        sortedCargos.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "code":
        sortedCargos.sort((a, b) => {
          const codeA = parseInt(a.code, 10);
          const codeB = parseInt(b.code, 10);
  
          return codeA - codeB;
        });
        break;
  
      default:
        // No sorting
        break;
    }
  
    setFilteredCargos(sortedCargos);
  };
  

  const handleDeleteCargo = (cargo) => {
    const updatedCargos = filteredCargos.filter((q) => q.id !== cargo.id);
    setFilteredCargos(updatedCargos);
  };

  const handleCargoCreated = (newCargo) => {
    newCargo.id = uuidv4();
    newCargo.subs = 0;

    const updatedCargos = [...filteredCargos, newCargo];
    setFilteredCargos(updatedCargos);
    localStorage.setItem("cargos", JSON.stringify(updatedCargos));
  };

  const handleUpdateCargo = (updatedCargo) => {
    const cargoIndex = filteredCargos.findIndex(
      (cargo) => cargo.id === updatedCargo.id
    );

    if (cargoIndex !== -1) {
      const updatedCargos = [...filteredCargos];
      updatedCargos[cargoIndex] = updatedCargo;
      setFilteredCargos(updatedCargos);
      localStorage.setItem("cargos", JSON.stringify(updatedCargos));
    }
  };

  const indexOfLastCargo = currentPage * cargosPerPage;
  const indexOfFirstCargo = indexOfLastCargo - cargosPerPage;
  const currentCargos = filteredCargos.slice(
    indexOfFirstCargo,
    indexOfLastCargo
  );
  const totalPages = Math.ceil(filteredCargos.length / cargosPerPage);

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

  return (
    <div className="">
      <Heading
        title="Cargo Logistics"
        description=" Streamlining Cargo Movement."
        icon={Combine}
        iconColor="text-sky-400"
      />
      <div className="px-1 flex flex-col md:flex-row mt-8 mb-2 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={searchCargos} />
        </div>
        <div className="mb-4 mr-0 ml-2">
          <SortOptions sortOption={sortOption} onSortChange={sortCargos} />
        </div>
        <div className="mb-4">
          <NewCargo cargos={filteredCargos} onCargoCreated={handleAPIAddCargo} />
        </div>
      </div>

      <div className=" px-4 md:px-12 lg:px-16 space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {currentCargos.map((cargo, index) => (
          <Card
            key={index}
            className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl "
          >
            <Link href={`/cargos/${cargo._id}`} key={index} legacyBehavior>
              <div className="  flex items-center justify-center mb-4 cursor-pointer ">
                <div className="w-full  ">
                  <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                    <div className="flex  ">{cargo.name || "..........."}</div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">code:</div>
                    <div className="text-right ">{cargo.code || "..........."}</div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Number of Sub:</div>
                    <div className="text-right ">{cargo.subCargoList.length }</div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex justify-center px-1">
              <UpdateCargo cargo={cargo} onUpdateCargo={handleAPIUpdateCargo} />
              {/* <DeleteCargo cargo={cargo} onDeleteCargo={() => handleDeleteCargo(cargo)} /> */}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentCargos={currentCargos}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
