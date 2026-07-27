import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  return (
    <div className="flex bg-slate-100">

      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;