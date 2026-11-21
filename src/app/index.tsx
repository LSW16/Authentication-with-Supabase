import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

type PublicItem = {
  id: number;
  title: string;
  description: string;
};

export default function Index() {
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [publicItems, setPublicItems] = useState<PublicItem[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");

  const loginForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function loadPublicData() {
      try {
        const { data, error } = await supabase
          .from("public_info")
          .select("id, title, description")
          .order("id");

        if (error) throw error;

        setPublicItems(data || []);
      } catch {
        setMessage("Unable to load public information.");
      } finally {
        setPublicLoading(false);
      }
    }

    loadPublicData();
  }, []);

  async function handleSignIn(values: SignInValues) {
    setBusy(true);
    setMessage("");
    setMessageType("");

    try {
      const { error } = await signIn(values.email.trim(), values.password);

      if (error) {
        setMessageType("error");
        setMessage(
          error.message.toLowerCase().includes("invalid login credentials")
            ? "Invalid credentials. Please check your email and password."
            : error.message
        );
      }
    } catch {
      setMessageType("error");
      setMessage(
        "Network error. Please check your internet connection and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(values: SignUpValues) {
    setBusy(true);
    setMessage("");

    try {
      const { error, session } = await signUp(
        values.name,
        values.email,
        values.password
      );

      if (error) {
        setMessage(error.message);
      } else if (session) {
        setMessage("Account created successfully!");
      } else {
        setMessage(
          "Account created! Please check your email to confirm your account, then sign in."
        );

        setIsSignUp(false);
        loginForm.setValue("email", values.email);
      }
    } catch {
      setMessage("Network error. Please check your internet connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>

          <Text style={styles.subtitle}>
            {isSignUp
              ? "Create your account to get started."
              : "Sign in to access your account."}
          </Text>

          {isSignUp ? (
            <>
              <Text style={styles.label}>Full Name</Text>

              <Controller
                control={registerForm.control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              {registerForm.formState.errors.name && (
                <Text style={styles.error}>
                  {registerForm.formState.errors.name.message}
                </Text>
              )}

              <Text style={styles.label}>Email Address</Text>

              <Controller
                control={registerForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              {registerForm.formState.errors.email && (
                <Text style={styles.error}>
                  {registerForm.formState.errors.email.message}
                </Text>
              )}

              <Text style={styles.label}>Password</Text>

              <Controller
                control={registerForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              {registerForm.formState.errors.password && (
                <Text style={styles.error}>
                  {registerForm.formState.errors.password.message}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.label}>Email Address</Text>

              <Controller
                control={loginForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              {loginForm.formState.errors.email && (
                <Text style={styles.error}>
                  {loginForm.formState.errors.email.message}
                </Text>
              )}

              <Text style={styles.label}>Password</Text>

              <Controller
                control={loginForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              {loginForm.formState.errors.password && (
                <Text style={styles.error}>
                  {loginForm.formState.errors.password.message}
                </Text>
              )}
            </>
          )}

          {message !== "" && (
            <Text
              style={[
                styles.message,
                messageType === "error"
                  ? styles.errorMessage
                  : styles.successMessage,
              ]}
            >
              {message}
            </Text>
          )}

          <Pressable
            style={[styles.button, busy && styles.disabled]}
            disabled={busy}
            onPress={() => {
              if (isSignUp) {
                registerForm.handleSubmit(handleSignUp)();
              } else {
                loginForm.handleSubmit(handleSignIn)();
              }
            }}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? "Sign Up" : "Sign In"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
              loginForm.reset();
              registerForm.reset();
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.publicSection}>
          <Text style={styles.sectionTitle}>Public Information</Text>

          <Text style={styles.publicSubtitle}>
            Information available to everyone.
          </Text>

          {publicLoading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : publicItems.length === 0 ? (
            <Text style={styles.publicText}>
              No public information available.
            </Text>
          ) : (
            publicItems.map((item) => (
              <View key={item.id} style={styles.infoCard}>
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text style={styles.infoDescription}>{item.description}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64748B",
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: "#DC2626",
    marginBottom: 10,
  },
  message: {
    color: "#2563EB",
    marginBottom: 12,
    lineHeight: 21,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchText: {
    color: "#2563EB",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  publicSection: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6,
  },
  publicSubtitle: {
    color: "#64748B",
    marginBottom: 12,
  },
  publicText: {
    color: "#64748B",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 5,
  },
  infoDescription: {
    color: "#64748B",
    lineHeight: 20,
  },
  errorMessage: {
    color: '#DC2626',
  },
  successMessage: {
    color: '#16A34A',
  },
});
