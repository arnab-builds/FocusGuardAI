import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useLanguage } from "../../context/useLanguage";
import {
  getNormalUsers,
  reviewNormalUserDeactivation,
} from "../../services/superAdminService";

function NormalUsers() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getNormalUsers();
      setUsers(response.data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const review = async (requestId, action) => {
    await reviewNormalUserDeactivation(requestId, action);
    await loadUsers();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t("normal_users", "Normal Users")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("normal_users_management_description", "Review normal-user accounts and deactivation requests.")}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-6 py-4">{t("email", "Email")}</th>
                <th className="px-6 py-4">{t("account_created", "Account Created")}</th>
                <th className="px-6 py-4">{t("deactivation_request", "Deactivation Request")}</th>
                <th className="px-6 py-4">{t("actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-6 text-gray-500" colSpan="4">{t("loading", "Loading...")}</td></tr>
              ) : users.map((user) => {
                const request = user.deactivation_request;
                return (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{request ? request.status : t("none", "None")}</td>
                    <td className="px-6 py-4">
                      {request?.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button onClick={() => review(request.id, "approve")} className="rounded-lg bg-green-600 px-3 py-2 text-white">{t("approve", "Approve")}</button>
                          <button onClick={() => review(request.id, "reject")} className="rounded-lg bg-red-600 px-3 py-2 text-white">{t("reject", "Reject")}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default NormalUsers;
