import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  GraduationCap,
  Activity,
  ArrowLeft,
  Search,
  Funnel,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import Modal from "../../components/custom/Modal";
import DropDown from "../../components/custom/DropDown";
import activityLogCrud from "../../api/activityLogCrud";

function LatestActivities({ Cardinfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);

  const [activities, setActivities] = useState(Cardinfo?.activityLog || []);
  const [modalActivities, setModalActivities] = useState([]);

  const [loading, setLoading] = useState(false);

  const toPersianNumber = (number) => {
    return number.toString().replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
  };

  const getRelativeTime = (createdAt) => {
    if (!createdAt) return "";

    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "همین الان";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${toPersianNumber(diffInMinutes)} دقیقه پیش`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${toPersianNumber(diffInHours)} ساعت پیش`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 1) {
      return "دیروز";
    }

    return `${toPersianNumber(diffInDays)} روز پیش`;
  };

  const getActivityIcon = (message) => {
    if (!message) return Activity;

    if (message.includes("سوال") || message.includes("پرسش")) {
      return HelpCircle;
    }

    if (message.includes("آزمون") || message.includes("امتحان")) {
      return ClipboardList;
    }

    if (message.includes("کتاب")) {
      return BookOpen;
    }

    if (message.includes("درس")) {
      return GraduationCap;
    }

    return Activity;
  };

  const getActivityIconStyle = (message) => {
    if (!message) return "text-violet-500";

    if (message.includes("نتیجه")) {
      return "text-green-500";
    }

    return "text-violet-500";
  };

  const activiteLogTypeItems = [
    {
      id: 1,
      name: "بر اساس کتاب",
      value: "book",
    },
    {
      id: 2,
      name: "بر اساس سوال",
      value: "question",
    },
    {
      id: 3,
      name: "بر اساس امتحان",
      value: "exam",
    },
  ];

  useEffect(() => {
    if (!isModalOpen) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await activityLogCrud.getActivityLogs({
          search,
          activityType: filter?.value || "",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Activity Logs:", result);

        setModalActivities(result.data?.items || []);
      } catch (error) {
        console.error("خطا در دریافت فعالیت‌ها:", error);
        setModalActivities([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filter, isModalOpen]);

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-300 p-6 text-right h-65  dark:border-slate-700
           dark:bg-slate-900 shadow-md shadow-gray-800/10 dark:shadow-black/30"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="text-violet-900 size-4 dark:text-white" />

            <h2 className="font-bold text-gray-800 text-sm dark:text-white">آخرین فعالیت‌ها</h2>
          </div>
        </div>

        {/* Latest Activities */}
        <div className="latest-scroll space-y-5 overflow-auto max-h-30 pt-5">
          {activities.length > 0 ? (
            activities.map((item) => {
              const Icon = getActivityIcon(item.message);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center dark:bg-violet-950">
                      <Icon
                        size={20}
                        className={getActivityIconStyle(item.message)}
                      />
                    </div>

                    <p className="text-xs text-gray-700 font-medium dark:text-white">
                      {item.message}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap px-6">
                    {getRelativeTime(item.createdAt)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-gray-400">
                فعالیتی برای نمایش وجود ندارد.
              </p>
            </div>
          )}
        </div>
        {/* Footer */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-7 flex items-center gap-2 text-violet-600 text-xs font-semibold hover:gap-5 cursor-pointer transition-all"
        >
          مشاهده همه فعالیت‌ها
          <ArrowLeft size={15} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          header={
            <div>
              <div className="flex items-center gap-3">
                <Activity className="text-violet-600 dark:text-white" size={25} />

                <h2 className="text-xl dark:text-white font-bold text-gray-800">
                  همه فعالیت‌ها
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                تمام فعالیت‌های اخیر سیستم را مشاهده و جستجو کنید.
              </p>
            </div>
          }
          content={
            <div className="p-7">
              {/* Search + Filter */}
              <div className="mb-6 flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در فعالیت‌ها..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:text-white pr-11 pl-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filter */}
                <div className="relative">
                  <Funnel
                    size={17}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <div className="w-80">
                    <DropDown
                      items={activiteLogTypeItems}
                      placeholder="فیلتر کردن"
                      value={filter}
                      onChange={setFilter}
                    />
                  </div>
                </div>
              </div>
              {/* Activity Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {toPersianNumber(modalActivities.length)} فعالیت
                </p>

                {(search || filter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter(null);
                    }}
                    className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-all dark:text-white dark:hover:text-gray-400"
                  >
                    حذف فیلترها
                  </button>
                )}
              </div>

              {/* Activities */}
              <div className="space-y-3">
                {!loading && modalActivities.length > 0
                  ? modalActivities.map((item) => {
                      const Icon = getActivityIcon(item.message);

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 dark:bg-violet-950 p-4 transition hover:border-violet-100 hover:bg-violet-50/30"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white  shadow-sm">
                              <Icon
                                size={20}
                                className={getActivityIconStyle(item.message)}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-700 dark:text-white">
                                {item.message}
                              </p>

                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
                                {getRelativeTime(item.createdAt)}
                              </p>
                            </div>
                          </div>

                          <span className="mr-4 shrink-0 rounded-lg bg-violet-50 dark:bg-slate-900 dark:text-white px-3 py-1.5 text-[11px] font-bold text-violet-600">
                            فعالیت
                          </span>
                        </div>
                      );
                    })
                  : !loading && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-violet-950  dark:border dark:border-white">
                          <Activity size={25} className="text-gray-300" />
                        </div>

                        <p className="mt-4 text-sm font-bold text-gray-500 dark:text-white">
                          فعالیتی پیدا نشد
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          عبارت جستجو یا فیلتر را تغییر دهید.
                        </p>
                      </div>
                    )}
              </div>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                مجموع {toPersianNumber(modalActivities.length)} فعالیت
              </span>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-11 ml-3 rounded-xl bg-violet-700 dark:bg-violet-900 px-7 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                بستن
              </button>
            </div>
          }
        />
      )}
    </>
  );
}

export default LatestActivities;
