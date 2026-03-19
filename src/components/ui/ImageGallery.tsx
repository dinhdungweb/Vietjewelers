import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-800 p-4 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={images[selected]}
          alt={alt}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-800 p-1 border-2 transition-colors ${
                i === selected ? 'border-primary' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <img
                src={img}
                alt={`${alt} ${i + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
