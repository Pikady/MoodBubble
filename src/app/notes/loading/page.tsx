"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

// 页面阶段枚举
enum LOADING_PHASE {
  LOADING = "loading",
  DONE = "done",
  GROW = "grow",
};

export default function NoteLoading() {
  const router = useRouter();
  
  // 图片资源
  const imgBubbleChewing = "/images/mascot/bubble-chewing.svg";
  const imgBubbleChewDone = "/images/mascot/bubble-chewing-done.svg";
  const imgBubbleGrowHorn = "/images/mascot/bubble-grow-horn.svg";
  const imgNoteLabelBack = "/images/mascot/note-background-line.svg";
  const imgDecorationChewing = "/images/mascot/decoration-chewing.svg";
  const imgDecorationChewDone = "/images/mascot/decoration-chewing-done.svg";
  const imgLoadingDots = "/images/mascot/loading-dots.svg";

  // 状态管理
  const [curLoadingPhase, setCurLoadingPhase] = useState<LOADING_PHASE>(LOADING_PHASE.LOADING);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitionLocked, setIsTransitionLocked] = useState(false);
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);

  // 页面切换核心方法 - 确保前一个组件完全淡出后再淡入下一个
  const switchPhase = useCallback((targetPhase: LOADING_PHASE) => {
    if (isTransitionLocked) return;

    setIsTransitionLocked(true);
    setIsVisible(false); // 先隐藏（淡出）

    // 淡出动画完成后切换内容
    const fadeOutTimer = setTimeout(() => {
      setCurLoadingPhase(targetPhase);
      
      // 等待DOM完全更新后再显示（淡入）
      // 将延迟时间从50ms增加到与淡出时间相同，确保前一个组件完全消失
      setTimeout(() => {
        setIsVisible(true);
        
        // 淡入动画完成后解锁
        const fadeInTimer = setTimeout(() => {
          setIsTransitionLocked(false);
        }, 300); // 与淡入动画时长一致
        
        return () => clearTimeout(fadeInTimer);
      }, 300); // 延长延迟，确保前一个组件完全淡出
      
    }, 300); // 淡出动画时长

    return () => clearTimeout(fadeOutTimer);
  }, [isTransitionLocked]);

  // 初始加载与自动切换逻辑
  useEffect(() => {
    // 初始淡入效果
    const initialFadeIn = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 微小延迟确保动画触发

    // 自动切换逻辑
    let autoSwitchToDone: NodeJS.Timeout;
    if (!hasAutoSwitched && curLoadingPhase === LOADING_PHASE.LOADING) {
      autoSwitchToDone = setTimeout(() => {
        switchPhase(LOADING_PHASE.DONE);
        setHasAutoSwitched(true);
      }, 3000);
    }

    return () => {
      clearTimeout(initialFadeIn);
      if (autoSwitchToDone) clearTimeout(autoSwitchToDone);
    };
  }, [switchPhase, curLoadingPhase, hasAutoSwitched]);

  // 页面样式 - 统一应用过渡效果
  const pagePublicClass = cn(
    "relative flex flex-col justify-center mt-[30%] transition-opacity duration-300 ease-linear",
    isVisible ? "opacity-100" : "opacity-0"
  );
  const bubblePublicClass = "w-[75%] mx-auto transition-all duration-300";

  // 页面内容定义
  const loadingPage = (
    <div className={pagePublicClass}>
      <img className={bubblePublicClass} src={imgBubbleChewing} alt="泡泡咀嚼中" />
      <img className='absolute right-0 top-[-10%] transition-opacity duration-300' src={imgDecorationChewing} alt="装饰元素" />
      <div className='flex justify-center mt-10'>
        <div className='relative font-normal text-[24px]'>
          <span className='relative z-[1400]'>品尝中</span>
          <img className='absolute top-0 z-[1399] h-[100%]' src={imgNoteLabelBack} alt="文字背景" />
        </div>
        <img className='ml-2' src={imgLoadingDots} alt="加载中动画" />
      </div>
    </div>
  );

  const loadDonePage = (
    <div className={pagePublicClass}>
      <img className={bubblePublicClass} src={imgBubbleChewDone} alt="泡泡咀嚼完成" />
      <img className='absolute right-[10%] top-[-15%] transition-opacity duration-300' src={imgDecorationChewDone} alt="装饰元素" />
      <div className='flex justify-center mt-10'>
        <Button
          className='flex rounded-[30px] w-[80%] whitespace-normal h-[70px]'
          onClick={() => switchPhase(LOADING_PHASE.GROW)}
        >
          <span className='text-[18px]/6 text-left mx-2'>太好啦！！真为你开心，这是你主动迈出的第一步！</span>
        </Button>
      </div>
    </div>
  );

  const growHornPage = (
    <div className={cn(pagePublicClass, "mt-[20%]")}>
      <img className={cn(bubblePublicClass, "w-[90%]")} src={imgBubbleGrowHorn} alt="泡泡长角" />
      <div className='flex justify-center mt-10'>
        <span className='inline-block text-[24px]'>泡泡长出了
          <div className='inline-block relative'>
            <span className='relative z-[1400]'>角！</span>
            <img className='absolute top-0 z-[1399] h-[100%]' src={imgNoteLabelBack} alt="文字背景" />
          </div>
        </span>
      </div>
      <div className='flex justify-center mt-10'>
        <Button
          className='flex rounded-[30px] w-[36%] whitespace-normal h-[70px]'
          onClick={() => router.push("/notes")}
        >
          <span className='flex items-center text-[18px]/6 text-left'>
            <Heart className='mr-2' style={{ width: "24px", height: "24px" }} />赞赞！
          </span>
        </Button>
      </div>
    </div>
  );

  const pageMap = {
    [LOADING_PHASE.LOADING]: loadingPage,
    [LOADING_PHASE.DONE]: loadDonePage,
    [LOADING_PHASE.GROW]: growHornPage,
  };

  return (
    <AppShell>
      {pageMap[curLoadingPhase]}
    </AppShell>
  );
}