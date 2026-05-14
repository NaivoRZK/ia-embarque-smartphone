import React from 'react';
import { render } from '@testing-library/react-native';
import { MessageBubble } from '../../../src/ui/components/MessageBubble';

describe('MessageBubble', () => {
  const userMessage = {
    id: '1',
    text: 'Bonjour',
    role: 'user' as const,
    timestamp: 1000,
  };

  const assistantMessage = {
    id: '2',
    text: 'Salut!',
    role: 'assistant' as const,
    timestamp: 2000,
  };

  it('renders user message text', () => {
    const { getByText } = render(
      <MessageBubble message={userMessage} isGenerating={false} />,
    );

    expect(getByText('Bonjour')).toBeTruthy();
  });

  it('renders assistant message text', () => {
    const { getByText } = render(
      <MessageBubble message={assistantMessage} isGenerating={false} />,
    );

    expect(getByText('Salut!')).toBeTruthy();
  });

  it('shows avatar for assistant', () => {
    const { getByText } = render(
      <MessageBubble message={assistantMessage} isGenerating={false} />,
    );

    expect(getByText('\uD83E\uDD16')).toBeTruthy();
  });

  it('does not show avatar for user', () => {
    const { queryByText } = render(
      <MessageBubble message={userMessage} isGenerating={false} />,
    );

    expect(queryByText('\uD83E\uDD16')).toBeNull();
  });

  it('shows thinking dots when assistant is generating empty message', () => {
    const emptyAssistant = {
      id: '3',
      text: '',
      role: 'assistant' as const,
      timestamp: 3000,
    };

    const { queryByTestId } = render(
      <MessageBubble message={emptyAssistant} isGenerating={true} />,
    );

    expect(queryByTestId('thinking-dots')).toBeTruthy();
  });

  it('renders empty assistant message as empty when not generating', () => {
    const emptyAssistant = {
      id: '3',
      text: '',
      role: 'assistant' as const,
      timestamp: 3000,
    };

    const { queryByText } = render(
      <MessageBubble message={emptyAssistant} isGenerating={false} />,
    );

    expect(queryByText('...')).toBeNull();
  });
});
