'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  Bot,
  Radar,
  ListOrdered,
  ShieldAlert,
  AlertOctagon,
  BatteryCharging,
  Radio,
  Zap
} from 'lucide-react';
import { useRobotics } from '@/context/RoboticsContext';

export function Navbar() {
  const pathname = usePathname();
  const { robots, masterEstopActive, toggleMasterEstop } = useRobotics();

  const links = [
    { href: '/', label: 'SCADA FACILITY', sub: '2D FLOOR GRID' },
    { href: '/telemetry/', label: 'LIDAR SLAM', sub: '360° SENSOR FUSION' },
    { href: '/missions/', label: 'DISPATCH QUEUE', sub: 'PALLET LOGISTICS' },
    { href: '/safety/', label: 'SAFETY SIL-3', sub: 'INTERLOCK RELAYS' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090b0f] border-b-2 border-yellow-500/60 font-mono">
      {/* Industrial Hazard Striping Header Ribbon */}
      <div className="hazard-stripes h-2 w-full" />

      {/* Industrial SCADA Top Bar */}
      <div className="bg-[#050608] border-b border-zinc-800 px-4 py-1 text-xs text-zinc-400 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-yellow-400 font-black">
            <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
            <span>SCADA INDUSTRIAL PLC NETWORK // MODBUS-TCP 10.240.10.1</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="hidden sm:inline text-zinc-300">
            FLEET: <strong className="text-white">4 AMR ACTIVE</strong> • 3,250 KG TOTAL CAPACITY • ROS2 HUMBLE
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-emerald-400 font-bold">SAFETY INTERLOCK: NORMAL</span>
          <span className="text-yellow-400 font-black">TITAN #46 // BRUTALIST SCADA</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Raw Angular Mechanical Logo */}
            <div className="w-11 h-11 bg-[#12151e] border-2 border-yellow-400 flex items-center justify-center shadow-[2px_2px_0px_#eab308]">
              <Bot className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                ROBO<span className="text-yellow-400">FLEET</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-400 text-black font-black">
                  AMR-SCADA
                </span>
              </div>
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest">
                AUTONOMOUS MOBILE ROBOTICS OS
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 transition-all flex flex-col items-center border ${
                    active
                      ? 'bg-yellow-400 text-black border-yellow-300 font-black shadow-[2px_2px_0px_#ffffff]'
                      : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-yellow-500/50 hover:bg-[#12151e]'
                  }`}
                >
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className={`text-[9px] ${active ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
                    {item.sub}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Master Industrial E-STOP Button */}
          <button
            onClick={toggleMasterEstop}
            className={`px-4 py-2 border-2 text-xs font-black transition-all flex items-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
              masterEstopActive
                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                : 'bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white border-red-600'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>{masterEstopActive ? 'ESTOP TRIPPED (RESET)' : 'MASTER E-STOP'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
