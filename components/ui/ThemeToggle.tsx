import { useThemeContext } from "@/app/ThemeContext";
import { Toggle } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useThemeContext();
    // Add a mounted state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false);
    
    // Only show the actual component after client-side hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // During SSR or before hydration, render a placeholder with the same dimensions
    if (!isMounted) {
        return (
            <View style={styles.themeToggleContainer}>
                <View style={styles.placeholderToggle} />
            </View>
        );
    }
    
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
        marginTop: 'auto',
    },
    themeToggle: {
        marginTop: 8,
    },
    placeholderToggle: {
        height: 32,  // Approximate height of toggle
        width: 150,  // Approximate width with text
        marginTop: 8,
    }
});