import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ChatInput } from '../../../src/ui/components/ChatInput';

describe('ChatInput', () => {
  const defaultProps = {
    inputText: '',
    onInputChange: jest.fn(),
    onSend: jest.fn(),
    isGenerating: false,
    isListening: false,
    voiceError: '',
    onMicPress: jest.fn(),
  };

  it('renders text input', () => {
    const { getByPlaceholderText } = render(<ChatInput {...defaultProps} />);

    expect(getByPlaceholderText('Écrivez votre message...')).toBeTruthy();
  });

  it('calls onInputChange when typing', () => {
    const onInputChange = jest.fn();
    const { getByPlaceholderText } = render(
      <ChatInput {...defaultProps} onInputChange={onInputChange} />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Écrivez votre message...'),
      'Hello',
    );

    expect(onInputChange).toHaveBeenCalledWith('Hello');
  });

  it('calls onSend when send button pressed with text', () => {
    const onSend = jest.fn();
    const { getByText } = render(
      <ChatInput {...defaultProps} inputText="Hello" onSend={onSend} />,
    );

    fireEvent.press(getByText('\u2191'));

    expect(onSend).toHaveBeenCalled();
  });

  it('does not call onSend when input is empty', () => {
    const onSend = jest.fn();
    const { getByText } = render(
      <ChatInput {...defaultProps} onSend={onSend} />,
    );

    fireEvent.press(getByText('\u2191'));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('shows voice error when present', () => {
    const { getByText } = render(
      <ChatInput {...defaultProps} voiceError="Erreur micro" />,
    );

    expect(getByText('Erreur micro')).toBeTruthy();
  });

  it('calls onMicPress when mic button pressed', () => {
    const onMicPress = jest.fn();
    const { getByText } = render(
      <ChatInput {...defaultProps} onMicPress={onMicPress} />,
    );

    fireEvent.press(getByText('\uD83C\uDFA4'));

    expect(onMicPress).toHaveBeenCalled();
  });
});
