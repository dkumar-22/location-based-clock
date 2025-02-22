export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'utilities'
  | 'other';