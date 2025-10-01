"use server";
import { db } from "~/server/db";
import Style  from "./_components/gallery.module.css";
import Image from "next/image";

import { upload } from "./_components/actions";

async function TopPics() {
  return await db.top.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      colors: { select: { name: true, hexCode: true } },
      topType: { select: { name: true } },
      user: { select: { id: true } }
    },
    orderBy: { name: "asc" }
  });
}

// BOTTOM
async function BottomPics() {
  return await db.bottom.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      colors: { select: { name: true, hexCode: true } },
      bottomType: { select: { name: true } },
      user: { select: { id: true } }
    },
    orderBy: { name: "asc" }
  });
}

// ONE PIECE
async function OnePiecePics() {
  return await db.onePiece.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      colors: { select: { name: true, hexCode: true } },
      onePieceType: { select: { name: true } },
      user: { select: { id: true } }
    },
    orderBy: { name: "asc" }
  });
}

// FOOTWEAR
async function FootwearPics() {
  return await db.footwear.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      colors: { select: { name: true, hexCode: true } },
      footwearType: { select: { name: true } },
      user: { select: { id: true } }
    },
    orderBy: { name: "asc" }
  });
}



export default async function GalleryPage() {



  return (
    <main className="p-5">
        <h1 className="text-2xl font-bold mb-4 text-white">Gallery</h1>
      
        {/* Your content items here */}
        <form action={upload}>

          
           <button type="submit" className={Style.uploadButton}>Upload Image</button>
           <input type="file" name="image" accept="image/*" required className={Style.uploadInput} />
            
        </form>
        <div className={`gridcontainer ${Style.gridcontainer}`}>
         

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

     