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
import {memo, useCallback, useState} from "react";
import MicPromptInputBox from "./mic";
import {Separator} from "@/components/ui/separator";

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

const PromptInputBox = () => {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [isFormattingInput, setIsFormattingInput] = useState(false);

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");
    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  }, []);

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputAttachmentsDisplay />
          <PromptInputBody>
            <PromptInputTextarea 
              disabled={isFormattingInput} 
              className={isFormattingInput ? "opacity-30 pointer-events-none" : ""} 
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
              <MicPromptInputBox isFormattingInput={isFormattingInput} setIsFormattingInput={setIsFormattingInput} />
              <PromptInputSubmit status={status} disabled={isFormattingInput} />
            </div>
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
};

export default PromptInputBox;
