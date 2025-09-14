import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Brush, CheckCircle2, Clock } from "lucide-react";

const cleaningTasks = [
  { id: "Train 201", status: "Pending", assignedTo: "Team A" },
  { id: "Train 202", status: "In Progress", assignedTo: "Team B" },
  { id: "Train 203", status: "Completed", assignedTo: "Team C" },
  { id: "Train 204", status: "Pending", assignedTo: "Team A" },
];

const CleaningPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <Brush className="text-teal-600" /> Cleaning Management
      </h2>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Clock /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Cleaning Task Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Train Cleaning Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Team</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cleaningTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          task.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="mr-2">
                      Assign
                    </Button>
                    {task.status !== "Completed" && (
                      <Button size="sm" className="bg-teal-600 text-white">
                        Mark Done
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button className="bg-teal-600 text-white px-6">
          Add Cleaning Task
        </Button>
        <Button variant="outline" className="px-6">
          Generate Cleaning Report
        </Button>
      </div>
    </div>
  );
};

export default CleaningPage;
