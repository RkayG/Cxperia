import {
  Clock,
  Users,
  Star,
  Play,
  Calendar,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductUsedCard from "./ProductsUsedCard";


const TutorialPreviewPage = ({ tutorial }: { tutorial?: any }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use tutorial from location.state if available (for preview mode)
  const previewTutorial = location.state?.tutorial;
  const data = tutorial || previewTutorial;
  const renderVideoEmbed = (url: string) => {
    if (!url) return null;

    // Extract YouTube video ID for embedding
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    if (youtubeMatch) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            title="Tutorial Video"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      );
    }

    // For other video URLs, show a placeholder
    return (
      <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="w-12 h-12 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Video: {url}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-6 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center text-purple-800 hover:text-purple-900"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Editor
            </button>
            <div className="flex items-center gap-3">
           
              <button className="p-2 text-gray-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:max-w-4xl mx-auto md:px-6 py-8">
        {/* Single Large Card: Hero, Title, Meta, Description, Steps */}
        <div className="md:bg-white md:rounded-2xl md:shadow-lg overflow-hidden">
          {/* Featured Image/Video */}
          {data.videoUrl ? (
            <div className="p-6 pb-0">{renderVideoEmbed(data.videoUrl)}</div>
          ) : data.featuredImage ? (
            <div className="h-64 md:h-96 relative overflow-hidden">
              <img
                src={data.featuredImage}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-96 flex items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold rounded-t-2xl">
              No featured image or video
            </div>
          )}

          {/* Title and Meta Info */}
          <div className="p-6 rounded-t-4xl md:-mt-8  md:bg-white  md:relative md:z-10" style={{ borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 uppercase font-medium">
                  {data.category}
                </span>
              </div>
              <h1
                className="text-3xl md:text-4xl text-left font-bold text-black leading-tight mb-3"
                style={{ fontFamily: "Mozilla Headline, sans-serif" }}
              >
                {data.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-black">
                      Brand
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>0 min ago</span>
                    <span>•</span>
                    <span>{data.totalDuration || ""}</span>
                    <span>•</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-black" />
                <span>{data.skinTypes?.join(", ")}</span>
              </div>
            </div>

            {/* Occasions */}
            {data.occasion?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-black" />
                  <span className="text-sm font-medium text-gray-700">
                    Perfect for:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.occasion.map((occasion: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-black text-sm rounded-full"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6 pb-2">
            <p
              className="text-gray-700 text-lg leading-relaxed text-left"
              style={{ fontFamily: "Tahoma" }}
            >
              {data.description}
            </p>
          </div>

          {/* Steps Section */}
          <div className="p-0">
            <h2
              className="text-2xl font-bold text-black mb-6 px-6 pt-6"
              style={{ fontFamily: "Mozilla Headline, sans-serif" }}
            >
              Tutorial Steps
            </h2>
            {(() => {
              const realSteps = Array.isArray(data.steps)
                ? data.steps.filter(
                    (step: any) =>
                      (step.title && step.title.trim()) ||
                      (step.description && step.description.trim()) ||
                      (Array.isArray(step.products) &&
                        step.products.length > 0) ||
                      (Array.isArray(step.tips) &&
                        step.tips.some((tip: string) => tip.trim()))
                  )
                : [];
              if (realSteps.length > 0) {
                return realSteps.map((step: any, index: number) => (
                  <div
                    key={step.id}
                    className={
                      index !== realSteps.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }
                  >
                    <div className="p-6">
                      {/* Step Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="text-xl font-semibold text-black"
                              style={{
                                fontFamily: "Mozilla Headline, sans-serif",
                              }}
                            >
                              {step.title}
                            </h3>
                            {step.duration && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {step.duration}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-gray-700 leading-relaxed text-left"
                            style={{ fontFamily: "Tahoma" }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Step Media */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {step.imageUrl && (
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={step.imageUrl}
                              alt={`Step ${step.stepNumber}`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        {step.videoUrl && (
                          <div className="rounded-lg overflow-hidden">
                            {renderVideoEmbed(step.videoUrl)}
                          </div>
                        )}
                      </div>

                      {/* Products Used */}
                      {Array.isArray(step.products) &&
                        step.products.length > 0 && (
                          <div className="mb-6">
                            <h4
                              className="text-lg font-semibold text-black mb-3"
                              style={{
                                fontFamily: "Mozilla Headline, sans-serif",
                              }}
                            >
                              Products Used
                            </h4>
                            <div className="grid grid-cols-2  gap-3">
                              {step.products.map((product: any) => (
                                <ProductUsedCard
                                  key={product.id}
                                  product={product}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Pro Tips */}
                      {Array.isArray(step.tips) &&
                        step.tips.some((tip: string) => tip.trim()) && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                              <Star className="w-5 h-5 mr-2" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {step.tips
                                .filter((tip: string) => tip.trim())
                                .map((tip: string, tipIndex: number) => (
                                  <li
                                    key={tipIndex}
                                    className="text-green-700 flex items-start"
                                  >
                                    <span className="text-green-500 mr-2 flex-shrink-0">
                                      •
                                    </span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                ));
              } else {
                return (
                  <div className="p-8 text-center text-gray-500">
                    No steps created yet. Add steps to help your customers
                    follow along.
                  </div>
                );
              }
            })()}
          </div>

        

          {/* Action Buttons */}
          {/* <div className="flex gap-4 mt-8 justify-center">
            <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
              <Heart className="w-5 h-5 mr-2" />
              Save Tutorial
            </button>
            <button className="flex items-center px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors">
              <Share2 className="w-5 h-5 mr-2" />
              Share Tutorial
            </button>
          </div> */}
        </div>

        {/* Mobile Bottom Bar */}
        {/*  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-xl">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div> */}
      </div>
      {/* Tutorial Summary */}
      {(() => {
        const realSteps = Array.isArray(data.steps)
          ? data.steps.filter(
              (step: any) =>
                (step.title && step.title.trim()) ||
                (step.description && step.description.trim()) ||
                (Array.isArray(step.products) && step.products.length > 0) ||
                (Array.isArray(step.tips) &&
                  step.tips.some((tip: string) => tip.trim()))
            )
          : [];
        const totalProducts = realSteps.reduce(
          (total: number, step: any) =>
            total + (Array.isArray(step.products) ? step.products.length : 0),
          0
        );
        return (
          <div className="bg-[#ede8f3] mx-4 text-black md:mb-4 max-w-4xl md:mx-auto rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">Tutorial Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{realSteps.length}</div>
                <div className="text-black text-sm">Total Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalProducts}</div>
                <div className="text-black text-sm">Products Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.totalDuration}</div>
                <div className="text-black text-sm">Duration</div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TutorialPreviewPage;
