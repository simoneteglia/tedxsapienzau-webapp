// mock-server.js
const WebSocket = require('ws');

// Creiamo un server WebSocket sulla porta 8080
const wss = new WebSocket.Server({ port: 8080 });

// Alcune frasi di test per simulare il flusso del parlato
const mockSentences = [
    "Benvenuti signore e signori a questa serata speciale.",
    "Stiamo testando il sistema di trascrizione in tempo reale.",
    "Ogni tre secondi riceverete un nuovo aggiornamento testuale dal server.",
    "Questo vi permetterà di verificare come la vostra applicazione React gestisce l'aggiunta continua di testo.",
    "Assicuratevi che lo scrolling automatico verso il basso sia fluido.",
    "È importante che il testo rimanga ben leggibile anche da lontano per il pubblico in sala.",
    "Essere, o non essere, questo è il dilemma.",
    "Continueremo a inviare messaggi in loop finché non chiuderete la connessione."
];

wss.on('connection', (ws) => {
    console.log('🟢 Nuovo client frontend connesso al mock server!');
    
    let index = 0;

    // Imposta un intervallo che scatta ogni 3000 millisecondi (3 secondi)
    const intervalId = setInterval(() => {
        // Controlla che la connessione sia ancora aperta prima di inviare
        if (ws.readyState === WebSocket.OPEN) {
            const textToSend = mockSentences[index % mockSentences.length];
            ws.send(textToSend);
            console.log(`Inviato: "${textToSend}"`);
            index++;
        }
    }, 3000);

    // Quando il frontend si disconnette, puliamo l'intervallo per evitare memory leak
    ws.on('close', () => {
        console.log('🔴 Client disconnesso. Interrompo invio.');
        clearInterval(intervalId);
    });
});

console.log('🎭 Mock WebSocket Server in ascolto su ws://localhost:8080');