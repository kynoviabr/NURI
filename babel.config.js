module.exports = function (api) {
  api.cache(true);
  return {
    // No SDK 58, o babel-preset-expo já inclui o plugin de worklets do Reanimated 4.
    presets: ['babel-preset-expo'],
  };
};
