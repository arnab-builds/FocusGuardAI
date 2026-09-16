import { useEffect, useState } from "react";

import { Plus, Loader2 } from "lucide-react";

import OrganizationsTable from "../../components/organizations/OrganizationsTable";
import CreateOrganizationModal from "../../components/organizations/CreateOrganizationModal";

import { useLanguage } from "../../context/useLanguage";

import { getOrganizations } from "../../services/superAdminService";
import { fetchWithCache, getCache, setCache } from "../../../utils/apiCache";

function Organizations() {
    const { t } = useLanguage();
    const cacheKey = "super-organizations";

    const [open, setOpen] = useState(false);
    const [organizations, setOrganizations] = useState(() => getCache(cacheKey) || []);
    const [loading, setLoading] = useState(() => !getCache(cacheKey));

    const loadOrganizations = async (showLoading = true) => {
        try {
            if (showLoading && !getCache(cacheKey)) setLoading(true);

            const res = await fetchWithCache(cacheKey, getOrganizations);
            const data = res.data ?? res;
            setOrganizations(data);
            setCache(cacheKey, data);
        } catch (err) {
            console.error("Error loading organizations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        loadOrganizations(true);
        return () => { isMounted = false; };
    }, []);

    return (
        <>
            <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                            {t(
                                "organizations",
                                "Organizations"
                            )}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-500 mt-2">
                            {t(
                                "manage_organizations",
                                "Manage organizations."
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        {t(
                            "create_organization",
                            "+ Create Organization"
                        )}
                    </button>
                </div>

                {loading && organizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-white p-12 sm:p-16 shadow-sm">
                        <Loader2
                            size={32}
                            className="animate-spin text-blue-600"
                            strokeWidth={2}
                        />

                        <p className="text-sm sm:text-base font-medium text-slate-500">
                            {t(
                                "loading_organizations",
                                "Loading organizations..."
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-7">
                            <OrganizationsTable
                                organizations={organizations}
                                refreshOrganizations={loadOrganizations}
                            />
                        </div>
                    </div>
                )}
            </div>

            <CreateOrganizationModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    loadOrganizations();
                }}
            />
        </>
    );
}

export default Organizations;
