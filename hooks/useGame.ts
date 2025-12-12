import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, set, update, push, serverTimestamp } from "firebase/database";

export type GameState = {
  phase: "LOBBY" | "BUZZER" | "LOCKED" | "VOTING";
  buzzerWinner: string | null;
};

export type Team = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  buzzedAt?: number;
  activeMessage?: string | null; // <--- NUOVO CAMPO
};


export function useGame() {
  const [gameState, setGameState] = useState<GameState>({ phase: "LOBBY", buzzerWinner: null });
  const [teams, setTeams] = useState<Team[]>([]);

  // Sincronizza lo STATO DEL GIOCO (Fase attuale)
  useEffect(() => {
    const stateRef = ref(db, "gameState");
    return onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setGameState(data);
    });
  }, []);

  // Sincronizza le SQUADRE e le ordina per punteggio
  useEffect(() => {
    const teamsRef = ref(db, "teams");
    return onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setTeams([]);
        return;
      }
      
      const teamList = Object.entries(data).map(([key, val]: any) => ({
        id: key,
        ...val,
      })).sort((a, b) => b.score - a.score); // Ordine decrescente
      
      setTeams(teamList);
    });
  }, []);

  // REGISTRAZIONE SQUADRA
  const registerTeam = async (name: string, avatar: string) => {
    const newTeamRef = push(ref(db, "teams"));
    await set(newTeamRef, {
      name,
      avatar,
      score: 0,
      joinedAt: serverTimestamp()
    });
    return newTeamRef.key;
  };

  // PRESSIONE PULSANTE (Solo se fase è BUZZER)
  const pressBuzzer = async (teamId: string) => {
    if (gameState.phase !== 'BUZZER') return;
    // Scrive il timestamp. Vince chi ha il timestamp minore.
    await update(ref(db, `teams/${teamId}`), {
      buzzedAt: serverTimestamp()
    });
  };

const sendMessage = async (teamId: string, text: string) => {
    await update(ref(db, `teams/${teamId}`), {
      activeMessage: text
    });
  };

  // Cancella messaggio (Client conferma lettura)
  const clearMessage = async (teamId: string) => {
    await update(ref(db, `teams/${teamId}`), {
      activeMessage: null
    });
  };

  // Ricordati di aggiungere sendMessage e clearMessage nel return qui sotto:
  return { gameState, teams, registerTeam, pressBuzzer, sendMessage, clearMessage };
}