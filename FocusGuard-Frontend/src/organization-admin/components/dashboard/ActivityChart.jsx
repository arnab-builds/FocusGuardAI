import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useLanguage } from "../../context/useLanguage";

const formatHours = (value, t) =>
    `${Number(value || 0).toFixed(1)}${t("hours_short", "h")}`;

const toHours = (item, secondsKey, legacyKeys) => {
    const seconds = Number(item?.[secondsKey]);

    if (Number.isFinite(seconds)) {
        return Math.max(0, seconds) / 3600;
    }

    for (const key of legacyKeys) {
        const value = Number(item?.[key]);

        if (Number.isFinite(value)) {
            return Math.max(0, value);
        }
    }

    return 0;
};

const formatDay = (item) => {
    if (item.date) {
        return new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            day: "numeric",
        }).format(new Date(`${item.date}T12:00:00`));
    }

    return item.day || item.name || "";
};

function ActivityChart({ data = [] }) {
    const { t } = useLanguage();

    const chartData = data.map((item) => ({
        day: formatDay(item),
        productive: toHours(item, "productive_seconds", [
            "productive",
        ]),
        unproductive: toHours(
            item,
            "non_productive_seconds",
            ["unproductive", "non_productive", "nonProductive"]
        ),
    }));

    return (
        <Card
            elevation={0}
            className="rounded-[18px] border border-blue-100/50 bg-gradient-to-br from-blue-50/70 to-white shadow-sm transition-all duration-200 hover:shadow-md"
            sx={{ height: "100%" }}
        >
            <CardContent sx={{ p: 3.5 }}>
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <Typography
                            sx={{
                                color: "#64748B",
                                fontWeight: 700,
                                fontSize: 12,
                                letterSpacing: 0,
                                textTransform: "uppercase",
                            }}
                        >
                            {t(
                                "productivity_trend",
                                "Productivity Trend"
                            )}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            mt={0.5}
                            color="#0F172A"
                        >
                            {t(
                                "weekly_trend",
                                "Weekly Trend"
                            )}
                        </Typography>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <AnalyticsRoundedIcon fontSize="small" />
                    </div>
                </div>

                <div className="h-[330px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                barGap={8}
                                barCategoryGap="28%"
                                margin={{
                                    top: 8,
                                    right: 12,
                                    left: 0,
                                    bottom: 8,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#E2E8F0"
                                    strokeDasharray="4 4"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: 12,
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        formatHours(
                                            value,
                                            t
                                        )
                                    }
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: 12,
                                    }}
                                    width={44}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "rgba(99,102,241,.08)",
                                    }}
                                    formatter={(
                                        value,
                                        name
                                    ) => [
                                        formatHours(
                                            value,
                                            t
                                        ),
                                        name ===
                                        "productive"
                                            ? t(
                                                  "productive",
                                                  "Productive"
                                              )
                                            : t(
                                                  "unproductive",
                                                  "Unproductive"
                                              ),
                                    ]}
                                    labelStyle={{
                                        color: "#0F172A",
                                        fontWeight: 700,
                                    }}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "1px solid #E2E8F0",
                                        boxShadow:
                                            "0 12px 24px rgba(15,23,42,.10)",
                                    }}
                                />

                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingTop: 18,
                                        fontSize: 13,
                                    }}
                                    formatter={(value) =>
                                        value ===
                                        "productive"
                                            ? t(
                                                  "productive",
                                                  "Productive"
                                              )
                                            : t(
                                                  "unproductive",
                                                  "Unproductive"
                                              )
                                    }
                                />

                                <Bar
                                    dataKey="productive"
                                    fill="#22C55E"
                                    radius={[
                                        8, 8, 0, 0,
                                    ]}
                                    maxBarSize={34}
                                />

                                <Bar
                                    dataKey="unproductive"
                                    fill="#EF4444"
                                    radius={[
                                        8, 8, 0, 0,
                                    ]}
                                    maxBarSize={34}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                            {t(
                                "no_weekly_trend_data",
                                "No weekly trend data available."
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ActivityChart;
