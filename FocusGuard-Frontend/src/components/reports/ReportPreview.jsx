const formatTime = (time) => {
  if (!time) return "0m";

  const [h, m] = time.split(":");

  if (Number(h) > 0)
    return `${h}h ${m}m`;

  return `${m}m`;
};

export default function ReportPreview({ report }) {
  if (!report)
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <h2 className="text-2xl font-bold">
          No Report Selected
        </h2>

        <p className="text-gray-500 mt-3">
          Generate a report to preview it.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      <h2 className="text-2xl font-bold mb-6">
        Report Preview
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <Info
          title="Productive Time"
          value={formatTime(report.productive_time)}
        />

        <Info
          title="Non Productive"
          value={formatTime(report.non_productive_time)}
        />

        <Info
          title="Neutral"
          value={formatTime(report.neutral_time)}
        />

        <Info
          title="Idle"
          value={formatTime(report.idle_time)}
        />

        <Info
          title="Websites"
          value={report.websites_visited}
        />

        <Info
          title="Tab Switches"
          value={report.tab_switches}
        />

        <Info
          title="Focus Score"
          value={`${report.productivity_percentage}%`}
        />

      </div>

    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="border rounded-xl p-4">

      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="text-xl font-bold mt-1">
        {value}
      </h3>

    </div>
  );
}