"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/heading";
import Link from "next/link";
import { Ship } from "lucide-react";
import { Card } from "@/components/ui/card";
import CheckPointData from "../components/checkPoint-data";
import { v4 as uuidv4 } from "uuid";
// import UpdatePattern from "/components/Pattern-Update";

const PatternInfo = ({ params }) => {
  const [Pattern, setPattern] = useState(null);
  const [checkPoints, setCheckPoints] = useState([]);
  const [filteredCheckPoints, setFilteredCheckPoints] = useState([]);
  const [filteredPatterns, setFilteredPatterns] = useState([]);

  const id = params.id;

  useEffect(() => {
    const Patterns = JSON.parse(localStorage.getItem("Patterns")) || [];
    const foundPattern = Patterns.find((c) => c.id === id);

    if (foundPattern) {
      setPattern(foundPattern);
      const PatternCheckPoints =
        JSON.parse(localStorage.getItem(`checkPoints_${id}`)) || [];
      foundPattern.checkPoints = PatternCheckPoints.length;
      setFilteredPatterns(Patterns);
    }

    const PatternCheckPoints =
      JSON.parse(localStorage.getItem(`checkPoints_${id}`)) || [];
    setCheckPoints(PatternCheckPoints);
    setFilteredCheckPoints(PatternCheckPoints);
  }, [id]);

  if (!Pattern) {
    return <div>Loading...</div>;
  }

  const handleCheckPointCreated = (newCheckPoint) => {
    newCheckPoint.id = uuidv4();
    const updatedCheckPoints = [...checkPoints, newCheckPoint];
    setCheckPoints(updatedCheckPoints);
    localStorage.setItem(
      `checkPoints_${id}`,
      JSON.stringify(updatedCheckPoints)
    );

    const updatedPattern = {
      ...Pattern,
      checkPoints: Pattern.checkPoints + 1,
    };
    setPattern(updatedPattern);
    localStorage.setItem(`Pattern_${id}`, JSON.stringify(updatedPattern));

    setFilteredPatterns((prevState) => {
      const index = prevState.findIndex((v) => v.id === updatedPattern.id);
      if (index !== -1) {
        prevState[index] = updatedPattern;
      }
      return [...prevState];
    });
  };

  const handleUpdateCheckPoint = (updatedCheckPoint) => {
    const checkPointIndex = checkPoints.findIndex(
      (checkPoint) => checkPoint.id === updatedCheckPoint.id
    );

    if (checkPointIndex !== -1) {
      const updatedCheckPoints = [...checkPoints];
      updatedCheckPoints[checkPointIndex] = updatedCheckPoint;
      setCheckPoints(updatedCheckPoints);

      const filteredCheckPointsIndex = filteredCheckPoints.findIndex(
        (checkPoint) => checkPoint.id === updatedCheckPoint.id
      );

      if (filteredCheckPointsIndex !== -1) {
        const updatedFilteredCheckPoints = [...filteredCheckPoints];
        updatedFilteredCheckPoints[filteredCheckPointsIndex] =
          updatedCheckPoint;
        setFilteredCheckPoints(updatedFilteredCheckPoints);
        localStorage.setItem(
          `checkPoints_${id}`,
          JSON.stringify(updatedCheckPoints)
        );
      }
    }
  };

  const handleUpdatePattern = (updatedPattern) => {
    setPattern(updatedPattern);

    const PatternIndex = filteredPatterns.findIndex(
      (Pattern) => Pattern.id === updatedPattern.id
    );

    if (PatternIndex !== -1) {
      const updatedPatterns = [...filteredPatterns];
      updatedPatterns[PatternIndex] = updatedPattern;
      setFilteredPatterns(updatedPatterns);
      localStorage.setItem("Patterns", JSON.stringify(updatedPatterns));
    }
  };

  return (
    <div>
      <Link href="/pattern">
        <Heading
          title="Pattern Operations"
          description="Navigating Your Pattern Fleet."
          icon={Ship}
          iconColor="text-sky-400"
        />
      </Link>

      <div className="px-4 md:px-12 lg:px-16 space-y-4  grid  xl:grid-cols-2 gap-4">
        <Card className="p-4  border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-xl ">
          <div className=" ">
            <div className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
              <div className="text-right ">
                {Pattern.name || ".................."}
              </div>
            </div>
            <div className="flex justify-between mb-2 shadow-md p-2">
              <div className="text-left text-md">Code:</div>
              <div className="text-right ">
                {Pattern.code || ".................."}
              </div>
            </div>
            <div className="flex justify-between shadow-md p-2">
              <div className="text-left text-md">IMEX:</div>
              <div className="text-right ">
                {Pattern.imex || ".................."}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <CheckPointData
          checkPoints={filteredCheckPoints}
          onCheckPointCreated={handleCheckPointCreated}
          onUpdateCheckPoint={handleUpdateCheckPoint}
        />
      </div>
    </div>
  );
};

export default PatternInfo;
