import React from 'react';
import { cn } from '@/lib/utils';

// Local SVG assets
const imgBubbleMainFeature = "/images/mascot/bubble-main-feature.svg";
const imgBubbleWatching = "/images/mascot/bubble-watching.svg";
const imgBubbleThoughts = "/images/mascot/bubble-thoughts.svg";
const imgEnviornment = "/images/mascot/environment.svg";

interface CharacterBubbleProps {
  size?: number;
  mood?: 'idle' | 'typing' | 'thinking' | 'watching';
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
        {/* 环境装饰（支持等比例缩放和移动，和主气泡一致） */}
        <div
          className="absolute"
          style={{
            width: environmentWidth,
            height: environmentHeight,
            left: environmentLeft - 30,
            bottom: environmentBottom - 160,
            transform: `scale(${scaleFactor + 1}) translate(${-0}px, ${0}px)`, // 缩放和偏移与主气泡保持一致
            transformOrigin: "top left"
          }}
        >
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={imgEnviornment}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Main bubble */}
        {/* 主气泡支持等比例缩放和移动 */}
        <div
          className="absolute"
          style={{
            width: mainBubbleSize+400,
            height: mainBubbleSize+400,
            left: 0,
            top: 40,
            transform: `scale(${scaleFactor}) translate(${-44}px, ${0}px)`, // 可根据需要调整translate偏移
            transformOrigin: "top left"
          }}
        >
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={imgBubbleMainFeature}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Thoughts bubble (above main bubble, only when showThoughts is true) */}
        {/* 思维泡泡（支持等比例缩放和移动） */}
        {showThoughts && (
          <div
            className="absolute"
            style={{
              width: thoughtsSize,
              height: thoughtsSize,
              left: thoughtsLeft+10,
              top: thoughtsTop + 80,
              transform: `scale(${scaleFactor+1})`, // 让思维泡泡也能等比例缩放
              transformOrigin: "top left" // 缩放基准点为左上角，和主气泡一致
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

  if (mood === 'watching') {
    // Watching mood specific sizing and positioning
    const watchingScaleFactor = size / 408;
    const watchingBubbleSize = size;
    const watchingThoughtsSize = 175 * watchingScaleFactor;
    const watchingEnvironmentHeight = 85 * watchingScaleFactor;
    const watchingEnvironmentWidth = 325 * watchingScaleFactor;

    // Watching mood specific positions
    const watchingThoughtsLeft = 211 * watchingScaleFactor;
    const watchingThoughtsTop = -165 * watchingScaleFactor;
    const watchingEnvironmentLeft = 1 * watchingScaleFactor;
    const watchingEnvironmentBottom = 1 * watchingScaleFactor;

    return (
      <div className={cn("relative", className)} style={{ width: watchingBubbleSize, height: watchingBubbleSize }}>
        {/* Environment decoration for watching mood */}
        <div
          className="absolute"
          style={{
            width: watchingEnvironmentWidth,
            height: watchingEnvironmentHeight,
            left: watchingEnvironmentLeft - 30,
            bottom: watchingEnvironmentBottom - 160,
            transform: `scale(${watchingScaleFactor + 1}) translate(${-0}px, ${0}px)`,
            transformOrigin: "top left"
          }}
        >
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={imgEnviornment}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Main watching bubble */}
        <div
          className="absolute"
          style={{
            width: watchingBubbleSize+400,
            height: watchingBubbleSize+400,
            left: 0,
            top: 40,
            transform: `scale(${watchingScaleFactor}) translate(${-44}px, ${0}px)`,
            transformOrigin: "top left"
          }}
        >
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={imgBubbleWatching}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Thoughts bubble for watching mood */}
        {showThoughts && (
          <div
            className="absolute"
            style={{
              width: watchingThoughtsSize,
              height: watchingThoughtsSize,
              left: watchingThoughtsLeft+10,
              top: watchingThoughtsTop + 80,
              transform: `scale(${watchingScaleFactor+1})`,
              transformOrigin: "top left"
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