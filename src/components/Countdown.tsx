"use client";

import { useEffect, useState } from "react";

export default function Countdown({
  targetDate,
}: {
  targetDate: string;
}) {
  const calculate = () => {
    const diff =
      new Date(targetDate).getTime() - new Date().getTime();

    if (diff <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return {
      days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(
        Math.floor((diff / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0"),
      minutes: String(
        Math.floor((diff / (1000 * 60)) % 60)
      ).padStart(2, "0"),
      seconds: String(
        Math.floor((diff / 1000) % 60)
      ).padStart(2, "0"),
    };
  };

  const [time, setTime] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-3">
      <TimeBox value={time.days} label="Días" />
      <TimeBox value={time.hours} label="Horas" />
      <TimeBox value={time.minutes} label="Min" />
      <TimeBox value={time.seconds} label="Seg" />
    </div>
  );
}

function TimeBox({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
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