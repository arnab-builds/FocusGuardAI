import {
  Building2,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

function ProgressBar({ value, color }) {
  return (
    <div className="mt-2">

      <div className="w-full h-4 rounded-full bg-gray-200">

        <div
          className={`${color} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />

      </div>

      <p className="mt-2 font-semibold">
        {value}%
      </p>

    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-5">

      <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold">
          {value}
        </h2>

      </div>

    </div>
  );
}

function OrganizationOverview({
  organization,
  summary,
}) {

  return (
    <>

      <div>

        <h1 className="text-3xl font-bold">
          {organization.name}
        </h1>

        <p className="text-gray-500 mt-2">
          {organization.address || "Organization Performance Overview"}
        </p>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <Card
          title="Employees"
          value={summary.employees}
          icon={<Users />}
        />

        <Card
          title="Active"
          value={summary.active}
          icon={<UserCheck />}
        />

        <Card
          title="Inactive"
          value={summary.inactive}
          icon={<UserX />}
        />

        <Card
          title="Organization"
          value={organization.id}
          icon={<Building2 />}
        />

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold">
            Overall Productivity
          </h2>

          <ProgressBar
            value={summary.productive}
            color="bg-green-500"
          />

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold">
            Overall Unproductive
          </h2>

          <ProgressBar
            value={summary.unproductive}
            color="bg-red-500"
          />

        </div>

      </div>

    </>
  );
}

export default OrganizationOverview;