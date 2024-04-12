import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ModeToggle } from './mode-toggle';

const InfiniteScrollComponent: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(15);
    const observer = useRef<IntersectionObserver>();

    const fetchData = async (pageNumber: number) => {
        try {
            const response = await axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&page=${pageNumber}`);
            const newData = response.data.records.map((record: any) => record.fields);
            setData(prevData => [...prevData, ...newData]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page, loading]); // Listen for changes in page and loading state

    // Fetch initial data when component mounts
    useEffect(() => {
        fetchData(page);
    }, []); // Empty dependency array

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
    
        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                setLoading(true); // Set loading to true before updating page to avoid multiple fetches
                setPage(prevPage => prevPage + 1); // Update page to trigger fetching of new data
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
    }, []); // Empty dependency array

    return (
        <div>
            <div className='flex justify-end items-center pr-10'>
                <span className='pr-6'>theme</span>
                <ModeToggle />
            </div>
            <div>
                {/* Render the list of data */}
                <Table>
                    {/* <TableCaption>A list of cities</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Coordinates</TableHead>
                            <TableHead>Timezone</TableHead>
                            {/* Add more TableHeads for other columns if needed */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.ascii_name}</TableCell>
                                <TableCell>{item.cou_name_en}</TableCell>
                                <TableCell>{item.coordinates[0]} {item.coordinates[1]}</TableCell>
                                <TableCell>{item.timezone}</TableCell>
                                {/* Add more TableCell components for other columns if needed */}
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
