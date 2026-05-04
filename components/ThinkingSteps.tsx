'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ThinkingStepsProps {
  steps: string[];
  isActive: boolean;
}

export function ThinkingSteps({ steps, isActive }: ThinkingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive || steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive, steps.length]);

  if (!isActive || steps.length === 0) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-secondary/50 px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-muted-foreground"
            >
              {steps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
