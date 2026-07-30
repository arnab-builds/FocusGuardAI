import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import InvitationsTable from "../../components/invitations/InvitationsTable";

import { useLanguage } from "../../context/useLanguage";

import { getInvitations } from "../../services/superAdminService";

function Invitations() {
    const { t } = useLanguage();

    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInvitations = async () => {
        try {
            setLoading(true);

            const res = await getInvitations();

            console.log("Invitations API:", res.data);

            setInvitations(res.data);
        } catch (err) {
            console.error("Error loading invitations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvitations();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {t(
                                "invitations",
                                "Invitations"
                            )}
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {t(
                                "manage_organization_invitations",
                                "Manage organization invitations."
                            )}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl border p-10 text-center">
                        {t(
                            "loading_invitations",
                            "Loading invitations..."
                        )}
                    </div>
                ) : (
                    <InvitationsTable
                        invitations={invitations}
                        refreshInvitations={loadInvitations}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default Invitations;