import React from 'react';
import { Platform } from 'react-native';
import { useTheme, Layout, Text, Icon } from '@ui-kitten/components';
import { IconSymbol } from './IconSymbol';
import { Picker } from '@react-native-picker/picker';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSelect: (value: string) => void;
  options: Option[];
  style?: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select...',
  value,
  onSelect,
  options,
  style,
}) => {
    const theme = useTheme();  
    const [visible, setVisible] = React.useState(false);
  
  return (
    <Layout style={{ position: 'relative' }}>
        <Text
            style={{
                fontSize: 12,
                color: theme['text-hint-color'],
                marginLeft: 4,
                marginBottom: 2,
                minHeight: 16,
                opacity: placeholder !== '' && placeholder !== 'Select...' && value !== undefined ? 1 : 0
            }}
        >
            {placeholder}
        </Text>
        <Picker
            selectedValue={value}
            onValueChange={(value, index) => {
                if (value !== "") onSelect(value)
            }}
            style={{
                padding: 9,
                borderRadius: 6,
                borderStyle: 'solid',
                borderColor: theme['border-basic-color-3'],
                borderWidth: 1,
                backgroundColor: theme['background-basic-color-1'],
                color: theme['text-basic-color'],
                minWidth: 150,
                outline: 'none',
                fontSize: 16,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
        >
            <Picker.Item
                label={placeholder}
                value=""
                color={theme['text-hint-color']}
                enabled={false}
            />
            {options.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
        </Picker>
    </Layout>
  )
};

export default Select;
