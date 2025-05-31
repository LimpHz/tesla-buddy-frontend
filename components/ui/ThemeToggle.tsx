import { useThemeContext } from "@/app/ThemeContext";
import { Toggle } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useThemeContext();
    
    return (
        <View style={styles.themeToggleContainer}>
            <Toggle
                checked={theme === 'dark'}
                onChange={toggleTheme}
                style={styles.themeToggle}
            >
                {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </Toggle>
        </View>
    );
}

const styles = StyleSheet.create({
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