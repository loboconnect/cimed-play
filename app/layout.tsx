import PushNotificationProvider from '@/components/PushNotificationProvider'
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campanha Digital 2026",
    description: "Sistema de transmissão de campanha eleitoral",
      manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
                statusBarStyle: "black-translucent",
                  },
                  };

                  export const viewport: Viewport = {
                    themeColor: "#000000",
                      width: "device-width",
                        initialScale: 1,
                        };

                        export default function RootLayout({
                          children,
                          }: {
                            children: React.ReactNode;
                            }) {
                              return (
                                  <html lang="pt-BR">
                                        <head>
                                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                                        <meta name="theme-color" content="#000000" />
                                                                <link rel="manifest" href="/manifest.json" />
                                                                        <link rel="icon" href="/icons/icon-192.png" />
                                                                              </head>
                                                                                    <body className="bg-black text-white">
                                                                                            <PushNotificationProvider>
                                                                                                      {children}
                                                                                                              </PushNotificationProvider>
                                                                                                                      <script
                                                                                                                                dangerouslySetInnerHTML={{
                                                                                                                                            __html: `
                                                                                                                                                          if ('serviceWorker' in navigator) {
                                                                                                                                                                          navigator.serviceWorker.register('/service-worker.js')
                                                                                                                                                                                            .then(reg => console.log('Service Worker registrado', reg))
                                                                                                                                                                                                              .catch(err => console.log('Erro ao registrar SW', err));
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        `,
                                                                                                                                                                                                                                                  }}
                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                                </body>
                                                                                                                                                                                                                                                                    </html>
                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                      