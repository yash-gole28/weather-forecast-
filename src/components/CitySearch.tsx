import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Skeleton } from './ui/skeleton';

const CitySearch: React.FC = () => {
  const [cityName, setCityName] = useState<string>('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(event.target.value);
  };

  const searchWeather = async () => {
    try {
      setLoading(true);
      setWeatherData('')
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}`);
      setWeatherData(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchWeather();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={cityName}
          onChange={handleInputChange}
          placeholder="Enter city name..."
        />
        <Button type="submit">Search</Button>
      </form>
      {loading && <div className=' w-full min-h-screen flex items-start justify-center'>
                    <div className="flex flex-col justify-center items-center space-x-4">

                        <div className="space-y-2 mb-12">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-8 w-1/3" />
                        </div>
                        <div className="space-y-2 mb-12">
                            <Skeleton className="h-8 w-[550px]" />
                            <Skeleton className="h-8 w-[500px]" />
                        </div>
                        <div className="space-y-2 mb-12">
                            <Skeleton className="h-8 w-[550px]" />
                            <Skeleton className="h-8 w-[500px]" />
                        </div>
                        <div className="space-y-2 mb-12">
                            <Skeleton className="h-8 w-[550px]" />
                            <Skeleton className="h-8 w-[500px]" />
                        </div>

                    </div>
                </div>}
      {weatherData && (
        <div>
          <h2>Weather for {weatherData.city.name}</h2>
          <h2>Population - {weatherData.city.population}</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DateTime</TableHead>
                <TableHead>Temperature (K)</TableHead>
                <TableHead>Weather</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weatherData.list.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.dt_txt}</TableCell>
                  <TableCell>{item.main.temp}</TableCell>
                  <TableCell>{item.weather[0].description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
