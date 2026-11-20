
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

type ProtectedItem = {
  id: number;
  title: string;
  description: string;
};

export default function Home() {
  const { session, signOut } = useAuth();

  const [items, setItems] = useState<ProtectedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!session) {
        if (isMounted) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const { data, error } = await supabase
          .from('protected_items')
          .select('id, title, description')
          .order('id');

        if (error) throw error;

        if (isMounted) {
          setItems(data || []);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load protected information.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  async function handleSignOut() {
    setBusy(true);
    setMessage('');

    try {
      const { error } = await signOut();

      if (error) {
        setMessage(error.message);
        setBusy(false);
      }
    } catch {
      setMessage('Unable to sign out. Please try again.');
      setBusy(false);
    }
  }

  const userEmail = session?.user.email || 'User';
  const userName =
    session?.user.user_metadata?.full_name || userEmail;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.welcome}>Welcome!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={handleSignOut}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutText}>Sign Out</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Protected Dashboard</Text>

        <Text style={styles.email}>
          Signed in as: {userEmail}
        </Text>

        <Text style={styles.sectionTitle}>
          Protected Information
        </Text>

        <Text style={styles.subtitle}>
          Only authenticated users can access this information.
        </Text>

        {message !== '' && (
          <Text style={styles.error}>{message}</Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No protected information available.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Text style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text style={styles.itemDescription}>
                  {item.description}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 24,
    paddingTop: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  welcome: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#1E40AF',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  email: {
    color: '#64748B',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    marginBottom: 18,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  itemDescription: {
    color: '#64748B',
    lineHeight: 21,
  },
  empty: {
    color: '#64748B',
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
  },
});
