import { useEffect, useMemo, useState } from "react";
import {
    Bot,
    Send,
    User,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import { askOrganizationAssistant } from "../../services/aiService";
import { getApiErrorMessage } from "../../utils/responseUtils";

function ChatWindow() {
    const { currentLanguageCode, t } = useLanguage();

    const welcomeMessage = useMemo(
        () =>
            t("focusguard_ai_greeting", "Hi! I'm FocusGuard AI.") +
            "\n\n" +
            t(
                "focusguard_ai_description",
                "I can answer questions about employees, productivity, website usage, analytics and organization reports."
            ) +
            "\n\n" +
            t(
                "focusguard_ai_prompt",
                "Choose one of the suggestions below or ask your own question."
            ),
        [t]
    );

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: welcomeMessage,
        },
    ]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessages((currentMessages) => {
            if (
                currentMessages.length !== 1 ||
                currentMessages[0]?.sender !== "ai"
            ) {
                return currentMessages;
            }

            return [{ sender: "ai", text: welcomeMessage }];
        });
    }, [welcomeMessage]);

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
            const data = await askOrganizationAssistant(
                question,
                currentLanguageCode
            );
            const answer = data?.response;

            if (!answer) {
                throw new Error(
                    t(
                        "organization_ai_empty_response",
                        "Organization Admin AI response was empty or malformed."
                    )
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
                            t(
                                "organization_ai_unavailable",
                                "The Organization Admin AI Assistant is currently unavailable."
                            )
                    ),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-full min-h-[70vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
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
                            {t(
                                "focusguard_ai",
                                "FocusGuard AI"
                            )}
                        </h1>

                        <p className="text-indigo-100">
                            {t(
                                "organization_assistant",
                                "Organization Assistant"
                            )}
                        </p>
                    </div>
                </div>

                <div className="rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                    {new Date().toLocaleDateString(
                        currentLanguageCode
                    )}
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
                                            {t(
                                                "answered_by",
                                                "Answered by"
                                            )}{" "}
                                            {msg.provider}
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
                                {t(
                                    "analyzing_organization_data",
                                    "Analyzing organization data..."
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                        placeholder={t(
                            "ask_anything_about_organization",
                            "Ask anything about your organization..."
                        )}
                        className="flex-1 rounded-2xl border border-slate-300 px-6 py-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={loading}
                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition text-white px-7 py-4 flex items-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send size={18} />

                        {loading
                            ? t(
                                  "sending",
                                  "Sending..."
                              )
                            : t(
                                  "send",
                                  "Send"
                              )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
