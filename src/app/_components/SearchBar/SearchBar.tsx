'use client';

import styles from './SearchBar.module.css';
import React from 'react';
import { useState } from 'react';


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
            <img src="/searchLogo.png" className={styles['search-icon']} alt="" />

            What do you want to wear today?
            
            
        </div>
        ):(
        <div className={styles.searching}>
            <div className={styles.searchContainer}>
                <img src="/left-arrow.png" className={styles['arrow-icon']} alt="" onClick={handleCloseSearch}/>
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

    const values= ['Casual', 'Work', 'Formal', 'Active'];
    console.log("Searching for:", query);


    // You can also call an API or filter items based on the query
}



