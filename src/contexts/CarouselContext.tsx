import React, { createContext, useContext, useState } from 'react';

interface CarouselContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  totalImages: number;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export const CarouselProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = 5; // cheetah + 4 images

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, totalImages }}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within CarouselProvider');
  }
  return context;
};
