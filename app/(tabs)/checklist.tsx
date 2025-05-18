import MarkdownRenderer from '@/components/MarkdownRenderer';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MarkdownService } from '@/services/markdown.service';
import { Layout } from '@ui-kitten/components';
import { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet } from 'react-native';

export default function Checklist() {
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const markdownService = new MarkdownService();

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Option 1: Load from a URL (e.g., GitHub raw content)
                const content = await markdownService.fetchMarkdownContent(
                    'https://raw.githubusercontent.com/polymorphic/tesla-model-y-checklist/refs/heads/master/README.md'
                );
                
                setMarkdownContent(content);
            } catch (error) {
                console.error('Failed to load markdown:', error);
                setMarkdownContent('# Failed to load checklist\nPlease try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <IconSymbol
                    size={150}
                    color="#808080"
                    name="checklist"
                    style={styles.reactLogo}
                />
            }>
            <Layout style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" style={styles.loader} />
                ) : (
                    <MarkdownRenderer 
                        content={markdownContent}
                        onLinkPress={(url) => {
                            // Handle link clicks
                            console.log('Link pressed:', url);
                            // You can add custom navigation here
                            return false; // Return true to allow default behavior
                        }}
                        onCheckboxToggle={(text, isChecked) => {
                            console.log(`Checkbox "${text}" toggled to: ${isChecked}`);
                            // Here you can persist the checkbox state if needed
                        }}
                    />
                )}
            </Layout>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: -65,
        left: -25,
        position: 'absolute',
    },
    container: {
        padding: 16,
    },
    loader: {
        marginVertical: 20,
    }
});
