import React from "react";

export interface StepItem {
  id: number;
  label: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-1">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-2.5 relative z-10">
                {/* Outer ring + circle */}
                <div
                  className={`
                    relative w-9 h-9 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isActive
                      ? "bg-primary shadow-lg shadow-indigo-200 scale-110"
                      : isCompleted
                      ? "bg-emerald-500 shadow-md shadow-emerald-100"
                      : "bg-white border-2 border-slate-200"
                    }
                  `}
                >
                  {isCompleted ? (
                    /* Checkmark */
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}

                  {/* Active pulse ring */}
                  {/* {isActive && (
                    <span className="absolute inset-0 rounded-2xl ring-4 ring-indigo-300/40 animate-ping" />
                  )} */}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-200
                    ${isActive
                      ? "text-indigo-600"
                      : isCompleted
                      ? "text-emerald-600"
                      : "text-slate-400"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 relative mt-[18px] mx-2 h-[3px] rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`
                      absolute inset-y-0 left-0 rounded-full transition-all duration-500
                      ${isCompleted
                        ? "w-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "w-0"
                      }
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};