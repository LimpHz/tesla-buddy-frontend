import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ArrangeByOptions, Conditions, Markets, Models, Ordering, Regions } from '@limphz/tesla-api-utilities/constants';
import { Button, Input, Layout, Radio, RadioGroup, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TeslaInventoryService } from '../services/tesla-inventory.service';
import { Select } from '@/components/ui/Select';

export default function InventoryScreen() {
  // Example state for each VehicleSpecs property
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [arrangeByIndex, setArrangeByIndex] = useState<number | undefined>(0);
  const [order, setOrder] = useState('');
  const [market, setMarket] = useState('');
  const [language, setLanguage] = useState('');
  const [superRegion, setSuperRegion] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentRange, setPaymentRange] = useState('');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');
  const [inventoryResult, setInventoryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const handleFetchInventory = async () => {
    setLoading(true);

    try {
      const result = await teslaInventoryService.fetchInventory({
        query: {
          model: model,
          condition: condition,
          options: { paint: '' },
          arrangeby: Object.entries(ArrangeByOptions).at(arrangeByIndex ?? 0)?.[1],
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
      });
  
      setInventoryResult(result);
    } finally {
      setLoading(false);
    }
  };

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
      <Layout style={{ gap: 8, marginBottom: 16 }}>
        <Layout style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {modelOptions.map((option) => (
            <Button
              key={option.name}
              onPress={() => setModel(option.value)}
              style={[
                styles.button,
                {
                  backgroundColor: model === option.value ? styles.button.backgroundColor : 'transparent',
                  minWidth: 150
                }
              ]}
            >
              <Text style={{ color: model === option.value ? '#fff' : '#0a7ea4' }}>{option.name}</Text>
            </Button>
          ))}
        </Layout>
        <Layout style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {Object.entries(Conditions).map(([key, value]) => (
            <Button
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
                height: 16
              }}
              onPress={() => setCondition(value)}
            >
              <Layout
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: condition === value ? '#fff' : '#0a7ea4',
                  backgroundColor: condition === value ? '#fff' : 'transparent',
                  marginRight: 6,
                }}
              />
              <Text style={{ color: condition === value ? '#fff' : '#0a7ea4' }}>{key}</Text>
            </Button>
          ))}
        </Layout>
        <Layout style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ marginRight: 24 }}>Arrange By:</Text>
          <RadioGroup
            selectedIndex={arrangeByIndex}
            onChange={i => setArrangeByIndex(i)}
          >
            {Object.entries(ArrangeByOptions).map(([key, value]) => (
              <Radio key={key}>
                <Text style={styles.radioText}>{value}</Text>
              </Radio>
            ))}
          </RadioGroup>
        </Layout>
        <Layout style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          <Select
            options={
              Object.entries(Ordering).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setOrder(value)}
          />
          <Select
            options={
              Object.entries(Markets).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setMarket(value)}
          />
          <Input placeholder="Language" value={language} onChangeText={setLanguage} />
          <Input placeholder="Super Region" value={superRegion} onChangeText={setSuperRegion} />
          <Input placeholder="Payment Type" value={paymentType} onChangeText={setPaymentType} />
          <Input placeholder="Payment Range" value={paymentRange} onChangeText={setPaymentRange} />
          <Input placeholder="Zip" value={zip} onChangeText={setZip} />
          <Select
            options={
              Object.entries(Regions).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setMarket(value)}
          />
        </Layout>
        <Layout style={{ alignItems: 'center', width: '100%' }}>
          <Button 
            style={styles.button}
            onPress={handleFetchInventory}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Search'}</Text>
          </Button>
          {loading && (
            <Text style={{ marginTop: 8 }}>Loading inventory...</Text>
          )}
          {inventoryResult && !loading && (
            <Layout style={{ marginTop: 16, width: '100%' }}>
              <Text category="s1">Inventory Result:</Text>
              <Text style={{ fontSize: 12, marginTop: 4 }}>
                {typeof inventoryResult === 'object'
                  ? JSON.stringify(inventoryResult, null, 2)
                  : String(inventoryResult)}
              </Text>
            </Layout>
          )}
        </Layout>
      </Layout>
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
  },
  radioText: {
    fontSize: 18
  }
});
