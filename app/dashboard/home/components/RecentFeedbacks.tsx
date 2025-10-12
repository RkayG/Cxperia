import React from "react";

interface Feedback {
  id: string;
  productName: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  productImageUrl?: string;
}

interface RecentFeedbacksProps {
  feedbacks: Feedback[];
  onSeeAll?: () => void;
}

const RecentFeedbacks: React.FC<RecentFeedbacksProps> = ({ feedbacks, onSeeAll }) => {
  return (
    <div className="mt-12 mb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Feedbacks</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="min-w-[320px] max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start justify-center"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="flex items-center gap-3 mb-2">
              {fb.productImageUrl && (
                <img
                  src={fb.productImageUrl}
                  alt={fb.productName}
                  className="w-12 h-12 object-cover rounded-lg shadow"
                />
              )}
              <div>
                <h3 className="text-md font-semibold text-gray-800">{fb.productName}</h3>
                <span className="text-xs text-gray-400">{fb.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 font-bold">{"★".repeat(fb.rating)}</span>
              <span className="text-gray-500 text-sm">by {fb.user}</span>
            </div>
            <div className="text-gray-700 text-sm mb-2">{fb.comment}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-2 bg-gray-200 text-gray-800 hover:text-white rounded-full font-semibold shadow hover:bg-purple-800 transition-all"
          onClick={onSeeAll}
        >
          See All Feedbacks
        </button>
      </div>
    </div>
  );
};

export default RecentFeedbacks;
