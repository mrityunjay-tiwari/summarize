import {SortableExample} from "../../examples/sortable";
import {TbCardsFilled} from "react-icons/tb";
import {Button} from "../../ui/button";
import {PlusIcon} from "lucide-react";
import {Separator} from "../../ui/separator";

export function FlashCardsTab() {
  return (
    <div className="min-w-full">
      <div className="max-w-full flex justify-between items-center px-6 mt-1 bg-blue-300/10 rounded-lg p-4 mx-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/10 p-2 rounded-lg shadow-md">
            <TbCardsFilled className="size-4 text-blue-500" />
          </div>
          <span className="text-sm font-medium">Revise in a go!</span>
        </div>
        <div>
          <Button
            size={"xs"}
            variant={"outline"}
            className="rounded-full shadow-md"
          >
            <PlusIcon /> Add more
          </Button>
        </div>
      </div>
      <Separator className="mt-4 mx-6 opacity-40" />
      <SortableExample />
    </div>
  );
}
