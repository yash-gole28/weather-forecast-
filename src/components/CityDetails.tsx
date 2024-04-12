import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CityDetails: React.FC<{ cityName: string }> = ({ cityName }) => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const API_KEY = '6e130ee55b401757bb5a2338932b0ebc';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=${API_KEY}`);
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    if (!weatherData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Weather Forecast for {cityName}</h1>
            {/* Display weather forecast data */}
        </div>
    );
};

export default CityDetails;
