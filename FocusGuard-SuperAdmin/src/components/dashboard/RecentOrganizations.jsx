import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";

function RecentOrganizations({ organizations = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold">
          Recent Organizations
        </h2>

        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b text-left text-gray-500">

            <th className="pb-4">Organization</th>

            <th className="pb-4">Created</th>

            <th className="pb-4">Status</th>

            <th className="pb-4 text-right">Action</th>

          </tr>

        </thead>

        <tbody>

          {organizations.length === 0 ? (

            <tr>

              <td
                colSpan={4}
                className="py-10 text-center text-gray-500"
              >
                No organizations found.
              </td>

            </tr>

          ) : (

            organizations.map((organization) => (

              <tr
                key={organization.id}
                className="border-b last:border-none"
              >

                <td className="py-5 font-medium">
                  {organization.name}
                </td>

                <td>
                  {new Date(
                    organization.created_at
                  ).toLocaleDateString()}
                </td>

                <td>

                  <StatusBadge
                    status={
                      organization.status
                        ? "Active"
                        : "Inactive"
                    }
                  />

                </td>

                <td className="text-right">

                  <Link
                    to={`/organizations/${organization.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default RecentOrganizations;