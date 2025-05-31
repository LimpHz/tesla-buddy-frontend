import DeliveryChecklist from './delivery-checklist';
import InventoryScreen from './inventory';
import { 
  Drawer, 
  DrawerItem,
  IndexPath,
  Icon,
  Menu,
  MenuItem,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Divider
} from '@ui-kitten/components';
import { useThemeContext } from '../ThemeContext';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ContactUs from './contact-us';
import { useRouter, usePathname, Href, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './index';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const { Navigator, Screen } = createDrawerNavigator();

export default function DrawerLayout() {
  const { theme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(getInitialSelectedIndex());
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Get the initial selected index based on the current path
  function getInitialSelectedIndex(): IndexPath {
    if (pathname.includes('inventory')) return new IndexPath(1);
    if (pathname.includes('delivery-checklist')) return new IndexPath(2);
    if (pathname.includes('contact')) return new IndexPath(3);
    return new IndexPath(0); // Default to home
  }

  const HomeIcon = (props: any) => (
    <Icon name="home" {...props} size={24} />
  );

  const InventoryIcon = (props: any) => (
    <Icon name="archive" {...props} size={24} />
  );

  const ChecklistIcon = (props: any) => (
    <Icon name="clipboard" {...props} size={24} />
  );

  const ContactIcon = (props: any) => (
    <Icon name="message-square" {...props} size={24} />
  );
  
  // Determine if we're on mobile or desktop
  const isMobile = Platform.OS !== 'web' || (typeof window !== 'undefined' && window.innerWidth < 768);

  // Update selected route when user clicks a menu/drawer item
  const handleSelect = (index: IndexPath) => {
    setSelectedIndex(index);
    let route = '';
    switch(index.row) {
      case 0:
        route = '/(tabs)';
        break;
      case 1:
        route = '/(tabs)/inventory';
        break;
      case 2:
        route = '/(tabs)/delivery-checklist';
        break;
      case 3:
        route = '/(tabs)/contact-us';
        break;
      default:
        route = '/(tabs)';
        break;
    }
    
    router.push(route as Href);
    
    // Close drawer on mobile after selection
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // Render current screen content based on selected index
  const renderContent = () => {
    switch(selectedIndex.row) {
      case 0:
        return <HomeScreen />;
      case 1:
        return <InventoryScreen />;
      case 2:
        return <DeliveryChecklist />;
      case 3:
        return <ContactUs />;
      default:
        return <HomeScreen />;
    }
  };

  // Custom navigation logic for React Navigation screens
  const handleScreenPress = (routeName: string) => {
    let route = '';
    let index = 0;
    
    switch(routeName) {
      case 'home':
        route = '/(tabs)';
        index = 0;
        break;
      case 'inventory':
        route = '/(tabs)/inventory';
        index = 1;
        break;
      case 'delivery-checklist':
        route = '/(tabs)/delivery-checklist';
        index = 2;
        break;
      case 'contact-us':
        route = '/(tabs)/contact-us';
        index = 3;
        break;
    }
    
    setSelectedIndex(new IndexPath(index));
    router.push(route as Href);
  };

  // Determine the appropriate theme styles based on the current theme
  const themeStyles = {
    backgroundColor: theme === 'dark' ? '#222B45' : 'white',
    textColor: theme === 'dark' ? 'white' : '#222B45',
    borderColor: theme === 'dark' ? '#101426' : '#E8E8E8',
  };

  const DrawerContent = ({ navigation, state }: any) => (
    <View style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: themeStyles.backgroundColor
    }}>
      <Drawer
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        style={[styles.drawer, { backgroundColor: themeStyles.backgroundColor }]}
        appearance={theme === 'dark' ? 'noDivider' : 'default'}
      >
        <DrawerItem
          title="Home"
          accessoryLeft={HomeIcon}
        />
        <DrawerItem
          title="Inventory"
          accessoryLeft={InventoryIcon}
        />
        <DrawerItem
          title="Delivery Checklist"
          accessoryLeft={ChecklistIcon}
        />
        <DrawerItem
          title="Contact Us"
          accessoryLeft={ContactIcon}
        />
      </Drawer>
      
      <View style={[
        styles.themeToggleContainer, 
        { 
          borderTopColor: themeStyles.borderColor,
          backgroundColor: themeStyles.backgroundColor
        }
      ]}>
        {/* <ThemeToggle /> */}
      </View>
    </View>
  );
  
  // Convert React Navigation Screen to Expo Router compatible
  const ScreenWithRouter = ({ name, component: Component }: { name: string, component: React.ComponentType<any> }) => {
    return (
      <Component 
        onPress={() => handleScreenPress(name)}
        active={pathname === `/(tabs)/${name}` || (name === 'home' && pathname === '/(tabs)')}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {isMobile ? (
          // Mobile layout with React Navigation Drawer
            <Navigator
              initialRouteName="index"
              drawerContent={props => <DrawerContent {...props} />}
              screenOptions={{
                headerShown: true,
                swipeEnabled: true,
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: themeStyles.backgroundColor,
                },
                headerTintColor: themeStyles.textColor,
                drawerStyle: {
                  backgroundColor: themeStyles.backgroundColor,
                },
                drawerActiveTintColor: theme === 'dark' ? '#3366FF' : '#3366FF',
                drawerInactiveTintColor: themeStyles.textColor,
              }}
            >
              <Screen
                name="index"
                component={() => <HomeScreen />}
                options={{
                  title: 'Home',
                  drawerIcon: HomeIcon,
                }}
                listeners={{
                  focus: () => {
                    setSelectedIndex(new IndexPath(0));
                  },
                  drawerItemPress: (e) => {
                    // Prevent default behavior
                    e.preventDefault();
                    router.push('/(tabs)' as Href);
                  }
                }}
              />
              <Screen
                name="inventory"
                component={InventoryScreen}
                options={{
                  title: 'Inventory',
                  drawerIcon: InventoryIcon,
                }}
                listeners={{
                  drawerItemPress: (e) => {
                    // Prevent default behavior
                    e.preventDefault();
                    router.push('/(tabs)/inventory' as Href);
                  }
                }}
              />
              <Screen
                name="delivery-checklist"
                component={DeliveryChecklist}
                options={{
                  title: 'Delivery Checklist',
                  drawerIcon: ChecklistIcon,
                }}
                listeners={{
                  drawerItemPress: (e) => {
                    // Prevent default behavior
                    e.preventDefault();
                    router.push('/(tabs)/delivery-checklist' as Href);
                  }
                }}
              />
              <Screen
                name="contact-us"
                component={ContactUs}
                options={{
                  title: 'Contact Us',
                  drawerIcon: ContactIcon,
                }}
                listeners={{
                  drawerItemPress: (e) => {
                    // Prevent default behavior
                    e.preventDefault();
                    router.push('/(tabs)/contact-us' as Href);
                  }
                }}
              />
            </Navigator>
        ) : (
          // Desktop layout with permanent menu
          <Layout style={styles.desktopContainer} level={theme === 'dark' ? '2' : '1'}>
            <View style={[
              styles.desktopSidebar,
              { 
                backgroundColor: themeStyles.backgroundColor,
                borderRightColor: themeStyles.borderColor
              }
            ]}>
              <Menu
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
                style={[styles.menu, { backgroundColor: themeStyles.backgroundColor }]}
                appearance={theme === 'dark' ? 'noDivider' : 'default'}
              >
                <MenuItem
                  title="Home"
                  accessoryLeft={HomeIcon}
                />
                <MenuItem
                  title="Inventory"
                  accessoryLeft={InventoryIcon}
                />
                <MenuItem
                  title="Delivery Checklist"
                  accessoryLeft={ChecklistIcon}
                />
                <MenuItem
                  title="Contact Us"
                  accessoryLeft={ContactIcon}
                />
              </Menu>
              
              <View style={[
                styles.themeToggleContainer, 
                { 
                  borderTopColor: themeStyles.borderColor,
                  backgroundColor: themeStyles.backgroundColor
                }
              ]}>
                {/* <ThemeToggle /> */}
              </View>
            </View>
            
            <View style={[
              styles.contentContainer,
              { backgroundColor: themeStyles.backgroundColor }
            ]}>
              {renderContent()}
            </View>
          </Layout>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Helper function to get title from selected index
function getTitleFromIndex(index: number): string {
  switch(index) {
    case 0: return 'Home';
    case 1: return 'Inventory';
    case 2: return 'Delivery Checklist';
    case 3: return 'Contact Us';
    default: return 'Home';
  }
}

const styles = StyleSheet.create({
  topNavigation: {
    paddingHorizontal: 8,
  },
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  menu: {
    flex: 1,
    backgroundColor: 'white',
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebar: {
    width: 240,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E8E8E8',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileDrawerContainer: {
    width: '75%',
    position: 'absolute',
    left: 0,
    top: 56,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flex: 1,
  },
  themeToggleContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto', // Push to bottom in flex container
  },
  themeToggle: {
    marginTop: 8,
  }
});
