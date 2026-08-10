import {
  FiMonitor,
  FiCheckCircle,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function ExtensionCard() {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/50 text-indigo-600 shadow-sm shadow-indigo-500/10">

          <FiMonitor size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            {t("browser_extension", "Browser Extension")}
          </h2>

          <p className="text-sm text-slate-600">
            {t(
              "browser_extension_status",
              "Extension connection status"
            )}
          </p>

        </div>

      </div>

      {/* Status */}

      <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

            <FiCheckCircle size={20} />

          </div>

          <div>

            <p className="font-semibold text-slate-900">
              {t("connected", "Connected")}
            </p>

            <p className="text-sm text-slate-600">
              {t(
                "chrome_extension_active",
                "Chrome Extension Active"
              )}
            </p>

          </div>

        </div>

        <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          ● {t("online", "Online")}
        </span>

      </div>

    </section>
  );
}