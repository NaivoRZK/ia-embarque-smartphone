module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-fs|react-native-tts|react-native-speech-recognition-kit|react-native-safe-area-context|llama\\.rn|react-native-css-interop|nativewind)/)',
  ],
};
