import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export type MciIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconCircleProps {
  name: MciIconName;
  color: string;
  backgroundColor: string;
  size?: number;
  iconSize?: number;
}

export function IconCircle({
  name,
  color,
  backgroundColor,
  size = 44,
  iconSize,
}: IconCircleProps) {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.5);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}>
      <MaterialCommunityIcons name={name} size={resolvedIconSize} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
