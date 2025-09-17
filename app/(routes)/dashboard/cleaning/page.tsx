"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Table components defined inline since @/components/ui/table is not available
const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b hover:bg-gray-50">{children}</tr>
);

const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`p-3 text-left font-medium text-gray-700 ${className}`}>{children}</th>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-3 ${className}`}>{children}</td>
);
import { Brush, CheckCircle2, Clock, RefreshCw } from "lucide-react";

export type Cleaning = {
  last_clean_end: string;
  clean_age_hours: number;
  today_clean_load: number;
};

export type Maintenance = {
  open_work_orders: number;
  open_work_order_hours: number;
  _id: string;
};

export type TrainData = {
  train_id: string;
  eligible: boolean;
  priority_score: number;
  status: string;
  fitness_days_left: number;
  reasons: string[];
  recommendations: string[];
  cleaning: Cleaning;
  maintenance: Maintenance;
};

export type AllocationData = {
  _id: string;
  userId: string;
  data: TrainData[];
  statusSummary: {
    Ready: number;
    Standby: number;
    Maintenance: number;
  };
  createdAt: string;
};

const CleaningPage = () => {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [records, setRecords] = useState<(TrainData & { cleaningStatus: string; assignedTo?: string })[]>([]);
  const [counts, setCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard");
        const payload = await res.json();
        
        if (payload && payload.data) {
          setAllocationData(payload);
          
          let pending = 0;
          let inProgress = 0;
          let completed = 0;

          const updated = payload.data.map((train: TrainData) => {
            let cleaningStatus = "Pending";

            // Determine cleaning status based on the data structure
            if (train.cleaning?.last_clean_end && train.cleaning?.today_clean_load === 0) {
              cleaningStatus = "Completed";
              completed++;
            } else if (train.cleaning?.today_clean_load > 0) {
              cleaningStatus = "In Progress";
              inProgress++;
            } else if (!train.cleaning?.last_clean_end || train.cleaning?.clean_age_hours > 24) {
              cleaningStatus = "Pending";
              pending++;
            } else {
              cleaningStatus = "Completed";
              completed++;
            }

            // Add some mock assigned team data (you can replace this with real data)
            const assignedTo = `Team ${Math.floor(Math.random() * 5) + 1}`;

            return { ...train, cleaningStatus, assignedTo };
          });

          setRecords(updated);
          setCounts({ pending, inProgress, completed });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleAssignTeam = (trainId: string) => {
    // Mock function - implement your assign team logic here
    console.log(`Assigning team to train ${trainId}`);
    alert(`Assigning team to train ${trainId}`);
  };

  const handleMarkDone = (trainId: string) => {
    // Mock function - implement your mark done logic here
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.train_id === trainId 
          ? { ...record, cleaningStatus: "Completed" }
          : record
      )
    );
    
    // Update counts
    setCounts(prevCounts => ({
      ...prevCounts,
      inProgress: Math.max(0, prevCounts.inProgress - 1),
      completed: prevCounts.completed + 1
    }));
  };

  const formatCleanAge = (hours: number) => {
    if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    } else {
      return `${(hours / 24).toFixed(1)}d`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
            <p className="text-lg">Loading cleaning management data...</p>
            <p className="text-sm text-gray-600">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-bold">{counts.pending}</p>
            <p className="text-sm text-gray-600">Trains awaiting cleaning</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <RefreshCw /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.inProgress}</p>
            <p className="text-sm text-gray-600">Currently being cleaned</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.completed}</p>
            <p className="text-sm text-gray-600">Recently cleaned trains</p>
          </CardContent>
        </Card>
      </div>

      {/* Cleaning Task Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Train Cleaning Schedule</CardTitle>
          {allocationData && (
            <p className="text-sm text-gray-600">
              Last updated: {new Date(allocationData.createdAt).toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clean Age</TableHead>
                <TableHead>Today's Load</TableHead>
                <TableHead>Assigned Team</TableHead>
                <TableHead>Train Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.train_id}>
                  <TableCell className="font-medium">{record.train_id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          record.cleaningStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : record.cleaningStatus === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {record.cleaningStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.cleaning?.clean_age_hours ? 
                      formatCleanAge(record.cleaning.clean_age_hours) : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    {record.cleaning?.today_clean_load || 0}
                  </TableCell>
                  <TableCell>{record.assignedTo || "Unassigned"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          record.status === "Ready"
                            ? "bg-green-100 text-green-700"
                            : record.status === "Maintenance"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => handleAssignTeam(record.train_id)}
                    >
                      Assign
                    </Button>
                    {record.cleaningStatus !== "Completed" && (
                      <Button 
                        size="sm" 
                        className="bg-teal-600 text-white hover:bg-teal-700"
                        onClick={() => handleMarkDone(record.train_id)}
                      >
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
        <Button className="bg-teal-600 text-white px-6 hover:bg-teal-700">
          Add Cleaning Task
        </Button>
        <Button variant="outline" className="px-6">
          Generate Cleaning Report
        </Button>
        <Button variant="outline" className="px-6" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      {/* Summary Footer */}
      {allocationData && (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Total Trains</p>
                <p className="text-gray-600">{allocationData.data.length}</p>
              </div>
              <div>
                <p className="font-medium">Cleaning Efficiency</p>
                <p className="text-gray-600">
                  {((counts.completed / allocationData.data.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="font-medium">Data Source</p>
                <p className="text-gray-600">KMRL Database</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CleaningPage;