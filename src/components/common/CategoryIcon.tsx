import React from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Fuel,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Sparkles,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Gift,
  PlusCircle,
  Coffee,
  Home,
  Smartphone,
  BookOpen,
  Dumbbell,
  HelpCircle,
  Tag,
  CreditCard,
  Building2,
  Wallet,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.FC<any>> = {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Fuel,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Sparkles,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  Gift,
  PlusCircle,
  Coffee,
  Home,
  Smartphone,
  BookOpen,
  Dumbbell,
  Tag,
  CreditCard,
  Building2,
  Wallet,
  HelpCircle,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  className = 'w-5 h-5',
  size = 20,
  color,
}) => {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
};
