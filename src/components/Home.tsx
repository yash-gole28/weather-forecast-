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
import { ModeToggle } from './mode-toggle';
import { Input } from "@/components/ui/input"


const InfiniteScrollComponent: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [originalData, setOriginalData] = useState<any[]>([]); // Maintain original data
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const observer = useRef<IntersectionObserver>();

    const fetchData = async (pageNumber: number) => {
        try {
            const offset = (pageNumber - 1) * 10;
            const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${offset}`);
            const newData = response.data.results.map((response: any) => response);
            setData(prevData => [...prevData, ...newData]);
            setOriginalData(prevData => [...prevData, ...newData]); // Update original data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            // If search query is empty, display all original data
            setData(originalData);
        } else {
            // Filter data based on search query
            const filteredData = originalData.filter(item =>
                item.ascii_name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setData(filteredData);
        }
    };

    return (
        <div>
            <div className='flex justify-end items-center pr-10'>
                <span className='pr-6'>theme</span>
                <ModeToggle />
            </div>
            <div>
                {/* <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search..."
                /> */}
                <div className=' w-1/3'>
                <Input type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search..."/>
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
                                <TableCell>{item.ascii_name}</TableCell>
                                <TableCell>{item.cou_name_en}</TableCell>
                                <TableCell>{item.coordinates.lon} {item.coordinates.lat}</TableCell>
                                <TableCell>{item.timezone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div id="scroll-sentinel" style={{ height: '10px' }}></div>
            {loading && <div>Loading...</div>}
        </div>
    );
};

export default InfiniteScrollComponent;
