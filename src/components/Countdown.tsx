"use client";
import { useEffect, useState } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const calculate = () => {
   const parsed = targetDate.includes("T")
      ? new Date(targetDate)
      : new Date(targetDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"));
    const diff = parsed.getTime() - new Date().getTime();
    if (diff <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }
    return {
      days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculate> | null>(null);

  useEffect(() => {
    setTimeLeft(calculate());
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-3">
      <TimeBox value={timeLeft?.days ?? "--"} label="Días" />
      <TimeBox value={timeLeft?.hours ?? "--"} label="Hs" />
      <TimeBox value={timeLeft?.minutes ?? "--"} label="Min" />
      <TimeBox value={timeLeft?.seconds ?? "--"} label="Seg" />
    </div>
  );
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg">
        <span className="font-display text-3xl font-bold text-white">
          {value}
        </span>
      </div>
      <span className="mt-2 text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </span>
    </div>
  );
}