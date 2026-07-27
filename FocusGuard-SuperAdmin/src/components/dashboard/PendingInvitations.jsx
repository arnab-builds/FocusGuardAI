import StatusBadge from "../ui/StatusBadge";

function PendingInvitations({ invitations = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold">
          Pending Invitations
        </h2>

        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {invitations.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No pending invitations.
          </div>

        ) : (

          invitations.map((invite) => (

            <div
              key={invite.id}
              className="flex items-center justify-between pb-5 border-b last:border-none"
            >

              <div>

                <h3 className="font-semibold">
                  {invite.email}
                </h3>

                <p className="text-sm text-gray-500">
                  {invite.organization}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {invite.role}
                </p>

              </div>

              <StatusBadge
                status={invite.status || "Pending"}
              />

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default PendingInvitations;