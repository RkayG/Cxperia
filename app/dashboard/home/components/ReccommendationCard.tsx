
import { FaPlus} from 'react-icons/fa';


// A card component for displaying recent recommendations
const RecommendationCard = ({ title, description, imageUrl, isCreateCard }: { title?: string, description?: string, imageUrl?: string, isCreateCard?: boolean }) => {
  return (
    <div className="w-[400px] p-2">
      <div className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-white h-full">
        {isCreateCard ? (
          <div className="flex flex-col items-center justify-center p-6 h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <FaPlus className="text-3xl text-gray-500" />
            <p className="mt-2 text-sm font-medium text-gray-600">New Product</p>
          </div>
        ) : (
          <>
            <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 truncate">{title}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;