import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../constants/supabaseClient";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.replace("/(tabs)");
      }
    }
    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      router.replace("/(tabs)");
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#007AFF", "#34C759", "#f5f6fa"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to manage your todos</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} activeOpacity={0.7}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.signup} activeOpacity={0.7}>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    backgroundColor: "#fff",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 18,
    borderRadius: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 18,
    paddingHorizontal: 14,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#222",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  error: {
    color: "#FF3B30",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 15,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#e1e1e1",
    marginVertical: 18,
  },
  signup: {
    marginTop: 0,
  },
  signupText: {
    color: "#222",
    fontSize: 15,
    textAlign: "center",
  },
});

export default LoginScreen;
