import { FiInfo } from "react-icons/fi";

export default function AboutCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex items-center gap-3 mb-5">
        <FiInfo size={24} />
        <h2 className="text-xl font-semibold">
          About
        </h2>
      </div>

      <div className="space-y-2">

        <p>
          <strong>Application</strong>
          <br />
          FocusGuard
        </p>

        <p>
          <strong>Version</strong>
          <br />
          v1.0.0
        </p>

        <p>
          <strong>Made by Arnab</strong>
          <br />
          
        </p>

      </div>

    </div>
  );
}