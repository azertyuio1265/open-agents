import React, { useState, useEffect } from 'react';
import {
  Bot,
  Terminal,
  Play,
  Pause,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Plus,
  Search,
  Shield,
  Workflow,
  Sparkles,
  Trash2,
  RefreshCw,
  FileText,
  GitBranch,
  Check,
  AlertCircle
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignIn, useUser } from '@clerk/clerk-react';

interface AgentTask {
  id: string;
  title: string;
  agentName: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  progress: number;
  duration: string;
  model: string;
  createdAt: string;
  logs: string[];
}

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  status: 'active' | 'idle' | 'busy';
  tasksCompleted: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'tasks' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [newPrompt, setNewPrompt] = useState('');
  const [selectedAgentForNewTask, setSelectedAgentForNewTask] = useState('Code Architect Pro');

  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: '1',
      name: 'Code Architect Pro',
      role: 'Full-stack system design & component generation',
      model: 'gemini-2.5-flash',
      temperature: 0.2,
      systemPrompt: 'You are an expert full-stack software architect specializing in robust TypeScript, React, and robust architecture.',
      status: 'active',
      tasksCompleted: 142
    },
    {
      id: '2',
      name: 'Security & Linter Auditor',
      role: 'Static analysis, vulnerability scanning, and code hygiene',
      model: 'gemini-2.5-flash',
      temperature: 0.1,
      systemPrompt: 'You audit codebases for security vulnerabilities, memory leaks, type safety issues, and formatting standards.',
      status: 'idle',
      tasksCompleted: 89
    },
    {
      id: '3',
      name: 'Refactor & Test Runner',
      role: 'Automated unit test generation and performance optimization',
      model: 'gemini-2.5-flash',
      temperature: 0.3,
      systemPrompt: 'You write comprehensive unit tests with 95%+ coverage and optimize runtime performance.',
      status: 'busy',
      tasksCompleted: 215
    }
  ]);

  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'task-101',
      title: 'Migrate legacy authentication hooks to Better Auth',
      agentName: 'Code Architect Pro',
      status: 'running',
      progress: 68,
      duration: '1m 24s',
      model: 'gemini-2.5-flash',
      createdAt: '2 mins ago',
      logs: [
        '[00:01] Initializing sandbox environment...',
        '[00:12] Analyzing apps/web/lib/auth directory structure...',
        '[00:35] Refactoring session provider and client hooks...',
        '[00:58] Validating TypeScript types across components...'
      ]
    },
    {
      id: 'task-102',
      title: 'Audit database migration scripts for Drizzle ORM',
      agentName: 'Security & Linter Auditor',
      status: 'completed',
      progress: 100,
      duration: '45s',
      model: 'gemini-2.5-flash',
      createdAt: '15 mins ago',
      logs: [
        '[00:01] Scanning schema.ts and migration files...',
        '[00:20] Verifying foreign key cascade constraints...',
        '[00:45] All Drizzle migration checks passed successfully.'
      ]
    },
    {
      id: 'task-103',
      title: 'Generate end-to-end integration tests for workspace API',
      agentName: 'Refactor & Test Runner',
      status: 'queued',
      progress: 0,
      duration: '-',
      model: 'gemini-2.5-flash',
      createdAt: '1 hour ago',
      logs: ['[Queue] Waiting for available agent worker...']
    }
  ]);

  useEffect(() => {
    if (tasks.length > 0 && !selectedTask) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    const newTask: AgentTask = {
      id: `task-${Date.now().toString().slice(-3)}`,
      title: newPrompt,
      agentName: selectedAgentForNewTask,
      status: 'running',
      progress: 10,
      duration: '5s',
      model: 'gemini-2.5-flash',
      createdAt: 'Just now',
      logs: [
        '[00:00] Task dispatched to ' + selectedAgentForNewTask,
        '[00:02] Sandbox container allocated and secured',
        '[00:04] Executing prompt analysis...'
      ]
    };

    setTasks([newTask, ...tasks]);
    setSelectedTask(newTask);
    setNewPrompt('');
  };

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-[#0f1117] text-[#e1e4e8] font-sans antialiased flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#161b22] border border-[#21262d] rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Open Agents Studio</h1>
            <p className="text-slate-400 text-sm mb-6 text-center">
              Sign in with your preferred authentication method (Google, GitHub, Email, Passkey) to access autonomous coding agents and sandbox orchestrator.
            </p>
            <div className="w-full flex justify-center">
              <SignIn routing="hash" appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full p-0",
                  headerTitle: "text-white text-lg",
                  headerSubtitle: "text-slate-400 text-xs",
                  socialButtonsBlockButton: "bg-[#21262d] border-[#30363d] text-white hover:bg-[#30363d]",
                  formFieldInput: "bg-[#0f1117] border-[#30363d] text-white",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
                  footerActionLink: "text-indigo-400 hover:text-indigo-300"
                }
              }} />
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-[#0f1117] text-[#e1e4e8] font-sans antialiased flex flex-col">
          {/* Top Header */}
          <header className="border-b border-[#21262d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold tracking-tight text-white">Open Agents Studio</h1>
                  <span className="text-xs bg-indigo-500/20 text-indigo-400 font-medium px-2 py-0.5 rounded-full border border-indigo-500/30">
                    v2.5 Live
                  </span>
                </div>
                <p className="text-xs text-slate-400">Autonomous background coding agents & sandbox orchestrator</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#30363d] text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cluster Status: Healthy</span>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-300 transition-colors border border-[#30363d]"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <div className="flex items-center pl-2 border-l border-[#30363d]">
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-indigo-500/30"
                  }
                }} />
              </div>
            </div>
          </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#21262d] bg-[#161b22] p-4 flex flex-col justify-between">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Active Agents</span>
              <span className="ml-auto bg-[#30363d] text-xs px-2 py-0.5 rounded-full text-slate-300">
                {agents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Task Queue & Logs</span>
              <span className="ml-auto bg-[#30363d] text-xs px-2 py-0.5 rounded-full text-slate-300">
                {tasks.length}
              </span>
            </button>
          </nav>

          <div className="p-3 bg-[#21262d]/50 rounded-xl border border-[#30363d] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sandbox CPU</span>
              <span className="text-emerald-400 font-mono">14%</span>
            </div>
            <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[14%]"></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Memory Usage</span>
              <span className="text-indigo-400 font-mono">1.2 GB / 8 GB</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0f1117] p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Active Agents</span>
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All workers online
                  </p>
                </div>

                <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Running Tasks</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1</div>
                  <p className="text-xs text-amber-400 mt-1">Executing background job</p>
                </div>

                <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Completed Tasks</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">446</div>
                  <p className="text-xs text-slate-400 mt-1">+24 in last 24h</p>
                </div>

                <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Token Efficiency</span>
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">99.4%</div>
                  <p className="text-xs text-violet-400 mt-1">Gemini 2.5 Flash optimized</p>
                </div>
              </div>

              {/* Launch Task Card */}
              <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                  Dispatch New Agent Task
                </h2>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="Describe the coding task (e.g. Refactor API error handling and add unit tests)..."
                      className="w-full bg-[#0f1117] border border-[#30363d] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="text-xs text-slate-400">Assign Agent:</label>
                      <select
                        value={selectedAgentForNewTask}
                        onChange={(e) => setSelectedAgentForNewTask(e.target.value)}
                        className="bg-[#0f1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {agents.map(a => (
                          <option key={a.id} value={a.name}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Agent Execution</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Tasks List */}
              <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-white">Active & Recent Task Queue</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full bg-[#0f1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedTask?.id === task.id
                          ? 'bg-[#21262d] border-indigo-500/50'
                          : 'bg-[#0f1117] border-[#21262d] hover:border-[#30363d]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-slate-400">{task.id}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            task.status === 'running'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : task.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-white">{task.title}</h3>
                        <p className="text-xs text-slate-400">Agent: <span className="text-indigo-400">{task.agentName}</span> • {task.createdAt}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-xs font-mono text-slate-300">{task.progress}%</span>
                        <div className="w-24 bg-[#161b22] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Configured Autonomous Agents</h2>
                  <p className="text-xs text-slate-400">Specialized agent instances powered by Gemini 2.5 Flash</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create Agent</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          {agent.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{agent.role}</p>
                      </div>
                      <div className="p-3 bg-[#0f1117] rounded-xl border border-[#21262d] text-xs font-mono text-slate-300">
                        Model: {agent.model} (temp: {agent.temperature})
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[#21262d] flex items-center justify-between text-xs text-slate-400">
                      <span>Completed: <strong className="text-white">{agent.tasksCompleted} tasks</strong></span>
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium">Configure →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Task History</h2>
                <div className="space-y-2">
                  {tasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedTask?.id === t.id ? 'bg-[#21262d] border-indigo-500' : 'bg-[#0f1117] border-[#21262d]'
                      }`}
                    >
                      <div className="text-xs font-mono text-slate-400">{t.id}</div>
                      <div className="text-sm font-medium text-white truncate">{t.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{t.agentName}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 flex flex-col">
                <h2 className="text-base font-semibold text-white mb-4">Execution Output & Terminal Logs</h2>
                {selectedTask ? (
                  <div className="flex-1 bg-[#0f1117] border border-[#21262d] rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto max-h-[500px]">
                    <div className="text-indigo-400 font-bold mb-2"># Task: {selectedTask.title}</div>
                    <div className="text-slate-500 mb-4">Agent: {selectedTask.agentName} | Duration: {selectedTask.duration}</div>
                    {selectedTask.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-slate-600">&gt;</span>
                        <span className="text-slate-200">{log}</span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2 text-emerald-400 mt-4">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sandbox execution stream active</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                    Select a task to view execution logs
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-[#161b22] border border-[#21262d] rounded-2xl p-8 space-y-6">
              <h2 className="text-lg font-semibold text-white">Open Agents Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gemini API Integration</label>
                  <input
                    type="password"
                    disabled
                    value="****************************************"
                    className="w-full bg-[#0f1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Managed securely via AI Studio environment secrets.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sandbox Container Timeout</label>
                  <select className="w-full bg-[#0f1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white">
                    <option>15 Minutes (Default)</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Default Agent Model</label>
                  <select className="w-full bg-[#0f1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white">
                    <option>gemini-2.5-flash (Recommended)</option>
                    <option>gemini-1.5-pro</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  </SignedIn>
</>
  );
}
