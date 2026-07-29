import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";

import { useLanguage } from "../../context/useLanguage";

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
    const { t } = useLanguage();

    const chartData = Array.isArray(data)
        ? data
        : [];

    const total = chartData.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[460px] overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">
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

                                <Tooltip />

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

                                            <span className="min-w-0 break-words text-slate-600">
                                                {item.name ||
                                                    t(
                                                        "unknown",
                                                        "Unknown"
                                                    )}
                                            </span>
                                        </div>

                                        <span className="shrink-0 font-semibold text-slate-700">
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
                <div className="h-full flex items-center justify-center text-slate-500">
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