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
  Divider,
  Toggle
} from '@ui-kitten/components';
import { useThemeContext } from '../ThemeContext';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ContactUs from './contact-us';
import { useRouter, usePathname, Href } from 'expo-router';
import { useState } from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import HomeScreen from './index';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const { Navigator, Screen } = createDrawerNavigator();

export default function DrawerLayout() {
  const { theme, toggleTheme } = useThemeContext();
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

  const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => (
    <Drawer
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      style={styles.drawer}
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
      
      <ThemeToggle />
    </Drawer>
  );
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {isMobile ? (
          // Mobile layout with collapsible drawer
          <Layout style={{ flex: 1 }}>
            <Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Screen
                name="home"
                component={HomeScreen}
                options={{
                  title: 'Home',
                }}
              />
              <Screen
                name="inventory"
                component={InventoryScreen}
                options={{
                  title: 'Inventory',
                }}
              />
              <Screen
                name="delivery-checklist"
                component={DeliveryChecklist}
                options={{
                  title: 'Delivery Checklist',
                }}
              />
              <Screen
                name="contact-us"
                component={ContactUs}
                options={{
                  title: 'Contact Us',
                }}
              />
            </Navigator>
            
            
            {/* <Layout style={styles.contentContainer}>
              {renderContent()}
            </Layout> */}
          </Layout>
        ) : (
          // Desktop layout with permanent menu
          <Layout style={styles.desktopContainer}>
            <View style={styles.desktopSidebar}>
              <Menu
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
                style={styles.menu}
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
              
              <ThemeToggle />
            </View>
            
            <View style={styles.contentContainer}>
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
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginTop: 'auto',
  },
  themeToggle: {
    marginTop: 8,
  }
});
