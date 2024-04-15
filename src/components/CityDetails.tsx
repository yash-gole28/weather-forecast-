import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from './ui/use-toast';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const CityDetailsPage: React.FC = () => {
    const { name, lat, lon } = useParams(); // Use useParams to get route parameters
    const [weatherData, setWeatherData] = useState<any>(null);
    const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
    const [pressureUnit, setPressureUnit] = useState<'hPa' | 'mb'>('hPa');
    const [speedUnit, setSpeedUnit] = useState<'m/s' | 'mph'>('m/s');
    const [loading, setLoading] = useState<boolean>(false); // Add loading state

    const { toast } = useToast()

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true); // Set loading state to true before fetching data
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}`);
                setWeatherData(response.data);
            } catch (error) {
                toast({
                    title: " Error ",
                    description: "Error while Fetching Data",
                });
            } finally {
                setLoading(false); // Set loading state to false after fetching data
            }
        };

        // Fetch weather data when lat and lon are set
        if (lat && lon) {
            fetchWeatherData();
        }
    }, [lat, lon, toast]); // Add lat, lon, and toast as dependencies

    // Function to convert temperature from Celsius to Fahrenheit
    const convertTemperature = (temperature: number) => {
        if (temperatureUnit === 'C') {
            return temperature;
        } else {
            return (temperature * 9) / 5 + 32; // Convert Celsius to Fahrenheit
        }
    };

    // Function to convert pressure from hPa to mb
    const convertPressure = (pressure: number) => {
        if (pressureUnit === 'hPa') {
            return pressure;
        } else {
            return pressure * 0.1; // Convert hPa to mb
        }
    };

    // Function to convert wind speed from m/s to mph
    const convertSpeed = (speed: number) => {
        if (speedUnit === 'm/s') {
            return speed;
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

    // Open the map in a new tab
    const openMap = () => {
        const url = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <h1 className=' text-xl font-semibold m-4 border-b pb-4'>City Name: {name}</h1>
            <div className=' flex justify-center border-b pb-4 m-4'>
                <p className='text-muted-foreground text-xl'>Current Weather -{convertedWeatherData?.length ?convertedWeatherData[0].weather[0].description : null}</p>
        
            </div>

            <div className=' flex justify-between items-center'>
                <h2 className=' text-xl m-4'>Next 5 days Weather Forecast </h2>
                <Button variant="outline" className='mr-4' onClick={openMap}>View on Map</Button>
            </div>

            {loading ? (
                <div className=' w-full min-h-screen flex items-start justify-center'>
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

                    </div>
                </div>

            ) : (
                convertedWeatherData && (
                    <div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sr No.</TableHead>
                                    <TableHead>Climate</TableHead>
                                    <TableHead>Date and Time</TableHead>
                                    <TableHead>
                                        <label>Wind Speed Unit:</label>
                                        <select
                                            className="bg-background text-foreground outline-none"
                                            value={speedUnit}
                                            onChange={(e) => setSpeedUnit(e.target.value as 'm/s' | 'mph')}
                                        >
                                            <option value="m/s">m/s</option>
                                            <option value="mph">mph</option>
                                        </select>
                                    </TableHead>
                                    <TableHead>
                                        <label >Temperature Unit:</label>
                                        <select
                                            className="bg-background text-foreground outline-none"
                                            value={temperatureUnit}
                                            onChange={(e) => setTemperatureUnit(e.target.value as 'C' | 'F')}
                                        >
                                            <option value="C">Celsius</option>
                                            <option value="F">Fahrenheit</option>
                                        </select>
                                    </TableHead>
                                    <TableHead>
                                        <label>Pressure Unit:</label>
                                        <select
                                            className="bg-background text-foreground outline-none"
                                            value={pressureUnit}
                                            onChange={(e) => setPressureUnit(e.target.value as 'hPa' | 'mb')}
                                        >
                                            <option value="hPa">hPa</option>
                                            <option value="mb">mb</option>
                                        </select>
                                    </TableHead>
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
                                        <TableCell>Speed: {item.wind.speed}, Direction: {item.wind.deg}°, Gust: {item.wind.gust}</TableCell>
                                        <TableCell>{item.main.temp}</TableCell>
                                        <TableCell>{item.main.pressure}</TableCell>
                                        <TableCell>{item.main.humidity}%</TableCell>
                                        <TableCell>{item.clouds.all}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
            )}

        </div>
    );
};

export default CityDetailsPage;
