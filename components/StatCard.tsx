import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="labelLarge" style={styles.label}>
          {label}
        </Text>
        <Text variant="headlineMedium">{value}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    marginBottom: 4,
    opacity: 0.7,
  },
});
