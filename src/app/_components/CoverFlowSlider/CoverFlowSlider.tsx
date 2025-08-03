'use client';

import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Import component styles
import styles from './CoverFlowSlider.module.css';

// Define the props type
interface CoverflowSliderProps {
  images: string[];
}

export default function CoverflowSlider({ images }: CoverflowSliderProps) {
  return (
    <div className={styles.container}>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        pagination={{ el: `.${styles.pagination}`, clickable: true }}
        navigation={{
          nextEl: `.${styles.nextButton}`,
          prevEl: `.${styles.prevButton}`,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className={styles.swiper_container}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={styles.swiper_slide}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}

        
      </Swiper>
    </div>
  );
}