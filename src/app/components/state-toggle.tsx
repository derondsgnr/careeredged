/**
 * Draggable State Toggle
 * 
 * Allows switching between Onboarding, Empty, and Active states
 * for demo purposes. Position persists via localStorage.
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";

export type AppState = "onboarding" | "empty" | "active";

interface StateToggleProps {
  state: AppState;
  onChange: (state: AppState) => void;
}

export function StateToggle({ state, onChange }: StateToggleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Load position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stateTogglePosition");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save position to localStorage
  const savePosition = (pos: { x: number; y: number }) => {
    localStorage.setItem("stateTogglePosition", JSON.stringify(pos));
  };

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
        setPosition(newPos);
        savePosition(newPos);
      }}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="rounded-xl p-3"
      animate={{ background: isDragging ? "rgba(14,16,20,0.98)" : "rgba(14,16,20,0.95)" }}
      transition={{ duration: 0.15 }}
    >
      <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", backdropFilter: "blur(20px)", overflow: "hidden" }}>
        {/* Drag handle */}
        <div className="flex items-center justify-center py-1.5 px-3 cursor-grab active:cursor-grabbing" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <GripVertical className="w-3.5 h-3.5 text-[#374151]" />
        </div>

        {/* State buttons */}
        <div className="p-2 space-y-1">
          {(["active", "empty", "onboarding"] as AppState[]).map((s) => {
            const isActive = state === s;
            return (
              <button
                key={s}
                onClick={() => onChange(s)}
                className="w-full px-3 py-2 rounded-lg cursor-pointer text-left transition-colors"
                style={{
                  background: isActive ? "rgba(179,255,59,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(179,255,59,0.12)" : "1px solid transparent",
                }}
              >
                <span className="text-[11px] capitalize" style={{ color: isActive ? "#B3FF3B" : "#6B7280", fontFamily: "var(--font-body)", fontWeight: isActive ? 500 : 400 }}>
                  {s}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
