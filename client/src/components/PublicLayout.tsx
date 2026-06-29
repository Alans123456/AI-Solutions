import { Outlet } from "react-router-dom";
import { useState } from "react";
import { ChatBot } from "./ChatBot";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { MouseAnimationBackground } from "./MouseAnimationBackground";

export function PublicLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Global mouse animation background */}
      <MouseAnimationBackground />

      {/* Main content */}
      <div className="relative z-10">
        <PublicHeader onOpenChat={() => setChatOpen(true)} />
        <main className="pt-16">
          <Outlet />
        </main>
        <PublicFooter />
        <ChatBot open={chatOpen} onOpenChange={setChatOpen} />
      </div>
    </div>
  );
}
