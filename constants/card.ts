import { StyleSheet } from 'react-native';

/** Shared centered metric / feature card content layout. */
export const featureCardContentStyle = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  centeredText: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
