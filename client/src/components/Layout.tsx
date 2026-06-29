import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MouseAnimationBackground } from "./MouseAnimationBackground";

export function Layout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Global mouse animation background */}
      <MouseAnimationBackground />

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <div className="flex h-[calc(100vh-4rem)] pt-16">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
