 
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="text-center">
        <Image
          src="/cxperia.png"
          alt="Cxperia Logo"
          className="mx-auto animate-pulse-logo"
          width={120}
          height={120}
          style={{ width: '120px', height: 'auto' }}
          priority
        />
      </div>
    </div>
  );
}
 