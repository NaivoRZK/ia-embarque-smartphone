import { useRef, useCallback } from 'react';
import { FlatList } from 'react-native';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../../entities/Message';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
}

export function MessageList({ messages, isGenerating }: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={({ item }) => <MessageBubble message={item} isGenerating={isGenerating} />}
      keyExtractor={(item) => item.id}
      extraData={messages}
      contentContainerClassName="px-3 py-2"
      onContentSizeChange={handleContentSizeChange}
    />
  );
}
