import { useEffect, useMemo, useRef, useState } from "react";
import {
    Bot,
    Send,
    User,
    CheckCircle2,
    Trash2,
} from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
    askOrganizationAssistant,
    clearOrganizationChatHistory,
    getOrganizationChatHistory,
} from "../../services/aiService";
import { getApiErrorMessage } from "../../utils/responseUtils";

const SUGGESTED_PROMPTS = [
    "Top productive employees",
    "Most visited websites",
    "Organization productivity today",
    "Inactive employees",
    "Generate summary",
];

const CAPABILITIES = [
    "Employee analytics",
    "Productivity insights",
    "Website usage",
    "Reports",
    "Organization statistics",
];

const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

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

    const getDefaultMessages = () => [{ sender: "ai", text: welcomeMessage }];
    const [selectedDate, setSelectedDate] = useState(getLocalDate);
    const [messages, setMessages] = useState(getDefaultMessages);

    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const scrollRef = useRef(null);

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

    useEffect(() => {
        let isCurrent = true;

        const loadHistory = async () => {
            setLoadingHistory(true);
            try {
                const history = await getOrganizationChatHistory(selectedDate);
                if (isCurrent) {
                    setMessages(
                        history.length
                            ? history
                            : [{ sender: "ai", text: welcomeMessage }]
                    );
                }
            } catch (error) {
                console.error("Organization chat history error:", error);
                if (isCurrent) {
                    setMessages([{ sender: "ai", text: welcomeMessage }]);
                }
            } finally {
                if (isCurrent) setLoadingHistory(false);
            }
        };

        loadHistory();
        return () => { isCurrent = false; };
    }, [selectedDate, welcomeMessage]);

    useEffect(() => {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 1, 0);

        const timeout = window.setTimeout(() => {
            setMessages([{ sender: "ai", text: welcomeMessage }]);
            setMessage("");
            setSelectedDate(getLocalDate());
        }, nextMidnight.getTime() - now.getTime());

        return () => window.clearTimeout(timeout);
    }, [selectedDate, welcomeMessage]);

    useEffect(() => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

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
                currentLanguageCode,
                selectedDate
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

    const handleClearChat = async () => {
        if (loading || loadingHistory) return;
        try {
            await clearOrganizationChatHistory(selectedDate);
            setMessages(getDefaultMessages());
            setMessage("");
        } catch (error) {
            console.error("Clear organization chat error:", error);
        }
    };

    const hasUserMessage = messages.some((item) => item.sender === "user");

    return (
        <div className="w-full max-w-full min-h-[70vh] rounded-3xl border border-violet-100/50 bg-gradient-to-br from-violet-50/70 to-white shadow-xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-blue-600 px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Bot
                            size={30}
                            className="text-white"
                        />
                    </div>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            {t(
                                "focusguard_ai",
                                "FocusGuard AI"
                            )}
                        </h1>

                        <p className="text-indigo-100 text-sm sm:text-base">
                            {t(
                                "organization_assistant",
                                "Organization Assistant"
                            )}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

                            <span className="text-xs font-medium text-indigo-100">
                                {t(
                                    "online_ready_to_help",
                                    "Online • Ready to help"
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="self-start sm:self-auto rounded-full bg-white/20 px-4 py-2 text-sm text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={handleClearChat} disabled={!hasUserMessage || loading || loadingHistory} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={14} />{t("clear_chat", "Clear Chat")}</button>
                        {new Date().toLocaleDateString(currentLanguageCode)}
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scroll-smooth bg-transparent px-4 sm:px-8 py-6 sm:py-8 space-y-6"
            >
                {loadingHistory ? (
                    <p className="py-10 text-center text-sm text-slate-500">{t("loading", "Loading...")}</p>
                ) : messages.map((msg, index) => {
                    const isWelcome =
                        index === 0 &&
                        msg.sender === "ai";

                    return (
                        <div
                            key={index}
                            className={`flex animate-[fadeIn_0.3s_ease-out] ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {msg.sender === "ai" ? (
                                <div className="flex gap-3 sm:gap-4 max-w-full sm:max-w-4xl w-full sm:w-auto">
                                    <div className="h-11 w-11 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                        <Bot
                                            size={20}
                                            className="text-white"
                                        />
                                    </div>

                                    <div className="rounded-3xl bg-white border border-slate-200 shadow px-5 sm:px-6 py-5 flex-1 sm:flex-none">
                                        {isWelcome && (
                                            <h2 className="text-lg font-bold text-slate-900 mb-2">
                                                {t(
                                                    "welcome_to_focusguard_ai",
                                                    "Welcome to FocusGuard AI"
                                                )}
                                            </h2>
                                        )}

                                        <p className="text-base text-slate-700 whitespace-pre-line leading-8">
                                            {msg.text}
                                        </p>

                                        {isWelcome && (
                                            <>
                                                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {CAPABILITIES.map(
                                                        (
                                                            capability
                                                        ) => (
                                                            <li
                                                                key={
                                                                    capability
                                                                }
                                                                className="flex items-center gap-2 text-sm font-medium text-slate-600"
                                                            >
                                                                <CheckCircle2
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="text-indigo-500 shrink-0"
                                                                />
                                                                {
                                                                    capability
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>

                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {SUGGESTED_PROMPTS.map(
                                                        (
                                                            prompt
                                                        ) => (
                                                            <button
                                                                key={
                                                                    prompt
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSend(
                                                                        prompt
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all duration-200 hover:bg-indigo-100 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {
                                                                    prompt
                                                                }
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {msg.provider && (
                                            <span className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                                                {t(
                                                    "answered_by",
                                                    "Answered by"
                                                )}{" "}
                                                {msg.provider}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-3xl bg-indigo-600 text-white px-6 py-5 shadow-lg flex items-center gap-3 max-w-[85%] sm:max-w-3xl">
                                    <User
                                        size={18}
                                        className="shrink-0"
                                    />

                                    <p className="text-base leading-8">
                                        {msg.text}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex gap-3 sm:gap-4 max-w-4xl">
                            <div className="h-11 w-11 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <Bot
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <div className="rounded-3xl bg-white border border-slate-200 shadow px-6 py-5 flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                                </span>

                                <span className="text-slate-500 text-sm font-medium">
                                    {t(
                                        "analyzing_organization_data",
                                        "FocusGuard AI is analyzing..."
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t bg-white px-4 sm:px-8 py-5 sm:py-6">
                <div className="max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
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
                        className="flex-1 min-w-0 h-14 rounded-3xl border border-slate-300 px-6 outline-none shadow-sm transition-all duration-150 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                        onClick={() => handleSend()}
                        disabled={loading}
                        className="shrink-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 text-white px-5 sm:px-7 h-14 flex items-center gap-2 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                        <Send
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />

                        <span className="hidden sm:inline">
                            {loading
                                ? t(
                                      "sending",
                                      "Sending..."
                                  )
                                : t(
                                      "send",
                                      "Send"
                                  )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
