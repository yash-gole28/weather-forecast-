import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Skeleton } from './ui/skeleton';
import { Link } from 'react-router-dom';


const InfiniteScrollComponent: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const observer = useRef<IntersectionObserver>();
    const [history, setHistory] = useState<{ name: string, lat: number, lon: number }[]>(() => {
        const storedHistory = localStorage.getItem('cityHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
    });

    const { toast } = useToast()

    const fetchData = async (pageNumber: number) => {
        try {
            const offset = (pageNumber - 1) * 10;
            const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${offset}`);
            const newData = response.data.results.map((response: any) => response);
            setData(prevData => [...prevData, ...newData]);
            setOriginalData(prevData => [...prevData, ...newData]);
            setLoading(false);
        } catch (error) {

            toast({
                title: " Error ",
                description: "Error while Fetching Data",

            })
            setLoading(false);
        }
    };

    const sortData = () => {
        const sortedData = [...data].sort((a, b) => {
            const nameA = a.ascii_name.toUpperCase();
            const nameB = b.ascii_name.toUpperCase();
            if (sortOrder) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
        setData(sortedData);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    useEffect(() => {
        sortData();
    }, [sortOrder]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                setLoading(true);
                setPage(prevPage => prevPage + 1);
            }
        }, options);

        if (observer.current) {
            observer.current.observe(document.getElementById('scroll-sentinel') as Element);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    const handleSortChange = () => {
        setSortOrder(prevSortOrder => !prevSortOrder);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setSearchQuery(inputValue);
        if (inputValue.trim() === '') {
            setData(originalData);
        } else {
            const filteredData = originalData.filter(item =>
                item.ascii_name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setData(filteredData);
        }
    };

    const openCityDetails = (cityName: string, lat: number, lon: number) => {
        const url = `/city-details/${encodeURIComponent(cityName)}/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;
        window.open(url, '_blank');
        // Add to history
        addToHistory(cityName, lat, lon);
    };

    const addToHistory = (name: string, lat: number, lon: number) => {
        const updatedHistory = [{ name, lat, lon }, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('cityHistory', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('cityHistory');
    };

    return (
        <div className=' w-full '>
            <div className=' ml-4 mr-4'>
                <div className='flex justify-between items-center pr-10 pl-10 mb-6 mt-4 border-b pb-4'>
                    <div className='text-3xl'>Weather Forecast</div>
                    <div><span className='pr-6'>theme</span>
                        <ModeToggle /></div>
                </div>

                <div>
                    <div className=' flex justify-between'>
                        <div className=' w-1/3 '>
                            <Input type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder="Search..." />
                        </div>
                        <div className=' mb-4'>
                            <Dialog>
                                <DialogTrigger><Button variant="secondary">History</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        {history?.length ? <DialogTitle>Here's your History</DialogTitle> : <DialogTitle>No search history yet</DialogTitle>}
                                        
                                        <DialogDescription>
                                            <div className='mb-3'>
                                                {history.map((item, index) => (
                                                    <p className=' text-xl' key={index}>
                                                        <button onClick={() => openCityDetails(item.name, item.lat, item.lon)}>{item.name}</button>
                                                    </p>
                                                ))}
                                            </div>
                                            <Button onClick={clearHistory}>Clear History</Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <span>Name</span>
                                    <span className='pl-6' onClick={handleSortChange}>
                                        sort- {sortOrder ? "Descending" : "Ascending"}
                                    </span>
                                </TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Coordinates</TableHead>
                                <TableHead>Timezone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link onClick={() => addToHistory(item.ascii_name, item.coordinates.lat, item.coordinates.lon)} to={`/city-details/${encodeURIComponent(item.ascii_name)}/${encodeURIComponent(item.coordinates.lat)}/${encodeURIComponent(item.coordinates.lon)}`} target='_blank'>
                                            {item.ascii_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.cou_name_en}</TableCell>
                                    <TableCell>{item.coordinates.lat} {item.coordinates.lon}</TableCell>
                                    <TableCell>{item.timezone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div id="scroll-sentinel" style={{ height: '10px' }}></div>
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

                    </div>
                </div>}

            </div>
        </div>
    );
};

export default InfiniteScrollComponent;
