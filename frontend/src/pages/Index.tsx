import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import EmptyState from "@/components/EmptyState";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

const Index = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [sessions, setSessions] = useSessionStorage<ChatSession[]>("chat-sessions", []);
  const [activeSessionId, setActiveSessionId] = useSessionStorage<string | null>("active-session-id", null);

  const activeSession = sessions.find(session => session.id === activeSessionId) || null;

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions.length]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date()
    };
    
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !activeSessionId) return;
    
    const newMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage]
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/agent?query=${encodeURIComponent(inputMessage)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      const responseMessage: Message = {
        id: generateId(),
        role: "system",
        content: data.answer,
        timestamp: new Date()
      };

      const finalUpdatedSessions = sessions.map(session => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            messages: [...session.messages, responseMessage]
          };
        }
        return session;
      });

      setSessions(finalUpdatedSessions);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again."
      });
      
      const errorSessions = sessions.map(session => {
        if (session.id === activeSessionId) {
          const errorMessage: Message = {
            id: generateId(),
            role: "system",
            content: "Network error. Please check your connection to the backend server.",
            timestamp: new Date()
          };
          return {
            ...session,
            messages: [...session.messages, errorMessage]
          };
        }
        return session;
      });
      
      setSessions(errorSessions);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    
    // If we're deleting the active session, set the first available session as active
    if (sessionId === activeSessionId) {
      setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
  };

  const renameSession = (sessionId: string, newName: string) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return { ...session, name: newName };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId || ""}
        createNewSession={createNewSession}
        deleteSession={deleteSession}
        renameSession={renameSession}
        setActiveSessionId={setActiveSessionId}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {activeSession && activeSession.messages.length > 0 ? (
            <div className="space-y-4 pb-20">
              {activeSession.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center ml-12 text-gray-400">
                  <div className="mr-2">Agent is typing</div>
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
        
        <form 
          onSubmit={sendMessage}
          className="p-4 border-t border-gray-800 bg-[#111111] sticky bottom-0"
        >
          <div className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything"
              disabled={isLoading || !activeSessionId}
              className="bg-gray-900 border-gray-700 focus-visible:ring-gray-600 text-white"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !inputMessage.trim() || !activeSessionId}
              className="bg-gray-800 hover:bg-gray-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Index;
