import { ClipboardList, ArrowLeft } from "lucide-react";

function LatestExams() {
  const exams = [
    {
      id: 1,
      title: "آزمون فصل ۳ ریاضی دهم",
      type: "تستی",
      date: "۱۴۰۳/۰۳/۱۴",
      status: "تکمیل شده",
      statusStyle: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      id: 2,
      title: "آزمون شیمی آلی (فصل ۲)",
      type: "تشریحی",
      date: "۱۴۰۳/۰۳/۱۲",
      status: "در حال تصحیح",
      statusStyle: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    },
    {
      id: 3,
      title: "آزمون جامع فیزیک",
      type: "تستی",
      date: "۱۴۰۳/۰۳/۱۰",
      status: "تکمیل شده",
      statusStyle: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      id: 4,
      title: "آزمون زیست شناسی دوازدهم",
      type: "تستی",
      date: "۱۴۰۳/۰۳/۰۸",
      status: "لغو شده",
      statusStyle: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
    },
  ];

  return (
    <div dir="rtl" className="w-full rounded-xl border border-gray-200 bg-white p-5 text-right shadow-sm transition-colors duration-300 max-h-75 overflow-hidden  dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-black/20">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between max-h-60">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
            <ClipboardList size={17} />
          </div>

          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
            آخرین آزمون‌ها
          </h2>
        </div>

        <button type="button" className="text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
          مشاهده همه
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden max-h-32 rounded-lg border border-gray-100 dark:border-slate-800">
        {/* Table Header */}
        <div className="grid grid-cols-4 items-center border-b border-gray-100 bg-gray-50 px-4 py-3 text-[11px] font-semibold text-gray-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-gray-500">
          <span>عنوان</span>
          <span className="text-center">نوع آزمون</span>
          <span className="text-center">تاریخ</span>
          <span className="text-center">وضعیت</span>
        </div>

        {/* List */}
        <div className="latest-scroll max-h-56 overflow-y-auto">
          {exams.map((exam) => (
            <div key={exam.id} className="grid grid-cols-4 items-center gap-2 border-b border-gray-100 px-4 py-3.5 text-xs transition-colors hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              {/* Title */}
              <p title={exam.title} className="truncate font-bold text-gray-700 dark:text-gray-200">
                {exam.title}
              </p>

              {/* Type */}
              <p className="text-center text-gray-500 dark:text-gray-400">
                {exam.type}
              </p>

              {/* Date */}
              <p className="text-center text-gray-400 dark:text-gray-500">
                {exam.date}
              </p>

              {/* Status */}
              <div className="flex justify-center">
                <span className={`w-fit whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${exam.statusStyle}`}>
                  {exam.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <button type="button" className="group mt-5 flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-600 transition-all hover:gap-3 hover:text-violet-700  dark:hover:text-violet-300">
        <span>مشاهده همه آزمون‌ها</span>

        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
      </button>
    </div>
  );
}

export default LatestExams;
