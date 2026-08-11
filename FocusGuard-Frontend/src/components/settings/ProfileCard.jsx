import {
  FiUser,
  FiMail,
  FiHome,
  FiShield,
} from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function ProfileCard({ profile }) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-[#111827] p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">

          <FiUser size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("profile", "Profile")}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t(
              "profile_information",
              "Your account information"
            )}
          </p>

        </div>

      </div>

      {/* Details */}

      <div className="space-y-4">

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">

            <FiUser size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              {t("username", "Username")}
            </p>

            <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
              {profile?.username || "-"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">

            <FiMail size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              {t("email", "Email")}
            </p>

            <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
              {profile?.email || "-"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">

            <FiShield size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              {t("role", "Role")}
            </p>

            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {profile?.role?.replaceAll("_", " ") || "-"}
            </p>

          </div>

        </div>

        {profile?.role !== "NORMAL_USER" && (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">

              <FiHome size={20} />

            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t("organization", "Organization")}
              </p>

              <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
                {profile?.organization ||
                  t("not_assigned", "Not Assigned")}
              </p>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}