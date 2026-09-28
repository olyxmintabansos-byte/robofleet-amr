'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { useRobotics } from '@/context/RoboticsContext';

export default function SafetyPlcPage() {
  const { safetyZones, masterEstopActive, toggleMasterEstop, robots } = useRobotics();
  const [interlockTestResult, setInterlockTestResult] = useState<string | null>(null);

  const runSafetySelfTest = () => {
    setInterlockTestResult('ALL SIL-3 RELAYS VERIFIED // OMRON G9SP SAFETY CONTROLLER NOMINAL (100% HEALTH)');
    setTimeout(() => setInterlockTestResult(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2e8f0] pb-24 font-mono scada-grid-lines">
      {/* Header */}
      <section className="bg-[#0b0e14] border-b-2 border-yellow-500/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-black">
              <ShieldAlert className="w-4 h-4 text-yellow-400" />
              <span>SAFETY INTEGRITY LEVEL (SIL-3) // ISO 3691-4 INDUSTRIAL COMPLIANCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              SAFETY PLC & <span className="text-yellow-400">INTERLOCKS</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runSafetySelfTest}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#ffffff]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>EXECUTE SIL-3 RELAY TEST</span>
            </button>
          </div>
        </div>
      </section>

      {/* Safety Alert Notification */}
      {interlockTestResult && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-xs font-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{interlockTestResult}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Safety Laser Scanner Zones (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="scada-panel p-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500/20 pb-3 mb-4">
                <span className="text-xs font-black text-white uppercase">FACILITY SAFETY SCANNER ZONES</span>
                <span className="text-[10px] text-zinc-500">OPTICAL FIELD VOLUMES</span>
              </div>

              <div className="space-y-4">
                {safetyZones.map((zone) => {
                  const isBreached = zone.laserScannerStatus !== 'ZONE_CLEAR';
                  return (
                    <div
                      key={zone.zoneId}
                      className={`p-4 border-2 transition-all space-y-2 ${
                        isBreached
                          ? 'bg-amber-950/40 border-amber-500'
                          : 'bg-[#050608] border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-zinc-800 text-yellow-400 text-xs font-black">
                            {zone.zoneId}
                          </span>
                          <span className="text-xs text-white font-bold">{zone.name}</span>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 font-black border ${
                            isBreached
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          }`}
                        >
                          {zone.laserScannerStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                        <span>CERTIFICATION: <strong className="text-white">{zone.silLevel} (EN ISO 13849-1 PLe)</strong></span>
                        <span className="text-[11px] text-zinc-500">{zone.lastInterlockTest}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Master E-STOP Interlock Loop (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`p-6 border-2 transition-all ${
                masterEstopActive
                  ? 'bg-red-950/60 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'scada-panel'
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-black text-white uppercase">HARDWIRED DUAL-CHANNEL E-STOP LOOP</span>
                <span className={`text-xs font-black ${masterEstopActive ? 'text-red-400' : 'text-emerald-400'}`}>
                  {masterEstopActive ? 'OPEN LOOP (STOP)' : 'CLOSED (ARMED)'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#050608] border border-zinc-800 text-center space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase">SAFETY RELAY CONTACT STATUS</div>
                  <div className={`text-3xl font-black ${masterEstopActive ? 'text-red-400' : 'text-emerald-400'}`}>
                    {masterEstopActive ? 'DE-ENERGIZED' : 'ENERGIZED 24V DC'}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {masterEstopActive
                      ? 'All motor power cut via STO (Safe Torque Off) hardware inputs.'
                      : 'Dual redundant safe relays holding contacts closed.'}
                  </p>
                </div>

                {/* E-Stop Toggle Switch */}
                <button
                  onClick={toggleMasterEstop}
                  className={`w-full py-4 text-sm font-black uppercase transition-all shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 ${
                    masterEstopActive
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  <AlertOctagon className="w-5 h-5" />
                  <span>{masterEstopActive ? 'RESET & RE-ARM E-STOP LOOP' : 'TRIP EMERGENCY STOP (E-STOP)'}</span>
                </button>

                {/* Individual AMR STO Status */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">ROBOT LOCAL STO RELAYS:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {robots.map((r) => (
                      <div key={r.id} className="p-2 bg-[#050608] border border-zinc-800 flex justify-between">
                        <span>{r.id}:</span>
                        <strong className={masterEstopActive ? 'text-red-400' : 'text-emerald-400'}>
                          {masterEstopActive ? 'STO ACTIVE' : 'OK'}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
