"use-client ";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {PlayCircle,RotateCcw} from "lucide-react"
import {Button} from "@/components/ui/button"
const SimulationForm = () => {
    return  (   
           
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Trains
              </label>
              <input
                type="number"
                defaultValue={25}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Peak Demand (%)
              </label>
              <input
                type="number"
                defaultValue={80}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Maintenance Probability (%)
              </label>
              <input
                type="number"
                defaultValue={15}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" >
                Cleaning Time (hrs)
              </label>
              <input 
                name="cleaningTime"
                type="number"
                defaultValue={2}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <Button  className="bg-teal-600 text-white">
              <PlayCircle className="w-4 h-4 mr-1" /> Run Simulation
            </Button>
            <Button  variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>
        </CardContent>
)}
export default SimulationForm;