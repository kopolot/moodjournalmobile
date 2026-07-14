// Fallback MaterialIcons mapping for Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

const MAPPING: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'book.fill': 'menu-book',
  'plus.circle.fill': 'add-circle',
  'person.fill': 'person',
  'paperplane.fill': 'send',
  'square.and.pencil': 'edit',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
