import { FiMoon } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function AppearanceCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <FiMoon size={24} />

        <h2 className="text-xl font-semibold">
          {t("appearance", "Appearance")}
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {t("dark_mode", "Dark Mode")}
          </p>

          <p className="text-sm text-gray-500">
            {t("coming_soon", "Coming Soon")}
          </p>
        </div>

        <button
          disabled
          className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2"
        >
          {t("disabled", "Disabled")}
        </button>
      </div>
    </div>
  );
}