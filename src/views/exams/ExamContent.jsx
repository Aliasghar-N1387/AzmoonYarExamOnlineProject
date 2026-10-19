import { ClipboardList, Folder, SavePlus } from "lucide-react";
import React from "react";
import BtnContents from "../../components/custom/BtnContents";
import ExamsTable from "../../components/exams/ExamsTable";
import AdvertisementCard from "../../components/exams/AdvertisementCard";
import icon1 from "../../assets/img/icon-exam1.png";
import icon2 from "../../assets/img/icon-exam2.png";
import icon3 from "../../assets/img/icon-exam3.png";
import FilterExam from "../../components/exams/FilterExam";
import SearchExam from "../../components/exams/SearchExam";

function ExamContent() {
  const BtnHeader = [
    {
      id: 1,
      name: "ساخت آزمون جدید",
      icon: <SavePlus size={16} />,
      styleButton:
        "bg-violet-900 text-white hover:bg-violet-800 hover:shadow-violet-500/30 active:bg-violet-950",
    },
    {
      id: 2,
      name: "بانک آزمون ها",
      icon: <Folder size={16} />,
      styleButton:
        "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:bg-gray-100",
    },
  ];

  const advertisements = [
    {
      id: 1,
      icon: icon1,
      title: "گزارش عملکرد آزمون‌ها",
      description: "گزارش کامل نتایج آزمون‌ها و ارزیابی عملکرد دانش‌آموزان",
      buttonText: "مشاهده گزارش‌ها",
      variant: "green",
    },
    {
      id: 2,
      icon: icon2,
      title: "ساخت آزمون هوشمند",
      description: "با چندین کلیک آزمون استاندارد و حرفه‌ای بسازید",
      buttonText: "شروع ساخت",
      variant: "blue",
    },
    {
      id: 3,
      icon: icon3,
      title: "سوالات پیشنهادی",
      description: "پیشنهاد سوالات مناسب بر اساس درس و موضوعات",
      buttonText: "مشاهده پیشنهادها",
      variant: "orange",
    },
  ];

  return (
    <div className="p-6 h-full pb-0 bg-violet-50/50 dark:bg-slate-950">
      {/* Header  */}
      <div className="flex pl-10 justify-between text-right">
        <div className="flex gap-4">
          {BtnHeader.map((btn) => {
            return (
              <div key={btn.id}>
                <BtnContents
                  name={btn.name}
                  icon={btn.icon}
                  styleButton={btn.styleButton}
                  onClick={btn.onClick}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">آزمون ها</p>
            <p className="text-md"> . مدیريت و برگزارى آزمون های آموزشى</p>
          </div>
          <div className="flex justify-center items-center">
            <ClipboardList className="size-10 text-violet-700" />
          </div>
          <div className=""></div>
        </div>
      </div>

      <div className="mt-7 grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        {advertisements.map((item) => (
          <AdvertisementCard key={item.id} {...item} />
        ))}
      </div>

      {/* Content  */}
      <div className="my-5 flex justify-center items-end gap-14">
        <FilterExam />
        <SearchExam />
      </div>

      <div className="flex justify-center items-center mt-7">
        <ExamsTable />
      </div>

      {/* Footer */}
    </div>
  );
}

export default ExamContent;
