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

    return () => {
      isCurrent = false;
    };
  }, [selectedDate, currentLanguageCode]);

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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col py-2 sm:py-4">
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <FiCpu className="text-indigo-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">{t("focusguard_ai", "FocusGuard AI")}</h2>
              <div className="text-xs text-slate-500">{t("productivity_assistant", "Productivity Assistant")}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearChat}
              disabled={!hasUserMessage || loading || loadingHistory}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("clear_chat", "Clear Chat")}
            </button>
            <div className="text-xs text-slate-600">{selectedDate}</div>
          </div>
        </div>

        {/* Chat */}

        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6">
          <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">

            {/* Suggestion chips: show only before the first user message */}
            {!hasUserMessage && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    disabled={loading}
                    className="chip rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
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
                  className={`max-w-[78%] rounded-xl px-4 py-2 ${
                    msg.sender === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
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
                <div className="rounded-xl rounded-bl-md border bg-white px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: ".12s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: ".24s" }} />
                    <span className="ml-3 text-sm text-slate-500">{t("thinking_message", "FocusGuard AI is thinking...")}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-3">
          <div className="mb-3">
            {/* on small screens suggestions shown above messages; once user messages exist they hide */}
          </div>

          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("ask_anything_productivity", "Ask anything about your productivity...")}
              className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <button
              onClick={handleSend}
              disabled={loading || loadingHistory}
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
