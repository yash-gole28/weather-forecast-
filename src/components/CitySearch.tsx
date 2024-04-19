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
    const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
    const [pressureUnit, setPressureUnit] = useState<'hPa' | 'mb'>('hPa');
    const [speedUnit, setSpeedUnit] = useState<'m/s' | 'mph'>('m/s');

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

    // Function to convert temperature from Kelvin to Celsius or Fahrenheit
    const convertTemperature = (temperature: number) => {
        if (temperatureUnit === 'C') {
            return temperature - 273.15; // Convert Kelvin to Celsius
        } else {
            return (temperature - 273.15) * 9 / 5 + 32; // Convert Kelvin to Fahrenheit
        }
    };

    // Function to convert pressure from hPa to mb or vice versa
    const convertPressure = (pressure: number) => {
        if (pressureUnit === 'hPa') {
            return pressure;
        } else {
            return pressure * 0.1; // Convert hPa to mb
        }
    };

    // Function to convert wind speed from m/s to mph or vice versa
    const convertSpeed = (speed: number) => {
        if (speedUnit === 'm/s') {
            return speed;
        } else {
            return speed * 2.23694; // Convert m/s to mph
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}>
                <div className='flex m-4'>
                    <Input
                        className=' w-1/3 mr-8'
                        type="text"
                        value={cityName}
                        onChange={handleInputChange}
                        placeholder="Enter city name..."
                    />
                    <Button type="submit">Search</Button>
                </div>

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
                    <h2 >Weather for {weatherData.city.name}</h2>
                    <h2>Population - {weatherData.city.population}</h2>
                    <div>
                    <Table>
                        <TableHeader >
                            <TableRow >
                                <TableHead >DateTime</TableHead>
                                <TableHead>Temperature
                                    <select
                                        className="bg-background text-foreground outline-none"
                                        value={temperatureUnit}
                                        onChange={(e) => setTemperatureUnit(e.target.value as 'C' | 'F')}
                                    >
                                        <option value="C">Celsius</option>
                                        <option value="F">Fahrenheit</option>
                                    </select>
                                </TableHead>
                                <TableHead>Weather</TableHead>
                                <TableHead>Humidity (%)</TableHead>
                                <TableHead>Wind Speed
                                    <select
                                        className="bg-background text-foreground outline-none"
                                        value={speedUnit}
                                        onChange={(e) => setSpeedUnit(e.target.value as 'm/s' | 'mph')}
                                    >
                                        <option value="m/s">m/s</option>
                                        <option value="mph">mph</option>
                                    </select>
                                </TableHead>
                                <TableHead>Cloudiness (%)</TableHead>
                                <TableHead>Pressure
                                    <select
                                        className="bg-background text-foreground outline-none"
                                        value={pressureUnit}
                                        onChange={(e) => setPressureUnit(e.target.value as 'hPa' | 'mb')}
                                    >
                                        <option value="hPa">hPa</option>
                                        <option value="mb">mb</option>
                                    </select>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weatherData.list.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{item.dt_txt}</TableCell>
                                    <TableCell>{convertTemperature(item.main.temp).toFixed(2)}</TableCell>
                                    <TableCell>{item.weather[0].description}</TableCell>
                                    <TableCell>{item.main.humidity}</TableCell>
                                    <TableCell>{convertSpeed(item.wind.speed).toFixed(2)}</TableCell>
                                    <TableCell>{item.clouds.all}</TableCell>
                                    <TableCell>{convertPressure(item.main.pressure).toFixed(2)}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    </div>
                   
                </div>
            )}
        </div>
    );
};

export default CitySearch;
