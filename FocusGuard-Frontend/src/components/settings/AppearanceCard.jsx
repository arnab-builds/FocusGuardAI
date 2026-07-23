import { FiMoon } from "react-icons/fi";

export default function AppearanceCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <FiMoon size={24} />
        <h2 className="text-xl font-semibold">
          Appearance
        </h2>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">
            Dark Mode
          </p>

          <p className="text-gray-500 text-sm">
            Coming Soon
          </p>
        </div>

        <button
          disabled
          className="bg-gray-300 px-5 py-2 rounded-lg cursor-not-allowed"
        >
          Disabled
        </button>
      </div>
    </div>
  );
}