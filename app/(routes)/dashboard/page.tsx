import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, PauseCircle, Wrench } from "lucide-react";

const trainData = [
  { id: "Train 101", status: "Ready" },
  { id: "Train 102", status: "Standby" },
  { id: "Train 103", status: "Maintenance" },
  { id: "Train 104", status: "Ready" },
  { id: "Train 105", status: "Standby" },
];

const statusIcon = {
  Ready: <CheckCircle2 className="text-green-600 w-5 h-5" />,
  Standby: <PauseCircle className="text-yellow-500 w-5 h-5" />,
  Maintenance: <Wrench className="text-red-600 w-5 h-5" />,
};

const TrainAllocationPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold">Train Allocation</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 /> Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <PauseCircle /> Standby
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Wrench /> Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Train Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainData.map((train) => (
                <TableRow key={train.id}>
                  <TableCell>{train.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {statusIcon[train.status as keyof typeof statusIcon]} {train.status}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="mr-2">
                      Reassign
                    </Button>
                    <Button size="sm" className="bg-teal-600 text-white">
                      Allocate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button className="bg-teal-600 text-white px-6">Run Optimization</Button>
        <Button variant="outline" className="px-6">View What-if Simulation</Button>
      </div>
    </div>
  );
};

export default TrainAllocationPage;