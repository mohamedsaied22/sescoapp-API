import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import NewCheckpoint from "./checkpoint-new";
import UpdateCheckPoint from "./checkpoint-update";
import Filters from "@/components/filteration";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const CheckPointData = ({
  checkPoints,
  onCheckPointCreated,
  onUpdateCheckPoint,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [filteredCheckPoints, setFilteredCheckPoints] = useState(checkPoints);

  const filterCheckPoints = useCallback(
    (filterValue) => {
      if (filterValue === "") {
        setFilteredCheckPoints(checkPoints);
      } else {
        const filtered = checkPoints.filter((checkPoint) => {
          const lowerCaseFilterValue = filterValue.toLowerCase();
          return (
            checkPoint.id.toLowerCase().includes(lowerCaseFilterValue) ||
            checkPoint.order.toLowerCase().includes(lowerCaseFilterValue) ||
            checkPoint.label.toLowerCase().includes(lowerCaseFilterValue) ||
            checkPoint.locationType
              .toLowerCase()
              .includes(lowerCaseFilterValue) ||
            checkPoint.role.toLowerCase().includes(lowerCaseFilterValue) ||
            checkPoint.repeat.toLowerCase().includes(lowerCaseFilterValue) ||
            checkPoint.description.toLowerCase().includes(lowerCaseFilterValue)
          );
        });

        setFilteredCheckPoints(filtered);
      }
    },
    [checkPoints]
  );

  useEffect(() => {
    filterCheckPoints(filterValue);
  }, [filterValue, checkPoints, filterCheckPoints]);

  const handleCheckpointCreated = (newCheckPoint) => {
    onCheckPointCreated(newCheckPoint);

    // Update the state to include the new checkpoint
    setFilteredCheckPoints((prevCheckPoints) => [
      newCheckPoint,
      ...prevCheckPoints,
    ]);

    // Show a success toast when a new checkpoint is created
    toast.success("New checkpoint created successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#9acaff",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px 0  12px 0",
        width: "98%",
        fontSize: "bold",
      },
    });
  };

  const handleUpdateCheckPoint = (updatedCheckPoint) => {
    // Update the state to include the updated checkpoint
    setFilteredCheckPoints((prevCheckPoints) =>
      prevCheckPoints.map((checkpoint) =>
        checkpoint.id === updatedCheckPoint.id ? updatedCheckPoint : checkpoint
      )
    );

    // Show a success toast when a checkpoint is updated
    toast.success("Checkpoint updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
      style: {
        background: "#9acaff",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px 0  12px 0",
        width: "98%",
        fontSize: "bold",
      },
    });
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  return (
    <div className="border-black/5 transition rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row mt-8 mb-2 justify-center items-center">
        <div className="flex-1 mb-4 ml-2 mr-2">
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div className="mb-4 mr-8">
          <NewCheckpoint
            checkPoints={checkPoints}
            onCheckpointCreated={handleCheckpointCreated}
          />
        </div>
      </div>

      <div className="px-4 md:px-8 mt-4 mb-4 lg:px-16 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredCheckPoints.map((checkPoint) => (
          <Card
            key={checkPoint.id}
            className="p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition rounded-2xl"
          >
            {/* Existing code */}
            <div className="flex items-center justify-end mb-4">
              <div className="w-full">
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">
                  Order:
                  </div>
                  <div className="text-right">
                    {checkPoint.order || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">label:</div>
                  <div className="text-right">
                    {checkPoint.label || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-sm">
                     Description:
                  </div>
                  <div className="text-right">
                    {checkPoint.description || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm"> locationType:</div>
                  <div className="text-right">
                    {checkPoint.locationType || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">role:</div>
                  <div className="text-right">
                    {checkPoint.role || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-sm">repeat:</div>
                  <div className="text-right">
                    {checkPoint.repeat || ".................."}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-between content-end">
              <UpdateCheckPoint
                checkPoint={checkPoint}
                onUpdateCheckPoint={handleUpdateCheckPoint}
              />
            </div>
          </Card>
        ))}
      </div>

      <ToastContainer autoClose={5000} />
    </div>
  );
};

export default CheckPointData;
