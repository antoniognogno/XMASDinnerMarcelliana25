"use client";
import { useEffect, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { ChristmasBackground } from "@/components/ui/ChristmasBackground";
import { playBuzzerSound, playPointsSound, playBuzzReadySound } from "@/lib/soundEffects";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PlayPage() {
  const { gameState, teams, pressBuzzer, clearMessage } = useGame();
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const router = useRouter();
  const [buzzerNotified, setBuzzerNotified] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("teamId");
    if (!id) router.push("/");
    setMyTeamId(id);
  }, [router]);

  // Riproduci suono quando il buzz diventa disponibile
  useEffect(() => {
    if (gameState.phase === "BUZZER" && !buzzerNotified) {
      playBuzzReadySound();
      setBuzzerNotified(true);
    } else if (gameState.phase !== "BUZZER") {
      setBuzzerNotified(false);
    }
  }, [gameState.phase, buzzerNotified]);

  const myTeam = teams.find((t) => t.id === myTeamId);

  if (!myTeam) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse">Caricamento Slitta...</div>;

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
        <ChristmasBackground className="flex flex-col items-center justify-center p-4">
      
      {/* --- NAVBAR SQUADRA --- */}
      {/* Nota: ho aggiunto backdrop-blur per renderla leggibile sopra la neve */}
               {/* ... contenuto navbar uguale a prima ... */}
      
      {/* ... Resto del codice (Pop-up e Area di gioco) uguale a prima ... */}

      {/* Navbar Squadra */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-end bg-gradient-to-b from-card to-transparent pb-8 z-10">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-muted-foreground uppercase">Squadra</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{myTeam.avatar}</span>
            <span className="font-bold text-xl leading-none">{myTeam.name}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-muted-foreground uppercase">Punti</span>
          <span className="text-4xl font-black text-primary leading-none">{myTeam.score}</span>
        </div>
      </div>

      {/* Area di Gioco Centrale */}
      <div className="mt-10 w-full max-w-sm flex flex-col items-center justify-center min-h-[50vh]">
        
        {/* FASE 1: ATTESA */}
        {gameState.phase === "LOBBY" && (
          <div className="mt-50 text-center animate-in zoom-in duration-500 bg-card/50 rounded-3xl border-4 border-dashed border-muted-foreground/20 p-8">
            <div className="text-8xl mb-4 drop-shadow-2xl">🎅</div>
            <h2 className="text-3xl font-black text-foreground mb-2">ATTENDI IL GIOCO</h2>
            <p className="font-medium">L'elfo sta preparando la domanda...</p>
          </div>
        )}

        {/* FASE 2: BUZZER ATTIVO */}
        {gameState.phase === "BUZZER" && (
           <button
             onClick={() => {
                if (!myTeam.buzzedAt) {
                  playBuzzerSound();
                  
                  // Calcola i punti che verranno assegnati
                  const buzzedCount = teams.filter(t => t.buzzedAt).length;
                  let points = 0;
                  if (buzzedCount === 0) points = 50;
                  else if (buzzedCount === 1) points = 30;
                  else if (buzzedCount === 2) points = 10;
                  
                  if (points > 0) {
                    setTimeout(() => playPointsSound(points), 200);
                  }
                  
                  pressBuzzer(myTeam.id);
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
             }}
             disabled={!!myTeam.buzzedAt}
             className={cn(
               "w-64 h-64 mt-50 rounded-full border-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center transition-all duration-200 active:scale-95 touch-manipulation",
               myTeam.buzzedAt 
                 ? "bg-secondary border-green-800 scale-95 opacity-80 cursor-default" 
                 : "bg-primary border-red-900 animate-pulse hover:scale-105"
             )}
           >
             <span className="text-5xl">{myTeam.buzzedAt ? "👍" : "🚨"}</span>
             <span className="text-2xl font-black text-white mt-2 uppercase">
               {myTeam.buzzedAt ? "PRESO!" : "PREMI!"}
             </span>
           </button>
        )}

        {/* FASE 3: BLOCCATO */}
        {gameState.phase === "LOCKED" && (
          <div className="text-center p-8 bg-card/50 rounded-3xl border-4 border-dashed border-muted-foreground/20 animate-in fade-in">
            <span className="text-6xl grayscale opacity-50">🔒</span>
            <h3 className="text-xl font-bold mt-4 text-muted-foreground">TEMPO SCADUTO</h3>
          </div>
        )}

      </div>
      {/* --- POP-UP MISSIONE SEGRETA --- */}
      <AlertDialog open={!!myTeam.activeMessage}>
        <AlertDialogContent className="bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-3xl shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white flex items-center gap-3 uppercase tracking-widest">
              <span className="text-3xl">🤫</span>
              TOP SECRET
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-white/90 py-6 leading-relaxed">
              {myTeam.activeMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => {
                if (myTeamId) clearMessage(myTeamId);
              }}
              className="bg-white text-black hover:bg-gray-200 font-bold text-lg h-14 w-full rounded-xl transition-all"
            >
              HO CAPITO (Eseguo)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ChristmasBackground>
      
    </div>
  );
}