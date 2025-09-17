"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, PauseCircle, Wrench, RefreshCw, Clock, Droplets, Settings, AlertTriangle } from "lucide-react";

export type Cleaning= {
  last_clean_end: string;
  clean_age_hours: number;
  today_clean_load: number;
}

export type Maintenance= {
  open_work_orders: number;
  open_work_order_hours: number;
  _id: string;
}

export type TrainData= {
  train_id: string;
  eligible: boolean;
  priority_score: number;
  status: string;
  fitness_days_left: number;
  reasons: string[];
  recommendations: string[];
  cleaning: Cleaning;
  maintenance: Maintenance;
}

export type Allocation= {
  _id: string;
  userId: string;
  data: TrainData[];
  statusSummary: {
    Ready: number;
    Standby: number;
    Maintenance: number;
  };
}

const statusIcon = {
  Ready: <CheckCircle2 className="text-green-600 w-5 h-5" />,
  Standby: <PauseCircle className="text-yellow-500 w-5 h-5" />,
  Maintenance: <Wrench className="text-red-600 w-5 h-5" />,
};

const TrainAllocationPage = () => {
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  console.log(allocation);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setAllocation(json);
    }
    fetchData();
  }, []);


  if (!allocation) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
            <p className="text-lg">Loading train allocation data...</p>
            <p className="text-sm text-gray-600">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }
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
            <p className="text-2xl font-bold">{allocation.statusSummary.Ready}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <PauseCircle /> Standby
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allocation.statusSummary.Standby}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Wrench /> Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allocation.statusSummary.Maintenance}</p>
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
              {allocation.data.map((train) => (
                <TableRow key={train.train_id}>
                  <TableCell>Train {train.train_id}</TableCell>
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