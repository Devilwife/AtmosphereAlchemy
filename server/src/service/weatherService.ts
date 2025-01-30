// import dotenv from 'dotenv';
// dotenv.config();
// TODO: Define a class for the Weather object
// TODO: Define an interface for the Coordinates object

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}


class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}
// Define a class for the Weather object
interface Coordinates {
  lat: number;
  lon: number;
}
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';
dotenv.config();

class WeatherService {
  
  private baseURL?: string;

  private apiKey?: string;

  private city = '';

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.WEATHER_API_KEY || '';
  }

  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geocoding/v1/json?q=${query}&key=${this.apiKey}`;
    const response = await fetch(url);
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      name: locationData.results[0].formatted_address,
      lat: locationData.results[0].geometry.location.lat,
      lon: locationData.results[0].geometry.location.lng,
      country: locationData.results[0].address_components.find((component: any) => component.types.includes('country')).long_name,
      state: locationData.results[0].address_components.find((component: any) => component.types.includes('administrative_area_level_1')).long_name,
    };
  }

  private buildGeocodeQuery(): string {
    return this.city;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const url = `${this.baseURL}/weather?${query}`;
    const response = await fetch(url);
    return response.json();
  }

  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      this.city,
      new Date().toISOString(),
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description
    );
  }

  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): any[] {
    const forecastArray = [];
    for (const data of weatherData) {
      forecastArray.push({
        date: data.dt_txt,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherDescription: data.weather[0].description,
      });
    }
    return forecastArray;
  }

  async getWeatherForCity(city: string): Promise<any> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return {
      currentWeather,
      forecastArray
    };
  }
}
export default new WeatherService();

// export default new WeatherService();

//   private async fetchLocationData(query: string): Promise<any> {
//     const url = `${this.baseURL}/geocoding/v1/json?q=${query}&key=${this.apiKey}`;
//     const response = await fetch(url);
//     return response.json();
//   }

//   private destructureLocationData(locationData: any): Coordinates {
//     return {
//       name: locationData.results[0].formatted_address,
//       lat: locationData.results[0].geometry.location.lat,
//       lon: locationData.results[0].geometry.location.lng,
//       country: locationData.results[0].address_components.find((component: any) => component.types.includes('country')).long_name,
//       state: locationData.results[0].address_components.find((component: any) => component.types.includes('administrative_area_level_1')).long_name,
//     };
//   }
//   private buildGeocodeQuery(): string {
//     return this.city;
//   }

//   private buildWeatherQuery(coordinates: Coordinates): string {
//     return `lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
//   }

//  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
//     const query = this.buildGeocodeQuery();
//     const locationData = await this.fetchLocationData(query);
//     return this.destructureLocationData(locationData);
//   }

//   private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
//     const query = this.buildWeatherQuery(coordinates);
//     const url = `${this.baseURL}/weather?${query}`;
//     const response = await fetch(url);
//     return response.json();
//   }

//   private parseCurrentWeather(response: any): Weather {
//     return new Weather(
//       this.city,
//       new Date().toISOString(),
//       response.main.temp,
//       response.wind.speed,
//       response.main.humidity,
//       response.weather[0].icon,
//       response.weather[0].description
//     );
//   }

//   // private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
//     private buildForecastArray(currentWeather: Weather, weatherData: any[]): any[] {
//       const forecastArray = [];
//       for (const data of weatherData) {
//         forecastArray.push({
//           date: data.dt_txt,
//           temperature: data.main.temp,
//           humidity: data.main.humidity,
//           windSpeed: data.wind.speed,
//           weatherDescription: data.weather[0].description,
//         });
//       }
//       return forecastArray;
//     }
//   }
  

// export default new WeatherService();
// async function getWeatherForCity(city: string): Promise<any> {
//   const weatherService = new WeatherService();
//   return await weatherService.getWeatherForCity(city);
// }

