import { FiUser, FiMail, FiHome } from "react-icons/fi";
import { useLanguage } from "../../context/useLanguage";

export default function ProfileCard({ profile }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        {t("profile", "Profile")}
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FiUser className="text-indigo-600" />

          <div>
            <p className="text-sm text-gray-500">
              {t("username", "Username")}
            </p>

            <p className="font-medium">
              {profile?.username || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiMail className="text-indigo-600" />

          <div>
            <p className="text-sm text-gray-500">
              {t("email", "Email")}
            </p>

            <p className="font-medium">
              {profile?.email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiHome className="text-indigo-600" />

          <div>
            <p className="text-sm text-gray-500">
              {t("organization", "Organization")}
            </p>

            <p className="font-medium">
              {profile?.organization ||
                t("not_assigned", "Not Assigned")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}