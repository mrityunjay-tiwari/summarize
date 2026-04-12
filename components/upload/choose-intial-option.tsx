import {
  Choicebox,
  ChoiceboxIndicator,
  ChoiceboxItem,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@/components/kibo-ui/choicebox";

const options = [
  {
    id: "1",
    label: "Chat with PDF",
    description: "Ask questions about the PDF",
  },
  {
    id: "2",
    label: "Flashcards",
    description: "Generate flashcards",
  },
  {
    id: "3",
    label: "Quiz",
    description: "Generate quiz from PDF",
  },
  {
    id: "4",
    label: "Mind Map",
    description: "Generate mind map from PDF",
  },
];

const InitialOption = () => (
  <Choicebox
    defaultValue="1"
    style={{
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
    }}
  >
    {options.map((option) => (
      <ChoiceboxItem className="rounded-lg! border-dashed! bg-white!" key={option.id} value={option.id}>
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle className="text-left">{option.label}</ChoiceboxItemTitle>
          <ChoiceboxItemDescription className="text-left">
            {option.description}
          </ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
        <ChoiceboxIndicator />
      </ChoiceboxItem>
    ))}
  </Choicebox>
);

export default InitialOption;
