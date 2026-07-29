import { useState } from "react";
import { analyzeRecommendation } from "../services/aiRecommendationService";
import { useLanguage } from "../context/useLanguage";
import "./AIRecommendation.css";

export default function AIRecommendation() {
    const { currentLanguageCode, t } = useLanguage();

    const [range, setRange] = useState("today");
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    const analyze = async () => {
        try {
            setLoading(true);

            const data = await analyzeRecommendation({
                range,
                language: currentLanguageCode,
            });

            setRecommendation({
                ...data,
                language: currentLanguageCode,
            });

        } catch (err) {
            console.log(err);

            alert(
                t(
                    "failed_to_generate_recommendation",
                    "Failed to generate recommendation"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-card">
            <h2>
                {t(
                    "ai_productivity_coach",
                    "AI Productivity Coach"
                )}
            </h2>

            <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
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
                onClick={analyze}
                disabled={loading}
            >
                {loading
                    ? t("analyzing", "Analyzing...")
                    : t("analyze", "Analyze")}
            </button>

            {recommendation?.language === currentLanguageCode && (
                <div className="recommendation-box">
                    <h3>{recommendation.title}</h3>

                    <p>{recommendation.message}</p>
                </div>
            )}
        </div>
    );
}
