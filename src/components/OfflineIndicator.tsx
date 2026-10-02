/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useOnlineStatus } from "../hooks/usePWAInstall";
import { WifiOff } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-amber-600/90 text-white text-[11px] font-medium shadow-lg backdrop-blur-xs flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Modalità Offline — Tutti i 1752 canoni sono disponibili localmente</span>
    </div>
  );
};
