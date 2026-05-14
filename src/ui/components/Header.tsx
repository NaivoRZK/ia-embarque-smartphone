import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const insets = useSafeAreaInsets();

  const topPadding = subtitle ? insets.top + 8 : insets.top;

  return (
    <View
      className="bg-primary items-center px-4 pb-3"
      style={{ paddingTop: topPadding }}
    >
      <Text className="text-white text-xl font-extrabold tracking-wider">
        {title}
      </Text>
      {subtitle != null && (
        <Text className="text-white/80 text-xs mt-0.5">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
