import { useLanguage } from "../../context/useLanguage";

function StatCard({ title, value, icon, color }) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm">
                        {title ||
                            t(
                                "untitled",
                                "Untitled"
                            )}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-slate-800">
                        {value}
                    </h2>
                </div>

                <div
                    className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;