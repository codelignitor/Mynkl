import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, Circle, Ellipse } from 'react-native-svg';

export function CheerUpIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Defs>
        <LinearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFE082" />
          <Stop offset="50%" stopColor="#FFD54F" />
          <Stop offset="100%" stopColor="#FF9800" />
        </LinearGradient>
        <LinearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFD54F" />
          <Stop offset="100%" stopColor="#FFB300" />
        </LinearGradient>
      </Defs>
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 28 + Math.cos(rad) * 18;
        const y1 = 28 + Math.sin(rad) * 18;
        const x2 = 28 + Math.cos(rad) * 24;
        const y2 = 28 + Math.sin(rad) * 24;
        return (
          <Path
            key={angle}
            d={`M${x1} ${y1} L${x2} ${y2}`}
            stroke="url(#rayGrad)"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
      {/* Sun body */}
      <Circle cx="28" cy="28" r="14" fill="url(#sunGrad)" />
      <Ellipse cx="24" cy="24" rx="5" ry="4" fill="white" opacity={0.3} />
      {/* Face */}
      <Circle cx="23" cy="27" r="1.5" fill="#5D4037" />
      <Circle cx="33" cy="27" r="1.5" fill="#5D4037" />
      <Path
        d="M22 32 Q28 37 34 32"
        fill="none"
        stroke="#5D4037"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Cheek blush */}
      <Ellipse cx="20" cy="31" rx="2.5" ry="1.5" fill="#FF8A65" opacity={0.4} />
      <Ellipse cx="36" cy="31" rx="2.5" ry="1.5" fill="#FF8A65" opacity={0.4} />
    </Svg>
  );
}
