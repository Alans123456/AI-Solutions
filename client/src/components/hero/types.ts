// src/components/hero/types.ts
export interface MousePosition {
  x: number;
  y: number;
}

export interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  color: string;
  shape: "circle" | "triangle" | "square" | "hexagon";
}

export type TechStackItem = {
  name: string;
  icon: React.ElementType;
  color: string;
};

export type StatCardProps = {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
  icon: React.ElementType;
};

export type InteractiveButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};
