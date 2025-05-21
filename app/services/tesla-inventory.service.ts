import { InventoryResponse, VehicleSpecs } from "@limphz/tesla-api-utilities/models";

const BASE_URL = process.env.EXPO_PUBLIC_TESLA_API_BASE_URL;

export class TeslaInventoryService {
    public async fetchInventory(query: VehicleSpecs): Promise<InventoryResponse> {
      try {
        const response = await fetch(`${BASE_URL}api/inventory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query),
        });
        if (!response.ok) {
          response.text().then((text) => {
            throw new Error(`HTTP error! status: ${response.status}\n${text}`);
          });
        }
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        throw error;
      }
    }
}
