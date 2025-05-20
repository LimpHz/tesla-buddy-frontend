import React from 'react';
import { Platform } from 'react-native';
import { useTheme, Layout, Text, Icon } from '@ui-kitten/components';
import { IconSymbol } from './IconSymbol';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  style?: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select...',
  value,
  options,
  style,
}) => {
    const theme = useTheme();  
    const [visible, setVisible] = React.useState(false);
  
  if (Platform.OS === 'web') {
    return (
        <Layout style={style} appearance="default">
            {label && <Text appearance="hint" style={{ marginBottom: 4 }}>{label}</Text>}
            <select
                value={value || ''}
                onChange={e => {
                    //onselect(e.target.value)
                    console.log("Selected: " + e.target.value)
                    value = e.target.value
                }}
                style={{
                    padding: 9,
                    borderRadius: 6,
                    border: `1px solid ${theme['border-basic-color-3']}`,
                    background: theme['background-basic-color-1'],
                    color: theme['text-basic-color'],
                    minWidth: 150,
                    outline: 'none',
                    fontSize: 16,
                    width: '100%',
                    fontFamily: 'inherit',
                }}
            >
                <option value="" disabled hidden>{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </Layout>
    );
  }  

  // Native: Use a simple modal picker approach for now
  // (You can replace with a more advanced picker if needed)
  return (
    <Layout style={style}>
      {label && <Text style={{ marginBottom: 4 }}>{label}</Text>}
      <Layout
        onTouchEnd={() => setVisible(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: theme['color-basic-400'],
          backgroundColor: theme['color-basic-100'],
          minWidth: 150,
        }}
      >
        <Text style={{ flex: 1, color: value ? theme['text-basic-color'] : theme['color-basic-600'] }}>
          {options.find(opt => opt.value === value)?.label || placeholder}
        </Text>
        <IconSymbol name="chevron.down" color={theme['color-basic-600']} style={{ width: 20, height: 20 }} />
      </Layout>
      {visible && (
        <Layout style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: theme['color-basic-100'],
          borderRadius: 6,
          borderWidth: 1,
          borderColor: theme['color-basic-400'],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}>
          {options.map(opt => (
            <Layout
              key={opt.value}
              onTouchEnd={() => {
                setVisible(false);
              }}
              style={{ padding: 12 }}
            >
              <Text style={{ color: theme['text-basic-color'] }}>{opt.label}</Text>
            </Layout>
          ))}
        </Layout>
      )}
    </Layout>
  );
};

export default Select;
