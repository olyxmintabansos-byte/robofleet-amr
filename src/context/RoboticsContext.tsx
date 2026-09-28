'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RobotUnit,
  MissionTask,
  SafetyZone,
  RoboticsContextType
} from '@/types/robotics';

const SEED_ROBOTS: RobotUnit[] = [
  {
    id: 'AMR-01',
    name: 'KIVA-VULCAN 1000',
    chassisType: 'DIFFERENTIAL_DRIVE',
    batteryPercentage: 88,
    currentPayloadKG: 640,
    maxPayloadKG: 1000,
    currentVelocityMPS: 1.45,
    maxVelocityMPS: 2.0,
    gridCoordinates: { x: 14, y: 38 },
    status: 'AUTONOMOUS_NAVIGATION',
    activeMissionId: 'MSN-8821',
    lidarObstacleDistanceMeters: 4.8,
    motorTempC: 44.2,
  },
  {
    id: 'AMR-02',
    name: 'OTTO-HEAVY 1500',
    chassisType: 'OMNIDIRECTIONAL_MECANUM',
    batteryPercentage: 94,
    currentPayloadKG: 1250,
    maxPayloadKG: 1500,
    currentVelocityMPS: 1.10,
    maxVelocityMPS: 1.8,
    gridCoordinates: { x: 42, y: 76 },
    status: 'PALLET_DOCKING',
    activeMissionId: 'MSN-8822',
    lidarObstacleDistanceMeters: 1.2,
    motorTempC: 48.6,
  },
  {
    id: 'AMR-03',
    name: 'MIR-AGILE 250',
    chassisType: 'DIFFERENTIAL_DRIVE',
    batteryPercentage: 42,
    currentPayloadKG: 120,
    maxPayloadKG: 250,
    currentVelocityMPS: 1.85,
    maxVelocityMPS: 2.2,
    gridCoordinates: { x: 88, y: 22 },
    status: 'AUTONOMOUS_NAVIGATION',
    activeMissionId: 'MSN-8823',
    lidarObstacleDistanceMeters: 6.5,
    motorTempC: 39.1,
  },
  {
    id: 'AMR-04',
    name: 'TUGGER-TITAN 3000',
    chassisType: 'HEAVY_TUGGER',
    batteryPercentage: 24,
    currentPayloadKG: 0,
    maxPayloadKG: 3000,
    currentVelocityMPS: 0.0,
    maxVelocityMPS: 1.5,
    gridCoordinates: { x: 5, y: 5 },
    status: 'CHARGING_AT_STATION',
    activeMissionId: 'IDLE_STATION',
    lidarObstacleDistanceMeters: 99.0,
    motorTempC: 31.0,
  },
];

const SEED_MISSIONS: MissionTask[] = [
  {
    id: 'MSN-8821',
    sourceNode: 'Aisle-04 / Rack-B2',
    destinationNode: 'Outbound Conveyor Dock-03',
    assignedRobotId: 'AMR-01',
    skuCode: 'SKU-TURBO-7712',
    palletWeightKG: 640,
    priorityLevel: 'CRITICAL_RUSH',
    completionPercent: 68,
    status: 'IN_TRANSIT',
  },
  {
    id: 'MSN-8822',
    sourceNode: 'Staging Pallet Area North',
    destinationNode: 'High-Bay Automated Aisle-12',
    assignedRobotId: 'AMR-02',
    skuCode: 'SKU-STEEL-4409',
    palletWeightKG: 1250,
    priorityLevel: 'STANDARD_FIFO',
    completionPercent: 24,
    status: 'IN_TRANSIT',
  },
  {
    id: 'MSN-8823',
    sourceNode: 'Cleanroom Airlock E',
    destinationNode: 'Packaging Station 08',
    assignedRobotId: 'AMR-03',
    skuCode: 'SKU-MICRO-9921',
    palletWeightKG: 120,
    priorityLevel: 'STANDARD_FIFO',
    completionPercent: 85,
    status: 'IN_TRANSIT',
  },
];

const SEED_SAFETY_ZONES: SafetyZone[] = [
  {
    zoneId: 'ZONE-A1',
    name: 'High-Speed Main Highway Corridor',
    laserScannerStatus: 'ZONE_CLEAR',
    silLevel: 'SIL-3',
    lastInterlockTest: '28 Sep 2026 06:00 UTC (PASS)',
  },
  {
    zoneId: 'ZONE-B2',
    name: 'Human-Robot Collaboration Loading Dock',
    laserScannerStatus: 'WARNING_FIELD_INTRUDER',
    silLevel: 'SIL-3',
    lastInterlockTest: '28 Sep 2026 06:00 UTC (PASS)',
  },
  {
    zoneId: 'ZONE-C3',
    name: 'Automated Battery Charging Bay',
    laserScannerStatus: 'ZONE_CLEAR',
    silLevel: 'SIL-3',
    lastInterlockTest: '28 Sep 2026 06:00 UTC (PASS)',
  },
];

const LOCAL_STORAGE_KEY = 'robofleet_amr_state_v1';

const RoboticsContext = createContext<RoboticsContextType | undefined>(undefined);

export function RoboticsProvider({ children }: { children: React.ReactNode }) {
  const [robots, setRobots] = useState<RobotUnit[]>(SEED_ROBOTS);
  const [missions, setMissions] = useState<MissionTask[]>(SEED_MISSIONS);
  const [safetyZones] = useState<SafetyZone[]>(SEED_SAFETY_ZONES);
  const [masterEstopActive, setMasterEstopActive] = useState<boolean>(false);
  const [selectedRobotId, setSelectedRobotId] = useState<string>('AMR-01');

  // Load persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.masterEstopActive !== undefined) setMasterEstopActive(parsed.masterEstopActive);
      }
    } catch {}
  }, []);

  // Save persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ missions, masterEstopActive }));
    } catch {}
  }, [missions, masterEstopActive]);

  const toggleMasterEstop = () => {
    setMasterEstopActive((prev) => {
      const next = !prev;
      setRobots((rList) =>
        rList.map((r) => ({
          ...r,
          status: next ? 'SAFETY_ESTOP_TRIPPED' : 'AUTONOMOUS_NAVIGATION',
          currentVelocityMPS: next ? 0 : 1.45,
        }))
      );
      return next;
    });
  };

  const dispatchMission = (source: string, destination: string, sku: string, weight: number) => {
    const newMission: MissionTask = {
      id: `MSN-${Math.floor(1000 + Math.random() * 9000)}`,
      sourceNode: source || 'Aisle-01 / Buffer',
      destinationNode: destination || 'Dock-01 Outbound',
      assignedRobotId: 'AMR-01',
      skuCode: sku || 'SKU-CUSTOM-8800',
      palletWeightKG: weight || 450,
      priorityLevel: 'STANDARD_FIFO',
      completionPercent: 5,
      status: 'IN_TRANSIT',
    };
    setMissions((prev) => [newMission, ...prev]);
  };

  return (
    <RoboticsContext.Provider
      value={{
        robots,
        missions,
        safetyZones,
        masterEstopActive,
        toggleMasterEstop,
        dispatchMission,
        selectedRobotId,
        setSelectedRobotId,
      }}
    >
      {children}
    </RoboticsContext.Provider>
  );
}

export function useRobotics() {
  const context = useContext(RoboticsContext);
  if (!context) throw new Error('useRobotics must be used within RoboticsProvider');
  return context;
}
