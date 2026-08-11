import {
  FiSend,
  FiCpu,
} from "react-icons/fi";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useOutletContext } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import {
  clearChatHistory,
  getAllChatHistory,
  getChatHistory,
  sendChatMessage,
} from "../../services/chatbotService";
import { useLanguage } from "../../context/useLanguage";

const AICoach = () => {
  const { selectedDate } = useOutletContext();
  const { currentLanguageCode, t } = useLanguage();

  const suggestions = [
    t(
      "suggestion_productivity_today",
      "How productive was I today?"
    ),
    t(
      "suggestion_focus_goal_priority",
      "Which focus goal should I prioritize today?"
    ),
    t(
      "suggestion_progress_low",
      "Why is my progress low?"
    ),
    t(
      "suggestion_complete_goals_deadline",
      "How can I complete my goals before the deadline?"
    ),
    t(
      "suggestion_summarize_today",
      "Summarize today's activity"
    ),
    t(
      "suggestion_distracting_websites",
      "Which websites distracted me today?"
    ),
  ];

  const getDefaultMessages = () => [
    {
      id: "welcome",
      sender: "ai",
      text: t(
        "ai_welcome_message",
        "👋 Hi! I'm **FocusGuard AI**.\n\nI can answer questions about your productivity, activity logs, analytics, reports and focus sessions.\n\nChoose a suggestion below or ask your own question."
      ),
    },
  ];

  const [messages, setMessages] = useState(getDefaultMessages);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [allHistory, setAllHistory] = useState([]);
  const [loadingAllHistory, setLoadingAllHistory] = useState(false);
  const [viewingHistoryDate, setViewingHistoryDate] = useState(null);
  const [historySearch, setHistorySearch] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let isCurrent = true;

    const loadChatHistory = async () => {
      setLoadingHistory(true);

      try {
        const history = await getChatHistory(
          selectedDate,
          currentLanguageCode
        );

        if (isCurrent) {
          setMessages(history.length ? history : getDefaultMessages());
        }
      } catch (error) {
        console.error("Chat history error:", error);

        if (isCurrent) {
          setMessages(getDefaultMessages());
        }
      } finally {
        if (isCurrent) {
          setLoadingHistory(false);
        }
      }
    };

    loadChatHistory();
    setViewingHistoryDate(null);
    setShowHistory(false);

    return () => {
      isCurrent = false;
    };
  }, [selectedDate, currentLanguageCode]);

  const loadAllHistory = async () => {
    setLoadingAllHistory(true);
    try {
      setAllHistory(await getAllChatHistory(currentLanguageCode));
      setHistorySearch("");
      setShowHistory(true);
    } catch (error) {
      console.error("All chat history error:", error);
    } finally {
      setLoadingAllHistory(false);
    }
  };

  const openHistoricalDate = (date, dateMessages) => {
    setMessages(dateMessages);
    setViewingHistoryDate(date);
    setShowHistory(false);
    setInput("");
  };

  const returnToDateView = () => {
    setViewingHistoryDate(null);
    setShowHistory(false);
    setLoadingHistory(true);
    getChatHistory(selectedDate, currentLanguageCode)
      .then((history) => setMessages(history.length ? history : getDefaultMessages()))
      .catch((error) => {
        console.error("Chat history error:", error);
        setMessages(getDefaultMessages());
      })
      .finally(() => setLoadingHistory(false));
  };

  const returnToHistory = () => {
    setViewingHistoryDate(null);
    setShowHistory(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      const data = await sendChatMessage(
        question,
        selectedDate,
        currentLanguageCode
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: t(
            "chat_error_message",
            "⚠️ Sorry, I couldn't process your request right now."
          ),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    send(input);
  };

  const handleSuggestion = (question) => {
    send(question);
  };

  const handleClearChat = async () => {
    try {
      await clearChatHistory(selectedDate);
      setMessages(getDefaultMessages());
      setInput("");
    } catch (error) {
      console.error("Clear chat error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  const hasUserMessage = messages.some((m) => m.sender === "user");
  const historyByDate = allHistory.reduce((groups, item) => {
    const date = item.selected_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  const filteredHistoryByDate = Object.entries(historyByDate).filter(
    ([date, dateMessages]) => {
      const query = historySearch.trim().toLowerCase();
      if (!query) return true;
      return date.includes(query) || dateMessages.some((message) =>
        message.text.toLowerCase().includes(query)
      );
    }
  );

  const formatHistoryDate = (date) => {
    const target = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const label = target.toLocaleDateString(undefined, { month: "short", day: "numeric", year: target.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
    if (target.getTime() === today.getTime()) return `${t("today", "Today")} — ${label}`;
    if (target.getTime() === yesterday.getTime()) return `${t("yesterday", "Yesterday")} — ${label}`;
    return label;
  };

  const formatHistoryTime = (timestamp) => new Date(timestamp).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col py-2 sm:py-4">
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-2xl border border-indigo-100/50 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">

        {/* Header */}

        <div className="flex flex-col items-start justify-between gap-3 border-b border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-950/30 dark:to-slate-800 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
            <div className="rounded-xl bg-indigo-100/50 dark:bg-indigo-900/40 p-2 shadow-sm shadow-indigo-500/10">
              <FiCpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t("focusguard_ai", "FocusGuard AI")}</h2>
              <div className="text-xs text-slate-600 dark:text-slate-400">{t("productivity_assistant", "Productivity Assistant")}</div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
            {viewingHistoryDate && (
              <button
                onClick={returnToHistory}
                className="rounded-lg border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
              >
                {t("back_to_history", "Back to History")}
              </button>
            )}
            <button
              onClick={loadAllHistory}
              disabled={loadingAllHistory}
              className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-950/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAllHistory ? t("loading", "Loading...") : t("history", "History")}
            </button>
            <button
              onClick={handleClearChat}
              disabled={!hasUserMessage || loading || loadingHistory || Boolean(viewingHistoryDate)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("clear_chat", "Clear Chat")}
            </button>
            <div className="text-xs text-slate-600 dark:text-slate-400">{selectedDate}</div>
          </div>
        </div>

        {/* Chat */}

        <div className="flex-1 overflow-y-auto bg-indigo-50/20 dark:bg-slate-900/50 px-4 py-6">
          <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">

            {showHistory ? (
              <section aria-label={t("chat_history", "Chat History")} className="rounded-xl border border-indigo-100 dark:border-slate-700 bg-white dark:bg-[#172033] p-4 shadow-sm transition-all duration-200 ease-out">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{t("chat_history", "Chat History")}</h3>
                  <button onClick={returnToDateView} className="rounded-lg border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40">
                    {t("current_date_chat", "Current Date Chat")}
                  </button>
                </div>
                <input
                  value={historySearch}
                  onChange={(event) => setHistorySearch(event.target.value)}
                  placeholder={t("search_chat_history", "Search chat history")}
                  aria-label={t("search_chat_history", "Search chat history")}
                  className="mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />
                {Object.keys(historyByDate).length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("no_chat_history", "No chat history yet.")}</p>
                ) : filteredHistoryByDate.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("no_matching_chats", "No matching chats found.")}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredHistoryByDate.map(([date, dateMessages]) => {
                      const prompts = dateMessages.filter((message) => message.sender === "user");
                      const latestMessage = dateMessages[dateMessages.length - 1];
                      return (
                        <div key={date} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700/70">
                          <button onClick={() => openHistoricalDate(date, dateMessages)} className="flex w-full items-start justify-between gap-3 text-left transition hover:text-indigo-600 dark:hover:text-indigo-300">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{formatHistoryDate(date)}</span>
                            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{prompts.length} {t("chats", "chats")}</span>
                          </button>
                          {latestMessage && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("last_activity", "Last activity")} {formatHistoryTime(latestMessage.created_at)}</p>}
                          <div className="mt-2 space-y-1.5">
                            {prompts.slice(0, 3).map((prompt) => (
                              <button key={prompt.id} onClick={() => openHistoricalDate(date, dateMessages)} className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-300">
                                {prompt.text}
                              </button>
                            ))}
                            {prompts.length > 3 && <p className="px-3 text-xs text-slate-500">+{prompts.length - 3} {t("more", "more")}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : <>

            {/* Suggestion chips: show only before the first user message */}
            {!hasUserMessage && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    disabled={loading}
                    className="chip rounded-full border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loadingHistory ? (
              <div className="py-12 text-center text-sm text-slate-500">
                {t("loading", "Loading...")}
              </div>
            ) : messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <FiCpu className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-xl px-4 py-2 shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-indigo-100/50 dark:border-slate-700 bg-white dark:bg-[#172033] text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="prose prose-sm max-w-none leading-snug">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-3">
                <div className="mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                  <FiCpu className="text-white" />
                </div>
                <div className="rounded-xl rounded-bl-md border border-indigo-100/50 dark:border-slate-700 bg-white dark:bg-[#172033] px-4 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: ".12s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: ".24s" }} />
                    <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">{t("thinking_message", "FocusGuard AI is thinking...")}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            </>}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
          <div className="mb-3">
            {/* on small screens suggestions shown above messages; once user messages exist they hide */}
          </div>

          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={viewingHistoryDate ? t("viewing_historical_chat", "Viewing historical chat") : t("ask_anything_productivity", "Ask anything about your productivity...")}
              disabled={Boolean(viewingHistoryDate)}
              className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              onClick={handleSend}
              disabled={loading || loadingHistory || Boolean(viewingHistoryDate)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-60"
              aria-label={t("send", "Send")}
            >
              <FiSend />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AICoach;
