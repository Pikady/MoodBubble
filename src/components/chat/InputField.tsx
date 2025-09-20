// components/InputField.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputFieldProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  isRecording: boolean;
  startVoice: () => void;
  stopVoice: () => void;
  canSend: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  input,
  setInput,
  handleSend,
  isRecording,
  startVoice,
  stopVoice,
  canSend,
}) => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div
        className="fixed bottom-0 left-0 right-0 mobile:absolute mobile:inset-x-0 mobile:bottom-0 px-3 pb-3 pt-2 z-50"
        style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            backdropFilter: "saturate(180%) blur(14px)",
            WebkitBackdropFilter: "saturate(180%) blur(14px)",
            background: "rgba(250,250,252,0.75)",
            borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
    >
      <div className="mx-auto flex w-full max-w-[680px] items-center gap-3">
        {/* 语音按钮 */}
        <Button
          type="button"
          size="icon"
          aria-label={isRecording ? "停止语音" : "按住说话"}
          className={[
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
            isRecording
              ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-200"
              : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-gray-200 hover:shadow-lg",
          ].join(" ")}
          onMouseDown={startVoice}
          onMouseUp={stopVoice}
          onMouseLeave={() => isRecording && stopVoice()}
          onTouchStart={(e) => {
            e.preventDefault();
            startVoice();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopVoice();
          }}
        >
          <motion.div
            animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
          </motion.div>
        </Button>

        {/* 文本输入框 */}
        <motion.div
          className="flex-1 rounded-3xl bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border border-gray-200/50 shadow-lg overflow-hidden"
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          animate={{ scale: inputFocused ? 1.02 : 1 }}
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "正在聆听…" : "说说你的想法…"}
            className="block w-full resize-none bg-transparent text-[16px] leading-6 px-4 py-3 outline-none placeholder:text-gray-400"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "0px";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";  // 设定最大高度
            }}
          />
        </motion.div>

        {/* 发送按钮 */}
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!canSend}
          className={[
            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
            canSend
              ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-blue-200 hover:shadow-xl"
              : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400",
          ].join(" ")}
          aria-label="发送"
        >
          <motion.div
            animate={canSend ? { x: [0, 2, 0] } : {}}
            transition={{ duration: 0.3, repeat: canSend ? Infinity : 0 }}
          >
            <Send className="h-5 w-5" />
          </motion.div>
        </Button>
      </div>
    </div>
  );
};

export default InputField;
