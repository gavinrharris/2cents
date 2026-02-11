import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { aiResponses } from "@/lib/mockData";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hi! I'm your AI financial advisor. Ask me anything about your budget, savings, or spending habits.", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-10rem)] flex-col rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <h1 className="font-semibold">AI Financial Advisor</h1>
          <p className="text-xs text-muted-foreground">Ask me anything about your finances</p>
        </div>

        <ScrollArea className="flex-1 px-5 py-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
