import React from 'react';
import { cn } from '@/lib/utils';

// Local SVG assets
const imgBubbleMainFeature = "/images/mascot/bubble-main-feature.svg";
const imgBubbleThoughts = "/images/mascot/bubble-thoughts.svg";
const imgEnviornment = "/images/mascot/environment.svg";

interface CharacterBubbleProps {
  size?: number;
  mood?: 'idle' | 'typing' | 'thinking';
  className?: string;
  showThoughts?: boolean;
}

export default function CharacterBubble({
  size = 128,
  mood = 'idle',
  className,
  showThoughts = false
}: CharacterBubbleProps) {
  // Calculate responsive sizes based on the original design (408px main bubble)
  const scaleFactor = size / 408;
  const mainBubbleSize = size;
  const thoughtsSize = 175 * scaleFactor;
  const environmentHeight = 85 * scaleFactor;
  const environmentWidth = 325 * scaleFactor;

  // Position calculations for responsive layout
  const thoughtsLeft = 211 * scaleFactor;
  const thoughtsTop = -165 * scaleFactor; // Position above main bubble
  const environmentLeft = 1 * scaleFactor;
  const environmentBottom = 1 * scaleFactor; // Position below main bubble

  if (mood === 'idle') {
    return (
      <div className={cn("relative", className)} style={{ width: mainBubbleSize, height: mainBubbleSize }}>
        {/* Environment decoration (below main bubble) */}
        <div
          className="absolute"
          style={{
            width: environmentWidth,
            height: environmentHeight,
            left: environmentLeft,
            bottom: environmentBottom-10
          }}
        >
          <img
            alt=""
            className="block max-w-none size-full"
            src={imgEnviornment}
          />
        </div>

        {/* Main bubble */}
        <div className="absolute inset-0">
          <img
            alt=""
            className="block max-w-none size-full"
            src={imgBubbleMainFeature}
          />
        </div>

        {/* Thoughts bubble (above main bubble, only when showThoughts is true) */}
        {showThoughts && (
          <div
            className="absolute"
            style={{
              width: thoughtsSize,
              height: thoughtsSize,
              left: thoughtsLeft,
              top: thoughtsTop+63
            }}
          >
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgBubbleThoughts}
            />
          </div>
        )}
      </div>
    );
  }

  // Fallback to original implementation for typing and thinking moods
  const getMoodEmoji = () => {
    switch (mood) {
      case 'typing':
        return '✍️';
      case 'thinking':
        return '🤔';
      default:
        return '🫧';
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'typing':
        return 'from-blue-200 to-purple-200';
      case 'thinking':
        return 'from-amber-200 to-orange-200';
      default:
        return 'from-purple-200 to-pink-200';
    }
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
        getMoodColor(),
        className
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="select-none"
        style={{ fontSize: size * 0.375 }}
      >
        {getMoodEmoji()}
      </span>
    </div>
  );
}