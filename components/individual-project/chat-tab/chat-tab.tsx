import PromptInputBox from "./prompt-input";

export function ChatTab() {
  return (
    <div className="flex flex-col h-full justify-end">
      <div className="w-full">
        <PromptInputBox />
      </div>
    </div>
  );
}
