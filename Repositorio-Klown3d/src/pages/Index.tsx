import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import TerminalEntry from "@/components/TerminalEntry";


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
      " ██╗  ██╗██╗      ██████╗ ██╗    ██╗███╗   ██╗██████╗ ██████╗ ",
      " ██║ ██╔╝██║     ██╔═══██╗██║    ██║████╗  ██║╚════██╗██╔══██╗",
      " █████╔╝ ██║     ██║   ██║██║ █╗ ██║██╔██╗ ██║ █████╔╝██║  ██║",
      " ██╔═██╗ ██║     ██║   ██║██║███╗██║██║╚██╗██║ ╚═══██╗██║  ██║",
      " ██║  ██╗███████╗╚██████╔╝╚███╔███╔╝██║ ╚████║██████╔╝██████╔╝",
      " ╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚═════╝ ╚═════╝ ",
    ],
    welcome: [
      "╔════════════════════════════════════════════════════════════════╗",
      "║                TERMINAL KLOWN3D v3.14                         ║",
      "║                  Geronimo Carpignano                          ║",
      "╚════════════════════════════════════════════════════════════════╝",
    ]
  };

  const commands: Record<string, () => string[]> = {
    help: () => [
      "Comandos disponibles:",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  help        - Muestra este mensaje",
      "  about       - Información sobre mí",
      "  skills      - Tecnologías que manejo",
      "  projects    - Mis proyectos",
      "  contact     - Cómo contactarme",
      "  clear       - Limpiar pantalla",
      "  whoami      - Información del sistema",
      "  exit        - Cerrar sesión",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ],
    about: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                         SOBRE MÍ                             ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "Nombre: Geronimo Carpignano",
      "Alias: Klown3d",
      "Rol: Backend Developer",
      "",
      "Me especializo en:",
      "  → Backends escalables",
      "  → Bases de datos",
      "  → Inteligencia Artificial",
      "",
      "Filosofía:",
      "  'Si funciona, dejalo'",
      "",
      "Estado: In Coding",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ],
    skills: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                    TECNOLOGÍAS                               ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "[TECNOLOGÍAS PRINCIPALES]",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  ▸ Node.js            [██████████████      ] 65%",
      "  ▸ Tensorflow         [███████████████     ] 70%",
      "  ▸ Supabase           [█████████████████   ] 80%",
      "  ▸ Redis              [██████████████████  ] 90%",
      "",
    ],
    projects: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                      PROYECTOS                               ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "[1] KIOSCO VIRTUAL",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Descripción: Sistema de pedidos para kiosco con gestión",
      "             de inventario y reportes en tiempo real.",
      "Tech Stack: Node.js, SQLite, JavaScript",
      "Estado:     [Finalizado]",
      "Link:       <a href='https://github.com/mercedesduarte/superluna' target='_blank' class='text-primary hover:underline'>Visitar Proyecto</a>",
      "",
      "[2] E-COMMERCE",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Descripción: Plataforma de e-commerce completa con carrito,",
      "             pasarela de pagos y panel administrativo.",
      "Tech Stack: Node.js, React, JWT, Django",
      "Estado:     [Finalizado]",
      "Link:       <a href='https://github.com/Klown3d/ViajaYa' target='_blank' class='text-primary hover:underline'>Visitar Proyecto</a>",
      "",
      "[3] SISTEMA SUPERMERCADO",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Descripción: Backend para gestión de supermercado con",
      "             control de stock y ventas.",
      "Tech Stack: Node.js, React, Django, JWT",
      "Estado:     [Finalizado]",
      "Link:       <a href='https://github.com/Klown3d/TrabajoGianChino' target='_blank' class='text-primary hover:underline'>Visitar Proyecto</a>",
      "",
      "[4] PLATAFORMA COLEGIO",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Descripción: Landing page escuela tecnica 7,",
      "Tech Stack: Html, JavaScript",
      "Estado:     [Finalizado]",
      "Link:       <a href='https://github.com/Klown3d/EscuelaPagina' target='_blank' class='text-primary hover:underline'>Visitar Proyecto</a>",
      "",
    ],
    contact: () => [
      "╔═══════════════════════════════════════════════════════════════╗",
      "║                    CONTACTO                                   ║",
      "╚═══════════════════════════════════════════════════════════════╝",
      "",
      "Email:    <a href='mailto:CarpignanoGeronimo@gmail.com' class='text-primary hover:underline'>CarpignanoGeronimo@gmail.com</a>",
      "GitHub:   <a href='https://github.com/Klown3d' target='_blank' class='text-primary hover:underline'>github.com/klown3d</a>",
      "LinkedIn: <a href='https://www.linkedin.com/in/geronimo-carpignano-70597432b' target='_blank' class='text-primary hover:underline'>linkedin.com/in/geronimo-carpignano</a>",
      "Instagram: <a href='https://www.instagram.com/geronimo.carpig' target='_blank' class='text-primary hover:underline'>@geronimocarpignano</a>",
      "",
      "Disponibilidad: Esperando por vos",
      "",
      "Tiempo de respuesta: A vos? en 5 minutos",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Puedes contactarme para:",
      "  • Desarrollo backend",
      "  • Arquitectura de sistemas",
      "  • Colaboraciones técnicas",
      "",
    ],
    whoami: () => [
      "Información del sistema:",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Usuario:          klown3d",
      "Sistema:          Terminal KLOWN3D v3.14",
      "Ubicación:        The BlaCKwAlL",
      "Nivel de acceso:  [ACCESO_TOTAL]",
      "Sesión:           Activa",
      "Uptime:           ∞",
      "",
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
    exit: () => {
      setHasAccess(false);
      return ["Cerrando sesión...", "Terminal bloqueado."];
    }
  };

  useEffect(() => {
    if (hasAccess && history.length === 0) {
      const welcomeOutput = [
        ...asciiArt.logo,
        "",
        ...asciiArt.welcome,
        "",
        "Sistema inicializado correctamente.",
        `Sesión iniciada a las ${getTimestamp()}`,
        "",
        "Escribe 'help' para ver los comandos disponibles.",
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
        `'${cmd}' no se reconoce como un comando interno o externo.`,
        "Escribe 'help' para ver la lista de comandos disponibles.",
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

      
      <div className="fixed inset-0 terminal-grid opacity-30 pointer-events-none" />
      
      <div className="scan-line fixed inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
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
              Sesión: {new Date().toLocaleDateString()} | Estado: CONECTADO
            </div>
          </div>
        </div>

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
                    line.includes("ERROR") || line.includes("DENEGADO") 
                      ? "text-secondary" 
                      : line.includes("ÉXITO") || line.includes("PERMITIDO") || line.includes("[EN PRODUCCIÓN]") || line.includes("[EN DESARROLLO]") || line.includes("[Finalizado]")
                      ? "text-primary text-glow-green"
                      : line.includes("ADVERTENCIA")
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

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

        <div className="mt-8 pt-4 border-t border-primary/30 text-xs text-muted-foreground text-center">
          <p>TERMINAL KLOWN3D v3.14</p>
          <p className="text-primary">Todos los sistemas operativos | Uptime: 99.99%</p>
        </div>
      </div>
    </div>
  );
};

export default Index;