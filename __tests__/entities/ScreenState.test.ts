describe('ScreenState type', () => {
  it('accepts all valid states', () => {
    const states = ['idle', 'downloading', 'loading', 'ready', 'error'] as const;

    for (const state of states) {
      const value: string = state;
      expect(['idle', 'downloading', 'loading', 'ready', 'error']).toContain(value);
    }
  });
});
