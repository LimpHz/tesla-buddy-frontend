import { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Select } from '@/components/ui/Select';
import { 
  Layout, 
  Input, 
  Button, 
  Text, 
  Spinner,
} from "@ui-kitten/components";

const requestTypes = [
  'General Inquiry',
  'Feature Request',
  'Bug Report',
  // 'Account Issue',
  // 'Billing Question',
  'Other'
];

export default function ContactUs() {
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRequestType, setRequestType] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const handleSubmit = async () => {
      if (!subject.trim()) {
        Alert.alert('Error', 'Please enter a subject');
        return;
      }

      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      if (!content.trim()) {
        Alert.alert('Error', 'Please enter your message');
        return;
      }

      setSubmitting(true);
      
      try {
        // Replace with actual API call
        // const response = await fetch('https://your-api.com/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     subject,
        //     email,
        //     requestType: selectedRequestType,
        //     content
        //   })
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // if (response.ok) {
        Alert.alert(
          'Success', 
          'Your message has been sent. We\'ll get back to you soon.',
          [{ text: 'OK', onPress: () => {
            setSubject('');
            setEmail('');
            setRequestType('');
            setContent('');
          }}]
        );
        // } else {
        //   throw new Error('Failed to send message');
        // }
      } catch (error) {
        Alert.alert('Error', 'Failed to send your message. Please try again later.');
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <IconSymbol
                    name="message.circle.fill"
                    color='#808080'
                    style={styles.headerImage}
                    size={150}
                />
            }>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Layout style={styles.container}>
                    <Text category="h4" style={styles.title}>Contact Us</Text>
                    <Text appearance="hint" style={styles.subtitle}>
                        We&apos;d love to hear from you! Please fill out the form below and we&apos;ll respond as soon as possible.
                    </Text>
                    
                    <Text style={styles.label}>Subject</Text>
                    <Input
                        placeholder="Enter subject"
                        value={subject}
                        onChangeText={setSubject}
                        style={styles.input}
                        size="large"
                    />
                    
                    <Text style={styles.label}>Email Address</Text>
                    <Input
                        placeholder="your.email@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        style={styles.input}
                        size="large"
                    />
                    
                    <Select
                        label="Request Type"
                        value={selectedRequestType}
                        onSelect={(value) => setRequestType(value)}
                        style={styles.input}
                        // size="large"
                        options={
                            requestTypes.map((type) => (
                                { label: type, value: type }
                            ))
                        }
                    />
                    
                    <Text style={styles.label}>Message</Text>
                    <Input
                        placeholder="Type your message here..."
                        value={content}
                        onChangeText={setContent}
                        multiline={true}
                        textStyle={{ minHeight: 120 }}
                        style={styles.input}
                        size="large"
                    />
                    
                    <Button 
                        onPress={handleSubmit} 
                        style={styles.button}
                        disabled={submitting}
                        accessoryLeft={submitting ? (props) => <Spinner size="small" /> : undefined}
                    >
                        {submitting ? 'SENDING...' : 'SUBMIT'}
                    </Button>
                </Layout>
            </KeyboardAvoidingView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -50,
        left: -20,
        position: 'absolute',
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: 24,
        textAlign: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    container: {
        padding: 16,
    },
    card: {
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 8,
    },
    loader: {
        marginVertical: 20,
    },
    label: {
        marginBottom: 4,
        marginTop: 12,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 8,
        borderRadius: 6,
    },
    button: {
        marginTop: 24,
        borderRadius: 6,
    }
});