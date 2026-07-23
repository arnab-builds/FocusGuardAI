import { FiSend, FiCpu } from "react-icons/fi";

const messages = [
  {
    sender: "ai",
    text: "👋 Hello! I'm your AI Productivity Coach. Ask me anything about your productivity, browsing habits, or focus sessions.",
  },
  {
    sender: "user",
    text: "How productive was I today?",
  },
  {
    sender: "ai",
    text: "You spent 4h 25m on productive websites and 45m on non-productive websites. Great work! 🎉",
  },
];

const AICoach = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          AI Coach
        </h1>

        <p className="text-gray-500 mt-2">
          Ask questions about your productivity and receive AI-powered insights.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg h-[75vh] flex flex-col">

        {/* Chat Header */}

        <div className="border-b p-5 flex items-center gap-3">

          <div className="bg-indigo-600 text-white p-3 rounded-full">
            <FiCpu size={22} />
          </div>

          <div>

            <h2 className="font-semibold">
              FocusGuard AI
            </h2>

            <p className="text-sm text-green-500">
              Online
            </p>

          </div>

        </div>

        {/* Chat Messages */}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-lg px-5 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>

            </div>

          ))}

        </div>

        {/* Input */}

        <div className="border-t p-5">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Ask your AI Coach..."
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl flex items-center gap-2"
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