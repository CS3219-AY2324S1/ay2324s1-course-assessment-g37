import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface HistoryPageItemFullTextProps {
  text: string;
}

function HistoryPageItemFullText({
  text,
}: HistoryPageItemFullTextProps): JSX.Element {
  const [displayedText, setDisplayedText] = useState("");
  const [isFullTextShown, setIsFullTextShown] = useState(true);
  const ref = useRef<HTMLElement | null>(null);

  const fullTextLines = useMemo(() => text.split("\n"), [text]);

  const isTextCollapsible = useMemo(
    () => fullTextLines.length > 10,
    [fullTextLines.length]
  );

  const minifiedText = useMemo(
    () => fullTextLines.slice(0, 10).join("\n") + "\n...",
    [fullTextLines]
  );

  const minifyText = useCallback(() => {
    setDisplayedText(minifiedText);
    setIsFullTextShown(false);
  }, [minifiedText]);

  const showFullText = useCallback(() => {
    setDisplayedText(text);
    setIsFullTextShown(true);
  }, [text]);

  useEffect(() => {
    if (ref.current !== null) {
      // "If the property which you are trying to delete does not exist, delete
      // will not have any effect and will return true."
      // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete

      // the following line is needed to remove the error "Element previously
      // highlighted. To highlight again, first unset `dataset.highlighted`."
      // when using highlight.js
      delete ref.current.dataset.highlighted;

      // force re-highlight since the displayedText has changed
      hljs.highlightElement(ref.current);
    }
  }, [displayedText]);

  useEffect(() => {
    if (isTextCollapsible) {
      minifyText();
    } else {
      showFullText();
    }
  }, [minifyText, showFullText, isTextCollapsible]);

  const handleClick = useCallback(() => {
    if (!isTextCollapsible) {
      // clicking does nothing
      return;
    }

    const selectionLength = window.getSelection()?.toString()?.length;

    if (selectionLength !== undefined && selectionLength > 0) {
      // user is highlighting text
      // do nothing
      return;
    }

    if (isFullTextShown) {
      minifyText();
    } else {
      showFullText();
    }
  }, [isTextCollapsible, isFullTextShown, showFullText, minifyText]);

  return (
    <pre>
      <code
        title={isTextCollapsible ? "Click to show/hide code snippet" : ""}
        style={{
          borderRadius: "0.5rem",
        }}
        ref={ref}
        onClick={handleClick}
        className="language-typescript"
      >
        {displayedText}
      </code>
    </pre>
  );
}

export default HistoryPageItemFullText;
