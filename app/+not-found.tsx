import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Layout style={styles.container}>
        <Text category="h2">This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text category="p1">Go to home screen!</Text>
        </Link>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    textDecorationLine: 'underline',
    color: '#1e90ff',
  },
});
