 
import Image from 'next/image';
import cxperiaLogo from '../assets/logo.png';

export default function Loading() {
  return (
    <div className="flex items-center -mt-28 justify-center min-h-screen">
      <div className="text-center">
        <Image
          src={cxperiaLogo}
          alt="Cxperia Logo"
          className="mx-auto animate-pulse-logo"
          width={140}
          height={140}
          style={{ width: '140px', height: 'auto' }}
          priority
        />
      </div>
    </div>
  );
}
 