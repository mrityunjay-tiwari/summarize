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
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {AIResponseWrapper} from "./chat-reactions";
import {Spinner} from "@/components/ui/spinner";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

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

const PromptInputBox = ({file_url}: {file_url: string}) => {
  const [isFormattingInput, setIsFormattingInput] = useState(false);
  const params = useParams();
  const document_id = params?.id as string | undefined;

  const {messages, sendMessage, status, regenerate} = useChat({
    id: document_id,
  });

  const isStreaming = status === "streaming";

  const handleRefresh = useCallback(() => {
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();

    if (!lastUserMessage) {
      console.warn("No previous user message");
      return;
    }

    if (!document_id) {
      console.warn("Missing document_id");
      return;
    }

    const text = lastUserMessage.parts
      ?.filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join(" ");

    sendMessage(
      {text},
      {
        body: {document_id},
      },
    );
  }, [messages, document_id, sendMessage]);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (status === "submitted" || status === "streaming") return;

      if (!document_id) {
        console.warn("Document ID is missing; cannot send chat request.");
        return;
      }

      console.log("Submitting message:", message);

      sendMessage({text: message.text}, {body: {document_id, file_url}});
    },
    [sendMessage, status, document_id],
  );
  console.log("MESSAGES:", messages);
  return (
    <div className="max-w-full mx-auto relative size-full h-[calc(100vh-4rem)] pt-12">
      <div className="flex flex-col h-full">
        <Conversation className="h-full thin-scrollbar">
          <ConversationContent>
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const reasoningParts =
                message.parts?.filter((p: any) => p.type === "reasoning") || [];
              const hasReasoning = reasoningParts.length > 0;
              const reasoningText = reasoningParts
                .map((p: any) => p.text)
                .join("\n\n");
              const lastPart = message.parts?.at(-1);
              const isReasoningStreaming =
                isLastMessage &&
                status === "streaming" &&
                lastPart?.type === "reasoning";

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts ? (
                      message.role === "assistant" ? (
                        <AIResponseWrapper
                          copyResponse={() => {
                            navigator.clipboard.writeText(
                              message.parts
                                ?.filter((part: any) => part.type === "text")
                                .map((part: any) => part.text)
                                .join("") || "",
                            );
                          }}
                          handleRefresh={handleRefresh}
                          isStreaming={status === "streaming" && isLastMessage}
                        >
                          {hasReasoning && (
                            <Reasoning
                              className="w-full"
                              isStreaming={isReasoningStreaming}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>
                                {reasoningText}
                              </ReasoningContent>
                            </Reasoning>
                          )}
                          <MessageResponse key={message.id}>
                            {message.parts
                              .filter((part: any) => part.type === "text")
                              .map((part: any) => part.text)
                              .join("")}
                          </MessageResponse>
                          <Sources className="mt-5">
                            <SourcesTrigger
                              count={
                                message.parts.filter(
                                  (part) => part.type === "source-document",
                                ).length
                              }
                            />
                            {message.parts.map((part, i) => {
                              switch (part.type) {
                                case "source-url":
                                  return (
                                    <SourcesContent key={`${message.id}-${i}`}>
                                      <Source
                                        key={`${message.id}-${i}`}
                                        href={part.url}
                                        title={part.url}
                                      />
                                    </SourcesContent>
                                  );
                              }
                            })}
                          </Sources>
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
              );
            })}
            {status === "submitted" && (
              <div className="text-left flex items-center gap-2">
                <Spinner />{" "}
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  Thinking...
                </p>
              </div>
            )}
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
                <PromptInputButton onClick={() => {console.log("Do web search baby !")}}>
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
