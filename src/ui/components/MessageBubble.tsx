import { View, Text } from 'react-native';
import type { Message } from '../../entities/Message';

interface MessageBubbleProps {
  message: Message;
  isGenerating: boolean;
}

export function MessageBubble({ message, isGenerating }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isEmptyAssistant = !isUser && message.text.length === 0 && isGenerating;

  const displayText = isEmptyAssistant ? '...' : message.text;

  return (
    <View
      className={`flex-row items-end my-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-primary-surface justify-center items-center mr-2">
          <Text className="text-base">{'\uD83E\uDD16'}</Text>
        </View>
      )}

      <View
        className={`max-w-[78%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-user rounded-br-md'
            : 'bg-white border border-neutral-200 rounded-bl-md'
        }`}
      >
        {isEmptyAssistant && (
          <View testID="thinking-dots" className="flex-row">
            <View className="w-2 h-2 bg-primary rounded-full mr-1" />
            <View className="w-2 h-2 bg-primary rounded-full mr-1 opacity-60" />
            <View className="w-2 h-2 bg-primary rounded-full opacity-30" />
          </View>
        )}

        {!isEmptyAssistant && (
          <Text
            className={`text-base leading-6 ${isUser ? 'text-white' : 'text-neutral-700'}`}
          >
            {displayText}
          </Text>
        )}
      </View>
    </View>
  );
}
