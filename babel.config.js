module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: process.env.JEST_WORKER_ID ? [] : ['nativewind/babel'],
};
