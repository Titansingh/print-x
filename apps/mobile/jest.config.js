/**
 * Jest config for the Expo app (jest-expo preset + React Native Testing Library).
 * @type {import('jest').Config}
 */
module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["/node_modules/", "/.maestro/"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|expo-router|expo-modules-core|react-native-screens|react-native-safe-area-context|tamagui|@tamagui/.*|@platform/.*|zustand|@tanstack/.*|axios))",
  ],
  moduleNameMapper: {
    // Tamagui maps this entry's "react-native" export condition to an ESM-only
    // .mjs file, which Jest cannot require. Metro bundles it fine; in Jest we
    // use the package's own CommonJS build (resolved via the "require" condition).
    "^@tamagui/style-grammar/token-categories$":
      require.resolve("@tamagui/style-grammar/token-categories"),
  },
};
