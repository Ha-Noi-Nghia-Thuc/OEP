import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, HelpCircle, Video } from "lucide-react";

// Hàm helper để chọn icon dựa trên loại chapter
const getChapterIcon = (type: Chapter["type"]) => {
  switch (type) {
    case "Video":
      return <Video className="mr-2 w-4 h-4 " />;
    case "Quiz":
      return <HelpCircle className="mr-2 w-4 h-4" />;
    case "Text":
    default:
      return <FileText className="mr-2 w-4 h-4" />;
  }
};

const AccordionSections = ({ sections }: AccordionSectionsProps) => {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section._id}
          value={section._id}
          className="accordion-section"
        >
          <AccordionTrigger className="accordion-section__trigger">
            <h5 className="accordion-section__title">{section.title}</h5>
          </AccordionTrigger>
          <AccordionContent className="accordion-section__content">
            <ul>
              {section.chapters.map((chapter) => (
                <li key={chapter._id} className="accordion-section__chapter">
                  {getChapterIcon(chapter.type)}
                  <span className="text-sm">{chapter.title}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionSections;
