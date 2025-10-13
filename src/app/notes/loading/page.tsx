"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { getAIRequestStatus, cleanupAIRequest } from '@/lib/aiService';

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
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [dotsIndex, setDotsIndex] = useState(0);

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

  // 从URL获取requestId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('requestId');
      if (id) {
        setRequestId(id);
      }
    }
  }, []);

  // 轮询检查AI状态
  useEffect(() => {
    if (!requestId) return;

    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const status = getAIRequestStatus(requestId);

        if (status) {
          if (status.status === 'completed' && status.response) {
            setAIResponse(status.response);

            // 切换到DONE状态
            if (!hasAutoSwitched) {
              const switchTimer = setTimeout(() => {
                switchPhase(LOADING_PHASE.DONE);
                setHasAutoSwitched(true);
                // 切换完成后清理数据和停止轮询
                setTimeout(() => {
                  cleanupAIRequest(requestId);
                  clearInterval(interval);
                  if (timeout) clearTimeout(timeout);
                }, 1000); // 延迟1秒清理，确保状态切换完成
              }, 500); // 短暂延迟确保用户体验
              return () => clearTimeout(switchTimer);
            }
          } else if (status.status === 'error') {
            console.error('AI调用失败:', status.error);

            // 使用默认回复
            if (!hasAutoSwitched) {
              const switchTimer = setTimeout(() => {
                switchPhase(LOADING_PHASE.DONE);
                setHasAutoSwitched(true);
                // 切换完成后清理数据和停止轮询
                setTimeout(() => {
                  cleanupAIRequest(requestId);
                  clearInterval(interval);
                  if (timeout) clearTimeout(timeout);
                }, 1000);
              }, 500);
              return () => clearTimeout(switchTimer);
            }
          }
        }
      } catch (error) {
        console.error('检查AI状态失败:', error);
      }
    };

    // 立即检查一次
    checkStatus();

    // 设置轮询
    interval = setInterval(checkStatus, 500);

    // 超时处理（最多等待30秒）
    timeout = setTimeout(() => {
      clearInterval(interval);
      if (!hasAutoSwitched) {
        switchPhase(LOADING_PHASE.DONE);
        setHasAutoSwitched(true);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [requestId, switchPhase, hasAutoSwitched]);

  // 动态点动画
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotsIndex((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // 初始加载与自动切换逻辑（仅在无requestId时使用）
  useEffect(() => {
    // 初始淡入效果
    const initialFadeIn = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 微小延迟确保动画触发

    // 自动切换逻辑（仅在无requestId时使用，保持原有行为）
    let autoSwitchToDone: NodeJS.Timeout;
    if (!requestId && !hasAutoSwitched && curLoadingPhase === LOADING_PHASE.LOADING) {
      autoSwitchToDone = setTimeout(() => {
        switchPhase(LOADING_PHASE.DONE);
        setHasAutoSwitched(true);
      }, 3000);
    }

    return () => {
      clearTimeout(initialFadeIn);
      if (autoSwitchToDone) clearTimeout(autoSwitchToDone);
    };
  }, [requestId]); // 只依赖requestId，避免重复执行

  // 页面样式 - 统一应用过渡效果
  const pagePublicClass = cn(
    "relative flex flex-col justify-center mt-[30%] transition-opacity duration-300 ease-linear",
    isVisible ? "opacity-100" : "opacity-0"
  );
  const bubblePublicClass = "w-[75%] mx-auto transition-all duration-300";

  // 动态加载点组件
  const LoadingDots = () => {
    const dots = ['.', '..', '...'];
    return (
      <span className='ml-2 text-[24px] font-normal inline-block' style={{ width: '1.5em' }}>
        {dots[dotsIndex]}
      </span>
    );
  };

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
        <LoadingDots />
      </div>
    </div>
  );

  const loadDonePage = (
    <div className={pagePublicClass}>
      <img className={bubblePublicClass} src={imgBubbleChewDone} alt="泡泡咀嚼完成" />
      <img className='absolute right-[10%] top-[-15%] transition-opacity duration-300' src={imgDecorationChewDone} alt="装饰元素" />
      <div className='flex justify-center mt-10'>
        <Button
          className='flex rounded-[30px] w-[80%] whitespace-normal min-h-[70px] py-4'
          onClick={() => switchPhase(LOADING_PHASE.GROW)}
        >
          <span className='text-[18px]/6 text-left mx-2 break-words overflow-wrap-normal'>
            {aiResponse || '太好啦！！真为你开心，这是你主动迈出的第一步！'}
          </span>
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