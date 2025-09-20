import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ScanResult {
  id: number;
  type: "info" | "scan" | "warning" | "error" | "success";
  message: string;
  delay: number;
}

const scanResults: ScanResult[] = [
  { id: 1, type: "info", message: ">> INITIALIZING QUANTUM SCANNER v3.2.1", delay: 500 },
  { id: 2, type: "info", message: ">> Loading neural network modules...", delay: 1000 },
  { id: 3, type: "success", message: ">> [OK] Core systems online", delay: 1500 },
  { id: 4, type: "scan", message: ">> Scanning network topology...", delay: 2000 },
  { id: 5, type: "info", message: "   └─ Found 127 active nodes", delay: 2500 },
  { id: 6, type: "scan", message: ">> Probing security protocols...", delay: 3000 },
  { id: 7, type: "warning", message: "   └─ [WARN] Weak encryption detected: 192.168.1.1", delay: 3500 },
  { id: 8, type: "scan", message: ">> Analyzing packet streams...", delay: 4000 },
  { id: 9, type: "success", message: "   └─ [OK] Clean traffic patterns", delay: 4500 },
  { id: 10, type: "scan", message: ">> Deep packet inspection initiated...", delay: 5000 },
  { id: 11, type: "info", message: "   ├─ HTTP/2 protocols: 89%", delay: 5500 },
  { id: 12, type: "info", message: "   ├─ TLS 1.3 encryption: 67%", delay: 6000 },
  { id: 13, type: "warning", message: "   └─ [WARN] Legacy SSL detected: 12%", delay: 6500 },
  { id: 14, type: "scan", message: ">> Port scanning in progress...", delay: 7000 },
  { id: 15, type: "info", message: "   ├─ Open ports found: 22, 80, 443, 8080", delay: 7500 },
  { id: 16, type: "error", message: "   └─ [ALERT] Suspicious activity on port 31337", delay: 8000 },
  { id: 17, type: "scan", message: ">> Running vulnerability assessment...", delay: 8500 },
  { id: 18, type: "success", message: "   └─ [OK] No critical vulnerabilities found", delay: 9000 },
  { id: 19, type: "info", message: ">> Scan completed successfully", delay: 9500 },
  { id: 20, type: "success", message: ">> System status: SECURE", delay: 10000 },
];

const progressChars = ["▱", "▰"];

export const TerminalScanner = () => {
  const [displayedResults, setDisplayedResults] = useState<ScanResult[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLine < scanResults.length) {
        setDisplayedResults(prev => [...prev, scanResults[currentLine]]);
        setCurrentLine(prev => prev + 1);
        setScanProgress((currentLine + 1) / scanResults.length * 100);
      } else {
        setIsScanning(false);
      }
    }, scanResults[currentLine]?.delay || 500);

    return () => clearTimeout(timer);
  }, [currentLine]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  const getLineStyle = (type: ScanResult["type"]) => {
    switch (type) {
      case "scan":
        return "terminal-scan";
      case "warning":
        return "terminal-warning";
      case "error":
        return "text-terminal-error";
      case "success":
        return "text-terminal-success";
      default:
        return "terminal-text";
    }
  };

  const renderProgressBar = (progress: number) => {
    const totalBars = 40;
    const filledBars = Math.floor((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    
    return (
      <div className="terminal-scan">
        [{"▰".repeat(filledBars)}{"▱".repeat(emptyBars)}] {progress.toFixed(0)}%
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line"></div>
      
      {/* Background matrix effect */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary font-mono text-xs animate-matrix-rain"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      <Card className="max-w-4xl mx-auto mt-8 p-6 bg-card border-primary shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="terminal-text text-xl font-bold mb-2 animate-glow-pulse">
            ╔══════════════════════════════════════════════╗
          </div>
          <div className="terminal-text text-xl font-bold mb-2 animate-glow-pulse">
            ║           QUANTUM NETWORK SCANNER            ║
          </div>
          <div className="terminal-text text-xl font-bold mb-4 animate-glow-pulse">
            ╚══════════════════════════════════════════════╝
          </div>
          
          {/* System info */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="terminal-text">
              <div>System: QuantumOS v3.2.1</div>
              <div>User: root@quantum-scanner</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
            </div>
            <div className="terminal-scan">
              <div>Memory: 15.7GB / 32GB</div>
              <div>CPU: 87% (Neural Processing)</div>
              <div>Network: 1.2 Gbps</div>
            </div>
          </div>

          {/* Progress bar */}
          {isScanning && (
            <div className="mb-4">
              <div className="terminal-text mb-2">Scan Progress:</div>
              {renderProgressBar(scanProgress)}
            </div>
          )}
        </div>

        {/* Terminal output */}
        <div className="bg-muted p-4 rounded border border-primary/30 min-h-96 max-h-96 overflow-y-auto">
          {displayedResults.map((result, index) => (
            <div
              key={result.id}
              className={`font-mono text-sm mb-1 ${getLineStyle(result.type)} animate-glow-pulse`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {result.message}
            </div>
          ))}
          
          {/* Blinking cursor */}
          {isScanning && (
            <div className="font-mono text-sm terminal-text inline-flex items-center">
              {showCursor && <span className="terminal-cursor">_</span>}
            </div>
          )}
          
          {/* Final status */}
          {!isScanning && (
            <div className="mt-4">
              <div className="terminal-text font-mono text-sm mb-2">
                ╔═══════════════════════════════════════╗
              </div>
              <div className="terminal-success font-mono text-sm mb-2">
                ║  SCAN COMPLETE - SYSTEM OPERATIONAL   ║
              </div>
              <div className="terminal-text font-mono text-sm mb-4">
                ╚═══════════════════════════════════════╝
              </div>
              <div className="terminal-scan font-mono text-sm">
                root@quantum-scanner:~$ {showCursor && <span className="terminal-cursor">_</span>}
              </div>
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="mt-4 flex justify-between items-center text-xs">
          <div className="flex space-x-4">
            <div className="terminal-success">◉ SECURE</div>
            <div className="terminal-scan">◉ SCANNING</div>
            <div className="terminal-warning">◉ MONITORING</div>
          </div>
          <div className="terminal-text">
            Quantum Scanner © 2024 - Neural Network Defense System
          </div>
        </div>
      </Card>
    </div>
  );
};