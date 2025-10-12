'use client';
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { MdOutlinePlaylistAdd, MdPending, MdQrCode } from "react-icons/md";
import {
  getVideoType,
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
} from "@/components/TutorialsAndRoutines/videoUtils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

// A card component for displaying product or tutorial projects
const ProjectCard = ({
  id,
  type,
  title,
  imageUrl,
  videoUrl,
  mediaUrl,
  qr_code_url,
  isCreateCard,
}: {
  id?: string | number;
  type: string;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaUrl?: string;
  qr_code_url?: string;
  isCreateCard?: boolean;
}) => {
  //console.log("ProjectCard props:", { id, type, title, imageUrl, videoUrl, mediaUrl, qr_code_url, isCreateCard });
  
  // Generate hrefs for Link components
  const getCreateHref = () => {
    if (type === "product experience") {
      return `/dashboard/experience/create?step=product-details&new=true`;
    } else if (type === "tutorial") {
      return "/dashboard/content/tutorial?mode=create";
    }
    return "#";
  };

  const getCardHref = () => {
    if (isCreateCard) {
      return getCreateHref();
    }
    
    // Navigate to edit pages based on type and id
    if (type === "tutorial" && id) {
      return `/dashboard/content/tutorial/${id}?mode=edit`;
    } else if (type === "product experience" && id) {
      return `/dashboard/experience/edit/${id}?step=product-details`;
    }
    return "#";
  };

  const getViewDetailsHref = () => {
    if (type === "tutorial" && id) {
      return `/tutorial/${id}`;
    } else if (id) {
      return `/experience/${id}?mode=edit&step=product-details`;
    }
    return "#";
  };

  // Reduced dimensions for compact sizing
  const CARD_WIDTH = 240;
  const IMAGE_HEIGHT = 150;
  const CARD_HEIGHT = 200;

  return (
    <div className="p-2" style={{ width: `${CARD_WIDTH}px` }}>
      <Link href={getCardHref()}>
        <Card className="flex flex-col overflow-hidden md:shadow-lg bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" style={{ height: `${CARD_HEIGHT}px` }}>
          {isCreateCard ? (
            <CardContent className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-4 bg-gray-100 rounded-full mb-3">
                {type === "product" || type === "product experience" ? (
                  <MdOutlinePlaylistAdd className="text-3xl text-gray-500" />
                ) : (
                  <FaPlus className="text-3xl text-gray-500" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 text-center px-4">
                Créer un nouveau {type.replace("experience", "").trim()}
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="relative" style={{ height: `${IMAGE_HEIGHT}px` }}>
                {/* If this is a tutorial prefer videoUrl/mediaUrl over imageUrl */}
                {(() => {
                  // Calculate src inside the IIFE
                  const src = type === "tutorial" ? videoUrl ?? mediaUrl ?? imageUrl : imageUrl;
                  if (!src) {
                    return (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Aucun média</span>
                      </div>
                    );
                  }
                  if (type === "tutorial" && src) {
                    const videoType = getVideoType(src);
                    
                    // Check if this is actually an image URL (not a video)
                    const isImageUrl = src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || src.includes('cloudinary.com');
                    
                    if (isImageUrl) {
                      return (
                        <Image
                          className="w-full h-full object-cover"
                          src={src}
                          alt={title || 'Image du tutoriel'}
                          width={280}
                          height={150}
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGM0YzRjMiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K";
                          }}
                        />
                      );
                    }
                    
                    if (videoType === "youtube") {
                      const embed = getYouTubeEmbedUrl(src);
                      return (
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    if (videoType === "vimeo") {
                      const embed = getVimeoEmbedUrl(src);
                      return (
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    if (videoType === "direct") {
                      return (
                        <video
                          className="w-full h-full object-cover bg-black"
                          src={src}
                          controls
                          muted
                          playsInline
                          preload="metadata"
                        />
                      );
                    }
                    // If it's not a video URL, treat it as an image
                    return (
                      <Image
                        className="w-full h-full object-cover"
                        src={src}
                        alt={title || 'Image du tutoriel'}
                        width={280}
                        height={150}
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGM0YzRjMiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K";
                        }}
                      />
                    );
                  }
                  return (
                    <Image
                      className="w-full h-full object-cover"
                      src={src || ''}
                      alt={title || 'Image du produit'}
                      width={280}
                      height={150}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGM0YzRjMiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K";
                      }}
                    />
                  );
                })()}
                {/* QR Code Status Badge */}
                <div className="absolute top-2 right-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${qr_code_url ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {qr_code_url ? (
                      <>
                        <MdQrCode className="mr-1" />
                        <span>Généré</span>
                      </>
                    ) : (
                      <>
                        <MdPending className="mr-1" />
                        <span>En attente</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Type Badge */}
               {/*  <div className="absolute top-2 left-2">
                  <div className="px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
                    {type === "tutorial" ? "Tutorial" : "Product"}
                  </div>
                </div> */}
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between p-4">
                <p className="text-sm font-medium text-gray-900 line-clamp-1 mb-2" title={title}>
                  {title && title.length > 24 ? `${title.slice(0, 24)}...` : title}
                </p>
              </CardContent>
              <CardFooter className="mt-auto pt-2 border-t border-gray-100 flex justify-between">
                <Link
                  href={getViewDetailsHref()}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                  }}
                >
                  Voir les détails →
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </Link>
    </div>
  );
};

export default ProjectCard;