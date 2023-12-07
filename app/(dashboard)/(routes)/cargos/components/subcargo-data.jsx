import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import NewSub from "./sub-new";
import UpdateSub from "./sub-update";
import DeleteSub from "./sub-delete";
import CargoFilters from "./cargo-filters";
import Filters from "@/components/filteration";
import SortOptions from "./cargo-sorting";
import Pagination from "@/components/pagination";
import { POSTAPI, PUTAPI } from "../../../../../utities/test";

const SubCargoData = ({ selectedCargo, onSubCreated, onUpdateSub, onDeleteSub }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [cargo, setCargo] = useState(selectedCargo);
  const [filteredSubCargos, setFilteredSubCargos] = useState(cargo.subCargoList);

  const [currentPage, setCurrentPage] = useState(1);
  const cargosPerPage = 15;
  const [originalCargos, setOriginalCargos] = useState([]);
  const [sortOption, setSortOption] = useState("");

  // useEffect(() => {
  //   const storedCargos = JSON.parse(localStorage.getItem("subs")) || [];
  //   setOriginalCargos(storedCargos.map(addSubsCount));
  //   setFilteredCargos(storedCargos.map(addSubsCount));
  // }, []);

  // useEffect(() => {
  //   setFilteredCargos(originalCargos);
  // }, [originalCargos]);

  const searchCargos = (searchValue) => {
    setFilteredSubCargos(
      cargo.subCargoList.filter(
        (subCargo) =>
          subCargo.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          subCargo.code.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const handleAPIAddSubCargo = async (newSubCargo) => {
    try {
      const result = await POSTAPI("/api/cargo/"+cargo.code+"/subCargo", newSubCargo);
      console.log(result);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        //setFilteredSubCargos([...filteredSubCargos, result]);
        setCargo(result)
        setFilteredSubCargos(result.subCargoList)
        //toast
      }
    } catch (error) {
      console.error("Error adding cargo:", error);
      // Handle error
    }
  };

  const handleAPIUpdateCargo = async (updatedSubCargo) => {
    try {
      console.log(updatedSubCargo)
      const { id, ...subCargo } = updatedSubCargo;
      const result = await PUTAPI("/api/cargo/"+cargo.code+"/subCargo", subCargo);

      if (result.statusCode === 400 && result.message.includes("code")) {
        // Handle validation error
        // toast
      } else {
        setFilteredSubCargos(
          filteredSubCargos.map((subCargo) =>
            subCargo.code === updatedSubCargo.code ? updatedSubCargo : subCargo
          )
        );
        //toast
      }
    } catch (error) {
      console.error("Error updating cargo:", error);
      // Handle error
    }
  };


  const handleSubCreated = (newSub) => {
    onSubCreated(newSub);
    setSelectedStatus("");

    // Optionally, you can update the filteredCargos state to include the new sub cargo
    setFilteredSubCargos((prevCargos) => [newSub, ...prevCargos]);
  };
  const handleUpdateSub = (updatedSub) => {
    onUpdateSub(updatedSub);

    // Update the subs state with the updated Sub
    const updatedSubs = subs.map((sub) =>
      sub.id === updatedSub.id ? updatedSub : sub
    );
    // Optionally, you can update the filteredCargos state here as well

    setFilteredSubCargos(updatedSubs);
  };

  const handleDeleteSub = (sub) => {
    onDeleteSub(sub);

    // Update the subs state to remove the deleted sub cargo
    const updatedSubs = subs.filter((item) => item.id !== sub.id);
    // Optionally, you can update the filteredCargos state here as well

    setFilteredSubCargos(updatedSubs);
  };

  const addSubsCount = (cargo) => {
    const cargoSubs =
      JSON.parse(localStorage.getItem(`subs_${cargo.id}`)) || [];
    cargo.subCargoList = cargoSubs.length;
    return cargo;
  };





  const filterCargos = (filterValue) => {
    if (filterValue === "") {
      setFilteredCargos(originalCargos);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = originalCargos.filter((cargo) => {
        return (
          cargo.name.toLowerCase().includes(lowerCaseFilterValue) ||
          cargo.code.toLowerCase().includes(lowerCaseFilterValue) ||
          (cargo.location &&
            cargo.location.toLowerCase().includes(lowerCaseFilterValue))
        );
      });

      setFilteredCargos(filtered);
      setCurrentPage(1);
    }
  };
  const sortCargos = (option) => {
    let sortedCargos = [...filteredSubCargos];

    switch (option) {
      case "name":
        sortedCargos.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "code":
        sortedCargos.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "branch":
        sortedCargos.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      case "location":
        sortedCargos.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        // No sorting
        break;
    }

    setFilteredSubCargos(sortedCargos);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortCargos(sortValue);
  };
  const indexOfLastCargo = currentPage * cargosPerPage;
  const indexOfFirstCargo = indexOfLastCargo - cargosPerPage;
  const currentCargos = filteredSubCargos.slice(
    indexOfFirstCargo,
    indexOfLastCargo
  );
  const totalPages = Math.ceil(filteredSubCargos.length / cargosPerPage);

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
    <div className="px-4 border-black/5 mt-4 transition ml-16 ">
      <div className="flex flex-col md:flex-row mt-8 mb-6 justify-center items-center">
        <div className="flex-1 mb-4">
          <Filters onFilterChange={searchCargos} />
        </div>
        <div className="mb-4 mr-0">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4">
          <NewSub subs={cargo.subCargoList} onSubCreated={handleAPIAddSubCargo} />
        </div>
      </div>

      <div className=" px-8 space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredSubCargos.map((sub) => (
          <Card
            key={sub.id}
            className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition  "
          >
            <div className="  flex items-center justify-center mb-4  ">
              <div className="w-full  ">
                <div className="flex text-lg mb-2 shadow-lg p-2 items-center justify-center rounded-2xl font-semibold">
                  {/* <div className="text-left text-sm ">Name:</div> */}
                  <div className="flex  ">{sub.name || "..........."}</div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">code:</div>
                  <div className="text-right ">{sub.code || "..........."}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center content-end">
              <UpdateSub sub={sub} onUpdateSub={handleAPIUpdateCargo} />
              {/* <DeleteSub sub={sub} onDeleteSub={() => handleDeleteSub(sub)} /> */}
            </div>
          </Card>
        ))}
      </div>
      <Pagination
        currentUsers={currentCargos}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default SubCargoData;
