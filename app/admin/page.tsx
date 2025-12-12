"use client";
import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChristmasBackground } from "@/components/ui/ChristmasBackground"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// --- DATABASE DELLE MISSIONI (INVARIATO) ---
const PREDEFINED_TASKS = {
  "EASY & SOCIAL": [
    "Fate un brindisi solenne a caso ('Allo scioglimento dei ghiacciai!') tutti in piedi.",
    "Tutti con gli occhiali da sole per 5 minuti (o tovagliolo in testa).",
    "Fatevi un selfie con un membro di un'altra squadra senza farvi vedere.",
    "Convincete un educatore a farsi una foto con voi in posa da Rapper.",
    "Tutta la squadra deve stare in silenzio assoluto per 2 minuti.",
    "Fate la OLA al tavolo ogni volta che qualcuno beve.",
    "Toccatevi il naso ogni volta che un educatore passa vicino."
  ],
  "CRINGE & ACTING": [
    "Parlate solo cantando (stile Opera o Trap) per 3 minuti.",
    "Ogni volta che ridete, dovete battere le mani sul tavolo.",
    "Uno di voi deve fare una recensione stile '4 Ristoranti' ad alta voce del piatto.",
    "Camminate e muovetevi tutti al rallentatore (Slow Motion) per 2 minuti.",
    "Fate finta di essere invisibili quando qualcuno vi parla.",
    "Fingete che sia il compleanno di uno di voi e fate partire il coro 'Tanti Auguri'.",
    "Chiedete a un altro tavolo se hanno visto il vostro 'Drago Invisibile'."
  ],
  "ACTION & STEALTH": [
    "Rubate un oggetto (saliera/tovagliolo) a un altro tavolo senza farvi vedere.",
    "Create una piramide con i bicchieri vuoti più alta possibile.",
    "Scambiatevi di posto con i membri di un altro tavolo per 1 minuto.",
    "Uno della squadra deve fare il cameriere e servire l'acqua a un altro tavolo.",
    "Nascondetevi tutti sotto il tavolo finché non arriva un educatore.",
    "Fate una catena umana toccandovi i piedi sotto il tavolo."
  ],
  "HARDCORE": [
    "Andate al centro della sala e fate un balletto di TikTok sincronizzato.",
    "Uno di voi deve alzarsi e dire: 'Ho un annuncio importante: mi piacciono i broccoli' e sedersi.",
    "Tutta la squadra deve camminare all'indietro per andare in bagno/buffet.",
    "Dovete mangiare il prossimo boccone senza usare le mani.",
    "Scrivete una poesia di Natale sul tovagliolo e recitatela all'educatore."
  ]
};

