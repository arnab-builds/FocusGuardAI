import DashboardLayout from "../layouts/DashboardLayout";
import ChatWindow from "../components/ai/ChatWindow";

function AIAssistant() {
    return (
        <DashboardLayout>
            <div className="min-h-[calc(100vh-100px)] w-full p-4 sm:p-6 lg:p-8">
                <ChatWindow />
            </div>
        </DashboardLayout>
    );
}

export default AIAssistant;