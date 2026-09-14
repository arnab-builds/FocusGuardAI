import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";

import { useLanguage } from "../../context/useLanguage";

import {
  getNormalUsers,
  reviewNormalUserDeactivation,
} from "../../services/superAdminService";
import { fetchWithCache, getCache, setCache } from "../../../utils/apiCache";

function NormalUsers() {
  const { t } = useLanguage();
  const cacheKey = "super-normal-users";

  const [users, setUsers] = useState(() => getCache(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getCache(cacheKey));

  const loadUsers = async (showLoading = true) => {
    try {
      if (showLoading && !getCache(cacheKey)) setLoading(true);

      const response = await fetchWithCache(cacheKey, getNormalUsers);

      const processed = response.data.results || [];
      setUsers(processed);
      setCache(cacheKey, processed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadUsers(true);
    return () => { isMounted = false; };
  }, []);

  const review = async (requestId, action) => {
    await reviewNormalUserDeactivation(
      requestId,
      action
    );

    await loadUsers();
  };

  const renderStatusBadge = (request) => {
    if (!request) {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
          {t("none", "None")}
        </span>
      );
    }

    if (request.status === "PENDING") {
      return (
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-3 py-1 text-xs font-bold text-amber-700 shadow-sm ring-1 ring-amber-200/70">
          {t("pending", "Pending")}
        </span>
      );
    }

    if (request.status === "APPROVED") {
      return (
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-100 to-green-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200/70">
          {t("approved", "Approved")}
        </span>
      );
    }

    if (request.status === "REJECTED") {
      return (
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-100 to-rose-50 px-3 py-1 text-xs font-bold text-red-700 shadow-sm ring-1 ring-red-200/70">
          {t("rejected", "Rejected")}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
        {request.status}
      </span>
    );
  };

  return (
      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white border border-blue-100/70 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <Users size={26} />
            </span>

            <div>
              <div className="flex items-center gap-3">
                <span className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                  <Users size={18} />
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {t(
                    "normal_users",
                    "Normal Users"
                  )}
                </h1>
              </div>

              <p className="mt-2 text-slate-500">
                {t(
                  "normal_users_management_description",
                  "Review normal-user accounts and deactivation requests."
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/70 to-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          {loading && users.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-16 flex flex-col items-center justify-center text-center">
              <Loader2
                className="animate-spin text-blue-600"
                size={36}
              />

              <p className="mt-5 text-base font-semibold text-slate-700">
                {t(
                  "loading",
                  "Loading..."
                )}
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-300 ring-1 ring-blue-100 mb-4">
                <Users
                  size={28}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-base font-semibold text-slate-600">
                {t(
                  "no_users_found",
                  "No users found."
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 bg-indigo-50/50 border-b border-indigo-100">
                      <th className="px-6 py-5">
                        {t(
                          "email",
                          "Email"
                        )}
                      </th>

                      <th className="px-6 py-5">
                        {t(
                          "account_created",
                          "Account Created"
                        )}
                      </th>

                      <th className="px-6 py-5">
                        {t(
                          "deactivation_request",
                          "Deactivation Request"
                        )}
                      </th>

                      <th className="px-6 py-5">
                        {t(
                          "actions",
                          "Actions"
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map(
                      (user, index) => {
                        const request =
                          user.deactivation_request;

                        return (
                          <tr
                            key={user.id}
                            className={`border-b border-slate-100 last:border-none hover:bg-blue-50/50 transition-all duration-300 ${
                              index % 2 === 1
                                ? "bg-slate-50/40"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-5 font-semibold text-slate-900">
                              {user.email}
                            </td>

                            <td className="px-6 py-5">
                              <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-sm text-slate-600 ring-1 ring-slate-100">
                                {new Date(
                                  user.created_at
                                ).toLocaleDateString()}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              {renderStatusBadge(
                                request
                              )}
                            </td>

                            <td className="px-6 py-5">
                              {request?.status ===
                                "PENDING" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      review(
                                        request.id,
                                        "approve"
                                      )
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-white font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                  >
                                    {t(
                                      "approve",
                                      "Approve"
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      review(
                                        request.id,
                                        "reject"
                                      )
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-white font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                                  >
                                    {t(
                                      "reject",
                                      "Reject"
                                    )}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
                            <div className="space-y-4 p-4 md:hidden">
                {users.map((user) => {
                  const request =
                    user.deactivation_request;

                  return (
                    <div
                      key={user.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {t(
                              "email",
                              "Email"
                            )}
                          </p>

                          <p className="mt-1 break-all font-semibold text-slate-900">
                            {user.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {t(
                              "account_created",
                              "Account Created"
                            )}
                          </p>

                          <p className="mt-1 text-slate-700">
                            {new Date(
                              user.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {t(
                              "deactivation_request",
                              "Deactivation Request"
                            )}
                          </p>

                          <div className="mt-2">
                            {renderStatusBadge(
                              request
                            )}
                          </div>
                        </div>

                        {request?.status ===
                          "PENDING" && (
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() =>
                                review(
                                  request.id,
                                  "approve"
                                )
                              }
                              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 font-medium text-white shadow-sm transition hover:shadow-md"
                            >
                              {t(
                                "approve",
                                "Approve"
                              )}
                            </button>

                            <button
                              onClick={() =>
                                review(
                                  request.id,
                                  "reject"
                                )
                              }
                              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3 font-medium text-white shadow-sm transition hover:shadow-md"
                            >
                              {t(
                                "reject",
                                "Reject"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
  );
}

export default NormalUsers;