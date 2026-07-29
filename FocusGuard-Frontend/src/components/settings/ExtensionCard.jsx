import { FiMonitor } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function ExtensionCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <FiMonitor size={24} />

        <h2 className="text-xl font-semibold">
          {t("browser_extension", "Browser Extension")}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-green-500"></div>

        <div>
          <p className="font-medium">
            {t("connected", "Connected")}
          </p>

          <p className="text-sm text-gray-500">
            {t(
              "chrome_extension_active",
              "Chrome Extension Active"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}