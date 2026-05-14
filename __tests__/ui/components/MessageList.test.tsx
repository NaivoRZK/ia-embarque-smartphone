import React from 'react';
import { render } from '@testing-library/react-native';
import { MessageList } from '../../../src/ui/components/MessageList';

describe('MessageList', () => {
  const messages = [
    { id: '1', text: 'Bonjour', role: 'assistant' as const, timestamp: 1 },
    { id: '2', text: 'Salut', role: 'user' as const, timestamp: 2 },
  ];

  it('renders all messages', () => {
    const { getByText } = render(<MessageList messages={messages} />);

    expect(getByText('Bonjour')).toBeTruthy();
    expect(getByText('Salut')).toBeTruthy();
  });

  it('renders empty list', () => {
    const { toJSON } = render(<MessageList messages={[]} />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders single message', () => {
    const { getByText } = render(
      <MessageList messages={[messages[0]]} />,
    );

    expect(getByText('Bonjour')).toBeTruthy();
  });
});
