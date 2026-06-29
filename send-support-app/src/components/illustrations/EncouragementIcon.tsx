import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, Circle } from 'react-native-svg';

export function EncouragementIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Defs>
        <LinearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFD54F" />
          <Stop offset="100%" stopColor="#FFB300" />
        </LinearGradient>
      </Defs>
      {/* Sparkles */}
      <Path d="M10 18 L11.5 21 L15 22 L11.5 23 L10 26 L8.5 23 L5 22 L8.5 21Z" fill="#FFD54F" opacity={0.7} />
      <Path d="M46 14 L47 16 L49 17 L47 18 L46 20 L45 18 L43 17 L45 16Z" fill="#FFD54F" opacity={0.6} />
      <Path d="M48 40 L49 42 L51 43 L49 44 L48 46 L47 44 L45 43 L47 42Z" fill="#FFE082" opacity={0.7} />
      <Circle cx="14" cy="42" r="2" fill="#FFD54F" opacity={0.5} />
      {/* Main star */}
      <Path
        d="M28 10 L32 22 L45 22 L35 30 L39 42 L28 34 L17 42 L21 30 L11 22 L24 22Z"
        fill="url(#starGrad)"
      />
      <Path
        d="M28 10 L32 22 L45 22 L35 30 L39 42 L28 34 L17 42 L21 30 L11 22 L24 22Z"
        fill="none"
        stroke="#FFB300"
        strokeWidth={0.5}
        opacity={0.3}
      />
      {/* Star highlight */}
      <Circle cx="24" cy="22" r="3" fill="white" opacity={0.35} />
    </Svg>
  );
}
