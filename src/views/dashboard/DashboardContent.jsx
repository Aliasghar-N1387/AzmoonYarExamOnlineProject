import React, { useEffect, useState } from "react";

import CardInformation from "../../components/dashboard/CardInformation";
import LinerChart from "../../components/dashboard/LinerChart";
import DonutChart from "../../components/dashboard/DonutChart";
import DropDown from "../../components/custom/DropDown";
import RapidOperation from "../../components/dashboard/RapidOperation";
import LatestActivities from "../../components/dashboard/LatestActivities";
import LatestExams from "../../components/dashboard/LatestExams";
import CalendarDate from "../../components/custom/CalenderDate";

import { ActivityIcon, ChartPie, Zap } from "lucide-react";

import dashboardCrud from "../../api/dashboardCrud";
import DashboardLoading from "../../components/dashboard/DashboardLoading";
import { useToast } from "../../components/custom/Toast";

function DashboardContent() {
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await dashboardCrud.getData();

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات");
        }

        const result = await response.json();

        setData(result.data);
      } catch (error) {
        console.error("Error:", error);

        toast.error("اتصال به سرور برقرار نشد", {
          title: "خطا در دریافت اطلاعات",
          duration: 5000,
        });

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="p-6 h-full pb-0 bg-violet-50/50 dark:bg-slate-950">
      {/* Card Info */}
      <div>
        <CardInformation Cardinfo={data} darkMode={darkMode} />
      </div>

      <div className="mt-8 flex gap-10 justify-center items-center">
        {/* Rapid Card */}
        <div
          className="relative px-15 py-3 rounded-lg border border-gray-300 text-right w-full dark:border-slate-700 bg-white
           dark:bg-slate-900 shadow-md shadow-gray-800/10 dark:shadow-black/30"
        >
          <p className="flex justify-end gap-3 text-sm font-bold my-2.5 dark:text-white">
            عملیات سریع
            <Zap className="size-4 text-violet-900 dark:text-white" />
          </p>

          <div className="">
            <RapidOperation />
          </div>
        </div>

        {/* Linear Chart */}
        <div
          className="relative rounded-lg border border-gray-300  dark:border-slate-700 bg-white
           dark:bg-slate-900 shadow-md shadow-gray-800/10 dark:shadow-black/30"
        >
          <div className="absolute top-2 right-10 flex justify-between">
            <p className="flex items-center gap-3 text-sm font-bold mt-2.5 dark:text-white">
              روند فعالیت
              <ActivityIcon className="size-4 text-violet-900 dark:text-white" />
            </p>
          </div>

          <div className="mt-10">
            <LinerChart />
          </div>
        </div>

        {/* Donut Chart */}
        <div
          className="relative rounded-lg border border-gray-300  dark:border-slate-700 bg-white
           dark:bg-slate-900 shadow-md shadow-gray-800/10 dark:shadow-black/30"
        >
          <p className="absolute top-2 right-10 flex items-center gap-3 text-sm font-bold mt-2.5 dark:text-white">
            سوالات براساس نوع
            <ChartPie className="size-4 text-violet-900 dark:text-white" />
          </p>

          <div className="mt-10">
            <DonutChart Cardinfo={data} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-17.5 justify-center items-center">
        <div>
          <LatestActivities Cardinfo={data} />
        </div>

        <div>
          <LatestExams />
        </div>

        <div>
          <CalendarDate />
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
