import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, Menu, Code2, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { FloatingGeometry } from "./home/subcomponents/FloatingGeometry";
import { NeuralNetwork } from "./home/subcomponents/NeuralNetwork";
import { useTheme } from "./ui/theme-provider";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

type PublicHeaderProps = {
  onOpenChat: () => void;
};

export function PublicHeader({ onOpenChat }: PublicHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <>
      <FloatingGeometry />
      <NeuralNetwork />

      <header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Solution</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-indigo-500"
                      : "text-muted-foreground hover:text-indigo-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-indigo-600/20 hover:text-indigo-500"
                onClick={onOpenChat}
                title="Open AI Solution chat"
                aria-label="Open AI Solution chat"
              >
                <Bot className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-indigo-600/20 hover:text-indigo-500"
                onClick={toggleTheme}
                title={`Switch Theme (Current: ${theme})`}
              >
                {theme === "light" && <Sun className="h-5 w-5" />}
                {theme === "dark" && <Moon className="h-5 w-5" />}
                {theme === "system" && <Monitor className="h-5 w-5" />}
              </Button>

              <Link to="/contact">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-indigo-600/20 hover:text-indigo-500"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] bg-background/95 border-l border-border/60"
                >
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors ${
                          location.pathname === item.href
                            ? "text-indigo-500"
                            : "text-muted-foreground hover:text-indigo-500"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground border-indigo-500/30 hover:bg-indigo-600/20 hover:text-indigo-500"
                      onClick={() => {
                        onOpenChat();
                        setIsOpen(false);
                      }}
                    >
                      <Bot className="h-5 w-5 mr-2" />
                      Chat with AI Solution
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-muted-foreground border-indigo-500/30 hover:bg-indigo-600/20 hover:text-indigo-500"
                      onClick={() => {
                        toggleTheme();
                        setIsOpen(false);
                      }}
                    >
                      {theme === "light" && <Sun className="h-5 w-5 mr-2" />}
                      {theme === "dark" && <Moon className="h-5 w-5 mr-2" />}
                      {theme === "system" && (
                        <Monitor className="h-5 w-5 mr-2" />
                      )}
                      Switch Theme
                    </Button>

                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white mt-4">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
