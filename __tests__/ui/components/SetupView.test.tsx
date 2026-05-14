import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SetupView } from '../../../src/ui/components/SetupView';

describe('SetupView', () => {
  const defaultProps = {
    state: 'idle' as const,
    progress: 0,
    errorMsg: '',
    onRetry: jest.fn(),
  };

  it('renders downloading state', () => {
    const { getByText } = render(
      <SetupView {...defaultProps} state="downloading" progress={50} />,
    );

    expect(getByText('Téléchargement...')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('renders loading state', () => {
    const { getByText } = render(
      <SetupView {...defaultProps} state="loading" />,
    );

    expect(getByText('Chargement en cours...')).toBeTruthy();
  });

  it('renders error state with message', () => {
    const { getByText } = render(
      <SetupView
        {...defaultProps}
        state="error"
        errorMsg="Erreur réseau"
        onRetry={jest.fn()}
      />,
    );

    expect(getByText('Erreur réseau')).toBeTruthy();
    expect(getByText(/Réessayer/)).toBeTruthy();
  });

  it('calls onRetry when retry button pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <SetupView
        {...defaultProps}
        state="error"
        errorMsg="Erreur"
        onRetry={onRetry}
      />,
    );

    fireEvent.press(getByText(/Réessayer/));

    expect(onRetry).toHaveBeenCalled();
  });

  it('renders nothing for idle state', () => {
    const { queryByText } = render(
      <SetupView {...defaultProps} state="idle" />,
    );

    expect(queryByText('Téléchargement...')).toBeNull();
    expect(queryByText('Chargement en cours...')).toBeNull();
  });
});
