import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Checklist from './checklist';
import IndexScreen from './index';
import InventoryScreen from './inventory';
import { Toggle } from '@ui-kitten/components';
import { useThemeContext } from '../ThemeContext';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { Navigator, Screen } = createDrawerNavigator();

export default function DrawerLayout() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <SafeAreaProvider>
      <Navigator
        initialRouteName="home"
        screenOptions={{
          drawerActiveTintColor: Colors[theme ?? 'light'].tint,
          headerShown: Platform.OS !== 'web' || (typeof window !== 'undefined' && window.innerWidth < 768),
          drawerType: Platform.OS === 'web' &&  typeof window !== 'undefined' && window.innerWidth >= 768 ? 'permanent' : 'slide',
          swipeEnabled: Platform.OS !== 'web',
          drawerStyle: {
            maxWidth: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768 
              ? 240  // Desktop width
              : '85%',  // Mobile width as percentage of screen
            width: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768 
              ? 240 
              : '85%',
            height: '100%',  // Ensure height is 100% of container
            backgroundColor: Colors[theme ?? 'light'].background
          },
          drawerContentContainerStyle: {
            paddingLeft: 0,
            paddingRight: 0,
          },
          drawerItemStyle: {
            marginTop: 8,
            borderRadius: 0,
          },
          drawerInactiveTintColor: Colors[theme ?? 'light'].tint,
          headerStyle: {
            backgroundColor: Colors[theme ?? 'light'].background,
          },
          headerTintColor: Colors[theme ?? 'light'].tint,
          headerTitleStyle: {
            color: Colors[theme ?? 'light'].text,
          },
        }}
        drawerContent={(props: any) => (
          <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16, marginTop: 'auto', alignSelf: 'center' }}>
              <Toggle
                checked={theme === 'dark'}
                onChange={toggleTheme}
              >
                {theme === 'dark' ? 'Dark' : 'Light'} Mode
              </Toggle>
            </View>
          </DrawerContentScrollView>
        )}
      >
        <Screen
          name="home"
          component={IndexScreen}
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 28} name="house.fill" color={color} />
            ),
          }}
        />
        <Screen
          name="inventory"
          component={InventoryScreen}
          options={{
            title: 'Inventory',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <IconSymbol size={size ?? 28} name="mail.fill" color={color} />
            ),
          }}
        />
        <Screen
          name="delivery-checklist"
          component={Checklist}
          options={{
            title: 'Delivery Checklist',
            drawerIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
          }}
        />
      </Navigator>
    </SafeAreaProvider>
  );
}
