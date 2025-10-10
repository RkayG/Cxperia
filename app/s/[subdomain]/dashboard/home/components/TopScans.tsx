import React from "react";

interface TopScansProps {
  scans: Array<{
    id: string;
    productName: string;
    imageUrl: string;
    scanCount: number;
    lastScan: string;
  }>;
}

const TopScans: React.FC<TopScansProps> = ({ scans }) => {
  return (
    <div className="mt-12 mb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Top Scanned Products (Last 7 Days)</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="min-w-[320px] max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={scan.imageUrl}
              alt={scan.productName}
              className="w-32 h-32 object-cover rounded-xl mb-4 shadow-md"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{scan.productName}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-700 font-bold text-2xl">{scan.scanCount}</span>
              <span className="text-gray-500 text-sm">scans</span>
            </div>
            <div className="text-xs text-gray-400">Last scan: {scan.lastScan}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopScans;
