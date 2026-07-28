import {
    Card,
    CardContent,
    Stack,
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

const formatHours = (value) => `${Number(value || 0).toFixed(1)}h`;

function ActivityChart({ data = [] }) {
    const chartData = data.map((item) => ({
        day: item.day || item.name,
        productive: Number(item.productive || 0),
        unproductive: Number(
            item.unproductive ??
                item.non_productive ??
                item.nonProductive ??
                0
        ),
    }));

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: "18px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 12px 30px rgba(15,23,42,.06)",
            }}
        >
            <CardContent sx={{ p: 3.5 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={4}
                >
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
                            Productivity Trend
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            mt={0.5}
                            color="#0F172A"
                        >
                            Weekly Trend
                        </Typography>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <AnalyticsRoundedIcon fontSize="small" />
                    </div>
                </Stack>

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
                                    tickFormatter={formatHours}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: 12,
                                    }}
                                    width={44}
                                />

                                <Tooltip
                                    cursor={{ fill: "rgba(99,102,241,.08)" }}
                                    formatter={(value, name) => [
                                        formatHours(value),
                                        name === "productive"
                                            ? "Productive"
                                            : "Unproductive",
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
                                        value === "productive"
                                            ? "Productive"
                                            : "Unproductive"
                                    }
                                />

                                <Bar
                                    dataKey="productive"
                                    fill="#22C55E"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={34}
                                />

                                <Bar
                                    dataKey="unproductive"
                                    fill="#EF4444"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={34}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                            No weekly trend data available.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ActivityChart;
