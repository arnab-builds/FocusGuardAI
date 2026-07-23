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

import { sendChatMessage } from "../../services/chatbotService";

const suggestions = [
  "How productive was I today?",
  "How can I improve my focus?",
  "Summarize today's activity",
  "Which websites distracted me today?",
];

const AICoach = () => {
  const { selectedDate } = useOutletContext();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        "👋 Hi! I'm **FocusGuard AI**.\n\nI can answer questions about your productivity, activity logs, analytics, reports and focus sessions.\n\nChoose a suggestion below or ask your own question.",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

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
        selectedDate
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
          text:
            "⚠️ Sorry, I couldn't process your request right now.",
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

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !loading) {

      handleSend();

    }

  };
 return (
  <div className="flex h-full items-center justify-center bg-slate-100 p-5">

    <div className="flex h-[82vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-8 py-5 text-white">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">

            <FiCpu size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              FocusGuard AI
            </h2>

            <p className="text-sm text-indigo-100">
              Productivity Assistant
            </p>

          </div>

        </div>

        <div className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">

          {selectedDate}

        </div>

      </div>

      {/* Chat */}

      <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-8">

        <div className="mx-auto flex max-w-4xl flex-col gap-6">

          {messages.map((msg) => (

            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {msg.sender === "ai" && (

                <div className="mr-3 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">

                  <FiCpu />

                </div>

              )}

              <div
                className={`max-w-[72%] rounded-3xl px-6 py-4 shadow ${
                  msg.sender === "user"
                    ? "rounded-br-md bg-indigo-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                }`}
              >

                <div className="prose prose-sm max-w-none">
  <ReactMarkdown>
    {msg.text}
  </ReactMarkdown>
</div>

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="mr-3 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">

               <FiCpu />

              </div>

              <div className="rounded-3xl rounded-bl-md border bg-white px-6 py-4 shadow">

                <div className="flex items-center gap-2">

                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></div>

                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{
                      animationDelay: ".15s",
                    }}
                  ></div>

                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{
                      animationDelay: ".30s",
                    }}
                  ></div>

                  <span className="ml-3 text-sm text-slate-500">

                    FocusGuard AI is thinking...

                  </span>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </div>

      {/* Suggestions */}

      <div className="border-t border-slate-200 bg-white px-6 py-4">

        <div className="mb-4 flex flex-wrap gap-3">

          {suggestions.map((question) => (

            <button
              key={question}
              onClick={() =>
                handleSuggestion(question)
              }
              disabled={loading}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
            >

              {question}

            </button>

          ))}

        </div>

        {/* Input */}

        <div className="flex items-center gap-4">

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your productivity..."
            className="flex-1 rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >

            <FiSend />

            Send

          </button>

        </div>

      </div>

    </div>

  </div>
);

};

export default AICoach;