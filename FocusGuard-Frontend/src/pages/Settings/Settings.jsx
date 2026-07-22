import { useEffect, useState } from "react";
import {
  getUserSettings,
  updateUserSettings,
} from "../../services/settingsService";
import "./Settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    productive_threshold: 60,
    non_productive_threshold: 10,
    idle_threshold: 5,
    browser_notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getUserSettings();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Saving settings:", settings)

    try {
      await updateUserSettings(settings);
      
      setMessage("✅ Settings updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("❌ Failed to update settings.");
    }
  };

  if (loading) {
    return <h2>Loading Settings...</h2>;
  }

  return (
  <div className="settings-container">
    <div className="settings-card">

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-5 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
      >
        ← Back to Dashboard
      </button>

      <h1>⚙ Settings</h1>

        <form onSubmit={handleSubmit}>

          <label>
            Productive Threshold (minutes)
          </label>

          <input
            type="number"
            name="productive_threshold"
            value={settings.productive_threshold}
            onChange={handleChange}
          />

          <label>
            Non Productive Threshold (minutes)
          </label>

          <input
            type="number"
            name="non_productive_threshold"
            value={settings.non_productive_threshold}
            onChange={handleChange}
          />

          <label>
            Idle Threshold (minutes)
          </label>

          <input
            type="number"
            name="idle_threshold"
            value={settings.idle_threshold}
            onChange={handleChange}
          />

          <div className="checkbox">

            <input
              type="checkbox"
              name="browser_notifications"
              checked={settings.browser_notifications}
              onChange={handleChange}
            />

            <span>Browser Notifications</span>

          </div>

          <button type="submit">
            Save Settings
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default Settings;