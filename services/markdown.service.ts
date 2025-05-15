import * as FileSystem from 'expo-file-system';

export class MarkdownService {
    public async loadMarkdownFile(filePath: string): Promise<string> {
      try {
        const content = await FileSystem.readAsStringAsync(filePath);
        return content;
      } catch (error) {
        console.error('Error loading markdown file:', error);
        return '# Error loading content';
      }
    }
    
    // For loading from network/API
    public async fetchMarkdownContent(url: string): Promise<string> {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        console.error('Error fetching markdown content:', error);
        return '# Error loading content';
      }
    }
}