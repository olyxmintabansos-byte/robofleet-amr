export type RobotStatus = 'AUTONOMOUS_NAVIGATION' | 'PALLET_DOCKING' | 'CHARGING_AT_STATION' | 'SAFETY_ESTOP_TRIPPED';

export interface RobotUnit {
  id: string;
  name: string;
  chassisType: 'DIFFERENTIAL_DRIVE' | 'OMNIDIRECTIONAL_MECANUM' | 'HEAVY_TUGGER';
  batteryPercentage: number;
  currentPayloadKG: number;
  maxPayloadKG: number;
  currentVelocityMPS: number;
  maxVelocityMPS: number;
  gridCoordinates: { x: number; y: number };
  status: RobotStatus;
  activeMissionId: string;
  lidarObstacleDistanceMeters: number;
  motorTempC: number;
}

export interface MissionTask {
  id: string;
  sourceNode: string;
  destinationNode: string;
  assignedRobotId: string;
  skuCode: string;
  palletWeightKG: number;
  priorityLevel: 'CRITICAL_RUSH' | 'STANDARD_FIFO' | 'LOW_BUFFER';
  completionPercent: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
}

export interface SafetyZone {
  zoneId: string;
  name: string;
  laserScannerStatus: 'ZONE_CLEAR' | 'WARNING_FIELD_INTRUDER' | 'PROTECTIVE_STOP_ACTIVE';
  silLevel: 'SIL-3' | 'SIL-2';
  lastInterlockTest: string;
}

export interface RoboticsContextType {
  robots: RobotUnit[];
  missions: MissionTask[];
  safetyZones: SafetyZone[];
  masterEstopActive: boolean;
  toggleMasterEstop: () => void;
  dispatchMission: (source: string, destination: string, sku: string, weight: number) => void;
  selectedRobotId: string;
  setSelectedRobotId: (id: string) => void;
}
