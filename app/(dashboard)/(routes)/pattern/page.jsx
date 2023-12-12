"use client";

import React, { useEffect, useState } from "react";
import { Ship, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import Pagination from "@/components/pagination";
import NewPattern from "./components/pattern-new";
import UpdatePattern from "./components/pattern-update";
// import DeletePattern from "./components/pattern-delete-modal";
import Filters from "@/components/filteration";
import SortOptions from "./components/pattern-sort";

export default function PatternsPage() {
  const [filteredPatterns, setFilteredPatterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patternsPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalPatterns, setOriginalPatterns] = useState([]);

  useEffect(() => {
    const storedPatterns = JSON.parse(localStorage.getItem("Patterns")) || [];
    setOriginalPatterns(storedPatterns.map(addSubsCount));
    setFilteredPatterns(storedPatterns.map(addSubsCount));
  }, []);

  useEffect(() => {
    const storedPatterns = JSON.parse(localStorage.getItem("Patterns")) || [];
    const updatedPatterns = storedPatterns.map((pattern) => {
      const patternCheckPoints =
        JSON.parse(localStorage.getItem(`patterns_${pattern.id}`)) || [];
      pattern.checkPoints = patternCheckPoints.length;
      return pattern;
    });
    setFilteredPatterns(updatedPatterns);
  }, []);

  const addSubsCount = (pattern) => {
    const patternSubs =
      JSON.parse(localStorage.getItem(`subs_${pattern.id}`)) || [];
    pattern.subs = patternSubs.length;
    return pattern;
  };

  const filterPatterns = (filterValue) => {
    if (filterValue === "") {
      setFilteredPatterns(originalPatterns);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = originalPatterns.filter((pattern) => {
        return (
          pattern.name.toLowerCase().includes(lowerCaseFilterValue) ||
          pattern.code.toLowerCase().includes(lowerCaseFilterValue) |
            pattern.imex.toLowerCase().includes(lowerCaseFilterValue)
          // pattern.location.toLowerCase().includes(lowerCaseFilterValue)
        );
      });

      setFilteredPatterns(filtered);
      setCurrentPage(1);
    }
  };

  const sortPatterns = (option) => {
    let sortedPatterns = [...originalPatterns];

    switch (option) {
      case "all":
        // No filtering, display all patterns
        break;
      case "import":
        sortedPatterns = sortedPatterns.filter(
          (pattern) => pattern.imex === "import"
        );
        break;
      case "export":
        sortedPatterns = sortedPatterns.filter(
          (pattern) => pattern.imex === "export"
        );
        break;
      default:
        // No sorting
        break;
    }

    setFilteredPatterns(sortedPatterns);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortPatterns(sortValue);
  };

  const indexOfLastPattern = currentPage * patternsPerPage;
  const indexOfFirstPattern = indexOfLastPattern - patternsPerPage;
  const currentPatterns = filteredPatterns.slice(
    indexOfFirstPattern,
    indexOfLastPattern
  );
  const totalPages = Math.ceil(filteredPatterns.length / patternsPerPage);

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

  const handlePatternCreated = (newPattern) => {
    newPattern.id = uuidv4();
    newPattern.checkPoints = 0;

    const updatedPatterns = [...filteredPatterns, newPattern];
    setFilteredPatterns(updatedPatterns);
    localStorage.setItem("Patterns", JSON.stringify(updatedPatterns));

    localStorage.setItem(`patterns_${newPattern.id}`, JSON.stringify([]));
  };

  const handleUpdatePattern = (updatedPattern) => {
    const patternIndex = filteredPatterns.findIndex(
      (pattern) => pattern.id === updatedPattern.id
    );

    if (patternIndex !== -1) {
      const updatedPatterns = [...filteredPatterns];
      updatedPatterns[patternIndex] = updatedPattern;
      setFilteredPatterns(updatedPatterns);
      localStorage.setItem("Patterns", JSON.stringify(updatedPatterns));
    }
  };

  const handleDeletePattern = (pattern) => {
    const updatedPatterns = filteredPatterns.filter((q) => q.id !== pattern.id);
    setFilteredPatterns(updatedPatterns);
    localStorage.setItem("Patterns", JSON.stringify(updatedPatterns));
  };

  return (
    <div className="">
      <Heading
        title="Pattern Operations"
        description="Navigating Your Pattern Fleet."
        icon={Upload}
        iconColor="text-sky-400"
      />

      <div className="px-1 flex flex-col md:flex-row mt-8 mb-2 justify-start items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={filterPatterns} />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4">
          <NewPattern
            Patterns={filteredPatterns}
            onPatternCreated={handlePatternCreated} // Make sure this function is defined
          />
        </div>
      </div>

      <div className=" px-4 md:px-12 lg:px-16 space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 ">
        {currentPatterns.map((pattern, index) => (
          <Card
            key={index}
            className="p-4 border-black/5 rounded-2xl flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded- "
          >
            <Link href={`/pattern/${pattern.id}`} key={index} legacyBehavior>
              <div className=" cursor-pointer  flex items-center justify-end mb-4 ">
                <div className="w-full font- ">
                  <div className="flex text-lg rounded-xl mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                    <div className="text-right ">
                      {pattern.name || ".................."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-md">Code:</div>
                    <div className="text-right ">
                      {pattern.code || ".................."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-md">IMEX:</div>
                    <div className="text-right ">
                      {pattern.imex || ".................."}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* <div className="flex flex-col items-center justify-end mb-4 p-1 shadow-md rounded-full cursor-pointer">
                <div className="text-center font-semibold text-xl ">
                  <a>{pattern.name}</a>
                </div>
                <div className="text-center text-sm ">IMO: {pattern.IMO}</div>
              </div>

            <span className="flex flex-col font-medium ">
              Gross Tonnage:{" "}
              {pattern.grossTonnage !== "" ? pattern.grossTonnage : "......"}
            </span> */}

            <div className="flex justify-center px-1 ">
              <UpdatePattern
                pattern={pattern}
                onUpdatePattern={handleUpdatePattern}
              />
              {/* <DeletePattern
                pattern={pattern}
                onDeletePattern={() => handleDeletePattern(pattern)}
              /> */}
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentPatterns}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
}
