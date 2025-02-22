import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { useExpenses } from '../../hooks/useExpenses';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function ExpensesScreen() {
  const { expenses, loading, deleteExpense } = useExpenses();

  const handleShare = async (expense: any) => {
    const message = `Expense: ${expense.description}\nAmount: $${expense.amount}\nCategory: ${expense.category}\nDate: ${format(new Date(expense.date), 'PPP')}`;
    
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            text: message,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        alert('Sharing is not supported on this browser');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading expenses...</Text>
      </View>
    );
  }

  if (expenses.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No expenses yet</Text>
        <Text style={styles.subText}>Add your first expense to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              <View style={styles.actions}>
                <Pressable
                  onPress={() => handleShare(item)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="share-outline" size={20} color="#4b5563" />
                </Pressable>
                <Pressable
                  onPress={() => deleteExpense(item.id)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Pressable>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.details}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.date}>
                {format(new Date(item.date), 'PPP')}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563eb',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});