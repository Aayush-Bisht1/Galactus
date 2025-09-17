"use client";
import React, { useEffect, useState } from "react";

const TopHeader = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
      async function fetchData() {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        setUser(json.username);
      }
      fetchData();
    }, []);
  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between h-16">
      {/* Left section - Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Replace with actual logo if available */}
        <div className="text-teal-700 font-bold text-xl">KMM</div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Kochi Metro Train Allocation
        </h1>
      </div>

      {/* Right section - User info */}
      <div className="text-sm text-gray-600 font-medium">
        Operations Control – <span className="font-semibold">{user.toUpperCase()}</span>
      </div>
    </header>
  );
};

export default TopHeader;
