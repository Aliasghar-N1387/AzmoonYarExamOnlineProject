import {
  ChartNoAxesCombined,
  ClipboardList,
  FileChartColumnIncreasing,
  SquareCheckBig,
  SquareDashedBottom,
  SquarePen,
} from "lucide-react";

import { useEffect, useState } from "react";
import background from "../../assets/img/bg-card-question.png";

function CardinfoQuestions({darkMode}) {

  const Cardinfo = [
    {
      id: 1,
      name: "کل سوالات",
      count: 252,
      icon: FileChartColumnIncreasing,
      iconBg: "bg-violet-100 dark:bg-violet-950/50",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      id: 2,
      name: "جاخالی",
      count: 30,
      icon: SquareDashedBottom,
      iconBg: "bg-blue-100 dark:bg-blue-950/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: 3,
      name: "صحیح/غلط",
      count: 15,
      icon: SquareCheckBig,
      iconBg: "bg-green-100 dark:bg-green-950/50",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      id: 4,
      name: "تستی",
      count: 147,
      icon: SquarePen,
      iconBg: "bg-orange-100 dark:bg-orange-950/50",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      id: 5,
      name: "کوتاه پاسخ",
      count: 4,
      icon: ChartNoAxesCombined,
      iconBg: "bg-pink-100 dark:bg-pink-950/50",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      id: 6,
      name: "تشریحی",
      count: 27,
      icon: ClipboardList,
      iconBg: "bg-cyan-100 dark:bg-cyan-950/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  const [counts, setCounts] = useState(Cardinfo.map(() => 0));

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts(Cardinfo.map((card) => Math.floor(card.count * easeOut)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div dir="rtl" className="flex justify-center gap-5 text-right">
      {Cardinfo.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            style={{
              backgroundImage: darkMode ? "none" : `url(${background})`,
            }}
            className="relative flex min-w-56 overflow-hidden rounded-2xl border border-violet-100 bg-cover bg-center bg-no-repeat shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10
            "
          >
            {/* Light/Dark Overlay */}
            <div
              className="absolute inset-0 bg-white/60 dark:bg-slate-900/80
              "
            />

            {/* Content */}
            <div className="relative flex w-full items-center">
              {/* Icon */}
              <div className="flex items-center justify-center py-5 pr-4">
                <div
                  className={`flex size-13 items-center justify-center rounded-2xl shadow-sm ${card.iconBg}
                  `}
                >
                  <Icon
                    className={`size-7 ${card.iconColor}`}
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex w-full flex-col justify-center px-4 py-4">
                <p
                  className="text-sm font-bold text-slate-600 dark:text-slate-300
                  "
                >
                  {card.name}
                </p>

                <p
                  className={`
                    pt-1
                    text-2xl
                    font-bold
                    ${card.iconColor}
                  `}
                >
                  {counts[index].toLocaleString("fa-IR")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CardinfoQuestions;
