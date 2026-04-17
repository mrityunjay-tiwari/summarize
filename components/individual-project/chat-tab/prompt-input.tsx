"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import type {AttachmentData} from "@/components/ai-elements/attachments";
import type {PromptInputMessage} from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {GlobeIcon} from "lucide-react";
import {memo, useCallback, useState, useEffect} from "react";
import MicPromptInputBox from "./mic";
import {Separator} from "@/components/ui/separator";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {useChat} from "@ai-sdk/react";
import {useParams} from "next/navigation";
import {ThumbsUp, ThumbsDown, RotateCw, Copy} from "lucide-react";

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

interface AttachmentItemProps {
  attachment: AttachmentData;
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({attachment, onRemove}: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id],
  );
  return (
    <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments],
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

interface AIResponseWrapperProps {
  children: React.ReactNode;
  isStreaming?: boolean;
  handleRefresh: () => void;
}

const AIResponseWrapper = ({
  children,
  isStreaming = false,
  handleRefresh
}: AIResponseWrapperProps) => {
  const [copied, setCopied] = useState(false);
  const [messageTimestamp, setMessageTimestamp] = useState<Date | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Set timestamp when component first mounts (when message is created)
  useEffect(() => {
    if (!messageTimestamp) {
      setMessageTimestamp(new Date());
    }
  }, []);

  const handleCopy = () => {
    const text = typeof children === "string" ? children : "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    console.log("Thumbs up clicked");
  };

  const handleThumbsDown = () => {
    console.log("Thumbs down clicked");
  };

  // const handleRefresh = () => {
  //   console.log("Refresh clicked");
  // };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="bg-gray-200/30 rounded-tl-none border-t-2 dark:bg-zinc-800/50 rounded-lg p-4 flex flex-col gap-3 max-w-[85%]">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 text-sm text-slate-900 dark:text-slate-100">
            {children}
          </div>
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex gap-1 pt-2">
            <button
              onClick={handleThumbsUp}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Helpful"
            >
              <ThumbsUp
                size={12}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            <button
              onClick={handleThumbsDown}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Not helpful"
            >
              <ThumbsDown
                size={12}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            <button
              onClick={handleRefresh}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Regenerate"
              disabled={isStreaming}
            >
              <RotateCw
                size={12}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            <button
              onClick={handleCopy}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={copied ? "Copied!" : "Copy"}
            >
              <Copy size={12} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
            {messageTimestamp
              ? formatTime(messageTimestamp)
              : formatTime(new Date())}
          </span>
        </div>
      </div>
    </div>
  );
};

const PromptInputBox = () => {
  const [isFormattingInput, setIsFormattingInput] = useState(false);
  const params = useParams();
  const document_id = params?.id as string | undefined;

  const {messages, sendMessage, status, regenerate} = useChat({
    id: document_id,
  });

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (status !== "ready") return;

      console.log("Submitting message:", message);

      sendMessage(
        {text: message.text},
        {body: {document_id: document_id || ""}},
      );
    },
    [sendMessage, status, document_id],
  );
  console.log("MESSAGES:", messages);
  return (
    <div className="max-w-full mx-auto relative size-full h-[calc(100vh-4rem)] pt-12">
      <div className="flex flex-col h-full">
        <Conversation className="h-full thin-scrollbar">
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts ? (
                    message.role === "assistant" ? (
                      <AIResponseWrapper handleRefresh={regenerate} isStreaming={status === "streaming"}>
                        <MessageResponse key={message.id}>
                          {message.parts
                            .filter((part: any) => part.type === "text")
                            .map((part: any) => part.text)
                            .join("")}
                        </MessageResponse>
                      </AIResponseWrapper>
                    ) : (
                      <MessageResponse key={message.id}>
                        {message.parts
                          .filter((part: any) => part.type === "text")
                          .map((part: any) => part.text)
                          .join("")}
                      </MessageResponse>
                    )
                  ) : null}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInputProvider>
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputAttachmentsDisplay />
            <PromptInputBody>
              <PromptInputTextarea
                disabled={isFormattingInput}
                className={
                  isFormattingInput ? "opacity-30 pointer-events-none" : ""
                }
              />
            </PromptInputBody>
            {/* <Separator className="w-9/12"/> */}
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                    <PromptInputActionAddScreenshot />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton>
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
              </PromptInputTools>
              <div className="flex gap-2">
                <MicPromptInputBox
                  isFormattingInput={isFormattingInput}
                  setIsFormattingInput={setIsFormattingInput}
                />
                <PromptInputSubmit
                  status={status}
                  disabled={isFormattingInput}
                />
              </div>
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
};

export default PromptInputBox;
