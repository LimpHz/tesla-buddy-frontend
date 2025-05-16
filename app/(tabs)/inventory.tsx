import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ArrangeByOptions, Conditions, Models } from '@limphz/tesla-api-utilities/constants';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TeslaInventoryService } from '../services/tesla-inventory.service';

export default function InventoryScreen() {
  // Example state for each VehicleSpecs property
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [arrangeby, setArrangeby] = useState('');
  const [order, setOrder] = useState('');
  const [market, setMarket] = useState('');
  const [language, setLanguage] = useState('');
  const [superRegion, setSuperRegion] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentRange, setPaymentRange] = useState('');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');

  const teslaInventoryService = new TeslaInventoryService();
  const modelOptions = [
    {
      name: "Model 3",
      value: Models.MODEL_3
    },
    {
      name: "Model Y",
      value: Models.MODEL_Y
    },
    {
      name: "Model S",
      value: Models.MODEL_S
    },
    {
      name: "Model X",
      value: Models.MODEL_X
    }
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={150}
          color="#808080"
          name="mail.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Inventory</ThemedText>
      </ThemedView>
      <View style={{ gap: 8, marginBottom: 16 }}>
        {/* Model selection as buttons */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {modelOptions.map((option) => (
            <Button
              key={option.value}
              title={option.name}
              onPress={() => setModel(option.value)}
              color={model === option.value ? '#0a7ea4' : undefined}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {Object.entries(Conditions).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 12,
                padding: 6,
                borderWidth: 1,
                borderColor: condition === value ? '#0a7ea4' : '#ccc',
                borderRadius: 16,
                backgroundColor: condition === value ? '#0a7ea4' : 'transparent',
              }}
              onPress={() => setCondition(value)}
            >
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: condition === value ? '#fff' : '#0a7ea4',
                  backgroundColor: condition === value ? '#fff' : 'transparent',
                  marginRight: 6,
                }}
              />
              <Text style={{ color: condition === value ? '#fff' : '#0a7ea4' }}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {/* Arrange By Dropdown */}
          <View
            style={{
              minWidth: 120,
              maxWidth: 200,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: '#fff',
              marginRight: 8,
              padding: 0, // Remove extra padding
              backgroundColor: '#222',
              justifyContent: 'center',
              height: 40, // Match StyledTextInput height
              overflow: 'hidden', // Prevent label from pushing dropdown down
              position: 'relative',
            }}
          >
            {(arrangeby !== '') && (
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 12,
                  position: 'absolute',
                  top: 2,
                  left: 8,
                  zIndex: 2,
                  backgroundColor: '#222',
                  paddingHorizontal: 2,
                }}
              >
                Arrange By
              </Text>
            )}
            <Picker
              selectedValue={arrangeby}
              onValueChange={setArrangeby}
              style={[styles.dropdown, { height: 40, marginTop: (arrangeby !== '') ? 10 : 0 }]}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Arrange By" value="" color="#888" />
              {Object.entries(ArrangeByOptions).map(([key, value]) => (
                <Picker.Item key={key} label={value} value={value} />
              ))}
            </Picker>
          </View>
          <StyledTextInput placeholder="Order" value={order} onChangeText={setOrder} />
          <StyledTextInput placeholder="Market" value={market} onChangeText={setMarket} />
          <StyledTextInput placeholder="Language" value={language} onChangeText={setLanguage} />
          <StyledTextInput placeholder="Super Region" value={superRegion} onChangeText={setSuperRegion} />
          <StyledTextInput placeholder="Payment Type" value={paymentType} onChangeText={setPaymentType} />
          <StyledTextInput placeholder="Payment Range" value={paymentRange} onChangeText={setPaymentRange} />
          <StyledTextInput placeholder="Zip" value={zip} onChangeText={setZip} />
          <StyledTextInput placeholder="Region" value={region} onChangeText={setRegion} />
        </View>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <TouchableOpacity style={styles.button} onPress={() => { teslaInventoryService.fetchInventory({
              query: {
                  model: model,
                  condition: condition,
                  options: {
                      paint: ''
                  },
                  arrangeby: arrangeby,
                  order: order,
                  market: market,
                  language: language,
                  super_region: superRegion,
                  PaymentType: paymentType,
                  paymentRange: parseInt(paymentRange) || 0,
                  zip: zip,
                  region: region
              },
              offset: 0,
              count: 0,
              outsideOffset: 0,
              outsideSearch: false,
              isFalconDeliverySelectionEnabled: true,
              version: 'v2'
          }) }}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ThemedText>This page is under construction.</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -50,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    minHeight: '100%'
  }
});
