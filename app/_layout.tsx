import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Simple TODO"
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
