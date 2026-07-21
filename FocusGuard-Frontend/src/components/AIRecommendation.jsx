import { useState } from "react";
import { analyzeRecommendation } from "../api/recommendation";
import "./AIRecommendation.css";

export default function AIRecommendation() {

    const [range, setRange] = useState("today");

    const [loading, setLoading] = useState(false);

    const [recommendation, setRecommendation] = useState(null);

    const analyze = async () => {

        try {

            setLoading(true);

            const data = await analyzeRecommendation({
                range,
            });

            setRecommendation(data);

        } catch (err) {

            console.log(err);

            alert("Failed to generate recommendation");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="ai-card">

            <h2>AI Productivity Coach</h2>

            <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
            >

                <option value="today">Today</option>

                <option value="yesterday">
                    Yesterday
                </option>

                <option value="last_week">
                    Last Week
                </option>

                <option value="last_month">
                    Last Month
                </option>

            </select>

            <button
                onClick={analyze}
                disabled={loading}
            >

                {loading
                    ? "Analyzing..."
                    : "Analyze"}

            </button>

            {recommendation && (

                <div className="recommendation-box">

                    <h3>
                        {recommendation.title}
                    </h3>

                    <p>
                        {recommendation.message}
                    </p>

                </div>

            )}

        </div>

    );

}