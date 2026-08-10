import { useLanguage } from "../../context/useLanguage";

function StatCard({ title, value, icon, color, cardClasses = "border-slate-100/50 border-t-slate-500 from-slate-50/70 to-white" }) {
    const { t } = useLanguage();

    return (
        <div className={`rounded-2xl shadow-sm p-6 border border-t-[3px] bg-gradient-to-br hover:shadow-md transition ${cardClasses}`}>
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