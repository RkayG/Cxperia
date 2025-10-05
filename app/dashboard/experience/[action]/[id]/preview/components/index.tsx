"use client";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import ScrollToTop from "@/components/ScrollToTop";
import BrandColorPicker from "./BrandColorPicker";
import DownloadOptions from "./DownloadOptions";
import MobilePreview from "./MobilePreview";
import QrCodeGenerator from "./QrCodeGenerator";

export default function PreviewPage() {
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string | undefined>(undefined);
  const downloadOptionsRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const experienceId = params?.id as string | undefined;
  const router = useRouter();
  console.log("[PreviewPage] experienceId (from params) =", experienceId);
  // Scroll to download options when QR is generated
  useEffect(() => {
    if (qrCodeImageUrl && downloadOptionsRef.current) {
      downloadOptionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [qrCodeImageUrl]);
  const [productName, setProductName] = useState<string | undefined>(undefined);
  // Responsive: detect if mobile/tablet (max-width: 1023px)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "brand">("preview");
  useEffect(() => {
    const checkScreen = () => setIsMobileOrTablet(window.innerWidth <= 1023);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Handler to allow BrandColorPicker to trigger tab switch
  const handleBrandColorApplied = () => {
    if (isMobileOrTablet) {
      setActiveTab("preview");
    }
  };

  const handleDownloadQrCode = (format: string) => {
    if (qrCodeImageUrl) {
      const link = document.createElement("a");
      link.href = qrCodeImageUrl;
      link.download = `qr-code.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="">
      <ScrollToTop />
      <button
        onClick={() => router.push("/create-experience/customize-features")}
        className="w-fit px-8 py-3  flex justify-left mb-3   text-gray-800 font-medium rounded-xl  transition-colors duration-200"
      >
        <ChevronLeft className="mr-2" size={20} />
        Back
      </button>
      <div className="min-h-screen bg-gray-50 border items-center justify-center rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3x text-center font-bold text-gray-900 mb-2">
            Preview Mode
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Preview and interact with your product experience like your customers will.
          </p>
        </div>

        {/* Main Content: Responsive Tabs for mobile/tablet, grid for desktop */}
        {!experienceId ? (
          <div className="text-center text-gray-500 py-12">
            Loading experience preview...
          </div>
        ) : isMobileOrTablet ? (
          <div className="mb-8 flex-1 flex flex-col">
            {/* Tab Switcher */}
            <div className="flex mb-4 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center font-medium text-base transition-colors ${activeTab === "preview"
                    ? "border-b-2 border-purple-700 text-purple-700 bg-white"
                    : "text-gray-500 bg-gray-100"
                  }`}
                onClick={() => setActiveTab("preview")}
              >
                Mobile Preview
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium text-base transition-colors ${activeTab === "brand"
                    ? "border-b-2 border-purple-700 text-purple-700 bg-white"
                    : "text-gray-500 bg-gray-100"
                  }`}
                onClick={() => setActiveTab("brand")}
              >
                Theme
              </button>
            </div>
            <div className="flex-1 min-h-[400px]">
              {activeTab === "preview" && (
                <div className="w-full flex flex-col items-center">
                  <MobilePreview experienceId={experienceId} />
                </div>
              )}
              {activeTab === "brand" && (
                <div className="w-full flex flex-col items-center">
                  <BrandColorPicker experienceId={experienceId} onApply={handleBrandColorApplied} />
                </div>
              )}
            </div>
            {/* QR Code Generator and Download Options always visible below */}
            <div className="w-full flex rounded-md flex-col lg:flex-row gap-8 pt-16">
              <div className="flex-1">
                <QrCodeGenerator
                  setQrCodeImageUrl={setQrCodeImageUrl}
                  setProductName={setProductName}
                />
              </div>
              {qrCodeImageUrl && (
                <div className="flex-1" ref={downloadOptionsRef}>
                  <DownloadOptions
                    onDownload={handleDownloadQrCode}
                    qrCodeImageUrl={qrCodeImageUrl}
                    productName={productName}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid mb-8 grid-cols-1 items-center lg:grid-cols-1 mb-8 flex-1">
              {/* Right Column (Mobile Preview + Brand Color Picker) */}
              <div className="lg:col-span-1 justify-center flex-col gap-6 mx-auto">
                <div className="flex justify-center flex-row gap-6 xl:gap-10 items-center">
                  <MobilePreview experienceId={experienceId} />
                  <div className="hidden md:block min-w-[450px]">
                    <BrandColorPicker experienceId={experienceId} />
                  </div>
                </div>
              </div>
            </div>
            {/* QR Code Generator and Download Options OUTSIDE the main box */}
            <div className="w-full flex flex-col lg:flex-row gap-8 mb-12">
              <div className="flex-1">
                <QrCodeGenerator
                  experienceId={experienceId}
                  setQrCodeImageUrl={setQrCodeImageUrl}
                  setProductName={setProductName}
                />
              </div>
              {qrCodeImageUrl && (
                <div className="flex-1" ref={downloadOptionsRef}>
                  <DownloadOptions
                    onDownload={handleDownloadQrCode}
                    qrCodeImageUrl={qrCodeImageUrl}
                    productName={productName}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        {/*   <div className="flex mb-32 mt-12 justify-between  pt-6 border-t border-gray-200">
          <button
            onClick={() => router.push("/product-dashboard?ref=experience-complete")}
            className="w-fit px-8 py-3.5 bg-purple-700 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-md"
          >
            Finish
          </button>
        </div> */}
      </div>
    </div>
  );
};
