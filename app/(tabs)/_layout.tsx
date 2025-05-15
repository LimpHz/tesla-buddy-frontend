import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Checklist from './checklist';
import IndexScreen from './index';
import InventoryScreen from './inventory';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        drawerType: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'permanent' : 'front',
        drawerStyle: {
          maxWidth: 240,
        },
        drawerContentContainerStyle: {
          paddingLeft: 0,
          paddingRight: 0,
        },
        drawerItemStyle: {
          marginTop: 8,
          borderRadius: 0,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={IndexScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <IconSymbol size={size ?? 28} name="house.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <IconSymbol size={size ?? 28} name="mail.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="checklist"
        component={Checklist}
        options={{
          title: 'Checklist',
          drawerIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}
