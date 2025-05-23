import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ArrangeByOptions, Conditions, Markets, Models, Ordering, PaymentTypes, Regions } from '@limphz/tesla-api-utilities/constants';
import { Button, Card, CheckBox, Icon, Input, Layout, Radio, RadioGroup, Spinner, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { Linking, StyleSheet, View, ViewProps } from 'react-native';
import { TeslaInventoryService } from '../services/tesla-inventory.service';
import { Select } from '@/components/ui/Select';
import { InventoryResponse, OptionCodeData, Vehicle } from '@limphz/tesla-api-utilities/models';
import { setStringAsync } from 'expo-clipboard';  

export default function InventoryScreen() {
  // Example state for each VehicleSpecs property
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [arrangeByIndex, setArrangeByIndex] = useState<number | undefined>(0);
  const [order, setOrder] = useState('');
  const [market, setMarket] = useState('');
  const [language, setLanguage] = useState('en');
  const [superRegion, setSuperRegion] = useState('north america');
  const [paymentType, setPaymentType] = useState('');
  const [paymentRange, setPaymentRange] = useState('');
  const [zip, setZip] = useState('');
  const [region, setRegion] = useState('');
  const [inventoryResult, setInventoryResult] = useState<InventoryResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState('');
  const [showFederalTaxCredit, setShowFederalTaxCredit] = useState(true);

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
        count: 50,
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

  function getTeslaInventoryLinkForVin(vin: string): string {
    return `https://www.tesla.com/${model}/order/${vin}?titleStatus=${condition}${referral !== '' ? `&referral=${referral}` : ''}&redirect=no#overview`;
  }

  const CardHeader = (res: Vehicle, props?: ViewProps): React.ReactElement => (
    <View {...props} style={[props?.style, {padding: 12}]}>
      <Layout
        style={{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          {res.TrimName}
        </Text>
        {res.IsInTransit && (
          <Text
            style={{ 
              fontSize: 10,
              color: '#0a7ea4',
              fontWeight: 'bold',
              backgroundColor: '#e6f7ff',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
            }}
          >
            In Transit
          </Text>
        )}
      </Layout>
    </View>
  );

  const CardFooter = (res: Vehicle, props?: ViewProps): React.ReactElement => (
    <View
      {...props}
      style={[props?.style, styles.footerContainer]}
    >
      <Text style={{ fontWeight: 'bold', flex: 1 }}>
        ${showFederalTaxCredit && res.FederalIncentives.IsTaxIncentiveEligible 
          ? res.FederalIncentives.PriceAfterTaxIncentive 
          : res.TotalPrice}
      </Text>
      <Layout style={{ 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
      }}>
        <Button
          style={styles.footerControl}
          size='small'
          accessoryRight={props => <Icon {...props} name="email-outline" />}
          onPress={async() => {
            const url = getTeslaInventoryLinkForVin(res.VIN);
            await setStringAsync(url);
          }}
          disabled={true}
        />
        <Button
          style={styles.footerControl}
          size='small'
          accessoryRight={props => <Icon {...props} name="clipboard-outline" />}
          onPress={async() => {
            const url = getTeslaInventoryLinkForVin(res.VIN);
            await setStringAsync(url);
          }}
        />
        <Button
          style={styles.footerControl}
          size='small'
          accessoryRight={props => <Icon {...props} name="navigation-2-outline" />}
          onPress={() => {
            const url = getTeslaInventoryLinkForVin(res.VIN);
            Linking.openURL(url);
          }}
        />
      </Layout>
    </View>
  );

  const paintColorMap: Record<string, string> = {
    'Pearl White Multi-Coat': '#f2f5f5',
    'Solid Black': '#000000',
    'Deep Blue Metallic': '#0a2c5e',
    'Midnight Silver Metallic': '#535353',
    'Red Multi-Coat': '#af0f0f',
    'Ultra Red': '#cc0000',
    'Stealth Grey': '#4a4e4d',
    'Diamond Black': '#000000',
    'Quicksilver': '#a6a8a7',
    'Lunar Silver': '#b7b8b7',
  };

  const interiorColorMap: Record<string, string> = {
    'All Black': '#000000',
    'White': '#ffffff',
    'Cream': '#f2e6d4',
    'Black and White': '#000000',
    'Black and Cream': '#000000',
    'Ebony Decor': '#000000',
  };

  const getInteriorColor = (interiorName?: string): string => {
    const defaultColor = '#ccc';

    if (!interiorName) return defaultColor;
    
    for (const [key, color] of Object.entries(interiorColorMap)) {
      if (interiorName.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    
    return defaultColor;
  };

  function removeOptionCodeExclusions(option: OptionCodeData): boolean {
    const groupExclusions: string[] = ['MODEL', 'MODEL\''];
    const codeExclusions: string[] = [
      '$SC04', // Pay-as-you-go Supercharging
      '$CPF0', // Standard Connectivity
      '$APBS', // Basic Autopilot
    ];

    return groupExclusions.indexOf(option.group) >= 0 ||
      codeExclusions.indexOf(option.code) >= 0;
  }

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
          <Input placeholder='Referral Code' label='Referral Code' value={referral} onChangeText={setReferral}></Input>
          <CheckBox
            checked={showFederalTaxCredit}
            onChange={setShowFederalTaxCredit}
            style={{ marginHorizontal: 28 }}
          >
            Show pricing after federal tax credit
          </CheckBox>
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
            placeholder='Order By'
            options={
              Object.entries(Ordering).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setOrder(value)}
            value={order}
          />
          <Select
            placeholder='Market'
            options={
              Object.entries(Markets).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => {console.log("Market set: " + value); setMarket(value)}}
            value={market}
          />
          <Input placeholder="Language" label='Language' value={language} onChangeText={setLanguage} disabled={true} />
          <Input placeholder="Super Region" label='Super Region' value={superRegion} onChangeText={setSuperRegion} disabled={true} />
          <Select
            placeholder='Payment Type'
            options={
              Object.entries(PaymentTypes).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setPaymentType(value)}
            value={paymentType}
          />
          <Input placeholder="Payment Range" label='Payment Range' value={paymentRange} onChangeText={setPaymentRange} />
          <Input placeholder="ZIP" label='ZIP' value={zip} onChangeText={setZip} />
          <Select
            placeholder='Region'
            options={
              Object.entries(Regions).map(([key, value]) => (
                { label: key, value: value }
              ))
            }
            onSelect={(value) => setRegion(value)}
            value={region}
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
            <Layout style={{ marginTop: 40 }}>
              <Spinner size='giant' />
            </Layout>
          )}
          {inventoryResult && !loading && (
            <>
              {inventoryResult !== undefined && (
                <Text style={{ marginBottom: 12, marginTop: 12, alignSelf: 'center' }}>
                  Total Results: {inventoryResult.total_matches_found}
                </Text>
              )}
              <Layout
                style={{
                  marginTop: 4,
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 16,
                  justifyContent: 'center',
                }}
              >
                {inventoryResult !== undefined &&
                  inventoryResult.results.map((res) => (
                    <Card
                      key={res.VIN}
                      style={styles.card}
                      header={props => CardHeader(res, props)}
                      footer={props => CardFooter(res, props)}
                    >
                      {res.OptionCodeList && res.OptionCodeList.length > 0 && (
                        <Layout style={{ marginTop: 8 }}>
                          {res.OptionCodeList.split(',').map(code => {
                            const option = res.OptionCodeData.find(o => o.code === code);
                            if (!option || !option.name || removeOptionCodeExclusions(option)) return null;
                            
                            const shouldShowColorCircle = ['PAINT', 'INTERIOR', 'INTERIOR_COLORWAY'].includes(option.group);
                            let circleColor = '#ccc';
                            
                            if (option.group === 'PAINT') {
                              circleColor = paintColorMap[option.name] || '#ccc';
                            } else if (option.group === 'INTERIOR' || option.group === 'INTERIOR_COLORWAY') {
                              circleColor = getInteriorColor(option.name);
                            }
                            
                            return (
                              <Layout 
                                key={code} 
                                style={{ 
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: 4
                                }}
                              >
                                {shouldShowColorCircle && (
                                  <View
                                    style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: 5,
                                      backgroundColor: circleColor,
                                      borderWidth: 1,
                                      borderColor: '#ddd',
                                      marginRight: 6,
                                      marginLeft: 2,
                                    }}
                                  />
                                )}
                                <Text style={{ fontSize: 11 }}>
                                  {option.name} <Text style={{ color: '#888', fontSize: 10 }}>({option.group})</Text> <Text style={{ color: '#888', fontSize: 10 }}>({option.code})</Text>
                                </Text>
                              </Layout>
                            );
                          }).filter(Boolean)}
                        </Layout>
                      )}
                    </Card>
                  ))}
              </Layout>
            </>
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
  },
  card: {
    flex: 1,
    margin: 8,
    width: 300,
    flexBasis: 300,
    maxWidth: 350,
    flexGrow: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerControl: {
    marginHorizontal: 4,
  },
});
