
import React from 'react';

interface PMSLogoProps {
  className?: string;
  size?: number;
}

const PMSLogo: React.FC<PMSLogoProps> = ({ className = "", size = 120 }) => {
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
        {/* Outer Orange Ring */}
        <circle cx="50" cy="50" r="48" fill="#ea580c" />
        
        {/* White Inner Circle Background */}
        <circle cx="50" cy="50" r="36" fill="white" />
        
        {/* Typography for Outer Ring */}
        <defs>
          <path id="outerTopPath" d="M 18,50 A 32,32 0 1,1 82,50" />
          <path id="outerBottomPath" d="M 18,50 A 32,32 0 1,0 82,50" />
        </defs>
        
        <text className="fill-white font-black" style={{ fontSize: '7.5px' }}>
          <textPath href="#outerTopPath" startOffset="50%" textAnchor="middle">PESHAWAR MODEL</textPath>
        </text>
        
        <text className="fill-white font-black" style={{ fontSize: '7.5px' }}>
          <textPath href="#outerBottomPath" startOffset="50%" textAnchor="middle" side="right">EDUCATIONAL NETWORK</textPath>
        </text>

        {/* Inner Elements */}
        <g transform="translate(50, 44) scale(0.7)">
          {/* Top Circle Element inside Crest area */}
          <circle cx="0" cy="-28" r="10" stroke="#ea580c" strokeWidth="2.5" fill="white" />
          <circle cx="0" cy="-28" r="6" fill="#ea580c" />

          {/* Shield / Crest */}
          <path
            d="M -25,-15 C -25,15 0,25 0,25 C 0,25 25,15 25,-15 L 25,-18 L -25,-18 Z"
            stroke="#ea580c" strokeWidth="2" fill="white"
          />
          
          {/* Accent stripes on sides of shield */}
          <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round">
            <line x1="-30" y1="-10" x2="-25" y2="-8" />
            <line x1="-30" y1="0" x2="-25" y2="2" />
            <line x1="-30" y1="10" x2="-25" y2="12" />
            <line x1="30" y1="-10" x2="25" y2="-8" />
            <line x1="30" y1="0" x2="25" y2="2" />
            <line x1="30" y1="10" x2="25" y2="12" />
          </g>

          {/* Open Book */}
          <path
            d="M -15,-5 L 0,0 L 15,-5 L 15,10 L 0,15 L -15,10 Z"
            fill="white" stroke="#ea580c" strokeWidth="1.5"
          />
          <line x1="0" y1="0" x2="0" y2="15" stroke="#ea580c" strokeWidth="1" />
          {/* Book dots */}
          <g fill="#ea580c">
            <rect x="-12" y="1" width="2" height="1" />
            <rect x="-8" y="2" width="2" height="1" />
            <rect x="-4" y="3" width="2" height="1" />
            <rect x="4" y="3" width="2" height="1" />
            <rect x="8" y="2" width="2" height="1" />
            <rect x="12" y="1" width="2" height="1" />
          </g>

          {/* Pakistan Ribbon */}
          <path
            d="M -20,22 Q 0,18 20,22 L 18,32 Q 0,28 -18,32 Z"
            fill="white" stroke="#ea580c" strokeWidth="1.5"
          />
          <text
            x="0"
            y="28"
            textAnchor="middle"
            className="fill-orange-600 font-black"
            style={{ fontSize: '6px' }}
          >
            PAKISTAN
          </text>

          {/* SINCE 1979 */}
          <text
            x="0"
            y="42"
            textAnchor="middle"
            className="fill-orange-600 font-black"
            style={{ fontSize: '8px' }}
          >
            SINCE 1979
          </text>
        </g>
      </svg>
      <div className="mt-3 text-center px-4">
        <div className="text-[0.6rem] font-black text-slate-800 uppercase tracking-widest leading-tight">
          Peshawar Model School
        </div>
        <div className="text-[0.5rem] font-bold text-orange-600 uppercase tracking-tight mt-0.5">
          Safya Homes Branch (Boys & Girls)
        </div>
      </div>
    </div>
  );
};

export default PMSLogo;
