"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, CheckCircle2, Clock, RefreshCw, AlertTriangle, Settings } from "lucide-react";

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

const MaintenancePage = () => {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [records, setRecords] = useState<(TrainData & { maintenanceStatus: string; assignedTo?: string; urgency: string })[]>([]);
  const [counts, setCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0,
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
          let urgent = 0;

          const updated = payload.data.map((train: TrainData) => {
            let maintenanceStatus = "No Issues";
            let urgency = "Low";

            // Determine maintenance status based on the data structure
            if (train.status === "Maintenance") {
              if (train.maintenance?.open_work_orders > 0) {
                if (train.maintenance.open_work_order_hours > 48) {
                  maintenanceStatus = "In Progress";
                  urgency = "High";
                  inProgress++;
                  urgent++;
                } else if (train.maintenance.open_work_order_hours > 24) {
                  maintenanceStatus = "In Progress";
                  urgency = "Medium";
                  inProgress++;
                } else {
                  maintenanceStatus = "Pending";
                  urgency = "Medium";
                  pending++;
                }
              } else {
                maintenanceStatus = "Pending";
                pending++;
              }
            } else if (train.maintenance?.open_work_orders > 0) {
              maintenanceStatus = "Scheduled";
              urgency = train.maintenance.open_work_order_hours > 24 ? "Medium" : "Low";
              pending++;
            } else if (train.fitness_days_left <= 5) {
              maintenanceStatus = "Due Soon";
              urgency = "High";
              urgent++;
              pending++;
            } else {
              maintenanceStatus = "Good";
              completed++;
            }

            // Add some mock assigned team data (you can replace this with real data)
            const assignedTo = train.status === "Maintenance" ? 
              `Maintenance Team ${Math.floor(Math.random() * 3) + 1}` : 
              "Unassigned";

            return { ...train, maintenanceStatus, assignedTo, urgency };
          });

          setRecords(updated);
          setCounts({ pending, inProgress, completed, urgent });
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
    console.log(`Assigning maintenance team to train ${trainId}`);
    alert(`Assigning maintenance team to train ${trainId}`);
  };

  const handleMarkDone = (trainId: string) => {
    // Mock function - implement your mark done logic here
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.train_id === trainId 
          ? { ...record, maintenanceStatus: "Good" }
          : record
      )
    );
    
    // Update counts
    setCounts(prevCounts => ({
      ...prevCounts,
      inProgress: Math.max(0, prevCounts.inProgress - 1),
      pending: Math.max(0, prevCounts.pending - 1),
      completed: prevCounts.completed + 1
    }));
  };

  const formatWorkOrderHours = (hours: number) => {
    if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    } else {
      return `${(hours / 24).toFixed(1)}d`;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      default: return "text-green-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Scheduled": return "bg-purple-100 text-purple-700";
      case "Due Soon": return "bg-red-100 text-red-700";
      case "Good": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
            <p className="text-lg">Loading maintenance management data...</p>
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
        <Wrench className="text-teal-600" /> Maintenance Management
      </h2>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pending}</p>
            <p className="text-sm text-gray-600">Awaiting maintenance</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Settings /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.inProgress}</p>
            <p className="text-sm text-gray-600">Under maintenance</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 /> Good Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.completed}</p>
            <p className="text-sm text-gray-600">Operational trains</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle /> Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.urgent}</p>
            <p className="text-sm text-gray-600">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Task Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
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
                <TableHead>Urgency</TableHead>
                <TableHead>Work Orders</TableHead>
                <TableHead>Order Duration</TableHead>
                <TableHead>Fitness Days Left</TableHead>
                <TableHead>Assigned Team</TableHead>
                <TableHead>Train Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records
                .sort((a, b) => {
                  // Sort by urgency first (High, Medium, Low), then by maintenance status
                  const urgencyOrder = { "High": 0, "Medium": 1, "Low": 2 };
                  return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
                })
                .map((record) => (
                <TableRow key={record.train_id}>
                  <TableCell className="font-medium">{record.train_id}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.maintenanceStatus)}`}>
                      {record.maintenanceStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getUrgencyColor(record.urgency)}`}>
                      {record.urgency}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.maintenance?.open_work_orders || 0}
                  </TableCell>
                  <TableCell>
                    {record.maintenance?.open_work_order_hours ? 
                      formatWorkOrderHours(record.maintenance.open_work_order_hours) : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    <span className={record.fitness_days_left <= 5 ? "text-red-600 font-medium" : ""}>
                      {record.fitness_days_left} days
                    </span>
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
                    {record.maintenanceStatus !== "Good" && (
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
          Add Maintenance Task
        </Button>
        <Button variant="outline" className="px-6">
          Generate Maintenance Report
        </Button>
        <Button variant="outline" className="px-6" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      {/* Summary Footer */}
      {allocationData && (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Total Trains</p>
                <p className="text-gray-600">{allocationData.data.length}</p>
              </div>
              <div>
                <p className="font-medium">Maintenance Rate</p>
                <p className="text-gray-600">
                  {((allocationData.statusSummary.Maintenance / allocationData.data.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="font-medium">Operational Health</p>
                <p className="text-gray-600">
                  {(((counts.completed) / allocationData.data.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="font-medium">Data Source</p>
                <p className="text-gray-600">Live Database</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Critical Attention Required</CardTitle>
          </CardHeader>
          <CardContent>
            {records.filter(r => r.urgency === "High").length > 0 ? (
              <div className="space-y-2">
                {records.filter(r => r.urgency === "High").slice(0, 3).map(train => (
                  <div key={train.train_id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">{train.train_id}</span>
                    <span className="text-sm text-red-600">{train.maintenanceStatus}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No critical issues at this time</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {records.filter(r => r.fitness_days_left <= 10 && r.fitness_days_left > 0).length > 0 ? (
              <div className="space-y-2">
                {records
                  .filter(r => r.fitness_days_left <= 10 && r.fitness_days_left > 0)
                  .sort((a, b) => a.fitness_days_left - b.fitness_days_left)
                  .slice(0, 3)
                  .map(train => (
                    <div key={train.train_id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span className="font-medium">{train.train_id}</span>
                      <span className="text-sm text-yellow-600">{train.fitness_days_left} days left</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-600">No upcoming maintenance scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenancePage;