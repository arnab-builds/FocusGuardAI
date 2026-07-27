import AdminLayout from "../../components/layout/AdminLayout";
import RequestsTable from "../../components/requests/RequestsTable";

function Requests() {
  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Deactivation Requests
          </h1>

          <p className="text-gray-500 mt-2">
            Approve or reject organization requests.
          </p>

        </div>

        <RequestsTable />

      </div>
    </AdminLayout>
  );
}

export default Requests;