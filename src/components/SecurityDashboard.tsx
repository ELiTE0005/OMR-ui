import { useState } from "react";
import { TerminalScanner } from "./TerminalScanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Database,
  Network,
  Lock,
  Eye,
  Terminal,
  Server
} from "lucide-react";

interface ScannerMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const scannerModes: ScannerMode[] = [
  {
    id: "deep-scan",
    name: "Deep Vulnerability Scan",
    description: "Comprehensive security analysis",
    icon: Shield,
    color: "terminal-scan"
  },
  {
    id: "network-scan",
    name: "Network Topology Scan",
    description: "Map network infrastructure",
    icon: Network,
    color: "terminal-text"
  },
  {
    id: "port-scan",
    name: "Port Security Scan",
    description: "Analyze open ports and services",
    icon: Database,
    color: "terminal-warning"
  },
  {
    id: "malware-scan",
    name: "Malware Detection",
    description: "Real-time threat analysis",
    icon: AlertTriangle,
    color: "text-terminal-error"
  }
];

export const SecurityDashboard = () => {
  const [currentMode, setCurrentMode] = useState("deep-scan");
  const [isScanning, setIsScanning] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const systemMetrics = [
    { label: "Threats Detected", value: "0", status: "success" },
    { label: "Vulnerabilities", value: "2", status: "warning" },
    { label: "Active Scans", value: "1", status: "active" },
    { label: "System Status", value: "SECURE", status: "success" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "terminal-success";
      case "warning": return "terminal-warning";
      case "active": return "terminal-scan";
      default: return "terminal-text";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`bg-card border-r border-primary/30 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-80"
      }`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!sidebarCollapsed && (
              <div className="terminal-text">
                <h1 className="text-xl font-bold animate-glow-pulse">QUANTUM SECURITY</h1>
                <p className="text-sm terminal-scan">Neural Defense System</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="terminal-text hover:bg-primary/10"
            >
              <Terminal className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          {!sidebarCollapsed && (
            <Card className="bg-muted border-primary/20 p-4 mb-6">
              <h3 className="terminal-text text-sm font-semibold mb-3">SYSTEM STATUS</h3>
              <div className="space-y-2">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs terminal-text">{metric.label}</span>
                    <Badge className={`${getStatusColor(metric.status)} bg-transparent border text-xs`}>
                      {metric.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Scanner Modes */}
          <div className="space-y-2">
            {!sidebarCollapsed && (
              <h3 className="terminal-text text-sm font-semibold mb-3">SCAN MODES</h3>
            )}
            {scannerModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={currentMode === mode.id ? "secondary" : "ghost"}
                  className={`w-full justify-start p-3 h-auto ${
                    currentMode === mode.id ? "bg-primary/10 border-primary/30" : "hover:bg-primary/5"
                  }`}
                  onClick={() => setCurrentMode(mode.id)}
                >
                  <Icon className={`h-4 w-4 ${mode.color} ${sidebarCollapsed ? "mr-0" : "mr-3"}`} />
                  {!sidebarCollapsed && (
                    <div className="text-left">
                      <div className="terminal-text text-sm font-medium">{mode.name}</div>
                      <div className="terminal-scan text-xs">{mode.description}</div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="mt-6 space-y-2">
              <h3 className="terminal-text text-sm font-semibold mb-3">QUICK ACTIONS</h3>
              <Button variant="outline" size="sm" className="w-full justify-start terminal-text border-primary/30">
                <Settings className="h-4 w-4 mr-2" />
                System Config
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start terminal-text border-primary/30">
                <Eye className="h-4 w-4 mr-2" />
                View Logs
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start terminal-text border-primary/30">
                <Server className="h-4 w-4 mr-2" />
                Server Status
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-card border-b border-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="terminal-text">
                <h2 className="text-lg font-semibold">Active Scanner: {scannerModes.find(m => m.id === currentMode)?.name}</h2>
                <p className="text-sm terminal-scan">Real-time security monitoring active</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsScanning(!isScanning)}
                className="terminal-text border-primary/30"
              >
                {isScanning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isScanning ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="terminal-scan border-accent/30"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Scan
              </Button>
            </div>
          </div>
        </div>

        {/* Scanner Display */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Main Scanner - Takes 3 columns */}
            <div className="lg:col-span-3">
              <TerminalScanner />
              
              {/* Action Buttons Below Scanner */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Zap className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="terminal-scan border-accent/30">
                  <Activity className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
                <Button variant="outline" className="terminal-warning border-destructive/30">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Security Alerts
                </Button>
                <Button variant="outline" className="terminal-text border-primary/30">
                  <Lock className="h-4 w-4 mr-2" />
                  Access Control
                </Button>
              </div>
            </div>

            {/* Right Panel - 1 column */}
            <div className="space-y-6">
              {/* Real-time Threats */}
              <Card className="bg-card border-primary/30 p-4">
                <h3 className="terminal-text font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-terminal-error" />
                  THREAT MONITOR
                </h3>
                <div className="space-y-2">
                  <div className="text-xs terminal-success flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2" />
                    No active threats
                  </div>
                  <div className="text-xs terminal-warning flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    2 minor vulnerabilities
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="text-xs terminal-scan">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </Card>

              {/* Network Status */}
              <Card className="bg-card border-primary/30 p-4">
                <h3 className="terminal-text font-semibold mb-3 flex items-center">
                  <Network className="h-4 w-4 mr-2 terminal-scan" />
                  NETWORK STATUS
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="terminal-text">Active Nodes</span>
                    <span className="terminal-success">127</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="terminal-text">Bandwidth</span>
                    <span className="terminal-scan">1.2 Gbps</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="terminal-text">Latency</span>
                    <span className="terminal-success">12ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="terminal-text">Security</span>
                    <span className="terminal-success">SECURE</span>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-primary/30 p-4">
                <h3 className="terminal-text font-semibold mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2 terminal-scan" />
                  ACTIVITY LOG
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="terminal-success">✓ Port scan completed</div>
                  <div className="terminal-scan">◦ Deep scan in progress</div>
                  <div className="terminal-warning">⚠ SSL warning detected</div>
                  <div className="terminal-success">✓ System update applied</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};