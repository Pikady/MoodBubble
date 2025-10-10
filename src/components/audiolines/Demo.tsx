import React from 'react';

// 录音动效图标组件
const AudioLinesIcon = ({ 
  size = 24, // 图标整体大小
  color = '#165DFF', // 线条颜色
  speed = '1.2s' // 动画速度
}: { 
  size?: number; 
  color?: string; 
  speed?: string; 
}) => {
  // 定义5条线的动画延迟（制造错落感）
  const delays = ['0ms', '150ms', '300ms', '450ms', '600ms'];
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: size * 0.2, // 线条间距（随图标大小自适应）
        height: size, 
        width: size * 1.8 // 图标宽度（适配5条线）
      }}
    >
      {delays.map((delay, index) => (
        <div
          key={index}
          style={{
            // 线条基础样式
            width: size * 0.15, // 线条宽度
            backgroundColor: color,
            borderRadius: size * 0.075, // 线条圆角
            // 核心动画：高度随时间变化
            animation: `audioPulse ${speed} ease-in-out infinite`,
            animationDelay: delay,
            // 初始高度（最短状态）
            height: size * 0.2,
            // 动画填充模式：保持最后一帧状态
            animationFillMode: 'both'
          }}
        />
      ))}
      
      {/* 注入动画关键帧 */}
      <style>
        {`
          @keyframes audioPulse {
            0%, 100% { height: ${size * 0.2}px; } /* 最短 */
            50% { height: ${size * 0.9}px; } /* 最长（接近图标高度） */
          }
        `}
      </style>
    </div>
  );
};

// 使用示例
const Demo = () => {
  return (
    <div style={{ padding: '20px', background: '#f5f7fa' }}>
      <h3>录音中动效：</h3>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>正在录音</span>
        {/* 调用图标组件，可自定义参数 */}
        <AudioLinesIcon size={28} color="#FF4D4F" speed="1s" />
      </div>
    </div>
  );
};

export default Demo;