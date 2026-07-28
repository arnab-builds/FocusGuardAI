import { FiUser, FiMail, FiHome } from "react-icons/fi";

export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-5">Profile</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FiUser className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">
              {profile?.username || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiMail className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">
              {profile?.email || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FiHome className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Organization</p>
            <p className="font-medium">
              {profile?.organization || "Not Assigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
