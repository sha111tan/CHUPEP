import React from "react";
import Link from "next/link";

interface NewsCardProps {
  news_id: number;
  news_photo: string;
  news_title: string;
  news_text: string;
  news_date: string;
}

const NewsCard = ({
  news_id,
  news_photo,
  news_title,
  news_text,
  news_date,
}: NewsCardProps) => {
  return (
    <Link href={`/news/${news_id}`}>
      <div className="transition-all duration-500 hover:scale-[1.02]">
        <div className="bg-[#303030] rounded-[40px] h-[300px] relative mb-6">
          {news_photo && (
            <img
              src={news_photo}
              alt={news_title}
              className="w-full h-full object-cover rounded-[40px]"
            />
          )}
          <div className="px-8 py-2 absolute bottom-6 mx-8 bg-[#575757] rounded-[40px]">
            <p className="text-white font-[600] text-[12px]">
              {new Date(news_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="grid mb-6">
          <p className="font-[600] text-[24px] mb-3 leading-[26px]">
            {news_title && news_title.length > 50
              ? `${news_title.substring(0, 50)}...`
              : news_title}
          </p>
          <p className="font-[400] text-[16px] mb-3 leading-[19px]">
            {news_text && news_text.length > 50
              ? `${news_text.substring(0, 50)}...`
              : news_text}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
