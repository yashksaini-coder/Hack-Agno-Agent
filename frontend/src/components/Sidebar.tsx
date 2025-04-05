
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, RefreshCw, ChevronDown, 
  Settings, User, Terminal, MoreVertical 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  name: string;
  messages: any[];
  createdAt: Date;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  setActiveSessionId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  createNewSession,
  deleteSession,
  renameSession,
  setActiveSessionId
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [endpoint, setEndpoint] = useState("http://127.0.0.1:8000/agent");
  const [selectedAgent, setSelectedAgent] = useState("Multi AI AGENT");

  const startRenaming = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditName(session.name);
  };

  const handleRename = (id: string) => {
    renameSession(id, editName);
    setEditingSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleRename(id);
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
    }
  };

  return (
    <aside className="w-[276px] bg-[#111111] border-r border-gray-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 text-white p-1 rounded">
            <Terminal size={16} />
          </div>
          <span className="font-bold text-white">AGENT UI</span>
        </div>
        <span className="text-red-500">Demo</span>
      </div>

      <Button 
        onClick={createNewSession}
        className="mx-4 my-4 bg-gray-800 hover:bg-gray-700 text-white"
      >
        <PlusCircle size={16} className="mr-2" /> NEW CHAT
      </Button>

      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">ENDPOINT</h3>
        <div className="flex items-center space-x-2 p-2 rounded bg-gray-900 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {endpoint}
          </div>
          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
            <RefreshCw size={12} />
          </Button>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">AGENT</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-gray-900 hover:bg-gray-800 text-white border-gray-700",
              selectedAgent === "BASIC AGENT" && "border-red-500"
            )}
            onClick={() => setSelectedAgent("BASIC AGENT")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-2 bg-red-600 rounded">
                <Terminal size={14} />
              </div>
              <span>BASIC AGENT</span>
            </div>
            <ChevronDown size={16} />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-between bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
            onClick={() => setSelectedAgent("OPENAI GPT-4O-MINI")}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center mr-2 bg-gray-700 rounded">
                <User size={14} />
              </div>
              <span>OPENAI GPT-4O-MINI</span>
            </div>
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 flex-1 overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">SESSIONS</h3>
        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)]">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className={cn(
                "group p-2 rounded flex items-center justify-between",
                session.id === activeSessionId 
                  ? "bg-gray-800 text-white" 
                  : "hover:bg-gray-800 text-gray-400"
              )}
            >
              <div 
                className="flex-1 overflow-hidden cursor-pointer"
                onClick={() => setActiveSessionId(session.id)}
              >
                {editingSessionId === session.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRename(session.id)}
                    onKeyDown={(e) => handleKeyDown(e, session.id)}
                    className="h-6 py-1 px-2"
                    autoFocus
                  />
                ) : (
                  <div className="text-sm truncate">{session.name}</div>
                )}
              </div>
              
              {session.id === activeSessionId && !editingSessionId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 text-white border-gray-700">
                    <DropdownMenuItem onClick={() => startRenaming(session)}>
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500" 
                      onClick={() => deleteSession(session.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
