"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';



// 点击后，先进入loading页面，展示1秒钟chewing，然后开始轮询接口是否解析完成，完成后进入done，等待点击按钮，点击后进入grow，等待点击按钮
enum LOADING_PHASE {
  LOADING = "loading",
  DONE = "done",
  GROW = "grow",
};

export default function NoteLoading() {
  const router = useRouter();
  const imgBubbleChewing = "/images/mascot/bubble-chewing.svg";
  const imgBubbleChewDone = "/images/mascot/bubble-chewing-done.svg";
  const imgBubbleGrowHorn = "/images/mascot/bubble-grow-horn.svg";
  const imgNoteLabelBack = "/images/mascot/note-background-line.svg";
  const imgDecorationChewing = "/images/mascot/decoration-chewing.svg";
  const imgDecorationChewDone = "/images/mascot/decoration-chewing-done.svg"
  const imgLoadingDots = "/images/mascot/loading-dots.svg";

  const pagePublicClass = "relative flex flex-col justify-center mt-[30%]";
  const bubblePublicClass = "w-[75%] mx-auto";

  const [curLoadingPhase, setCurLoadingPhase] = useState(LOADING_PHASE.LOADING);

  const navigateToNotes = () => {
    router.push("/notes");
  };

  const loadingPage = (
    <div className={pagePublicClass}>
      <img className={bubblePublicClass} src={imgBubbleChewing} alt="" />
      <img className='absolute right-0 top-[-10%]' src={imgDecorationChewing} alt="" />
      <div className='flex justify-center mt-10'>
        <div className='relative font-normal text-[24px]'>
          <span className='relative z-[1400]'>品尝中</span>
          <img className='absolute top-0 z-[1399] h-[100%]' src={imgNoteLabelBack} alt="" />
        </div>
        <img className='ml-2' src={imgLoadingDots} alt="" />
      </div>
    </div>
  );

  const loadDonePage = (
    <div className={pagePublicClass}>
      <img className={bubblePublicClass} src={imgBubbleChewDone} alt="" />
      <img className='absolute right-[10%] top-[-15%]' src={imgDecorationChewDone} alt="" />
      <div className='flex justify-center mt-10'>
        <Button className='flex rounded-[30px] w-[80%] whitespace-normal h-[70px]' onClick={() => { setCurLoadingPhase(LOADING_PHASE.GROW) }}>
          <span className='text-[18px]/6 text-left mx-2'>太好啦！！真为你开心，这是你主动迈出的第一步！</span>
        </Button>
      </div>
    </div>
  );

  const growHornPage = (
    <div className={cn(pagePublicClass, "mt-[20%]")}>
      <img className={cn(bubblePublicClass, "w-[90%]")} src={imgBubbleGrowHorn} alt="" />
      <div className='flex justify-center mt-10'>
        <span className='inline-block text-[24px]'>泡泡长出了
          <div className='inline-block relative'>
            <span className='relative z-[1400]'>角！</span>
            <img className='absolute top-0 z-[1399] h-[100%]' src={imgNoteLabelBack} alt="" />
          </div>
        </span>
      </div>
      <div className='flex justify-center mt-10'>
        <Button className='flex rounded-[30px] w-[36%] whitespace-normal h-[70px]' onClick={() => { navigateToNotes() }}>
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

  useEffect(() => {
    setTimeout(() => {
      setCurLoadingPhase(LOADING_PHASE.DONE);
    }, 3000);

    return () => {
      console.log('组件卸载');
    };
  }, []); // 空依赖数组确保只在初次渲染后运行

  return (
    <AppShell>
      {pageMap[curLoadingPhase]}
    </AppShell>
  )
}