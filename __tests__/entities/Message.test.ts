import type { Message } from '../../src/entities/Message';

describe('Message entity', () => {
  it('creates a user message with correct structure', () => {
    const message: Message = {
      id: '123',
      text: 'Bonjour',
      role: 'user',
      timestamp: 1000,
    };

    expect(message.id).toBe('123');
    expect(message.text).toBe('Bonjour');
    expect(message.role).toBe('user');
    expect(message.timestamp).toBe(1000);
  });

  it('creates an assistant message', () => {
    const message: Message = {
      id: '456',
      text: 'Salut!',
      role: 'assistant',
      timestamp: 2000,
    };

    expect(message.role).toBe('assistant');
  });
});
