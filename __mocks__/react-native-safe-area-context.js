import React from 'react';

const insets = { top: 0, right: 0, bottom: 0, left: 0 };

export const SafeAreaProvider = ({ children }) => React.createElement(React.Fragment, null, children);

export const useSafeAreaInsets = () => insets;

export const SafeAreaView = ({ children }) => React.createElement(React.Fragment, null, children);
