import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import TerminalEntry from "@/components/TerminalEntry";
import AudioVisualizer from "@/components/AudioVisualizer";

interface CommandHistory {
  command: string;
  output: string[];
  timestamp: string;
}

const Index = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("welcome");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
  };

  const asciiArt = {
    logo: [
      "  ██╗  ██╗██╗      ██████╗ ██╗    ██╗███╗   ██╗██████╗ ██████╗ ",
      "  ██║ ██╔╝██║     ██╔═══██╗██║    ██║████╗  ██║╚════██╗██╔══██╗",
      "  █████╔╝ ██║     ██║   ██║██║ █╗ ██║██╔██╗ ██║ █████╔╝██║  ██║",
      "  ██╔═██╗ ██║     ██║   ██║██║███╗██║██║╚██╗██║ ╚═══██╗██║  ██║",
      "  ██║  ██╗███████╗╚██████╔╝╚███╔███╔╝██║ ╚████║██████╔╝██████╔╝",
      "  ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚═════╝ ╚═════╝ ",
    ],
    welcome: [
      "╔════════════════════════════════════════════════════════════════╗",
      "║           KLOWN3D BACKEND DEVELOPMENT TERMINAL v3.14          ║",
      "║                  Geronimo Carpignano Systems                  ║",
      "╚════════════════════════════════════════════════════════════════╝",
    ]
  };

  const commands: Record<string, () => string[]> = {
    help: () => [
      "Available commands:",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  help        - Display this help message",
      "  about       - Information about Klown3d",
      "  skills      - List backend technologies and expertise",
      "  projects    - View portfolio projects",
      "  contact     - Get contact information",
      "  clear       - Clear terminal screen",
      "  whoami      - System information",
      "  exit        - Lock terminal (logout)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ],
    about: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                    ABOUT KLOWN3D                              ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "Name: Geronimo Carpignano",
      "Alias: Klown3d",
      "Role: Backend Developer & System Architect",
      "",
      "Specialization:",
      "  → Building scalable backend architectures",
      "  → RESTful & GraphQL API development",
      "  → Microservices & distributed systems",
      "  → Database design & optimization",
      "  → DevOps & containerization",
      "",
      "Philosophy:",
      "  'Code is chaos. Architecture brings order.'",
      "",
      "Status: AVAILABLE FOR PROJECTS",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ],
    skills: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                  BACKEND TECH STACK                           ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "[CORE TECHNOLOGIES]",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  ▸ Node.js            [████████████████████] 95% - Expert",
      "  ▸ Express.js         [████████████████████] 95% - Expert", 
      "  ▸ PostgreSQL         [██████████████████  ] 90% - Advanced",
      "  ▸ MongoDB            [████████████████    ] 80% - Advanced",
      "  ▸ Redis              [██████████████████  ] 90% - Advanced",
      "",
      "[API DEVELOPMENT]",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  ▸ REST APIs          [████████████████████] 95% - Expert",
      "  ▸ GraphQL            [████████████████    ] 80% - Advanced",
      "  ▸ WebSockets         [██████████████████  ] 90% - Advanced",
      "  ▸ gRPC               [██████████████      ] 70% - Intermediate",
      "",
      "[DEVOPS & TOOLS]",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  ▸ Docker             [████████████████████] 95% - Expert",
      "  ▸ Kubernetes         [████████████████    ] 80% - Advanced",
      "  ▸ Nginx              [██████████████████  ] 90% - Advanced",
      "  ▸ CI/CD              [████████████████    ] 85% - Advanced",
      "",
    ],
    projects: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                   PORTFOLIO PROJECTS                          ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "[1] DISTRIBUTED API GATEWAY",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Description: High-performance API gateway handling 10k+ req/s",
      "            with intelligent load balancing and Redis caching.",
      "Tech Stack: Node.js, Redis, Docker, Nginx",
      "Status:     [LIVE] Production",
      "",
      "[2] REAL-TIME DATA PIPELINE",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Description: Event-driven architecture processing streaming data",
      "            with sub-second latency using Kafka.",
      "Tech Stack: Node.js, Kafka, PostgreSQL, WebSockets",
      "Status:     [ACTIVE] Development",
      "",
      "[3] MICROSERVICES ARCHITECTURE",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Description: Scalable microservices ecosystem with service mesh",
      "            and auto-scaling capabilities.",
      "Tech Stack: Node.js, Kubernetes, gRPC, MongoDB",
      "Status:     [DEPLOYED] Production",
      "",
      "[4] AUTHENTICATION SERVICE",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Description: Secure JWT-based auth system with OAuth2, 2FA,",
      "            and comprehensive session management.",
      "Tech Stack: Express, PostgreSQL, Redis, JWT",
      "Status:     [LIVE] Production",
      "",
    ],
    contact: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                   CONTACT INFORMATION                         ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "Email:    geronimo@klown3d.dev",
      "GitHub:   github.com/klown3d",
      "LinkedIn: linkedin.com/in/geronimo-carpignano",
      "",
      "Availability: OPEN TO OPPORTUNITIES",
      "",
      "Response time: Usually within 24 hours",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Feel free to reach out for:",
      "  • Backend development projects",
      "  • System architecture consulting",
      "  • Microservices design",
      "  • API development",
      "  • Technical collaboration",
      "",
    ],
    whoami: () => [
      "System Information:",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "User:          klown3d",
      "System:        KLOWN3D Terminal v3.14",
      "Location:      The Backend Matrix",
      "Access Level:  [FULL_ACCESS]",
      "Session:       Active",
      "Uptime:        ∞ (Always coding)",
      "",
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
    exit: () => {
      setHasAccess(false);
      return ["Logging out...", "Terminal locked."];
    }
  };

  useEffect(() => {
    if (hasAccess && history.length === 0) {
      const welcomeOutput = [
        ...asciiArt.logo,
        "",
        ...asciiArt.welcome,
        "",
        "System initialized successfully.",
        `Session started at ${getTimestamp()}`,
        "",
        "Type 'help' for available commands.",
        "",
      ];
      
      setHistory([{
        command: "",
        output: welcomeOutput,
        timestamp: getTimestamp()
      }]);
    }
  }, [hasAccess]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const timestamp = getTimestamp();

    if (!trimmed) {
      setHistory(prev => [...prev, { command: "", output: [""], timestamp }]);
      return;
    }

    let output: string[] = [];

    if (commands[trimmed]) {
      output = commands[trimmed]();
      if (trimmed !== "clear") {
        setHistory(prev => [...prev, { command: cmd, output, timestamp }]);
      }
    } else {
      output = [
        `'${cmd}' is not recognized as an internal or external command.`,
        "Type 'help' for a list of available commands.",
        ""
      ];
      setHistory(prev => [...prev, { command: cmd, output, timestamp }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  if (!hasAccess) {
    return <TerminalEntry onAccess={() => setHasAccess(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-4 relative overflow-hidden">
      <AudioVisualizer />
      
      {/* Terminal grid background */}
      <div className="fixed inset-0 terminal-grid opacity-30 pointer-events-none" />
      
      {/* Scan line effect */}
      <div className="scan-line fixed inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Terminal header */}
        <div className="mb-4 pb-2 border-b-2 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="ml-4 text-sm text-primary">
                C:\KLOWN3D\PORTFOLIO&gt;
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Session: {new Date().toLocaleDateString()} | Status: CONNECTED
            </div>
          </div>
        </div>

        {/* Terminal output */}
        <div className="space-y-2 mb-4">
          {history.map((entry, idx) => (
            <div key={idx} className="terminal-output">
              {entry.command && (
                <div className="text-primary mb-1">
                  <span className="text-accent">{entry.timestamp}</span> C:\KLOWN3D\PORTFOLIO&gt; {entry.command}
                </div>
              )}
              {entry.output.map((line, lineIdx) => (
                <div 
                  key={lineIdx} 
                  className={`${
                    line.includes("ERROR") || line.includes("DENIED") 
                      ? "text-secondary" 
                      : line.includes("SUCCESS") || line.includes("GRANTED") || line.includes("[LIVE]") || line.includes("[ACTIVE]")
                      ? "text-primary text-glow-green"
                      : line.includes("WARNING")
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t-2 border-primary pt-4">
          <span className="text-primary text-glow-green">
            C:\KLOWN3D\PORTFOLIO&gt;
          </span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background border-none text-foreground font-mono focus:ring-0 focus:outline-none p-0 h-auto text-base"
            placeholder=""
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <span className="text-primary terminal-cursor"></span>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-primary/30 text-xs text-muted-foreground text-center">
          <p>KLOWN3D TERMINAL v3.14 | © 2025 Geronimo Carpignano</p>
          <p className="text-primary">All systems operational | Uptime: 99.99%</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
