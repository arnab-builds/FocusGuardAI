import {
  FiInfo,
  FiPackage,
  FiCode,
  FiUser,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function AboutCard() {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/50 text-indigo-600 shadow-sm shadow-indigo-500/10">

          <FiInfo size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            {t("about", "About")}
          </h2>

          <p className="text-sm text-slate-600">
            {t(
              "application_information",
              "Application information"
            )}
          </p>

        </div>

      </div>

      {/* Information */}

      <div className="space-y-4">

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

            <FiPackage size={20} />

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("application", "Application")}
            </p>

            <p className="font-semibold text-slate-900">
              FocusGuard
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

            <FiCode size={20} />

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("version", "Version")}
            </p>

            <p className="font-semibold text-slate-900">
              v1.0.0
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

            <FiUser size={20} />

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("made_by", "Made by")}
            </p>

            <p className="font-semibold text-slate-900">
              Arnab
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}