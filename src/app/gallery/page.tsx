"use server";
import { db } from "~/server/db";
import Style  from "./_components/gallery.module.css";
import Image from "next/image";

import { upload } from "./_components/actions";

export default async function GalleryPage() {
  // Fetch clothing items from database
  const topItems = await db.top.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10 // Limit to recent 10 items
  });

  const bottomItems = await db.bottom.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const onePieceItems = await db.onePiece.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const footwearItems = await db.footwear.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return (
    <main className="p-5">
        <h1 className="text-2xl font-bold mb-4 text-white">Gallery</h1>
      
        {/* Upload Form */}
        <form action={upload}>
           <button type="submit" className={Style.uploadButton}>Upload Image</button>
           <input type="file" name="image" accept="image/*" required className={Style.uploadInput} />
        </form>
        
        <div className={`gridcontainer ${Style.gridcontainer}`}>
          {/* Display uploaded tops */}
          {topItems.map((item) => (
            <div key={`top-${item.id}`} className={`grid-item ${Style.gridItem}`}>
              <Image 
                src={item.imageUrl ?? "/f21.jpg"}
                alt={item.name ?? "Top item"}
                width={300} 
                height={300}
                className={Style.gridItemimg}/>
              <p className="text-white text-sm mt-2">{item.name}</p>
            </div>
          ))}
          
          {/* Display uploaded bottoms */}
          {bottomItems.map((item) => (
            <div key={`bottom-${item.id}`} className={`grid-item ${Style.gridItem}`}>
              <Image 
                src={item.imageUrl ?? "/f21.jpg"}
                alt={item.name ?? "Bottom item"}
                width={300} 
                height={300}
                className={Style.gridItemimg}/>
              <p className="text-white text-sm mt-2">{item.name}</p>
            </div>
          ))}
          
          {/* Display uploaded one pieces */}
          {onePieceItems.map((item) => (
            <div key={`onepiece-${item.id}`} className={`grid-item ${Style.gridItem}`}>
              <Image 
                src={item.imageUrl ?? "/f21.jpg"}
                alt={item.name ?? "One piece item"}
                width={300} 
                height={300}
                className={Style.gridItemimg}/>
              <p className="text-white text-sm mt-2">{item.name}</p>
            </div>
          ))}
          
          {/* Display uploaded footwear */}
          {footwearItems.map((item) => (
            <div key={`footwear-${item.id}`} className={`grid-item ${Style.gridItem}`}>
              <Image 
                src={item.imageUrl ?? "/f21.jpg"}
                alt={item.name ?? "Footwear item"}
                width={300} 
                height={300}
                className={Style.gridItemimg}/>
              <p className="text-white text-sm mt-2">{item.name}</p>
            </div>
          ))}

          {/* Default grid item */}
          <div className={`grid-item ${Style.gridItem}`}>
            <Image 
              src="/f21.jpg" 
              alt="gallery image" 
              width={300} 
              height={300}
              className={Style.gridItemimg}/>
          </div>
        </div>
    </main>
  );
}

     