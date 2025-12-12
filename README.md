🛠️ Stack Tecnologico & Architettura
Xmas Commander è una Real-time Web App (PWA) progettata per gestire giochi interattivi a bassa latenza. L'applicazione sfrutta un'architettura Serverless per garantire scalabilità istantanea e aggiornamenti in tempo reale su tutti i client connessi.

💻 Tech Stack
Framework: Next.js 14 (App Router & TypeScript) - Per il rendering lato server e la gestione delle rotte.

Styling & UI:

Tailwind CSS - Utility-first CSS framework.

Shadcn/UI - Componenti riutilizzabili e accessibili.

Glassmorphism Custom Theme - Design system personalizzato con effetti blur, trasparenze e gradienti natalizi dinamici.

Backend & Database: Firebase Realtime Database - Scelto per la sua capacità di sincronizzare stati JSON via WebSocket a bassa latenza (fondamentale per il sistema di "Buzzer").

Effects & Animation:

react-snowfall: Gestione particellare per l'effetto neve su layer canvas.

canvas-confetti: Feedback visivo per le interazioni utente.

tailwindcss-animate: Animazioni fluide per UI transitions.

Deployment: Vercel - Hosting edge con CI/CD automatica.

🔄 Come Funziona (Architettura del Flusso Dati)
Il cuore dell'applicazione è l'hook personalizzato useGame, che gestisce la sincronizzazione dello stato globale tra Regia, Maxischermo e Giocatori.

Sync in Tempo Reale: Tutti i client (Admin, Screen, Player) mantengono una connessione WebSocket aperta con Firebase. Qualsiasi modifica allo stato (gameState) o ai punteggi (teams) viene propagata istantaneamente a tutti i dispositivi connessi senza necessità di refresh (Hydration in tempo reale).

Sistema di Buzzer (Race Condition Handling):

La Regia imposta lo stato su BUZZER.

I client abilitano il pulsante interattivo.

Al click, il client invia un timestamp (serverTimestamp()) al nodo della propria squadra.

Il backend ordina le richieste basandosi sul timestamp del server, garantendo precisione al millisecondo per determinare il vincitore, indipendentemente dalla velocità del dispositivo dell'utente.

Messaggistica Mirata (Secret Tasks): L'Admin può inviare payload specifici a un singolo Client ID. Il client ascolta passivamente modifiche al nodo activeMessage; quando rilevato, un componente AlertDialog "bloccante" interrompe l'UX del giocatore finché la missione non viene confermata.

Sicurezza & Accesso:

Admin: Protetto da un Gate lato client con password.

Giocatori: Autenticazione anonima basata su sessione. L'identità della squadra è persistita tramite localStorage e UUID, permettendo il rientro in gara anche in caso di crash del browser o refresh della pagina.

🧩 Diagramma di Flusso (Buzzer Logic)
Snippet di codice

sequenceDiagram
    participant Admin as 🎛️ Regia
    participant Firebase as 🔥 DB Realtime
    participant Client as 📱 Squadra
    participant Screen as 📺 Maxischermo

    Admin->>Firebase: Set Phase: "BUZZER"
    Firebase->>Client: Push Update (Attiva UI Pulsante)
    Firebase->>Screen: Push Update (Mostra "PREMI!")
    
    Note over Client: Utente preme il pulsante
    
    Client->>Firebase: Write: buzzedAt = serverTimestamp()
    Firebase->>Admin: Update Ordine Arrivo
    Firebase->>Screen: Mostra Vincitore
    Firebase->>Client: UI Feedback ("PRESO!")