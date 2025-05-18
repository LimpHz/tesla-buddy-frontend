import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ArrangeByOptions, Conditions, Models } from '@limphz/tesla-api-utilities/constants';
import { IndexPath, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { useState } from 'react';

import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TeslaInventoryService } from '../services/tesla-inventory.service';

export default function InventoryScreen() {
  // Example state for each VehicleSpecs property
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [arrangeByIndex, setArrangeByIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
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
      <Layout style={styles.titleContainer}>
        <Text category="h2">Inventory</Text>
      </Layout>
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
              height: 40, // Match Input height
              //overflow: 'hidden', // Prevent label from pushing dropdown down
              //position: 'relative',
            }}
          >
            <Select
              selectedIndex={arrangeByIndex}
              onSelect={index => setArrangeByIndex(index)}
              style={styles.dropdown}
            >
              {/* {Object.entries(ArrangeByOptions).map(([key, value]) => (
                <SelectItem key={key} title={value} />
              ))} */}
              <SelectItem title={ArrangeByOptions.SAVINGS} />
            </Select>
          </View>
          <Input placeholder="Order" value={order} onChangeText={setOrder} />
          <Input placeholder="Market" value={market} onChangeText={setMarket} />
          <Input placeholder="Language" value={language} onChangeText={setLanguage} />
          <Input placeholder="Super Region" value={superRegion} onChangeText={setSuperRegion} />
          <Input placeholder="Payment Type" value={paymentType} onChangeText={setPaymentType} />
          <Input placeholder="Payment Range" value={paymentRange} onChangeText={setPaymentRange} />
          <Input placeholder="Zip" value={zip} onChangeText={setZip} />
          <Input placeholder="Region" value={region} onChangeText={setRegion} />
        </View>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <TouchableOpacity style={styles.button} onPress={() => { teslaInventoryService.fetchInventory({
              query: {
                  model: model,
                  condition: condition,
                  options: {
                      paint: ''
                  },
                  arrangeby: Object.entries(ArrangeByOptions).at(
                    Array.isArray(arrangeByIndex) ? arrangeByIndex[0].row : arrangeByIndex.row
                  )?.[1],
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
      <Text>This page is under construction.</Text>
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
