'use client';

import styles from './SearchBar.module.css';
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';


export default function SearchBar() {
    const [isSearching, setIsSearching] = useState(false);
    
  // A function to handle closing the search view
  const handleCloseSearch = () => {
    setIsSearching(false);
  };

    return (
        <>

        {!isSearching?(
        <div className={styles.container} onClick={() => setIsSearching(true)}>
            <Image src="/searchLogo.png" className={styles['search-icon']} alt="Search" width={24} height={24} />

            What do you want to wear today?
            
            
        </div>
        ):(
        <div className={styles.searching}>
            <div className={styles.searchContainer}>
                <Image src="/left-arrow.png" className={styles['arrow-icon']} alt="Back" width={20} height={20} onClick={handleCloseSearch}/>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Search for outfits, styles, or trends."
                    onChange={(e) => search(e.target.value)}/>
            </div>
        </div>)}

        </>
        

    );
}

export function search(query: string) {
    // Implement search logic here
    const values = ['Casual', 'Work', 'Formal', 'Active'];
    console.log("Searching for:", query);
    console.log("Available categories:", values);

    // You can also call an API or filter items based on the query
    return values.filter(value => 
        value.toLowerCase().includes(query.toLowerCase())
    );
}



