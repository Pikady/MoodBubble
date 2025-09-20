export const noteTypeConfig = {
    goodnight: {
      title: "晚安纸条",
      prompt: "今天过得怎么样？让我更了解你一些吧~",
      color: "bg-violet-200",
      tilt: -2
    },
    gratitude: {
      title: "感恩纸条",
      prompt: "记录你今天觉得感恩的小事！",
      color: "bg-green-200",
      tilt: 2
    },
    emotion: {
      title: "情绪纸条",
      prompt: "分享一下你现在的心情吧！",
      color: "bg-blue-200",
      tilt: -3
    },
    reflection: {
      title: "思考纸条",
      prompt: "最近有什么值得思考的事情吗？",
      color: "bg-yellow-200",
      tilt: 2
    }
  } as const;
  