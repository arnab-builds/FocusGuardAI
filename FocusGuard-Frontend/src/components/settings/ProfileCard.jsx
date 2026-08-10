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
    <section className="rounded-2xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">

      {/* Header */}

      <div className="mb-6 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100/50 text-indigo-600 shadow-sm shadow-indigo-500/10">

          <FiUser size={28} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            {t("profile", "Profile")}
          </h2>

          <p className="text-sm text-slate-600">
            {t(
              "profile_information",
              "Your account information"
            )}
          </p>

        </div>

      </div>

      {/* Details */}

      <div className="space-y-4">

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

            <FiUser size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("username", "Username")}
            </p>

            <p className="truncate text-base font-semibold text-slate-900">
              {profile?.username || "-"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

            <FiMail size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("email", "Email")}
            </p>

            <p className="truncate text-base font-semibold text-slate-900">
              {profile?.email || "-"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

            <FiShield size={20} />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t("role", "Role")}
            </p>

            <p className="text-base font-semibold text-slate-900">
              {profile?.role?.replaceAll("_", " ") || "-"}
            </p>

          </div>

        </div>

        {profile?.role !== "NORMAL_USER" && (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

              <FiHome size={20} />

            </div>

            <div className="min-w-0 flex-1">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("organization", "Organization")}
              </p>

              <p className="truncate text-base font-semibold text-slate-900">
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