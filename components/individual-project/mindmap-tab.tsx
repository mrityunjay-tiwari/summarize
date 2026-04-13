import {SortableExample} from "../examples/sortable";
import {FcMindMap} from "react-icons/fc";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Separator } from "../ui/separator";

export function MindMapTab() {
  return (
    <div className="min-w-full">
      <div className="max-w-full flex justify-between items-center px-6 mt-1 bg-blue-300/10 rounded-lg p-4 mx-5">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/10 p-2 rounded-lg shadow-md">
            <FcMindMap className="size-4 text-blue-500" />
          </div>
          <span className="text-sm font-medium">Map Your Knowledge.</span>
        </div>
        <div>
          <Button
            size={"xs"}
            variant={"outline"}
            className="rounded-full shadow-md"
          >
            <PlusIcon /> Draw Another
          </Button>
        </div>
      </div>
      <Separator className="mt-4 mx-6 opacity-40" />
      <SortableExample />
    </div>
  );
}
