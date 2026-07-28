import { useState } from "react";
import {
    Bot,
    Send,
    User,
    Sparkles,
} from "lucide-react";

import { askOrganizationAssistant } from "../../services/aiService";
import { getApiErrorMessage } from "../../utils/responseUtils";

const suggestions = [
    "Who was the top performer today?",
    "Who used YouTube the most today?",
    "Show employees below 50% productivity.",
    "Generate today's summary.",
    "Which websites were visited the most?",
    "Who worked the longest today?",
];

function ChatWindow() {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text:
                "Hi! I'm FocusGuard AI.\n\n" +
                "I can answer questions about employees, productivity, website usage, analytics and organization reports.\n\n" +
                "Choose one of the suggestions below or ask your own question.",
        },
    ]);

    const [loading, setLoading] = useState(false);

    const handleSend = async (text = message) => {
        const question = text.trim();

        if (!question || loading) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: question,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const data = await askOrganizationAssistant(question);
            const answer = data?.response;

            if (!answer) {
                throw new Error(
                    "Organization Admin AI response was empty or malformed."
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: answer,
                    provider: data.provider,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: getApiErrorMessage(
                        error,
                        error?.message ||
                            "The Organization Admin AI Assistant is currently unavailable."
                    ),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-blue-600 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Bot
                            size={30}
                            className="text-white"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            FocusGuard AI
                        </h1>

                        <p className="text-indigo-100">
                            Organization Assistant
                        </p>
                    </div>
                </div>

                <div className="rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-8 space-y-8">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        {msg.sender === "ai" ? (
                            <div className="flex gap-4 max-w-4xl">
                                <div className="h-11 w-11 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                    <Bot
                                        size={20}
                                        className="text-white"
                                    />
                                </div>

                                <div className="rounded-3xl bg-white border border-slate-200 shadow px-6 py-5">
                                    <p className="text-slate-700 whitespace-pre-line leading-8">
                                        {msg.text}
                                    </p>

                                    {msg.provider && (
                                        <p className="mt-3 text-xs font-semibold uppercase text-slate-400">
                                            Answered by {msg.provider}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-3xl bg-indigo-600 text-white px-6 py-5 shadow flex items-center gap-3 max-w-3xl">
                                <User size={18} />

                                <p>{msg.text}</p>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-4 max-w-4xl">
                            <div className="h-11 w-11 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <Bot
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <div className="rounded-3xl bg-white border border-slate-200 shadow px-6 py-5 text-slate-500">
                                Analyzing organization data...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {messages.length === 1 && (
                <div className="border-t bg-white px-8 py-5">
                    <h3 className="font-semibold text-slate-700 mb-4">
                        Suggested Questions
                    </h3>

                    <div className="flex flex-wrap justify-center gap-3">
                        {suggestions.map((item) => (
                            <button
                                key={item}
                                onClick={() => handleSend(item)}
                                className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 px-5 py-3 transition"
                            >
                                <Sparkles
                                    size={15}
                                    className="text-indigo-600"
                                />

                                <span className="text-sm">
                                    {item}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t bg-white px-8 py-6">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="Ask anything about your organization..."
                        className="flex-1 rounded-2xl border border-slate-300 px-6 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={loading}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition text-white px-7 py-4 flex items-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send size={18} />

                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
