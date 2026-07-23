import { FiMonitor } from "react-icons/fi";

export default function ExtensionCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex items-center gap-3 mb-5">
        <FiMonitor size={24} />
        <h2 className="text-xl font-semibold">
          Browser Extension
        </h2>
      </div>

      <div className="flex items-center gap-3">

        <div className="w-3 h-3 rounded-full bg-green-500"></div>

        <div>
          <p className="font-medium">
            Connected
          </p>

          <p className="text-gray-500 text-sm">
            Chrome Extension Active
          </p>
        </div>

      </div>

    </div>
  );
}