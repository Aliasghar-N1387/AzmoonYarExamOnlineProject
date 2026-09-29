import {
  BookOpen,
  CircleQuestionMark,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import background from "../../assets/img/bg-card-question.png";


function CardInformation({ Cardinfo, darkMode }) {
  
  const cards = [
    {
      id: 1,
      name: "سوالات",
      increse: "+ 50%",
      titrIncrese: "نسبت به ماه گذشته",
      icon: (
        <CircleQuestionMark className="bg-violet-800/30 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 rounded-2xl p-3 size-15" />
      ),
      count: Cardinfo.totalQuestions,
    },
    {
      id: 2,
      name: "کتاب ها",
      increse: "+ 81%",
      titrIncrese: "نسبت به ماه گذشته",
      icon: (
        <BookOpen className="bg-yellow-300/30 dark:bg-yellow-400/10 text-yellow-500 dark:text-yellow-400 rounded-2xl p-3 size-15" />
      ),
      count: Cardinfo.totalBooks,
    },
    {
      id: 3,
      name: "آزمون ها",
      increse: "+ 5%",
      titrIncrese: "نسبت به ماه گذشته",
      icon: (
        <ClipboardList className="bg-green-400/30 dark:bg-green-400/10 text-green-600 dark:text-green-400 rounded-2xl p-3 size-15" />
      ),
      count: Cardinfo.totalExams,
    },
    {
      id: 4,
      name: "دروس",
      increse: "+ 60%",
      titrIncrese: "نسبت به ماه گذشته",
      icon: (
        <GraduationCap className="bg-blue-800/30 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-2xl p-3 size-15" />
      ),
      count: Cardinfo.totalLessons,
    },
  ];

  const [counts, setCounts] = useState(cards.map(() => 0));

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts(cards.map((card) => Math.floor(card.count * easeOut)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [Cardinfo]);

  return (
    <div className="text-right flex justify-center gap-10">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="flex w-fulls rounded-xl border border-gray-300 dark:border-slate-700 bg-white
           dark:bg-slate-900 shadow-md shadow-gray-800/10 dark:shadow-black/30 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: darkMode ? "none" : `url(${background})`,
          }}
        >
          <div className="flex items-center justify-center pl-5">
            <span>{card.icon}</span>
          </div>

          <div className="w-full pr-5 py-3 px-15">
            <p className="font-bold text-lg text-gray-800 dark:text-slate-100 transition-colors duration-300">
              {card.name}
            </p>

            <p className="font-bold text-3xl text-gray-900 dark:text-white transition-colors duration-300">
              {counts[index].toLocaleString("fa-IR")}
            </p>

            <span className="flex pt-1 gap-2 items-end justify-end font-bold text-xs">
              <span className="text-gray-400 dark:text-slate-500">
                {card.titrIncrese}
              </span>

              <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                {card.increse}
              </p>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardInformation;
