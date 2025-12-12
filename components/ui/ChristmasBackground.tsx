"use client";
import React from "react";
import Snowfall from "react-snowfall";
import { cn } from "@/lib/utils";

interface ChristmasBackgroundProps {
  children: React.ReactNode;
  className?: string; // Per aggiungere classi extra se serve
}

export const ChristmasBackground = ({ children, className }: ChristmasBackgroundProps) => {
  return (
    // 1. Contenitore principale con gradiente natalizio (Rosso scuro -> Verde scuro)
    <div 
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950 via-background to-green-950",
        className
      )}
    >
      {/* 2. Livello Neve: posizionato assolutamente sopra lo sfondo, ma sotto il contenuto */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
         <Snowfall
            // Colore dei fiocchi (bianco ghiaccio leggermente trasparente)
            color="#dee4fd"
            // Quantità di neve (regola a piacere, 150 è un buon equilibrio)
            snowflakeCount={150}
            // Velocità e dimensione variabili per realismo
            speed={[0.5, 2.5]}
            wind={[-0.5, 1.0]}
            radius={[0.5, 3.0]}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
         />
      </div>
      
      {/* 3. Il contenuto della pagina (z-index più alto per stare sopra la neve) */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};