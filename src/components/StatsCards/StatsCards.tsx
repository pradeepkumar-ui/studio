// import * as React from "react";

// interface StatCard {
//   label: string;
//   value: number | string;
//   color: "purple" | "green" | "amber" | "red";
//   icon: React.ReactNode;
// }

// const colorMap = {
//   purple: {
//     value: "text-violet-700",
//     bg: "bg-violet-50",
//     border: "border-violet-100",
//     iconRing: "ring-violet-200",
//     bar: "bg-violet-500",
//     labelColor: "text-violet-400",
//   },
//   green: {
//     value: "text-emerald-600",
//     bg: "bg-emerald-50",
//     border: "border-emerald-100",
//     iconRing: "ring-emerald-200",
//     bar: "bg-emerald-500",
//     labelColor: "text-emerald-400",
//   },
//   amber: {
//     value: "text-amber-600",
//     bg: "bg-amber-50",
//     border: "border-amber-100",
//     iconRing: "ring-amber-200",
//     bar: "bg-amber-500",
//     labelColor: "text-amber-400",
//   },
//   red: {
//     value: "text-red-600",
//     bg: "bg-red-50",
//     border: "border-red-100",
//     iconRing: "ring-red-200",
//     bar: "bg-red-500",
//     labelColor: "text-red-400",
//   },
// };

// export function StatsCards({ cards }: { cards: StatCard[] }) {
//   return (
//     <div className="grid grid-cols-4 gap-3 mb-4">
//       {cards.map((card, idx) => {
//         const c = colorMap[card.color];
//         return (
//           <div
//             key={card.label}
//             className={`
//               relative overflow-hidden
//               bg-white rounded-2xl border ${c.border}
//               px-5 py-4
//               shadow-sm hover:shadow-md
//               transition-shadow duration-200
//             `}
//           >
//             {/* Subtle top accent bar */}
//             <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.bar} opacity-60`} />

//             {/* Label */}
//             <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">
//               {card.label}
//             </p>

//             {/* Value + Icon row */}
//             <div className="flex items-end justify-between">
//               <span className={`text-[28px] leading-none font-bold ${c.value}`}>
//                 {card.value}
//               </span>

//               <div
//                 className={`
//                   w-9 h-9 rounded-xl flex items-center justify-center
//                   ${c.bg} ring-1 ${c.iconRing}
//                 `}
//               >
//                 {card.icon}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }



import * as React from "react";
import { Card } from "../ui/card";

interface StatCard {
  label: string;
  value: number | string;
  color: "purple" | "green" | "amber" | "red";
  icon: React.ReactNode;
}

const colorMap = {
  purple: {
    value: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconRing: "ring-violet-200",
    bar: "bg-violet-500",
  },
  green: {
    value: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconRing: "ring-emerald-200",
    bar: "bg-emerald-500",
  },
  amber: {
    value: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconRing: "ring-amber-200",
    bar: "bg-amber-500",
  },
  red: {
    value: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    iconRing: "ring-red-200",
    bar: "bg-red-500",
  },
};

export function StatsCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <Card
            key={card.label}
            className={`
              relative overflow-hidden
              border
              px-5 py-4
              shadow-sm hover:shadow-md
              transition-shadow duration-200 bg-white
            `}
          >
            {/* Subtle top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-60`} />

            {/* Label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">
              {card.label}
            </p>

            {/* Value + Icon row */}
            <div className="flex items-end justify-between">
              <span className={`text-[28px] leading-none font-bold ${c.value}`}>
                {card.value}
              </span>

              <div
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center
                  ${c.bg} ring-1 ${c.iconRing}
                `}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}