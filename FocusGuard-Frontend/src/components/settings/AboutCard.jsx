import { FiInfo } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function AboutCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <FiInfo size={24} />

        <h2 className="text-xl font-semibold">
          {t("about", "About")}
        </h2>
      </div>

      <div className="space-y-2">
        <p>
          <strong>{t("application", "Application")}</strong>
          <br />
          FocusGuard
        </p>

        <p>
          <strong>{t("version", "Version")}</strong>
          <br />
          v1.0.0
        </p>

        <p>
          <strong>{t("made_by", "Made by")}</strong>
          <br />
          Arnab
        </p>
      </div>
    </div>
  );
}