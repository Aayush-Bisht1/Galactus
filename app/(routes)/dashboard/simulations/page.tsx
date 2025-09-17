"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PlayCircle, RotateCcw, RefreshCw, TrendingUp, AlertTriangle, Settings, CheckCircle2 } from "lucide-react";

// Table components defined inline
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

// Input component
const Input = ({ type = "text", placeholder, value, onChange, className = "", step }: {
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  step?: string | number;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    step={step}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
  />
);

// Select component
const Select = ({ value, onChange, children, className = "" }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
  >
    {children}
  </select>
);

export type TrainData = {
  train_id: string;
  eligible: boolean;
  priority_score: number;
  status: string;
  fitness_days_left: number;
  reasons: string[];
  recommendations: string[];
  cleaning: {
    last_clean_end: string;
    clean_age_hours: number;
    today_clean_load: number;
  };
  maintenance: {
    open_work_orders: number;
    open_work_order_hours: number;
    _id: string;
  };
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

export type SimulationResult = {
  scenario: string;
  ready: number;
  standby: number;
  maintenance: number;
  totalAvailable: number;
  efficiency: number;
  recommendations: string[];
  impacts: {
    cleaning: number;
    maintenance: number;
    allocation: number;
  };
};

export type SimulationParameters = {
  scenario: string;
  demandIncrease: number;
  maintenanceReduction: number;
  cleaningEfficiency: number;
  emergencyReserve: number;
  peakHoursMultiplier: number;
};

const SimulationPage = () => {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);

  const [parameters, setParameters] = useState<SimulationParameters>({
    scenario: "current",
    demandIncrease: 0,
    maintenanceReduction: 0,
    cleaningEfficiency: 0,
    emergencyReserve: 10,
    peakHoursMultiplier: 1.2,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard");
        const payload = await res.json();
        setAllocationData(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const runSimulation = async () => {
    if (!allocationData) return;

    setSimulating(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const baseData = allocationData.data;
    const currentReady = baseData.filter(t => t.status === "Ready").length;
    const currentMaintenance = baseData.filter(t => t.status === "Maintenance").length;
    const currentStandby = baseData.length - currentReady - currentMaintenance;

    const scenarios: SimulationResult[] = [];

    // Current State Scenario
    scenarios.push({
      scenario: "Current State",
      ready: currentReady,
      standby: currentStandby,
      maintenance: currentMaintenance,
      totalAvailable: currentReady + currentStandby,
      efficiency: ((currentReady + currentStandby) / baseData.length) * 100,
      recommendations: ["Maintain current operations", "Monitor maintenance schedules"],
      impacts: { cleaning: 0, maintenance: 0, allocation: 0 }
    });

    // Peak Hours Scenario
    const peakDemand = Math.floor(currentReady * parameters.peakHoursMultiplier);
    const peakShortfall = Math.max(0, peakDemand - currentReady);
    const peakAvailableFromStandby = Math.min(peakShortfall, currentStandby);

    scenarios.push({
      scenario: "Peak Hours Demand",
      ready: currentReady + peakAvailableFromStandby,
      standby: currentStandby - peakAvailableFromStandby,
      maintenance: currentMaintenance,
      totalAvailable: currentReady + currentStandby,
      efficiency: ((currentReady + peakAvailableFromStandby) / peakDemand) * 100,
      recommendations: peakShortfall > peakAvailableFromStandby ?
        ["Consider reducing maintenance window during peak hours", "Optimize cleaning schedules"] :
        ["Current capacity adequate for peak demand"],
      impacts: { cleaning: 10, maintenance: -5, allocation: 15 }
    });

    // Improved Maintenance Scenario
    const maintenanceImprovement = Math.floor(currentMaintenance * (parameters.maintenanceReduction / 100));
    const improvedMaintenance = currentMaintenance - maintenanceImprovement;
    const improvedReady = currentReady + Math.floor(maintenanceImprovement * 0.7);
    const improvedStandby = currentStandby + Math.floor(maintenanceImprovement * 0.3);

    scenarios.push({
      scenario: `${parameters.maintenanceReduction}% Maintenance Reduction`,
      ready: improvedReady,
      standby: improvedStandby,
      maintenance: improvedMaintenance,
      totalAvailable: improvedReady + improvedStandby,
      efficiency: ((improvedReady + improvedStandby) / baseData.length) * 100,
      recommendations: [
        "Implement predictive maintenance",
        "Optimize maintenance scheduling",
        "Improve spare parts inventory"
      ],
      impacts: { cleaning: 5, maintenance: -parameters.maintenanceReduction, allocation: 10 }
    });

    // Enhanced Cleaning Efficiency Scenario
    const cleaningImprovement = Math.floor(baseData.length * (parameters.cleaningEfficiency / 100));
    const cleaningReady = Math.min(baseData.length, currentReady + Math.floor(cleaningImprovement * 0.5));
    const cleaningStandby = Math.min(baseData.length - cleaningReady - currentMaintenance,
      currentStandby + Math.floor(cleaningImprovement * 0.5));

    scenarios.push({
      scenario: `${parameters.cleaningEfficiency}% Cleaning Efficiency`,
      ready: cleaningReady,
      standby: cleaningStandby,
      maintenance: currentMaintenance,
      totalAvailable: cleaningReady + cleaningStandby,
      efficiency: ((cleaningReady + cleaningStandby) / baseData.length) * 100,
      recommendations: [
        "Implement parallel cleaning processes",
        "Optimize cleaning team scheduling",
        "Use advanced cleaning technologies"
      ],
      impacts: { cleaning: parameters.cleaningEfficiency, maintenance: 0, allocation: 8 }
    });

    // Emergency Scenario
    const emergencyTrainsDown = Math.floor(baseData.length * 0.15); // 15% emergency outage
    const emergencyReady = Math.max(0, currentReady - emergencyTrainsDown);
    const emergencyMaintenance = currentMaintenance + emergencyTrainsDown;

    scenarios.push({
      scenario: "Emergency Response (15% Outage)",
      ready: emergencyReady,
      standby: currentStandby,
      maintenance: emergencyMaintenance,
      totalAvailable: emergencyReady + currentStandby,
      efficiency: ((emergencyReady + currentStandby) / baseData.length) * 100,
      recommendations: [
        "Activate emergency response protocol",
        "Deploy all standby trains",
        "Prioritize critical maintenance only"
      ],
      impacts: { cleaning: -20, maintenance: 50, allocation: -30 }
    });

    // Optimized Scenario (combining improvements)
    const optimizedMaintenanceReduction = Math.floor(currentMaintenance * 0.2);
    const optimizedFromCleaning = Math.floor(baseData.length * 0.1);
    const optimizedReady = Math.min(baseData.length * 0.8,
      currentReady + optimizedMaintenanceReduction + optimizedFromCleaning);
    const optimizedMaintenance = Math.max(2, currentMaintenance - optimizedMaintenanceReduction);
    const optimizedStandby = baseData.length - optimizedReady - optimizedMaintenance;

    scenarios.push({
      scenario: "Fully Optimized Operations",
      ready: optimizedReady,
      standby: optimizedStandby,
      maintenance: optimizedMaintenance,
      totalAvailable: optimizedReady + optimizedStandby,
      efficiency: ((optimizedReady + optimizedStandby) / baseData.length) * 100,
      recommendations: [
        "Implement all optimization strategies",
        "Continuous monitoring and adjustment",
        "Regular performance reviews"
      ],
      impacts: { cleaning: 15, maintenance: -20, allocation: 25 }
    });

    setResults(scenarios);
    setSimulating(false);
  };

  const resetSimulation = () => {
    setResults([]);
    setParameters({
      scenario: "current",
      demandIncrease: 0,
      maintenanceReduction: 0,
      cleaningEfficiency: 0,
      emergencyReserve: 10,
      peakHoursMultiplier: 1.2,
    });
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return "text-green-600";
    if (impact < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
            <p className="text-lg">Loading simulation data...</p>
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
        <BarChart3 className="text-teal-600" /> Simulation & What-If Analysis
      </h2>

      {/* Current State Overview */}
      {allocationData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 /> Ready Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allocationData.statusSummary.Ready}</p>
              <p className="text-sm text-gray-600">Currently operational</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Settings /> Standby Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allocationData.statusSummary.Standby}</p>
              <p className="text-sm text-gray-600">Available for deployment</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle /> Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allocationData.statusSummary.Maintenance}</p>
              <p className="text-sm text-gray-600">Under maintenance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simulation Parameters */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
          <p className="text-sm text-gray-600">Adjust parameters to simulate different scenarios</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Demand Increase (%)</label>
              <Input
                type="number"
                value={parameters.demandIncrease}
                onChange={(e) => setParameters({ ...parameters, demandIncrease: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Maintenance Reduction (%)</label>
              <Input
                type="number"
                value={parameters.maintenanceReduction}
                onChange={(e) => setParameters({ ...parameters, maintenanceReduction: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cleaning Efficiency Gain (%)</label>
              <Input
                type="number"
                value={parameters.cleaningEfficiency}
                onChange={(e) => setParameters({ ...parameters, cleaningEfficiency: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emergency Reserve (%)</label>
              <Input
                type="number"
                value={parameters.emergencyReserve}
                onChange={(e) => setParameters({ ...parameters, emergencyReserve: Number(e.target.value) })}
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Peak Hours Multiplier</label>
              <Input
                type="number"
                step="0.1"
                value={parameters.peakHoursMultiplier}
                onChange={(e) => setParameters({ ...parameters, peakHoursMultiplier: Number(e.target.value) })}
                placeholder="1.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scenario Type</label>
              <Select
                value={parameters.scenario}
                onChange={(e) => setParameters({ ...parameters, scenario: e.target.value })}
              >
                <option value="current">Current State</option>
                <option value="optimistic">Optimistic</option>
                <option value="conservative">Conservative</option>
                <option value="emergency">Emergency</option>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              onClick={runSimulation}
              disabled={simulating}
              className="bg-teal-600 text-white px-6 hover:bg-teal-700 flex items-center gap-2"
            >
              {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              {simulating ? "Running Simulation..." : "Run Simulation"}
            </Button>

            <Button
              onClick={resetSimulation}
              variant="outline"
              className="px-6 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {results.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-teal-600" />
              Simulation Results
            </CardTitle>
            <p className="text-sm text-gray-600">Comparative analysis of different scenarios</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Standby</TableHead>
                  <TableHead>Maintenance</TableHead>
                  <TableHead>Total Available</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{result.scenario}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {result.ready}
                        {i > 0 && (
                          <span className={`text-xs ${result.ready > results[0].ready ? 'text-green-600' : result.ready < results[0].ready ? 'text-red-600' : 'text-gray-600'}`}>
                            ({result.ready > results[0].ready ? '+' : ''}{result.ready - results[0].ready})
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {result.standby}
                        {i > 0 && (
                          <span className={`text-xs ${result.standby > results[0].standby ? 'text-green-600' : result.standby < results[0].standby ? 'text-red-600' : 'text-gray-600'}`}>
                            ({result.standby > results[0].standby ? '+' : ''}{result.standby - results[0].standby})
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {result.maintenance}
                        {i > 0 && (
                          <span className={`text-xs ${result.maintenance < results[0].maintenance ? 'text-green-600' : result.maintenance > results[0].maintenance ? 'text-red-600' : 'text-gray-600'}`}>
                            ({result.maintenance > results[0].maintenance ? '+' : ''}{result.maintenance - results[0].maintenance})
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{result.totalAvailable}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getEfficiencyColor(result.efficiency)}`}>
                        {result.efficiency.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className={getImpactColor(result.impacts.cleaning)}>
                          C: {result.impacts.cleaning > 0 ? '+' : ''}{result.impacts.cleaning}%
                        </div>
                        <div className={getImpactColor(result.impacts.maintenance)}>
                          M: {result.impacts.maintenance > 0 ? '+' : ''}{result.impacts.maintenance}%
                        </div>
                        <div className={getImpactColor(result.impacts.allocation)}>
                          A: {result.impacts.allocation > 0 ? '+' : ''}{result.impacts.allocation}%
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Key Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.slice(1).map((result, i) => (
                  <div key={i} className="border-l-4 border-teal-500 pl-4">
                    <h4 className="font-medium text-sm">{result.scenario}</h4>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {result.recommendations.slice(0, 2).map((rec, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.length > 1 && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">Best Efficiency</span>
                      <span className="text-green-600 font-bold">
                        {Math.max(...results.map(r => r.efficiency)).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Max Available Trains</span>
                      <span className="text-blue-600 font-bold">
                        {Math.max(...results.map(r => r.totalAvailable))}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span className="text-sm font-medium">Optimal Scenario</span>
                      <span className="text-yellow-600 font-bold text-sm">
                        {results.reduce((best, current) =>
                          current.efficiency > best.efficiency ? current : best
                        ).scenario}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;