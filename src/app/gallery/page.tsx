'use client';
import Style  from "./_components/gallery.module.css";
import Image from "next/image";

import { upload } from "./_components/actions";

export default  function GalleryPage() {

  
  return (
    <main className="p-5">
        <h1 className="text-2xl font-bold mb-4 text-white">Gallery</h1>
      
        {/* Your content items here */}
        <div className={`gridcontainer ${Style.gridcontainer}`}>
         <form action={async (formData) => { await upload(formData); }}>

          <div className={`grid-item ${Style.gridItem}`}>
            <input type="file" name="image" accept="image/*" required />
            <button type="submit" className={Style.uploadButton}>Upload Image</button>
          </div>
        </form>

          <div className={`grid-item ${Style.gridItem}`}>
          <Image 
            src="/f21.jpg" 
            alt="gallery image" 
            width={300} 
            height={300}
            className={Style.gridItemimg}/>
          </div>
          <div className={`grid-item ${Style.gridItem}`}>Item 2</div>
          <div className={`grid-item ${Style.gridItem}`}>Item 3</div>
  
      
    </div>
    </main>


  );
}

     