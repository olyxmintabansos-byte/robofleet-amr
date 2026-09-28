'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Battery,
  Gauge,
  Thermometer,
  Radio,
  Layers,
  Zap,
  Activity,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  MoveUpRight
} from 'lucide-react';
import { useRobotics } from '@/context/RoboticsContext';

export default function ScadaFacilityPage() {
  const { robots, selectedRobotId, setSelectedRobotId, masterEstopActive } = useRobotics();
  const activeRobot = robots.find((r) => r.id === selectedRobotId) || robots[0];

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2e8f0] pb-24 font-mono scada-grid-lines">
      {/* Brutalist Warning Strip & Title */}
      <section className="bg-[#0b0e14] border-b-2 border-yellow-500/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-yellow-400 text-black font-black text-xs uppercase mb-3">
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>FACILITY SCADA // AUTOMATED MOBILE ROBOT WAREHOUSE FLEET</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              AMR FLEET <span className="text-yellow-400">DISPATCH CONSOLE</span>
            </h1>
            <p className="mt-2 text-zinc-400 max-w-2xl text-xs sm:text-sm">
              Live Modbus-TCP and ROS2 teleoperation interface. Monitoring 4 industrial mobile robots across 12,000 m² high-bay automated distribution center.
            </p>
          </div>

          {/* Quick Metrics Panel */}
          <div className="grid grid-cols-3 gap-2 bg-[#10141f] border-2 border-zinc-800 p-3 text-center">
            <div className="p-2 border-r border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">ACTIVE UNITS</div>
              <div className="text-xl font-black text-yellow-400">4 / 4 ON-GRID</div>
            </div>
            <div className="p-2 border-r border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase">AVG PAYLOAD</div>
              <div className="text-xl font-black text-white">502.5 KG</div>
            </div>
            <div className="p-2">
              <div className="text-[10px] text-zinc-500 uppercase">E-STOP STATUS</div>
              <div className={`text-xl font-black ${masterEstopActive ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                {masterEstopActive ? 'TRIPPED' : 'CLEAR'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main SCADA Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2D Facility Floor Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="scada-panel p-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-black text-white uppercase">2D WAREHOUSE SLAM FACILITY GRID</span>
                </div>
                <span className="text-[10px] text-zinc-500">GRID RES: 100 x 100 CELLS (0.5M/CELL)</span>
              </div>

              {/* 2D Floor Plan Simulation Canvas */}
              <div className="relative w-full aspect-video bg-[#040507] border-2 border-zinc-800 p-4 overflow-hidden flex flex-col justify-between">
                {/* Aisles Layout Markings */}
                <div className="grid grid-cols-6 gap-2 h-full opacity-40">
                  {['AISLE 01', 'AISLE 02', 'AISLE 03', 'AISLE 04', 'AISLE 05', 'AISLE 06'].map((aisle, i) => (
                    <div key={i} className="border-r border-dashed border-zinc-700 p-1 flex flex-col justify-between">
                      <span className="text-[9px] text-zinc-500">{aisle}</span>
                      <div className="h-16 w-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-600">
                        RACK
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dock Doors Bottom Zone */}
                <div className="border-t border-yellow-500/30 pt-1 flex justify-around text-[9px] text-yellow-400/70">
                  <span>DOCK-01 (INBOUND)</span>
                  <span>DOCK-02 (INBOUND)</span>
                  <span>DOCK-03 (OUTBOUND)</span>
                  <span>DOCK-04 (OUTBOUND)</span>
                </div>

                {/* Live AMR Robot Markers */}
                {robots.map((robot) => {
                  const isSelected = robot.id === selectedRobotId;
                  return (
                    <div
                      key={robot.id}
                      onClick={() => setSelectedRobotId(robot.id)}
                      className="absolute cursor-pointer transition-all duration-300"
                      style={{
                        left: `${robot.gridCoordinates.x}%`,
                        top: `${robot.gridCoordinates.y}%`,
                      }}
                    >
                      <div className="relative flex flex-col items-center group">
                        <div
                          className={`w-6 h-6 border-2 flex items-center justify-center text-[10px] font-black ${
                            isSelected
                              ? 'bg-yellow-400 text-black border-white shadow-[0_0_12px_#facc15]'
                              : 'bg-black text-yellow-400 border-yellow-400'
                          }`}
                        >
                          {robot.id.replace('AMR-', '')}
                        </div>
                        <span className="text-[8px] px-1 bg-black/90 border border-zinc-700 text-zinc-300 mt-1 whitespace-nowrap">
                          {robot.id}: {robot.batteryPercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floor Controls */}
              <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>SELECT UNIT TO ENGAGE SENSOR FUSION & ACTUATOR HUD</span>
                <Link
                  href="/telemetry/"
                  className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs hover:bg-yellow-300 flex items-center gap-1"
                >
                  <span>360° LIDAR SLAM</span>
                  <MoveUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Unit Actuator & Kinematics Diagnostics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="scada-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-black text-white">{activeRobot.name}</span>
                </div>
                <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 text-[10px] font-bold">
                  {activeRobot.status}
                </span>
              </div>

              {/* Primary Gauge Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0e111a] border border-zinc-800 p-3">
                  <div className="text-[10px] text-zinc-500">LITHIUM BATTERY</div>
                  <div className="text-2xl font-black text-yellow-400 mt-1">
                    {activeRobot.batteryPercentage}%
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 mt-2">
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: `${activeRobot.batteryPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#0e111a] border border-zinc-800 p-3">
                  <div className="text-[10px] text-zinc-500">PAYLOAD LOAD</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {activeRobot.currentPayloadKG} <span className="text-xs text-zinc-400">/ {activeRobot.maxPayloadKG} KG</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 mt-2">
                    <div
                      className="bg-emerald-400 h-full"
                      style={{ width: `${(activeRobot.currentPayloadKG / activeRobot.maxPayloadKG) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#0e111a] border border-zinc-800 p-3">
                  <div className="text-[10px] text-zinc-500">LINEAR VELOCITY</div>
                  <div className="text-xl font-black text-cyan-400 mt-1">
                    {activeRobot.currentVelocityMPS} M/S
                  </div>
                  <div className="text-[9px] text-zinc-500">MAX: {activeRobot.maxVelocityMPS} M/S</div>
                </div>

                <div className="bg-[#0e111a] border border-zinc-800 p-3">
                  <div className="text-[10px] text-zinc-500">BRUSHLESS MOTOR TEMP</div>
                  <div className="text-xl font-black text-amber-400 mt-1">
                    {activeRobot.motorTempC}°C
                  </div>
                  <div className="text-[9px] text-zinc-500">THERMAL THRESHOLD: 65°C</div>
                </div>
              </div>

              {/* Mission Attachment Tag */}
              <div className="bg-[#050608] border border-zinc-800 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ACTIVE MISSION ID:</span>
                  <strong className="text-yellow-400">{activeRobot.activeMissionId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">LIDAR MIN RANGE:</span>
                  <strong className="text-white">{activeRobot.lidarObstacleDistanceMeters} METERS</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">CHASSIS KINEMATICS:</span>
                  <span className="text-zinc-300 font-bold">{activeRobot.chassisType}</span>
                </div>
              </div>

              {/* Robot Switcher Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {robots.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRobotId(r.id)}
                    className={`p-2 border text-xs font-black transition-all ${
                      r.id === selectedRobotId
                        ? 'bg-yellow-400 text-black border-yellow-300'
                        : 'bg-[#0f121a] text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {r.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
