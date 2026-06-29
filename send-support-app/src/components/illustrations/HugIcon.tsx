import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, Ellipse } from 'react-native-svg';

export function HugIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Defs>
        <LinearGradient id="hugHeart" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#B8A9FF" />
          <Stop offset="100%" stopColor="#7B61FF" />
        </LinearGradient>
        <LinearGradient id="hugArm" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFD6A5" />
          <Stop offset="100%" stopColor="#FFB74D" />
        </LinearGradient>
      </Defs>
      {/* Left arm */}
      <Path
        d="M8 32 C4 28 6 22 12 20 C16 18 20 22 22 26 L18 34 C14 36 10 35 8 32Z"
        fill="url(#hugArm)"
      />
      <Ellipse cx="10" cy="22" rx="5" ry="4" fill="#FFCC80" />
      {/* Right arm */}
      <Path
        d="M48 32 C52 28 50 22 44 20 C40 18 36 22 34 26 L38 34 C42 36 46 35 48 32Z"
        fill="url(#hugArm)"
      />
      <Ellipse cx="46" cy="22" rx="5" ry="4" fill="#FFCC80" />
      {/* Heart */}
      <Path
        d="M28 16 C28 12 24 9 21 12 C18 9 14 12 14 16 C14 24 21 32 28 40 C35 32 42 24 42 16 C42 12 38 9 35 12 C32 9 28 12 28 16Z"
        fill="url(#hugHeart)"
      />
      <Ellipse cx="22" cy="16" rx="4" ry="3" fill="white" opacity={0.3} />
    </Svg>
  );
}
