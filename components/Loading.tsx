 
import Image from 'next/image';
import cxperiaLogo from '../assets/logo.png';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="text-center">
        <Image
          src={cxperiaLogo}
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
 