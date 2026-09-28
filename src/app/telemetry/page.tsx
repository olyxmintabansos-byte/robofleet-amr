'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radar,
  Radio,
  Gauge,
  Compass,
  Activity,
  Bot,
  Zap,
  Layers,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { useRobotics } from '@/context/RoboticsContext';

export default function LidarTelemetryPage() {
  const { robots, selectedRobotId, setSelectedRobotId } = useRobotics();
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const activeRobot = robots.find((r) => r.id === selectedRobotId) || robots[0];

  // Rotating LiDAR beam animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 6) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2e8f0] pb-24 font-mono scada-grid-lines">
      {/* Header */}
      <section className="bg-[#0b0e14] border-b-2 border-yellow-500/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-black">
              <Radar className="w-4 h-4 animate-spin-slow text-yellow-400" />
              <span>360° SOLID-STATE LIDAR SLAM // HOKUYO UST-20LX SENSOR FUSION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              POINT CLOUD <span className="text-yellow-400">KINEMATICS</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">UNIT:</span>
            {robots.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRobotId(r.id)}
                className={`px-3 py-1.5 border font-black transition-all ${
                  r.id === selectedRobotId
                    ? 'bg-yellow-400 text-black border-yellow-300'
                    : 'bg-[#10141f] text-zinc-400 border-zinc-800'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 360° LiDAR Scope Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="scada-panel p-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Radar className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-black text-white uppercase">20M DETECTION RADIUS SCOPE</span>
                </div>
                <span className="text-xs text-yellow-400 font-bold">SCAN FREQ: 40 HZ (1080 PTS/SCAN)</span>
              </div>

              {/* Circular LiDAR Scope Display */}
              <div className="relative w-full aspect-square max-h-[440px] mx-auto bg-[#040507] border-2 border-zinc-800 flex items-center justify-center overflow-hidden">
                {/* Concentric Distance Rings */}
                <div className="absolute inset-0 rounded-full border border-yellow-500/10" />
                <div className="absolute inset-[20%] rounded-full border border-yellow-500/20" />
                <div className="absolute inset-[40%] rounded-full border border-yellow-500/30" />
                <div className="absolute inset-[60%] rounded-full border border-yellow-500/40" />
                <div className="absolute inset-[80%] rounded-full border border-yellow-500/50" />

                {/* Scope Crosshairs */}
                <div className="absolute w-full h-[1px] bg-yellow-500/20" />
                <div className="absolute h-full w-[1px] bg-yellow-500/20" />

                {/* Rotating Beam */}
                <div
                  className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-yellow-300 origin-left"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${sweepAngle}deg)`,
                    boxShadow: '0 0 10px #facc15',
                  }}
                />

                {/* Simulated Point Cloud Clusters (Obstacles) */}
                <div className="absolute top-[28%] left-[62%] w-4 h-4 bg-red-500 rounded-sm animate-ping opacity-75" />
                <div className="absolute top-[28%] left-[62%] w-3 h-3 bg-red-400 border border-white flex items-center justify-center text-[8px] text-black font-black">
                  !
                </div>

                <div className="absolute top-[68%] left-[34%] w-6 h-6 border-2 border-yellow-400/80 bg-yellow-400/20 flex items-center justify-center text-[7px] text-yellow-300">
                  PALLET
                </div>

                {/* Robot Center Chassis Icon */}
                <div className="w-8 h-8 bg-black border-2 border-yellow-400 flex items-center justify-center z-10 text-[9px] font-black text-yellow-400 shadow-md">
                  {activeRobot.id.replace('AMR-', '')}
                </div>
              </div>

              {/* Scope Bottom Data Readout */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800 text-center text-xs">
                <div className="bg-[#050608] p-2 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">NEAREST INTRUDER</div>
                  <div className="font-black text-yellow-400">{activeRobot.lidarObstacleDistanceMeters} M</div>
                </div>
                <div className="bg-[#050608] p-2 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">ANGULAR VELOCITY</div>
                  <div className="font-black text-white">0.34 RAD/S</div>
                </div>
                <div className="bg-[#050608] p-2 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">IMU YAW ANGLE</div>
                  <div className="font-black text-cyan-400">142.8° TRUE</div>
                </div>
                <div className="bg-[#050608] p-2 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">SAFETY LASER FIELD</div>
                  <div className="font-black text-emerald-400">CLEAR (SIL-3)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kinematics & Motor Encoders (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="scada-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3">
                <span className="text-xs font-black text-white uppercase">DUAL BLDC MOTOR ODOMETRY</span>
                <span className="text-[10px] text-yellow-400 font-bold">ENCODER TICK SYNC</span>
              </div>

              {/* Wheel Encoder Telemetry */}
              <div className="space-y-3 text-xs">
                <div className="bg-[#050608] p-3 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">LEFT TRACTION WHEEL:</span>
                    <strong className="text-yellow-400 font-mono">148 RPM // 89,421 TICKS</strong>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5">
                    <div className="bg-yellow-400 h-full w-[78%]" />
                  </div>
                </div>

                <div className="bg-[#050608] p-3 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">RIGHT TRACTION WHEEL:</span>
                    <strong className="text-yellow-400 font-mono">148 RPM // 89,418 TICKS</strong>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5">
                    <div className="bg-yellow-400 h-full w-[78%]" />
                  </div>
                </div>
              </div>

              {/* Safety Braking Distance Calculator */}
              <div className="bg-[#0e111a] border border-zinc-800 p-4 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>DYNAMIC STOPPING DISTANCE:</span>
                  <strong className="text-emerald-400 font-black">0.82 METERS</strong>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Calculated based on current payload of {activeRobot.currentPayloadKG} KG at {activeRobot.currentVelocityMPS} M/S friction coefficient µ=0.75.
                </p>
              </div>

              {/* Chassis Architecture Overview */}
              <div className="bg-[#050608] border border-zinc-800 p-3 text-[11px] space-y-1 text-zinc-400">
                <div className="text-yellow-400 font-bold uppercase mb-1">SPECIFICATIONS ({activeRobot.id}):</div>
                <div>• Suspension: Spring-Loaded Independent Drive Units</div>
                <div>• Navigation: LiDAR Natural Feature SLAM + Floor QR Matrix</div>
                <div>• Wireless: Dual Band 802.11ax Roaming (Handshake &lt;10ms)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
