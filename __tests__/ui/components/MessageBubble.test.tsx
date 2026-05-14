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
    const { getByText } = render(<MessageBubble message={userMessage} />);

    expect(getByText('Bonjour')).toBeTruthy();
  });

  it('renders assistant message text', () => {
    const { getByText } = render(<MessageBubble message={assistantMessage} />);

    expect(getByText('Salut!')).toBeTruthy();
  });

  it('shows avatar for assistant', () => {
    const { getByText } = render(<MessageBubble message={assistantMessage} />);

    expect(getByText('\uD83D\uDC42')).toBeTruthy();
  });

  it('does not show avatar for user', () => {
    const { queryByText } = render(<MessageBubble message={userMessage} />);

    expect(queryByText('\uD83D\uDC42')).toBeNull();
  });
});
