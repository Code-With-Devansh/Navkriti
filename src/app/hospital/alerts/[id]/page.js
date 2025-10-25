"use client"
import { fetchWithProgress } from '@/lib/fetchWithProgess';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
const page = () => {
    const [data, setData] = useState({});
    const {id} = useParams();
    useEffect(() => {
        // Fetch alert data based on ID
        const fetchData = async () => {
            try {
                const response = await fetchWithProgress('/api/alerts/'+id);
                const result = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error('Error fetching alert data:', error);
            }
        };
        fetchData();
    }, [])
    
  return (
    <div>{Object.keys(data).map((e)=>{return e+' : '+data[e]+'\n'})}</div>
  )
}

export default page