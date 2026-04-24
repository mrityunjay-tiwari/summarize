import FeatureCounter from "@/components/individual-project/counter";
import {FlashCardsCarousel} from "@/components/individual-project/flash_cards-tab/flash_cards_carousel";
import CardFlip from "@/components/individual-project/flash_cards-tab/flip-card";

export default function FlipPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <FlashCardsCarousel flashCards={[]} />
      
    </div>
  );
}
