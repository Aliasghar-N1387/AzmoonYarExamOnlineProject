import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useState } from "react";

function CalendarDate() {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const weeks = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1406);
  const [selectedDay, setSelectedDay] = useState(17);

  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div
      className="bg-white border shadow-sm border-gray-200 rounded-xl p-5 w-100 text-right dark:bg-slate-900 dark:border-slate-700"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 dark:text-white"
        >
          <ChevronRight size={16} />
        </button>

        <div className="flex items-center gap-2 text-gray-800 font-bold text-sm dark:text-white">
          <CalendarDays size={16} className="text-violet-600" />
          {months[month]} {year}
        </div>

        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 dark:text-white"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Week */}
      <div className="grid grid-cols-7 text-center text-[11px] text-gray-400 mb-2 dark:text-white">
        {weeks.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`mx-auto w-6 h-6 rounded-full text-[11px] flex items-center justify-center transition

              ${
                selectedDay === day
                  ? "bg-violet-600 text-white shadow-sm dark:text-white"
                  : "text-gray-600 hover:bg-violet-50 dark:hover:bg-violet-900 dark:text-white"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarDate;
