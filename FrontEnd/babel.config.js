module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    // …any other plugins…
    "react-native-reanimated/plugin", // ← must go last
  ],
};
