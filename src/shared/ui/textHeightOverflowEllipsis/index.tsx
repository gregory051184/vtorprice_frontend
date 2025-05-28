import { useEffect, useRef } from "react";

interface ITextHeightOverflowEllipsis {
    text: string;
    maxHeight: number;
}
  
export const TextHeightOverflowEllipsis: React.FC<ITextHeightOverflowEllipsis> = ({ text, maxHeight }) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (pRef.current) {
      let truncatedText = text;
      const p = pRef.current;

      while (p.scrollHeight > maxHeight) {
        truncatedText = truncatedText.slice(0, -1);
        p.textContent = truncatedText + '...';
      }
    }
  }, [text, maxHeight]);

  return <p ref={pRef}>{text}</p>;
};