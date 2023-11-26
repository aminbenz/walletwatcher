import { TransactionCategory } from "@/types/enums";

import {
  Briefcase,
  Luggage,
  Home,
  Receipt,
  Theater,
  HeartPulse,
  ShoppingBasket,
  GraduationCap,
  PiggyBank,
  ArrowDownUp,
} from "lucide-react";

const CategoryIcon = ({ category }: { category: TransactionCategory }) => {
  switch (category) {
    case TransactionCategory.FREELANCING:
      return <Briefcase />;
    case TransactionCategory.TRANSPORTATION:
      return <Luggage />;
    case TransactionCategory.HOUSING:
      return <Home />;
    case TransactionCategory.BILLS_UTILITIES:
      return <Receipt />;
    case TransactionCategory.ENTERTAINMENT:
      return <Theater />;
    case TransactionCategory.HEALTH_FITNESS:
      return <HeartPulse />;
    case TransactionCategory.SHOPPING:
      return <ShoppingBasket />;
    case TransactionCategory.EDUCATION:
      return <GraduationCap />;
    case TransactionCategory.SAVINGS_INVESTMENTS:
      return <PiggyBank />;
    case TransactionCategory.MISCELLANEOUS:
      return <PiggyBank />;
    default:
      return <ArrowDownUp />;
  }
};
export default CategoryIcon;
