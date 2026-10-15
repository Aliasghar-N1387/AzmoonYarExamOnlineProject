import { ResponsivePie } from "@nivo/pie";

function QuestionTypeChart({ Cardinfo }) {
  const questionTypeNames = {
    1: "تشریحی",
    2: "جای خالی",
    3: "وصل کردنی",
    4: "تستی",
    5: "کوتاه پاسخ",
    6: "صحیح/غلط",
  };

  const colors = {
    1: "#34D399",
    2: "#EC4899",
    3: "#38BDF8",
    4: "#6D28D9",
    5: "#F59E0B",
    6: "#FBBF24",
  };

  const chartData = (Cardinfo?.questionTypeCounts ?? []).map((item) => ({
    id: item.questionType,
    label: questionTypeNames[item.questionType] || "نامشخص",
    value: item.questionCount,
    color: colors[item.questionType] || "#9CA3AF",
  }));

  return (
    <div className="flex items-center justify-between gap-8">
      {/* Chart */}
      <div className="h-70 p-10 w-70">
        {chartData.length === 0 ? (
          <div className="flex h-70 w-70 items-center justify-center text-sm text-gray-400">
            داده‌ای برای نمایش وجود ندارد
          </div>
        ) : (
          <ResponsivePie
            data={chartData}
            innerRadius={0.65}
            padAngle={1}
            cornerRadius={3}
            colors={(item) => item.data.color}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            animate
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex mr-10 flex-col gap-4">
        {chartData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-xs w-20 text-gray-600">{item.label}</span>
            </div>

            <span className="text-xs font-[Vazir] font-bold text-gray-500">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionTypeChart;
