import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

export function HeroIllustration() {
  return (
    <View style={styles.container}>
      <Svg width={220} height={200} viewBox="0 0 220 200">
        <Defs>
          <LinearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#B8A9FF" />
            <Stop offset="50%" stopColor="#8E7CF7" />
            <Stop offset="100%" stopColor="#6B52E8" />
          </LinearGradient>
          <LinearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F48FB1" />
            <Stop offset="100%" stopColor="#E91E8C" />
          </LinearGradient>
          <LinearGradient id="heartGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#CE93D8" />
            <Stop offset="100%" stopColor="#AB47BC" />
          </LinearGradient>
          <LinearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#8E7CF7" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#8E7CF7" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Soft glow underneath */}
        <Ellipse cx="110" cy="175" rx="70" ry="12" fill="url(#glowGrad)" />

        {/* Floating small hearts */}
        <G opacity={0.9}>
          <Path
            d="M35 55 C35 45 45 40 50 48 C55 40 65 45 65 55 C65 68 50 78 50 78 C50 78 35 68 35 55Z"
            fill="url(#heartGrad)"
            transform="rotate(-15 50 58)"
          />
          <Path
            d="M175 40 C175 32 182 28 186 34 C190 28 197 32 197 40 C197 50 186 58 186 58 C186 58 175 50 175 40Z"
            fill="url(#heartGrad2)"
            transform="rotate(20 186 44)"
          />
          <Path
            d="M185 120 C185 113 191 109 195 114 C199 109 205 113 205 120 C205 128 195 135 195 135 C195 135 185 128 185 120Z"
            fill="#F48FB1"
            transform="rotate(-10 195 122)"
          />
          <Path
            d="M25 130 C25 123 31 119 35 124 C39 119 45 123 45 130 C45 138 35 145 35 145 C35 145 25 138 25 130Z"
            fill="#CE93D8"
            transform="rotate(25 35 132)"
          />
        </G>

        {/* Sparkles */}
        <G fill="#FFD54F">
          <Path d="M60 35 L62 40 L67 42 L62 44 L60 49 L58 44 L53 42 L58 40Z" />
          <Path d="M155 75 L157 79 L161 80 L157 82 L155 86 L153 82 L149 80 L153 79Z" />
          <Path d="M40 95 L41.5 98 L45 99 L41.5 100 L40 103 L38.5 100 L35 99 L38.5 98Z" />
          <Path d="M170 155 L171.5 158 L175 159 L171.5 160 L170 163 L168.5 160 L165 159 L168.5 158Z" />
        </G>
        <G fill="#B8A9FF">
          <Path d="M195 90 L196.5 93 L200 94 L196.5 95 L195 98 L193.5 95 L190 94 L193.5 93Z" />
          <Path d="M15 70 L16.5 73 L20 74 L16.5 75 L15 78 L13.5 75 L10 74 L13.5 73Z" />
        </G>

        {/* Main speech bubble */}
        <Path
          d="M55 50
             C55 30 75 18 110 18
             C145 18 165 30 165 50
             C165 70 145 82 125 82
             L110 100
             L95 82
             C75 82 55 70 55 50Z"
          fill="url(#bubbleGrad)"
        />
        {/* Bubble highlight */}
        <Ellipse cx="85" cy="42" rx="22" ry="14" fill="white" opacity={0.25} />
        <Ellipse cx="78" cy="38" rx="10" ry="6" fill="white" opacity={0.35} />

        {/* Heart cutout in bubble (white heart shape) */}
        <Path
          d="M110 38
             C110 32 104 28 100 32
             C96 28 90 32 90 38
             C90 48 100 58 110 68
             C120 58 130 48 130 38
             C130 32 124 28 120 32
             C116 28 110 32 110 38Z"
          fill="white"
        />
        <Path
          d="M110 38
             C110 32 104 28 100 32
             C96 28 90 32 90 38
             C90 48 100 58 110 68
             C120 58 130 48 130 38
             C130 32 124 28 120 32
             C116 28 110 32 110 38Z"
          fill="none"
          stroke="rgba(142,124,247,0.2)"
          strokeWidth={1}
        />

        {/* Small sparkle on bubble */}
        <Circle cx="145" cy="38" r="3" fill="white" opacity={0.6} />
        <Circle cx="148" cy="42" r="1.5" fill="white" opacity={0.4} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});
