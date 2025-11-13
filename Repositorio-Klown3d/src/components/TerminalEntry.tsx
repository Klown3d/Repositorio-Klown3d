import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TerminalEntryProps {
  onAccess: () => void;
}

const TerminalEntry = ({ onAccess }: TerminalEntryProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "KLOWN3D SECURITY TERMINAL v3.14",
    "========================================",
    "Type 'help' for available commands",
    "Type 'hint' if you're lost in the chaos",
    ""
  ]);
  const [attempts, setAttempts] = useState(0);

  const passwords = ["klown3d", "backend", "chaos", "punk"];
  
  const commands: Record<string, () => void> = {
    help: () => {
      addToHistory([
        "Available commands:",
        "  help     - Show this message",
        "  hint     - Get a hint about access",
        "  clear    - Clear terminal",
        "  whoami   - System info",
        "  access   - Try to gain access",
        ""
      ]);
    },
    hint: () => {
      const hints = [
        "The key is in the name...",
        "What do you call someone who builds the chaos behind the scenes?",
        "Think about what defines this portfolio...",
        "It's not about security, it's about identity"
      ];
      addToHistory([hints[Math.min(attempts, hints.length - 1)], ""]);
    },
    clear: () => {
      setHistory([
        "KLOWN3D SECURITY TERMINAL v3.14",
        "========================================",
        ""
      ]);
    },
    whoami: () => {
      addToHistory([
        "User: Anonymous",
        "Location: The Digital Void",
        "Access Level: RESTRICTED",
        "Mission: Break through the chaos",
        ""
      ]);
    },
    access: () => {
      addToHistory([
        "ERROR: Requires password",
        "Usage: access <password>",
        ""
      ]);
    }
  };

  const addToHistory = (lines: string[]) => {
    setHistory(prev => [...prev, ...lines]);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addToHistory([`> ${cmd}`, ""]);

    if (trimmed === "") return;

    // Check if it's an access command with password
    if (trimmed.startsWith("access ")) {
      const password = trimmed.substring(7).trim();
      if (passwords.includes(password)) {
        addToHistory([
          "ACCESS GRANTED",
          "Initializing KLOWN3D interface...",
          "Welcome to the chaos.",
          ""
        ]);
        setTimeout(() => onAccess(), 1500);
      } else {
        setAttempts(prev => prev + 1);
        addToHistory([
          "ACCESS DENIED",
          `Attempts: ${attempts + 1}`,
          attempts >= 2 ? "Try 'hint' if you're stuck" : "",
          ""
        ]);
      }
      return;
    }

    // Direct password attempt (any of the valid passwords)
    if (passwords.includes(trimmed)) {
      addToHistory([
        "DIRECT ACCESS DETECTED",
        "Bypassing security protocols...",
        "ACCESS GRANTED",
        ""
      ]);
      setTimeout(() => onAccess(), 1500);
      return;
    }

    // Execute command
    if (commands[trimmed]) {
      commands[trimmed]();
    } else {
      addToHistory([
        `Command not found: ${trimmed}`,
        "Type 'help' for available commands",
        ""
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  useEffect(() => {
    const terminal = document.getElementById("terminal-history");
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [history]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 terminal-grid">
      <Card className="w-full max-w-3xl bg-card/95 border-2 border-primary p-6 text-glow-green">
        <div className="mb-4 flex items-center gap-2 border-b border-primary pb-2">
          <div className="w-3 h-3 bg-secondary" />
          <div className="w-3 h-3 bg-accent" />
          <div className="w-3 h-3 bg-primary animate-pulse" />
          <span className="ml-4 text-sm text-primary font-mono">
            C:\KLOWN3D\SECURITY&gt;
          </span>
        </div>

        <div 
          id="terminal-history"
          className="font-mono text-sm mb-4 h-96 overflow-y-auto space-y-1 text-foreground/90"
        >
          {history.map((line, i) => (
            <div key={i} className={line.startsWith(">") ? "text-primary font-bold" : ""}>
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-primary pt-2">
          <span className="text-primary font-mono">C:\KLOWN3D\SECURITY&gt;</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background border-none font-mono text-foreground focus:ring-0 focus:outline-none p-0 h-auto"
            placeholder=""
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <span className="text-primary terminal-cursor"></span>
        </form>

        <div className="mt-4 text-xs text-muted-foreground font-mono border-t border-primary/30 pt-2">
          <p>SYSTEM STATUS: <span className="text-secondary">LOCKED</span></p>
          <p className="text-accent flicker">WARNING: Unauthorized access will be traced</p>
        </div>
      </Card>
    </div>
  );
};

export default TerminalEntry;
