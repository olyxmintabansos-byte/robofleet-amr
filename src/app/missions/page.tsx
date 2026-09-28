'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListOrdered,
  Bot,
  Layers,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  Plus,
  AlertTriangle,
  MoveUpRight
} from 'lucide-react';
import { useRobotics } from '@/context/RoboticsContext';

export default function MissionsQueuePage() {
  const { missions, dispatchMission, robots } = useRobotics();

  // Form State
  const [sourceNode, setSourceNode] = useState<string>('Aisle-02 / Bay-C1');
  const [destNode, setDestNode] = useState<string>('Outbound Dock-04 Conveyor');
  const [skuCode, setSkuCode] = useState<string>('SKU-AUTOMOTIVE-902');
  const [palletWeight, setPalletWeight] = useState<number>(750);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchMission(sourceNode, destNode, skuCode, palletWeight);
    setDispatchedSuccess(`MISSION DISPATCHED // AUTONOMOUS TASK COMMITTED TO ROS2 QUEUE`);
    setTimeout(() => setDispatchedSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2e8f0] pb-24 font-mono scada-grid-lines">
      {/* Header */}
      <section className="bg-[#0b0e14] border-b-2 border-yellow-500/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-black">
              <ListOrdered className="w-4 h-4 text-yellow-400" />
              <span>WMS / ERP INTEGRATED PALLET TRANSPORT DISPATCH QUEUE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              AUTONOMOUS MISSION <span className="text-yellow-400">EXPEDITER</span>
            </h1>
          </div>

          <div className="text-xs text-zinc-400 bg-[#10141f] border border-zinc-800 p-2.5">
            ACTIVE JOBS IN QUEUE: <strong className="text-yellow-400 font-black">{missions.length} TASKS</strong>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Missions Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="scada-panel p-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3 mb-4">
                <span className="text-xs font-black text-white uppercase">IN-FLIGHT AMR MISSION REGISTRY</span>
                <span className="text-[10px] text-zinc-500">SORT BY FIFO PRIORITY</span>
              </div>

              <div className="space-y-4">
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-[#050608] border-2 border-zinc-800 hover:border-yellow-400/60 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black">
                          {m.id}
                        </span>
                        <span className="text-xs text-white font-bold">{m.skuCode}</span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 font-black border ${
                          m.priorityLevel === 'CRITICAL_RUSH'
                            ? 'bg-red-500/20 text-red-400 border-red-500'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {m.priorityLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                      <div>
                        <span className="text-zinc-500 text-[10px]">SOURCE:</span>
                        <div className="font-bold text-white truncate">{m.sourceNode}</div>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px]">DESTINATION:</span>
                        <div className="font-bold text-yellow-300 truncate">{m.destinationNode}</div>
                      </div>
                    </div>

                    {/* Progress Bar & Assigned Robot */}
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">ASSIGNED: <strong className="text-white">{m.assignedRobotId}</strong> ({m.palletWeightKG} KG)</span>
                      <span className="text-yellow-400 font-bold">{m.completionPercent}% DELIVERED</span>
                    </div>

                    <div className="w-full bg-zinc-800 h-2">
                      <div
                        className="bg-yellow-400 h-full transition-all"
                        style={{ width: `${m.completionPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Mission Dispatch Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="scada-panel p-6">
              <h3 className="text-sm font-black text-white uppercase border-b-2 border-yellow-500/20 pb-3 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-yellow-400" />
                <span>DISPATCH MANUAL TRANSPORT ORDER</span>
              </h3>

              {dispatchedSuccess && (
                <div className="p-3 bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs mb-4">
                  {dispatchedSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Source Node / Pickup Rack</label>
                  <input
                    type="text"
                    value={sourceNode}
                    onChange={(e) => setSourceNode(e.target.value)}
                    required
                    className="w-full bg-[#050608] border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Destination Node / Dropoff Conveyor</label>
                  <input
                    type="text"
                    value={destNode}
                    onChange={(e) => setDestNode(e.target.value)}
                    required
                    className="w-full bg-[#050608] border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Pallet SKU Identifier</label>
                    <input
                      type="text"
                      value={skuCode}
                      onChange={(e) => setSkuCode(e.target.value)}
                      required
                      className="w-full bg-[#050608] border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Payload Weight (KG)</label>
                    <input
                      type="number"
                      min={50}
                      max={2500}
                      value={palletWeight}
                      onChange={(e) => setPalletWeight(parseInt(e.target.value) || 100)}
                      required
                      className="w-full bg-[#050608] border border-zinc-800 p-2.5 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="bg-[#050608] border border-zinc-800 p-3 text-[11px] text-zinc-400 space-y-1">
                  <div className="text-yellow-400 font-bold">AUTOMATED SCHEDULING RULE:</div>
                  <div>• Nearest idle AMR automatically assigned via Dijkstra algorithm</div>
                  <div>• Path planning includes dynamic LiDAR obstacle re-routing</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase shadow-[2px_2px_0px_#ffffff] transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>TRANSMIT DISPATCH TO AMR FLEET</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
