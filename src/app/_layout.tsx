
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';

function RootNavigator() {
  const { session, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginScreen = pathname === '/';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!session && !isLoginScreen) {
      router.replace('/');
    } else if (session && isLoginScreen) {
      router.replace('/home');
    }
  }, [session, loading, isLoginScreen, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
