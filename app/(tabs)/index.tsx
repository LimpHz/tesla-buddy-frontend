import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Layout, Text } from '@ui-kitten/components';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Layout style={styles.titleContainer}>
        <Text category="h2">Welcome!</Text>
        <HelloWave />
      </Layout>
      <Layout style={styles.stepContainer}>
        <Text category="h3">Step 1: Try it</Text>
        <Text>
          Edit <Text>app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </Layout>
      <Layout style={styles.stepContainer}>
        <Text category="h3">Step 2: Explore</Text>
        <Text>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </Layout>
      <Layout style={styles.stepContainer}>
        <Text category="h3">Step 3: Get a fresh start</Text>
        <Text>
          {`When you're ready, run `}
          <Text>npm run reset-project</Text> to get a fresh{' '}
          <Text>app</Text> directory. This will move the current{' '}
          <Text>app</Text> to{' '}
          <Text>app-example</Text>.
        </Text>
      </Layout>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
