import { View, Text } from 'react-native';
import type { Message } from '../../entities/Message';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const rowStyle = isUser ? 'justify-end' : 'justify-start';

  let bubbleStyle = 'bg-white rounded-bl-md border border-primary';
  let textStyle = 'text-neutral-700';
  if (isUser) {
    bubbleStyle = 'bg-user rounded-br-md';
    textStyle = 'text-white';
  }

  return (
    <View className={`flex-row items-end my-1 ${rowStyle}`}>
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-primary-surface justify-center items-center mr-1.5">
          <Text className="text-lg">{'\uD83D\uDC42'}</Text>
        </View>
      )}
      <View className={`max-w-[75%] px-3.5 py-2.5 rounded-xl ${bubbleStyle}`}>
        <Text className={`text-base leading-6 ${textStyle}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}
