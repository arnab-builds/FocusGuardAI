import DashboardLayout from "../layouts/DashboardLayout";
import ChatWindow from "../components/ai/ChatWindow";

function AIAssistant() {
    return (
        <DashboardLayout>
            <div className="min-h-screen overflow-hidden flex items-center justify-center bg-slate-100 p-4 sm:p-6">
                <ChatWindow />
            </div>
        </DashboardLayout>
    );
}

export default AIAssistant;