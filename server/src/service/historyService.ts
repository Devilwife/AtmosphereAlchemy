import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private filePath = 'db/db.json';

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(city: string): Promise<City | null> {
    if (!city) throw new Error('City cannot be blank');
    
    const cities = await this.getCities();
    if (cities.find(c => c.name.toLowerCase() === city.toLowerCase())) {
      return null;
    }

    const newCity = new City(city, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<boolean> {
    let cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);

    if (cities.length === updatedCities.length) {
      return false;
    }

    await this.write(updatedCities);
    return true;
  }
}

export default new HistoryService();