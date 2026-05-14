import React from 'react';
import { render } from '@testing-library/react-native';
import { Header } from '../../../src/ui/components/Header';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 0, left: 0, right: 0 }),
}));

describe('Header', () => {
  it('renders title', () => {
    const { getByText } = render(<Header title="Tsaty" />);

    expect(getByText('Tsaty')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <Header title="Tsaty" subtitle="Modèle local actif" />,
    );

    expect(getByText('Modèle local actif')).toBeTruthy();
  });

  it('does not render subtitle when not provided', () => {
    const { queryByText } = render(<Header title="Tsaty" />);

    expect(queryByText('Modèle local actif')).toBeNull();
  });
});
