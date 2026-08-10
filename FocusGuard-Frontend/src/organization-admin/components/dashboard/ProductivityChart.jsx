import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../context/useLanguage";

const COLORS = [
    "#22C55E",
    "#EF4444",
];

function ProductivityChart({
    data = [],
}) {
    const { t } = useLanguage();

    return (

        <Card className="rounded-[18px] border border-blue-100/50 bg-gradient-to-br from-blue-50/70 to-white shadow-sm transition-all duration-200 hover:shadow-md" elevation={0}>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={3}
                >
                    {t(
                        "productivity_breakdown",
                        "Productivity Distribution"
                    )}
                </Typography>

                {

                    data.length === 0 ? (

                        <div className="h-[300px] flex items-center justify-center text-slate-500">

                            {t(
                                "no_productivity_data_for_period",
                                "No productivity data available"
                            )}

                        </div>

                    ) : (

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

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
                                    label
                                >

                                    {

                                        data.map((entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[
                                                        index %
                                                        COLORS.length
                                                    ]
                                                }
                                            />

                                        ))

                                    }

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    )

                }

            </CardContent>

        </Card>

    );

}

export default ProductivityChart;
