import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

const CityDetailsPage: React.FC = () => {
    const [cityName, setCityName] = useState<string>('');
    const [lat, setLat] = useState<string>('');
    const [lon, setLon] = useState<string>('');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
    const [pressureUnit, setPressureUnit] = useState<'hPa' | 'mb'>('hPa');
    const [speedUnit, setSpeedUnit] = useState<'m/s' | 'mph'>('m/s');
    const API_KEY = '6e130ee55b401757bb5a2338932b0ebc';

    useEffect(() => {
        // Parse the query string
        const params = new URLSearchParams(window.location.search);
        // Get the value of the 'name', 'lat', and 'lon' parameters
        const cityNameParam = params.get('name');
        const latParam = params.get('lat');
        const lonParam = params.get('lon');
        if (cityNameParam && latParam && lonParam) {
            // Set the city name, latitude, and longitude states
            setCityName(cityNameParam);
            setLat(latParam);
            setLon(lonParam);
        }
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        // Fetch weather data when lat and lon are set
        if (lat && lon) {
            fetchWeatherData();
        }
    }, [lat, lon]);

    // Function to convert temperature from Celsius to Fahrenheit
    const convertTemperature = (temperature: number) => {
        if (temperatureUnit === 'C') {
            return temperature; // No conversion needed
        } else {
            return (temperature * 9) / 5 + 32; // Convert Celsius to Fahrenheit
        }
    };

    // Function to convert pressure from hPa to mb
    const convertPressure = (pressure: number) => {
        if (pressureUnit === 'hPa') {
            return pressure; // No conversion needed
        } else {
            return pressure * 0.1; // Convert hPa to mb
        }
    };

    // Function to convert wind speed from m/s to mph
    const convertSpeed = (speed: number) => {
        if (speedUnit === 'm/s') {
            return speed; // No conversion needed
        } else {
            return speed * 2.23694; // Convert m/s to mph
        }
    };

    // Update weather data with converted units
    const convertedWeatherData = weatherData?.list?.map((item: any) => ({
        ...item,
        main: {
            ...item.main,
            temp: convertTemperature(item.main.temp),
            pressure: convertPressure(item.main.pressure),
        },
        wind: {
            ...item.wind,
            speed: convertSpeed(item.wind.speed),
        },
    }));

    return (
        <div>
            <h1>City Details</h1>
            <p>City Name: {cityName}</p>
            <p>Latitude: {lat}</p>
            <p>Longitude: {lon}</p>
            {/* Unit selection */}
            <div >
                <label >Temperature Unit:</label>
                <select className=' text-black' value={temperatureUnit} onChange={(e) => setTemperatureUnit(e.target.value as 'C' | 'F')}>
                    <option value="C">Celsius</option>
                    <option value="F">Fahrenheit</option>
                </select>
                <label>Pressure Unit:</label>
                <select className=' text-black' value={pressureUnit} onChange={(e) => setPressureUnit(e.target.value as 'hPa' | 'mb')}>
                    <option value="hPa">hPa</option>
                    <option value="mb">mb</option>
                </select>
                <label>Wind Speed Unit:</label>
                <select className=' text-black' value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value as 'm/s' | 'mph')}>
                    <option value="m/s">m/s</option>
                    <option value="mph">mph</option>
                </select>
            </div>
            {/* Display weather data */}
            {convertedWeatherData && (
                <div>
                    <h2>Weather Forecast for {cityName}</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sr No.</TableHead>
                                <TableHead>Climate</TableHead>
                                <TableHead>Date and Time</TableHead>
                                <TableHead>Wind</TableHead>
                                <TableHead>Temperature</TableHead>
                                <TableHead>Pressure</TableHead>
                                <TableHead>Humidity</TableHead>
                                <TableHead>Cloudiness</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {convertedWeatherData.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.weather[0].description}</TableCell>
                                    <TableCell>{item.dt_txt}</TableCell>
                                    <TableCell>Speed: {item.wind.speed} {speedUnit}, Direction: {item.wind.deg}°, Gust: {item.wind.gust}</TableCell>
                                    <TableCell>{item.main.temp} {temperatureUnit}</TableCell>
                                    <TableCell>{item.main.pressure} {pressureUnit}</TableCell>
                                    <TableCell>{item.main.humidity}%</TableCell>
                                    <TableCell>{item.clouds.all}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default CityDetailsPage;
