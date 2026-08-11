import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";

import { useLanguage } from "../../context/useLanguage";
import { useOrgTheme } from "../../context/OrgThemeContext";
import { translateCategory } from "../../utils/categoryTranslations";

const colors = [
    "#4f46e5",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#8b5cf6",
    "#e11d48",
    "#14b8a6",
];

function CategoryChart({ data = [] }) {
    const { currentLanguageCode, t } = useLanguage();
    const { theme } = useOrgTheme();
    const isDark = theme === "dark";

    const chartData = Array.isArray(data)
        ? data.map((item) => ({
              ...item,
              name: translateCategory(
                  item.name,
                  t,
                  currentLanguageCode
              ),
          }))
        : [];

    const total = chartData.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
    );

    return (
        <div className="rounded-[18px] border border-indigo-100/50 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-800 shadow-sm transition-all duration-200 hover:shadow-md p-6 h-[460px] overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                {t(
                    "category_distribution",
                    "Category Distribution"
                )}
            </h2>

            {chartData.length > 0 ? (
                <div className="flex h-[370px] flex-col gap-4">
                    <div className="h-[250px]">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={92}
                                    label={({ percent }) =>
                                        percent >=
                                        0.06
                                            ? `${Math.round(
                                                  percent *
                                                      100
                                              )}%`
                                            : ""
                                    }
                                >
                                    {chartData.map(
                                        (_, index) => (
                                            <Cell
                                                key={
                                                    index
                                                }
                                                fill={
                                                    colors[
                                                        index %
                                                            colors.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
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
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid max-h-[112px] grid-cols-1 gap-x-4 gap-y-2 overflow-y-auto pr-2 text-sm sm:grid-cols-2">
                        {chartData.map(
                            (item, index) => {
                                const percentage =
                                    total
                                        ? Math.round(
                                              (Number(
                                                  item.value ||
                                                      0
                                              ) *
                                                  100) /
                                                  total
                                          )
                                        : 0;

                                return (
                                    <div
                                        key={
                                            item.name ||
                                            index
                                        }
                                        className="flex min-w-0 items-center justify-between gap-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        colors[
                                                            index %
                                                                colors.length
                                                        ],
                                                }}
                                            />

                                            <span className="min-w-0 break-words text-slate-600 dark:text-slate-300">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="shrink-0 font-semibold text-slate-700 dark:text-slate-200">
                                            {
                                                percentage
                                            }
                                            %
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {t(
                        "no_category_data_available",
                        "No category data available."
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryChart;
