import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, Ellipse, Circle } from 'react-native-svg';

export function CalmIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Defs>
        <LinearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#81C784" />
          <Stop offset="100%" stopColor="#4CAF50" />
        </LinearGradient>
        <LinearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#A5D6A7" />
          <Stop offset="100%" stopColor="#66BB6A" />
        </LinearGradient>
        <LinearGradient id="leafGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#C8E6C9" />
          <Stop offset="100%" stopColor="#81C784" />
        </LinearGradient>
      </Defs>
      {/* Sparkles */}
      <Circle cx="12" cy="20" r="2" fill="#A5D6A7" opacity={0.6} />
      <Circle cx="44" cy="16" r="1.5" fill="#C8E6C9" opacity={0.7} />
      <Path d="M42 38 L43 40 L45 41 L43 42 L42 44 L41 42 L39 41 L41 40Z" fill="#A5D6A7" opacity={0.5} />
      {/* Soil mound */}
      <Ellipse cx="28" cy="48" rx="12" ry="4" fill="#8D6E63" opacity={0.3} />
      {/* Stem */}
      <Path
        d="M26 48 L26 30 Q26 26 28 24 Q30 22 28 20"
        fill="none"
        stroke="url(#stemGrad)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <Path
        d="M28 28 C18 26 14 20 16 14 C18 10 24 12 28 18 C30 22 30 26 28 28Z"
        fill="url(#leafGrad)"
      />
      <Path
        d="M22 18 Q20 16 18 17"
        fill="none"
        stroke="#4CAF50"
        strokeWidth={0.5}
        opacity={0.4}
      />
      {/* Right leaf */}
      <Path
        d="M28 24 C38 20 42 14 40 10 C38 6 32 8 28 14 C26 18 26 22 28 24Z"
        fill="url(#leafGrad2)"
      />
      <Path
        d="M34 14 Q36 12 38 13"
        fill="none"
        stroke="#66BB6A"
        strokeWidth={0.5}
        opacity={0.4}
      />
      {/* Sprout tip */}
      <Ellipse cx="28" cy="19" rx="3" ry="4" fill="#81C784" />
      <Ellipse cx="27" cy="18" rx="1" ry="1.5" fill="white" opacity={0.4} />
    </Svg>
  );
}
