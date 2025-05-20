import { useThemeContext } from '@/app/ThemeContext';
import React, { JSX, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { CheckBox, Layout, Text } from '@ui-kitten/components';

interface MarkdownRendererProps {
  content: string;
  onLinkPress?: (url: string) => boolean;
  interactive?: boolean;
  onCheckboxToggle?: (text: string, checked: boolean) => void;
}

export default function MarkdownRenderer({ 
  content, 
  onLinkPress, 
  interactive = true,
  onCheckboxToggle
}: MarkdownRendererProps) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  
  // Convert the markdown content to track checkbox states
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});
  // Debug state to check what's happening
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Process content to extract checkboxes
  useEffect(() => {
    // First, identify all checkbox items and store their state
    const checkboxRegex = /^(\s*)-\s+\[([ x])\]\s+(.*?)(?=\n|$)/gm;
    const newCheckedItems: {[key: string]: boolean} = {};
    
    let match;
    let matchCount = 0;
    const contentCopy = content.toString(); // Ensure we're working with a string
    
    while ((match = checkboxRegex.exec(contentCopy)) !== null) {
      matchCount++;
      const indentation = match[1] || ''; // Capture indentation
      const isChecked = match[2] === 'x';
      const text = match[3].trim();
      const key = `${indentation.length}:${text}`; // Use indentation level + text as key
      newCheckedItems[key] = isChecked;
    }
    
    setCheckedItems(newCheckedItems);
    setDebugInfo(`Found ${matchCount} checkboxes`);
    
    console.log('Checkbox detection completed');
    console.log(`Found ${matchCount} checkboxes`);
    console.log('First 100 chars of content:', content.substring(0, 100));
  }, [content]);
  
  const markdownStyles = {
    body: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 16,
    },
    heading1: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginVertical: 16,
    },
    heading2: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginVertical: 12,
    },
    heading3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginVertical: 8,
    },
    link: {
      color: isDark ? '#A1CEDC' : '#1D3D47',
    },
    list_item: {
      marginVertical: 4,
      colorScheme: isDark ? 'dark' : 'light',
    }
  };

  // Parse the markdown and insert our checkbox components where needed
  const parseAndRenderContent = () => {
    if (!content) {
      return [<Text key="empty">No content available</Text>];
    }

    // Split content by lines, ensure we handle different line endings
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const elements: JSX.Element[] = [];
    
    // Process each line
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      
      // Check if the line contains a checkbox
      const checkboxMatch = /^(\s*)-\s+\[([ x])\]\s+(.*)$/.exec(line);
      
      if (checkboxMatch) {
        // This line is a checkbox
        const indentation = checkboxMatch[1] || ''; // Capture indentation
        const text = checkboxMatch[3].trim();
        const key = `${indentation.length}:${text}`; // Use same key format as in useEffect
        const isChecked = checkedItems[key] || false;
        
        const toggleCheckbox = () => {
          const newState = !isChecked;
          setCheckedItems(prev => ({ ...prev, [key]: newState }));
          
          if (onCheckboxToggle) {
            onCheckboxToggle(text, newState);
          }
        };
        
        elements.push(
          <CheckBox 
            key={`checkbox-${index}`} 
            style={[
              styles.checkboxListItem,
              { paddingLeft: 16 + (indentation.length * 8) } // Add indentation based on spaces
            ]} 
            onPress={toggleCheckbox}
            disabled={!interactive}
          >
            <Text style={[
              styles.checkboxText,
              isChecked ? { textDecorationLine: 'line-through' } : {}
            ]}>
              {text}
            </Text>
          </CheckBox>
        );
      } else {
        // This is regular markdown content
        // Group consecutive non-checkbox lines to render them together
        let markdownBlock = line;
        let j = index + 1;
        
        // Look ahead to group consecutive non-checkbox lines
        while (j < lines.length && !(/^(\s*)-\s+\[([ x])\]\s+/.test(lines[j]))) {
          markdownBlock += '\n' + lines[j];
          j++;
        }
        
        // Skip the lines we've already included
        if (j > index + 1) {
          // Only add this block if it's not empty
          if (markdownBlock.trim()) {
            elements.push(
              <Markdown 
                key={`markdown-${index}`} 
                style={markdownStyles}
                onLinkPress={(url) => {
                  console.log('Link pressed:', url);
                  if (onLinkPress) {
                    return onLinkPress(url);
                  }
                  // Return true to open in default browser if no custom handler
                  return true;
                }}
              >
                {markdownBlock}
              </Markdown>
            );
          }
          
          // Update index to skip processed lines
          index = j - 1;
        } else {
          // Only add this line if it's not empty
          if (line.trim()) {
            elements.push(
              <Markdown 
                key={`markdown-${index}`} 
                style={markdownStyles}
                onLinkPress={(url) => {
                  console.log('Link pressed:', url);
                  if (onLinkPress) {
                    return onLinkPress(url);
                  }
                  // Return true to open in default browser if no custom handler
                  return true;
                }}
              >
                {line}
              </Markdown>
            );
          }
        }
      }
    }
    
    return elements;
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    checkbox: {
      width: 20,
      height: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      paddingHorizontal: 16,
    },
    checkboxText: {
      flex: 1,
      fontSize: 16,
      color: isDark ? 'white' : 'black', // Adding default color
    }
  });
  
  return (
    <Layout style={styles.container}>
      {parseAndRenderContent()}
    </Layout>
  );
}