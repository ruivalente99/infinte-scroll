"use client";
import { useEffect, useState, useRef } from 'react';
import { CircularBuffer } from '../utils/circularBuffer';

// Define the shape of the data we expect from the API
interface TodoItem {
  id: number;
  title: string;
}

const API_URL = 'https://jsonplaceholder.typicode.com/todos'; // Mock API for fetching todos

export default function Home() {
  const bufferSize: number = 20;
  const visibleItems: number = 5; // Number of items visible on screen
  const buffer = useRef(new CircularBuffer<string>(bufferSize)); // Using useRef to persist the buffer between renders

  const [items, setItems] = useState<string[]>([]); // State to store visible items
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const scrollRef = useRef<HTMLDivElement>(null); // Ref for the scrollable div

  // Fetch data from the API every 5 seconds and update the buffer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data: TodoItem[] = await response.json();
        const limitedData = data.slice(0, bufferSize); // Limit to buffer size
        limitedData.forEach((item: TodoItem) => buffer.current.push(item.title)); // Fill the circular buffer with fetched data

        // If the items are not yet set, initialize with the first set
        if (loading) {
          setItems(buffer.current.getBuffer().slice(0, visibleItems)); // Set initial visible items
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Fetch new data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [loading]);

  // Auto-scrolling effect
  useEffect(() => {
    if (!loading) {
      const scrollIntervalId = setInterval(() => {
        setItems(() => {
          const nextItems: string[] = [];
          for (let i = 0; i < visibleItems; i++) {
            // Get the next item from the buffer circularly
            const nextItem = buffer.current.buffer[(buffer.current.pointer + i) % bufferSize];
            nextItems.push(nextItem);
          }

          // Push the buffer pointer forward to simulate "scrolling"
          buffer.current.pointer = (buffer.current.pointer + 1) % bufferSize;

          return nextItems;
        });

        if (scrollRef.current) {
          scrollRef.current.scrollBy({
            top: 110, // Adjust this based on item height
            behavior: 'smooth',
          });

          // Reset the scroll position when reaching the end
          if (scrollRef.current.scrollTop >= scrollRef.current.scrollHeight - scrollRef.current.clientHeight) {
            scrollRef.current.scrollTop = 0;
          }
        }
      }, 1000); // Auto scroll every second

      return () => clearInterval(scrollIntervalId);
    }
  }, [loading]); // Start the effect only after the data is fetched

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div ref={scrollRef} className="overflow-hidden h-[550px] w-[320px] flex flex-col">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-center h-[100px] w-[300px] border border-gray-500 mb-2 bg-gray-200 text-black">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
