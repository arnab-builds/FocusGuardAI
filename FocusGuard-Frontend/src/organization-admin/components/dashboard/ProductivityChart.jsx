import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";
import { useOrgTheme } from "../../context/OrgThemeContext";

const COLORS = [
    "#22C55E",
    "#EF4444",
];

function ProductivityChart({
    data = [],
}) {
    const { t } = useLanguage();
    const { theme } = useOrgTheme();
    const isDark = theme === "dark";

    return (
        <div className="rounded-[18px] border border-blue-100/50 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/20 dark:to-slate-800 shadow-sm transition-all duration-200 hover:shadow-md p-6 h-[460px] flex flex-col">
            <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100">
                {t(
                    "productivity_breakdown",
                    "Productivity Distribution"
                )}
            </h2>

            {data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {t(
                        "no_productivity_data_for_period",
                        "No productivity data available"
                    )}
                </div>
            ) : (
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={4}
                                label={{
                                    fill: isDark ? "#F8FAFC" : "#0F172A",
                                    fontSize: 12,
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            COLORS[
                                                index %
                                                COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                                    borderColor: isDark ? "#334155" : "#E2E8F0",
                                    color: isDark ? "#F8FAFC" : "#0F172A",
                                    borderRadius: "12px",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                                }}
                                itemStyle={{
                                    color: isDark ? "#F8FAFC" : "#0F172A",
                                }}
                            />
                            <Legend 
                                wrapperStyle={{
                                    color: isDark ? "#94A3B8" : "#64748B"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ProductivityChart;
