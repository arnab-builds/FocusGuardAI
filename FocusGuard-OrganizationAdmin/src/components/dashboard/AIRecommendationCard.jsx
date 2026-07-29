import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";

import { analyzeRecommendation } from "../../services/recommendationService";
import { useLanguage } from "../../context/useLanguage";

function AIRecommendationCard() {
    const { t } = useLanguage();

    const [range, setRange] = useState("today");

    const [loading, setLoading] = useState(false);

    const [recommendation, setRecommendation] =
        useState(null);

    const handleAnalyze = async () => {

        try {

            setLoading(true);

            const data =
                await analyzeRecommendation({
                    range,
                });

            setRecommendation(data);

        }

        catch (error) {

            console.error(error);

            alert(
                t(
                    "failed_to_generate_recommendation",
                    "Failed to generate recommendation."
                )
            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h2 className="text-xl font-semibold text-slate-800">

                        {t("ai_productivity_coach", "AI Productivity Coach")}

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                        {t(
                            "ai_productivity_suggestions",
                            "Get AI-powered productivity suggestions."
                        )}

                    </p>

                </div>

                <div className="bg-indigo-100 p-3 rounded-xl">

                    <Brain
                        className="text-indigo-600"
                        size={24}
                    />

                </div>

            </div>

            <select
                value={range}
                onChange={(e) =>
                    setRange(e.target.value)
                }
                className="w-full border rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
            >

                <option value="today">

                    {t("today", "Today")}

                </option>

                <option value="yesterday">

                    {t("yesterday", "Yesterday")}

                </option>

                <option value="last_week">

                    {t("last_week", "Last Week")}

                </option>

                <option value="last_month">

                    {t("last_month", "Last Month")}

                </option>

            </select>

            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2"
            >

                <Sparkles size={18} />

                {

                    loading

                        ? t("analyzing", "Analyzing...")

                        : t(
                              "generate_recommendation",
                              "Generate Recommendation"
                          )

                }

            </button>

            {

                recommendation && (

                    <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">

                        <h3 className="font-semibold text-slate-800 mb-2">

                            {recommendation.title}

                        </h3>

                        <p className="text-slate-600 leading-7">

                            {recommendation.message}

                        </p>

                    </div>

                )

            }

        </div>

    );

}

export default AIRecommendationCard;
