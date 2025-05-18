"use client";
import React, { useState } from "react";

interface Review {
  content: string;
  author: string;
  relation: string;
  image: string;
}

interface ReviewsComponentProps {
  reviews: Review[];
  category: string;
}

const ReviewsComponent: React.FC<ReviewsComponentProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="xl:rounded-[40px] transition-all hover:shadow duration-500 hover:scale-[1.02] rounded-[16px] xl:h-full h-[355px] xl:max-w-[373px] w-full grid gap-4 bg-[#EEEBE8] xl:p-10 p-8">
      <p className="md:text-[14px] text-[10px] h-6">ОТЗЫВЫ О КЛИНИКЕ</p>
      <div className="xl:h-[170px] h-[170px] overflow-hidden">
        <p className="font-semibold text-[14px] md:text-[16px]">
          {currentReview.content}
        </p>
      </div>
      <div className="flex items-center gap-3 justify-between h-20">
        <div className="flex gap-3 items-center h-full">
          <img
            src={currentReview.image}
            alt={`${currentReview.author}'s avatar`}
            className="rounded-full bg-[#CFCFCF]  h-12 w-12 object-cover"
          />
          <div>
            <p className="font-semibold text-[14px]  overflow-hidden">
              {currentReview.author}
            </p>
            <p className="text-[12px]  overflow-hidden">
              {currentReview.relation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-full">
          <button
            onClick={handlePrev}
            className="rounded-full bg-[#CFCFCF] p-5 flex items-center justify-center h-12 w-12 transition-all hover:shadow duration-500 hover:scale-[1.05]"
          >
            <span className="text-lg text-black">&lt;</span>
          </button>
          <button
            onClick={handleNext}
            className="rounded-full bg-[#CFCFCF] p-5 flex items-center justify-center h-12 w-12 transition-all hover:shadow duration-500 hover:scale-[1.05]"
          >
            <span className="text-lg text-black">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsComponent;
