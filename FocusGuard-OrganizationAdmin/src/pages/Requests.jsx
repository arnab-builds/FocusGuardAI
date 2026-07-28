import DashboardLayout from "../layouts/DashboardLayout";

import PageHeader from "../components/common/PageHeader";
import RequestTable from "../components/requests/RequestTable";

function Requests() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <PageHeader
                    title="Requests"
                    subtitle="Manage employee requests"
                />

                <RequestTable />

            </div>

        </DashboardLayout>

    );

}

export default Requests;