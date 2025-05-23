import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { ThemeProvider, useThemeContext } from './ThemeContext';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Helmet } from 'react-helmet';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Tesla Buddy</title>
      </Helmet>
      <ThemeProvider>
        <ThemeWrapper>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeWrapper>
      </ThemeProvider>
    </>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext();
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider theme={theme === 'dark' ? eva.dark : eva.light} {...eva}>
        {children}
      </ApplicationProvider>
    </>
  );
}
