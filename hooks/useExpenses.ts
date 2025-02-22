import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types/expense';

const STORAGE_KEY = 'expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = {
        ...expense,
        id: Date.now().toString(),
      };
      const updatedExpenses = [...expenses, newExpense];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses);
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
  };
}