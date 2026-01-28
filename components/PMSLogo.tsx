
import React from 'react';

interface PMSLogoProps {
  className?: string;
  size?: number;
}

const PMSLogo: React.FC<PMSLogoProps> = ({ className = "", size = 80 }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" className="text-white opacity-40" />
        <circle cx="50" cy="50" r="42" fill="white" />
        
        {/* Emblem Background */}
        <path
          d="M50 15L80 30V55C80 75 50 85 50 85C50 85 20 75 20 55V30L50 15Z"
          className="fill-orange-600"
        />
        
        {/* PMS Initials */}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          className="fill-white font-black"
          style={{ fontSize: '22px', fontFamily: 'Inter, sans-serif' }}
        >
          PMS
        </text>
        
        {/* Branch Name Decorator */}
        <path
          id="curve"
          d="M 20,50 A 30,30 0 1,1 80,50"
          fill="transparent"
        />
        <text className="fill-orange-600 font-bold" style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            Safya Home Branch
          </textPath>
        </text>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-[0.6rem] font-black text-white uppercase tracking-[0.2em] leading-tight">
          Peshawar Model School
        </div>
        <div className="text-[0.5rem] font-bold text-orange-100 uppercase tracking-widest">
          Safya Home
        </div>
      </div>
    </div>
  );
};

export default PMSLogo;
