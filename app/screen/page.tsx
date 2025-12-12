"use client";
import { useGame } from "@/hooks/useGame";

export default function ScreenPage() {
  const { gameState, teams } = useGame();

  // Primi 3 buzzer per visualizzazione rapida
  const topBuzzers = teams
    .filter(t => t.buzzedAt)
    .sort((a, b) => (a.buzzedAt || 0) - (b.buzzedAt || 0))
    .slice(0, 1);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background p-8 flex gap-8">
      {/* CLASSIFICA (Sinistra) */}
      <div className="w-1/3 flex flex-col h-full bg-card/50 rounded-3xl border-4 border-muted p-6 shadow-xl backdrop-blur">
        <h2 className="text-4xl font-black text-center mb-6 text-foreground tracking-widest uppercase border-b-4 border-primary pb-4">
          Classifica
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {teams.map((team, index) => (
            <div 
              key={team.id} 
              className={`p-4 rounded-2xl flex items-center justify-between border-b-4 transition-all ${
                index === 0 
                  ? "bg-primary text-white border-primary-foreground scale-105 shadow-lg z-10" 
                  : index === 1
                  ? "bg-secondary text-white border-secondary-foreground"
                  : "bg-white text-foreground border-muted-foreground/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-black text-2xl ${index < 3 ? 'opacity-100' : 'opacity-40'}`}>#{index + 1}</span>
                <span className="text-4xl">{team.avatar}</span>
                <span className="font-bold text-2xl truncate max-w-[250px]">{team.name}</span>
              </div>
              <span className="text-4xl font-black">{team.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STAGE CENTRALE (Destra) */}
      <div className="flex-1 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border-4 border-dashed border-primary/20 flex flex-col items-center justify-center relative overflow-hidden p-10 text-center">
         
         {gameState.phase === "LOBBY" && (
            <div className="animate-pulse">
               <h1 className="text-[120px] font-black text-primary leading-none drop-shadow-xl">XMAS<br/>DINNER</h1>
               <p className="text-4xl text-muted-foreground mt-8 font-bold bg-white/80 inline-block px-8 py-2 rounded-full shadow-sm">
                 Entrate con il QR Code!
               </p>
            </div>
         )}

         {gameState.phase === "BUZZER" && topBuzzers.length === 0 && (
            <div className="animate-bounce">
               <h1 className="text-[150px] font-black text-red-600 drop-shadow-2xl">PREMI!</h1>
               <p className="text-5xl text-foreground font-bold">Chi sarà il più veloce?</p>
            </div>
         )}

         {(gameState.phase === "BUZZER" || gameState.phase === "LOCKED") && topBuzzers.length > 0 && (
            <div className="animate-in zoom-in duration-300 transform scale-125 bg-white p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-8 border-primary">
               <p className="text-3xl text-muted-foreground font-bold uppercase mb-4 tracking-[1rem]">Vincitore</p>
               <div className="text-[150px] mb-4">{topBuzzers[0].avatar}</div>
               <h1 className="text-8xl font-black text-primary">{topBuzzers[0].name}</h1>
            </div>
         )}
      </div>
    </div>
  );
}