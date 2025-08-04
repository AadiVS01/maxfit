'use server';
import CoverflowSlider from "./_components/CoverFlowSlider/CoverFlowSlider";
import Style from "./_components/Home.module.css";
import SearchBar from "./_components/SearchBar/SearchBar";

const images = [
  '/f21.jpg',
  '/f21.jpg',
  '/f21.jpg',
  '/f21.jpg',
];
export default async function HomePage() {
  return (
    <main className="p-5"> 

      <SearchBar />



      <div className={`gridcontainer ${Style.gridcontainer}`}>


         <div className={`griditem ${Style.griditem}`}>Casual</div>
         <div className={`griditem ${Style.griditem}`}>Work</div>
         <div className={`griditem ${Style.griditem}`}>Formal</div>
         <div className={`griditem ${Style.griditem}`}>Active </div>
         


      </div>

      <CoverflowSlider images={images} />

      
    </main>
    
  
  );
}
