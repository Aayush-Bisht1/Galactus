import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, FileText, ShieldCheck } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Admin Panel</h2>

      {/* Grid layout for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* User Management */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Users className="w-6 h-6 text-teal-600" />
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add, edit, or remove system users. Assign roles and permissions.
            </p>
            <Button variant="default" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Settings className="w-6 h-6 text-teal-600" />
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure fleet details, schedules, and access control.
            </p>
            <Button variant="default" className="w-full">Open Settings</Button>
          </CardContent>
        </Card>

        {/* Reports & Logs */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center space-x-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <CardTitle>Reports & Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review allocation history and system activity logs.
            </p>
            <Button variant="default" className="w-full">View Reports</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <CardTitle>Security & Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage system security and role-based access control.
            </p>
            <Button variant="default" className="w-full">Manage Access</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button className="bg-teal-600 text-white px-6">Reset Allocations</Button>
        <Button variant="outline" className="px-6">Manage Alerts</Button>
      </div>
    </div>
  );
};

export default AdminPage;