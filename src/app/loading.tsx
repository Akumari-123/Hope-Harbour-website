
"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(60), 100);
    const timer2 = setTimeout(() => setProgress(90), 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <Progress value={progress} className="h-1" />
    </div>
  );
}