export default function AdminPage() {
  const { gameState, teams, sendMessage } = useGame();
  
  const [messageText, setMessageText] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPresetTask, setSelectedPresetTask] = useState<string | null>(null);
  const [customTasks, setCustomTasks] = useState(PREDEFINED_TASKS);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("EASY & SOCIAL");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = "GaetanoRavascletto"; // <--- CAMBIA QUESTA PASSWORD!

  // Se non è autenticato, mostra solo il form di login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <ChristmasBackground className="flex items-center justify-center">
          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md text-center space-y-6">
            <h1 className="text-3xl font-bold text-white">🔒 Accesso Regia</h1>
            <p className="text-white/60">Inserisci il codice di sicurezza</p>
            <Input 
              type="password" 
              className="bg-white/10 border-white/20 text-white text-center text-2xl tracking-widest h-14"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="******"
            />
            <Button 
              className="w-full h-14 text-xl font-bold bg-red-600 hover:bg-red-500 text-white"
              onClick={() => {
                if (passwordInput === ADMIN_PASSWORD) setIsAuthenticated(true);
                else alert("Password errata! Riprova.");
              }}
            >
              SBLOCCA
            </Button>
          </div>
        </ChristmasBackground>
      </div>
    );
  }
  const handleSendManual = () => {
    if (selectedTeamId && messageText) {
      sendMessage(selectedTeamId, messageText);
      setMessageText("");
      setSelectedTeamId(null);
    }
  };

  const handleSendPreset = (targetTeamId: string) => {
    if (selectedPresetTask) {
      sendMessage(targetTeamId, selectedPresetTask);
      setSelectedPresetTask(null);
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && selectedCategory) {
      setCustomTasks(prev => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory as keyof typeof PREDEFINED_TASKS], newTaskText.trim()]
      }));
      setNewTaskText("");
      setShowAddTaskDialog(false);
    }
  };

  const setPhase = (phase: string) => update(ref(db, "gameState"), { phase });
  
  const resetBuzzer = () => {
    update(ref(db, "gameState"), { phase: "LOBBY", buzzerWinner: null });
    const updates: any = {};
    teams.forEach(t => updates[`teams/${t.id}/buzzedAt`] = null);
    update(ref(db), updates);
  };

  const addPoints = (teamId: string, currentScore: number, amount: number) => {
    update(ref(db, `teams/${teamId}`), { score: currentScore + amount });
  };

  const buzzers = teams
    .filter(t => t.buzzedAt)
    .sort((a, b) => (a.buzzedAt || 0) - (b.buzzedAt || 0));

  return (
    <div className="min-h-screen font-sans text-white"> 
      {/* ⚠️ Nota: ChristmasBackground gestisce solo la neve ora, il colore è nel globals.css */}
      <ChristmasBackground className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto">
      
      {/* HEADER - GLASS */}
      <header className="mb-20  flex justify-between items-center bg-black/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl sticky top-4 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
            <span className="text-4xl">🎄</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">REGIA XMAS</h1>
              <p className="text-xs text-white/50 font-mono uppercase tracking-widest">Control Center</p>
            </div>
        </div>
        <Badge variant="outline" className="text-sm px-6 py-2 border-white/20 text-white bg-white/5 uppercase tracking-widest font-bold">
          Fase: <span className="text-green-400 ml-2">{gameState.phase}</span>
        </Badge>
      </header>

      {/* CONTROLLI FASI - BOTTONI GRANDI E TRASPARENTI */}
      <section className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button onClick={() => setPhase("LOBBY")} className="h-20 text-lg bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur text-white">
            🏠 LOBBY
        </Button>
        <Button onClick={() => setPhase("BUZZER")} className="h-20 text-xl font-black bg-red-600/80 hover:bg-red-600 border border-red-400/50 backdrop-blur text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] md:col-span-2 animate-pulse hover:animate-none transition-all">
            🚨 ATTIVA BUZZER
        </Button>
        <Button onClick={resetBuzzer} className="h-20 text-lg bg-black/40 hover:bg-red-900/40 border border-white/10 hover:border-red-500/50 backdrop-blur text-white/80">
            ♻️ RESET
        </Button>
      </section>

      {/* RISULTATI BUZZER */}
      {gameState.phase !== "LOBBY" && (
         <section className="mb-20 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
           <h3 className="text-blue-300 font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
             ⚡ Ordine di Prenotazione
           </h3>
           {buzzers.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-8 text-white/20">
                   <p className="font-light text-lg">In attesa del primo click...</p>
               </div>
           ) : (
             <ul className="space-y-3">
               {buzzers.map((t, i) => (
                 <li key={t.id} className={cn(
                     "flex justify-between items-center p-4 rounded-2xl border backdrop-blur-md transition-all",
                     i === 0 
                        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-50 shadow-[0_0_20px_rgba(234,179,8,0.2)]" 
                        : "bg-white/5 border-white/5 text-white/60"
                 )}>
                   <div className="flex items-center gap-6">
                        <span className={cn("font-mono text-2xl font-bold w-10 text-center", i===0 ? "text-yellow-400" : "text-white/20")}>
                            #{i+1}
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{t.avatar}</span>
                            <span className="text-xl font-bold">{t.name}</span>
                        </div>
                   </div>
                   <span className="font-mono text-sm opacity-60">
                        {new Date(t.buzzedAt!).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                   </span>
                 </li>
               ))}
             </ul>
           )}
         </section>
      )}

      {/* GRID SQUADRE - STILE DARK GLASS */}
      <div>
        <h2 className="text-xl font-bold text-white/90 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <span>👥</span> Gestione Squadre
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
            <div key={team.id} className={cn(
                "relative flex flex-col gap-4 p-6 rounded-3xl border transition-all duration-300 hover:shadow-2xl bg-black/30 backdrop-blur-md",
                team.activeMessage ? "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)] bg-yellow-900/10" : "border-white/5 hover:border-white/20"
            )}>
                
                {/* Header Card */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow-lg">{team.avatar}</span>
                        <span className="font-bold text-lg text-white leading-tight">{team.name}</span>
                    </div>
                    <span className="text-3xl font-black text-white/90">{team.score}</span>
                </div>

                {/* Feedback Messaggio */}
                {team.activeMessage && (
                    <div className="bg-yellow-500/20 text-yellow-200 text-xs p-3 rounded-xl border border-yellow-500/30 flex items-center gap-2 animate-pulse">
                        <span>📩</span>
                        <span className="font-medium truncate">{team.activeMessage}</span>
                    </div>
                )}

                {/* Controlli Punti */}
                <div className="grid grid-cols-4 gap-2 mt-auto pt-4 border-t border-white/5">
                    <Button size="sm" variant="ghost" className="bg-white/5 text-red-300 hover:bg-red-500/20 hover:text-red-200" onClick={() => addPoints(team.id, team.score, -10)}>-10</Button>
                    <Button size="sm" variant="ghost" className="bg-white/5 text-white hover:bg-white/10" onClick={() => addPoints(team.id, team.score, 10)}>+10</Button>
                    <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20" onClick={() => addPoints(team.id, team.score, 20)}>+20</Button>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 font-bold" onClick={() => addPoints(team.id, team.score, 50)}>+50</Button>
                </div>

                {/* Scrivi Manuale */}
                <Dialog open={selectedTeamId === team.id} onOpenChange={(open) => !open && setSelectedTeamId(null)}>
                    <DialogTrigger asChild>
                        <Button variant="link" className="text-white/40 hover:text-white h-auto p-0 text-xs mt-2 w-full" onClick={() => setSelectedTeamId(team.id)}>
                        scrivi messaggio manuale...
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950/90 backdrop-blur-xl border-white/10 text-white">
                        <DialogHeader><DialogTitle>Scrivi a: {team.name}</DialogTitle></DialogHeader>
                        <div className="py-4">
                        <Input 
                            className="bg-white/5 border-white/10 text-white h-12" 
                            placeholder="Scrivi qui..." 
                            value={messageText} 
                            onChange={(e) => setMessageText(e.target.value)} 
                            autoFocus 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendManual()} 
                        />
                        </div>
                        <DialogFooter><Button onClick={handleSendManual} className="w-full bg-white text-black font-bold">INVIA</Button></DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
            ))}
        </section>
      </div>

      {/* ARCHIVIO MISSIONI */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white/90 flex items-center gap-2">
            <span>📚</span> Archivio Missioni Rapide
          </h2>
          <Button 
            onClick={() => setShowAddTaskDialog(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            ➕ Aggiungi Task
          </Button>
        </div>
        
        <div className="bg-black/30 backdrop-blur-xl rounded-[2rem] p-2 border border-white/5">
            <Tabs defaultValue="EASY & SOCIAL" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="flex w-full bg-transparent p-0 gap-2 flex-wrap md:flex-nowrap mb-4">
                {Object.keys(customTasks).map((category) => (
                <TabsTrigger 
                    key={category} 
                    value={category} 
                    className="flex-1 py-3 rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 font-bold uppercase text-xs tracking-wider transition-all"
                >
                    {category}
                </TabsTrigger>
                ))}
            </TabsList>
            
            {Object.entries(customTasks).map(([category, tasks]) => (
                <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2">
                {tasks.map((task, idx) => (
                    <button
                    key={idx}
                    onClick={() => setSelectedPresetTask(task)}
                    className="text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-white/80 hover:text-white"
                    >
                        {task}
                    </button>
                ))}
                </TabsContent>
            ))}
            </Tabs>
        </div>
      </div>

      {/* MODALE SELEZIONE SQUADRA */}
      <Dialog open={!!selectedPresetTask} onOpenChange={(open) => !open && setSelectedPresetTask(null)}>
        <DialogContent className="bg-slate-950/90 backdrop-blur-xl border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white/90">A chi inviare?</DialogTitle>
            <DialogDescription className="text-lg text-white/70 italic pt-2">"{selectedPresetTask}"</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-6 max-h-[50vh] overflow-y-auto">
            {teams.map((team) => (
              <Button
                key={team.id}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/30 text-white border-0"
                onClick={() => handleSendPreset(team.id)}
              >
                <span className="text-2xl">{team.avatar}</span>
                <span className="font-bold truncate w-full">{team.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODALE AGGIUNGI TASK */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="bg-slate-950/90 backdrop-blur-xl border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white/90">Aggiungi Nuovo Task</DialogTitle>
            <DialogDescription className="text-white/60">
              Categoria: <span className="text-white font-bold">{selectedCategory}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="task-text" className="text-white/80 mb-2 block">Testo del Task</Label>
              <Input
                id="task-text"
                className="bg-white/5 border-white/10 text-white h-12"
                placeholder="Es: Fate un brindisi solenne..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
            </div>
            <div>
              <Label className="text-white/80 mb-2 block">Seleziona Categoria</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(customTasks).map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className={cn(
                      "h-auto py-3 text-xs font-bold",
                      selectedCategory === cat
                        ? "bg-white/20 border-white/40 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleAddTask} 
              className="w-full bg-white text-black font-bold hover:bg-gray-200"
              disabled={!newTaskText.trim()}
            >
              ➕ AGGIUNGI TASK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </ChristmasBackground>
    </div>
  );
}