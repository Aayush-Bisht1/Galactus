
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SimulationForm from "@/app/_components/Dashboard/Simulation/SimulationForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, PlayCircle, RotateCcw } from "lucide-react";

const SimulationPage = () => {
  

  // mock simulation run
 let results:{ scenario: string; ready: number; standby: number; maintenance: number }[] = [
      { scenario: "Peak Hours", ready: 22, standby: 8, maintenance: 5 },
      { scenario: "Off Peak", ready: 18, standby: 12, maintenance: 5 },
    ];

  const resetSimulation = () => {results=[]};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <BarChart3 className="text-teal-600" /> Simulation & What-If Analysis
      </h2>

      {/* Parameter Input */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
        </CardHeader>

      </Card>
      <SimulationForm/>
      {/* Results Table */}
      {results.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Standby</TableHead>
                  <TableHead>Maintenance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.scenario}</TableCell>
                    <TableCell>{r.ready}</TableCell>
                    <TableCell>{r.standby}</TableCell>
                    <TableCell>{r.maintenance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationPage;
