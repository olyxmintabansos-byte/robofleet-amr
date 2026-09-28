import type { Metadata } from 'next';
import './globals.css';
import { RoboticsProvider } from '@/context/RoboticsContext';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'RoboFleet AMR — Autonomous Mobile Robot SCADA & Industrial Fleet HUD',
  description:
    'Titan #46: Industrial automated guided vehicles, Movement #2 Brutalist SCADA, LiDAR point-cloud SLAM, pallet dispatch queue, and Safety SIL-3 interlocks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#060709] text-[#e2e8f0]">
        <RoboticsProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </RoboticsProvider>
      </body>
    </html>
  );
}
