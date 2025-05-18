import React from "react";

interface EventItem {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date_time: string;
  event_location: string;
  event_max_seats: number;
  event_photo?: string;
  event_host?: string;
  event_price?: string;
}

interface EventsCardProps {
  event: EventItem;
  onClick: () => void;
}

const EventsCard: React.FC<EventsCardProps> = ({ event, onClick }) => {
  const isPastEvent = new Date(event.event_date_time) < new Date();

  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all duration-500 hover:scale-[1.02]"
    >
      <div className="bg-[#303030] rounded-[40px] md:px-10 px-4 py-4 md:py-10 md:h-[280px] h-[180px] gap-4  grid grid-cols-2 relative">
        <div className="bg-[#fff] rounded-[32px] overflow-hidden">
          {event.event_photo && (
            <img
              src={event.event_photo}
              alt={event.event_name}
              className={`w-full h-full object-cover rounded-[32px] ${isPastEvent ? "grayscale opacity-75" : ""}`}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div className="text-white flex flex-col justify-between">
          <div>
            <p className="font-[600] md:text-[28px] text-[14px] md:mb-4 mb-2">{event.event_name}</p>
            <p className="font-[500] md:text-[14px] text-[10px] md:mb-1 text-[#C1C1C1] md:leading-[17px]">
              {event.event_description}
            </p>
            <p className="font-[500] md:text-[14px] text-[10px] md:mb-1 text-[#C1C1C1] md:leading-[17px]">
              {new Date(event.event_date_time).toLocaleString()}
            </p>
            <p className="font-[500] md:text-[14px] text-[10px] text-[#C1C1C1] md:leading-[17px]">
              {event.event_location}
            </p>
          </div>
          <div>
            {event.event_price && (
              <p className="font-[700] md:text-[28px] text-[16px] ">
                от {event.event_price} ₽
              </p>
            )}
          </div>
        </div>
        {isPastEvent && (
          <div className="absolute top-4 right-6   bg-[#575757] text-white px-4 py-1 rounded-[10px] md:text-[12px] text-[8px]">
            Завершено
          </div>
          
        )}
      </div>
    </div>
  );
};

export default EventsCard;
