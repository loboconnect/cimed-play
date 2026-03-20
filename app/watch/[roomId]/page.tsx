PS C:\Users\allan\cimed-play> "use client";
>> import { useEffect, useRef, useState, useCallback } from "react";
>> import { useParams } from "next/navigation";
>>
>> export default function WatchPage() {
>>   const params = useParams();
>>   const roomId = params?.roomId as string;
>>   const videoRef = useRef<HTMLVideoElement>(null);
>>   const peerRef = useRef<any>(null);
>>   const [isConnected, setIsConnected] = useState(false);
>>   const [isPiP, setIsPiP] = useState(false);
>>   const [status, setStatus] = useState("Conectando...");
>>
>>   const connect = useCallback(async () => {
>>     if (!roomId) return;
>>     if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null; }
>>     const { Peer } = await import("peerjs");
>>     const peer = new Peer();
>>     peerRef.current = peer;
>>     peer.on("open", async () => {
>>       setStatus("Aguardando transmissão...");
>>       try {
>>         const fakeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });>>         const call = peer.call(roomId, fakeStream);
>>         fakeStream.getTracks().forEach(t => t.stop());
>>         if (call) {
>>           call.on("stream", (remoteStream) => {
>>             if (videoRef.current) {
>>               videoRef.current.srcObject = remoteStream;
>>               videoRef.current.play().catch(() => {});
>>             }
>>             setIsConnected(true);
>>             setStatus("AO VIVO");
>>           });
>>           call.on("close", () => { setIsConnected(false); setStatus("Transmissão encerrada."); }); 
>>         }
>>       } catch { setStatus("Erro ao conectar. Tente novamente."); }
>>     });
>>     peer.on("error", () => { setTimeout(() => connect(), 3000); });
>>   }, [roomId]);
>>
>>   useEffect(() => {
>>     connect();
>>     return () => { if (peerRef.current) peerRef.current.destroy(); };
>>   }, [connect]);
>>
>>   const togglePiP = async () => {
>>     if (!videoRef.current) return;
>>     try {
>>       if (document.pictureInPictureElement) {
>>         await document.exitPictureInPicture();
>>         setIsPiP(false);
>>       } else {
>>         await videoRef.current.requestPictureInPicture();
>>         setIsPiP(true);
>>       }
>>     } catch { alert("Picture-in-Picture não suportado neste navegador"); }
>>   };
>>
>>   return (
>>     <div className="min-h-screen bg-[#1A1A1A] text-white">
>>       <header className="px-6 py-4 bg-black border-b border-[#FFC600] flex justify-between items-center">
>>         <h1 className="text-2xl font-bold text-[#FFC600]">CIMED PLAY</h1>
>>         <a href="/" className="px-4 py-2 bg-gray-700 rounded font-bold text-sm">Início</a>
>>       </header>
>>       <main className="p-6">
>>         <div className="relative bg-black rounded-lg overflow-hidden w-full mb-4" style={{aspectRatio: "16/9"}}>
>>           <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full" style={{objectFit: "contain"}} />
>>           {!isConnected && (
>>             <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">     
>>               <div className="w-8 h-8 border-4 border-[#FFC600] border-t-transparent rounded-full animate-spin" />
>>               <span className="text-gray-400">{status}</span>
>>             </div>
>>           )}
>>           {isConnected && (
>>             <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
>>               <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
>>               <span className="text-white text-sm font-bold">AO VIVO</span>
>>             </div>
>>           )}
>>             <button onClick={togglePiP} className="absolute bottom-4 right-4 px-4 py-2 bg-[#FFC600] text-[#2D2926] rounded font-bold shadow-lg">
>>               {isPiP ? "?? Fechar Flutuante" : "??? Modo Flutuante"}
>>             </button>
>>           )}
>>         </div>
>>         <div className="bg-[#2D2926] rounded-lg p-4">
>>           <p className="text-sm text-gray-400">{isConnected ? "Você está assistindo a transmissão ao vivo da CIMED PLAY." : status}</p>
>>         </div>
>>       </main>
>>     </div>
>>   );
>> }
0a};b0f0c95c-58c8-45ae-a9ef-670a7533f200No linha:2 caractere:19
+ import { useEffect, useRef, useState, useCallback } from "react";
+                   ~
Argumento ausente na lista de parâmetros.
No linha:5 caractere:35
+ export default function WatchPage() {
+                                   ~
Uma expressão era esperada após '('.
No linha:6 caractere:28
+   const params = useParams();
+                            ~
Uma expressão era esperada após '('.
No linha:14 caractere:38
+   const connect = useCallback(async () => {
+                                      ~
Uma expressão era esperada após '('.
No linha:15 caractere:16
+     if (!roomId) return;
+                ~
Bloco de instrução ausente após if ( condição ).
No linha:16 caractere:52
+     if (peerRef.current) { peerRef.current.destroy(); peerRef.current ...
+                                                    ~
Uma expressão era esperada após '('.
No linha:18 caractere:27
+     const peer = new Peer();
+                           ~
Uma expressão era esperada após '('.
No linha:20 caractere:20
+     peer.on("open", async () => {
+                    ~
Expressão ausente após ','.
No linha:20 caractere:21
+     peer.on("open", async () => {
+                     ~~~~~
Token 'async' inesperado na expressão ou instrução.
No linha:20 caractere:20
+     peer.on("open", async () => {
+                    ~
')' de fechamento ausente na expressão.
Nem todos os erros de análise foram indicados.  Corrija os erros indicados e tente de novo.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : MissingArgument
 
PS C:\Users\allan\cimed-play> 