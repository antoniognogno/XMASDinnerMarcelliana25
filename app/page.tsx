"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AVATARS = ["🎅", "🦌", "⛄", "🎁", "🎄", "🍪"];

export default function LoginPage() {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const { registerTeam } = useGame();
  const router = useRouter();

  // Se l'utente ha già un ID squadra salvato, lo mandiamo subito al gioco
  useEffect(() => {
    if (localStorage.getItem("teamId")) {
      router.push("/play");
    }
  }, [router]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    const teamId = await registerTeam(name, selectedAvatar);
    if (teamId) {
      localStorage.setItem("teamId", teamId);
      router.push("/play");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Card className="w-full max-w-md border-4 border-primary/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-black text-primary tracking-tighter uppercase">
            Xmas Login 🎄
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nome Squadra</label>
            <Input 
              placeholder="Es. I Pandori Mannari" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="text-lg h-12 border-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Scegli Avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`text-3xl p-2 rounded-xl transition-all border-2 ${
                    selectedAvatar === av 
                      ? "bg-primary border-primary scale-110 shadow-lg" 
                      : "bg-muted border-transparent hover:bg-muted/80 opacity-50 hover:opacity-100"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleJoin} className="w-full text-xl font-bold h-14 mt-4 shadow-xl hover:scale-[1.02] transition-transform">
            ENTRA IN GARA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}