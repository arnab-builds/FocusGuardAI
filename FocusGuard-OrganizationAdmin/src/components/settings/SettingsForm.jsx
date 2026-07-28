import { useEffect, useState } from "react";

import {
    getProfile,
    requestOrganizationDeactivation,
} from "../../services/settingsService";
import { getApiErrorMessage } from "../../utils/responseUtils";

function SettingsForm() {

    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [deactivationReason, setDeactivationReason] = useState("");
    const [deactivationMessage, setDeactivationMessage] = useState("");
    const [deactivationError, setDeactivationError] = useState("");
    const [deactivationLoading, setDeactivationLoading] = useState(false);

    async function loadProfile() {

        try {

            const data = await getProfile();

            setOrganization(
                data.organization?.name ||
                data.organization_name ||
                ""
            );
            setEmail(data.email || "");
            setError("");

        }

        catch (error) {

            console.error(error);
            setError(
                getApiErrorMessage(
                    error,
                    "Settings could not be loaded."
                )
            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        const timeout = setTimeout(loadProfile, 0);

        return () => clearTimeout(timeout);

    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");
        setMessage(
            "Profile and organization updates are not available from the current backend endpoints."
        );

    };

    const handleDeactivationSubmit = async (e) => {

        e.preventDefault();

        try {

            setDeactivationLoading(true);
            setDeactivationError("");
            setDeactivationMessage("");

            const data = await requestOrganizationDeactivation({
                reason: deactivationReason,
            });

            console.log(
                "Organization deactivation request submitted:",
                data
            );

            setDeactivationReason("");
            setDeactivationMessage(
                data.message ||
                    "Organization deactivation request submitted successfully."
            );

        }

        catch (error) {

            console.error(error);
            setDeactivationError(
                getApiErrorMessage(
                    error,
                    "Organization deactivation request could not be submitted."
                )
            );

        }

        finally {

            setDeactivationLoading(false);

        }

    };

    return (

        <div className="max-w-3xl space-y-6">

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
            >

            <div className="space-y-6">

                {loading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Loading settings...
                    </div>
                )}

                {message && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>

                    <label className="block mb-2 font-medium">

                        Email

                    </label>

                    <input
                        value={email}
                        readOnly
                        className="w-full border rounded-xl px-4 py-3 bg-slate-50 text-slate-600"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Organization Name

                    </label>

                    <input
                        value={organization}
                        readOnly
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">

                        Change Password

                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3"
                >

                    Save Changes

                </button>

            </div>

            </form>

            <form
                onSubmit={handleDeactivationSubmit}
                className="bg-white rounded-2xl border border-red-200 shadow-sm p-8"
            >

                <div className="space-y-5">

                    <div>

                        <h2 className="text-xl font-semibold text-slate-900">

                            Organization Deactivation Request

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Submit a request for Super Admin review.

                        </p>

                    </div>

                    {deactivationMessage && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {deactivationMessage}
                        </div>
                    )}

                    {deactivationError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {deactivationError}
                        </div>
                    )}

                    <div>

                        <label className="block mb-2 font-medium">

                            Reason

                        </label>

                        <textarea
                            value={deactivationReason}
                            onChange={(e) =>
                                setDeactivationReason(e.target.value)
                            }
                            required
                            rows={5}
                            placeholder="Explain why this organization should be deactivated."
                            className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={
                            deactivationLoading ||
                            !deactivationReason.trim()
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 text-white rounded-xl px-6 py-3"
                    >

                        {deactivationLoading
                            ? "Submitting..."
                            : "Submit Deactivation Request"}

                    </button>

                </div>

            </form>

        </div>

    );

}

export default SettingsForm;
