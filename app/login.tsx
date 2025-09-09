import LoginScreen from "@/components/LoginScreen";
import { Stack } from "expo-router";

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}
