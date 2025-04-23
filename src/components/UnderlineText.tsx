import { ReactElement, useState } from "react";
import { Dropdown } from "react-bootstrap";

type UnderlineRange = [number, number, string[]];

interface UnderlinedTextProps {
    text: string;
    underline?: UnderlineRange[];
    update: (text: string) => void;
    addToDictionary: (word: string) => void;
    readonly: boolean;
}

interface TextPart {
    text: string;
    start: number;
    end: number;
    underline: boolean;
    suggestions?: string[];
    readonly: boolean;
}

const UnderlinedText = ({
    text,
    underline = [],
    update,
    addToDictionary,
    readonly,
}: UnderlinedTextProps): ReactElement => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const parts: TextPart[] = [];
    let currentIndex = 0;

    underline
        .sort((a, b) => a[0] - b[0])
        .forEach(([start, end, suggestions]) => {
            if (start > currentIndex) {
                parts.push({
                    text: text.slice(currentIndex, start),
                    start,
                    end,
                    underline: false,
                    readonly,
                });
            }
            parts.push({
                text: text.slice(start, end),
                start,
                end,
                underline: true,
                suggestions,
                readonly,
            });
            currentIndex = end;
        });

    if (currentIndex < text.length) {
        parts.push({
            text: text.slice(currentIndex),
            start: currentIndex,
            end: text.length,
            underline: false,
            readonly,
        });
    }

    const handleSuggestionClick = (part: TextPart, suggestion: string): void => {
        if (suggestion.startsWith("Add '")) {
            addToDictionary(part.text);
        } else {
            const updatedText = text.slice(0, part.start) + suggestion + text.slice(part.end);
            console.log("Selected suggestion:", updatedText);
            update(updatedText);
        }

        setActiveIndex(null); // close dropdown
    };

    return (
        <span className="underlined-text">
            {parts.map((part, index) => {
                if (part.underline) {
                    if (part.readonly) {
                        return (
                            <span
                                key={index}
                                style={{
                                    textDecoration: part.underline ? "underline wavy blue" : "none",
                                }}
                            >
                                {part.text}
                            </span>
                        );
                    }

                    return (
                        <Dropdown
                            key={index}
                            show={activeIndex === index}
                            onToggle={isOpen => setActiveIndex(isOpen ? index : null)}
                        >
                            <Dropdown.Toggle
                                as="span"
                                style={{
                                    textDecoration: "underline wavy blue",
                                    cursor: "pointer",
                                    color: "inherit",
                                }}
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                {part.text}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {part.suggestions?.map((suggestion, i) => (
                                    <Dropdown.Item key={i} onClick={() => handleSuggestionClick(part, suggestion)}>
                                        {suggestion}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    );
                } else {
                    return <span key={index}>{part.text}</span>;
                }
            })}
        </span>
    );
};

export default UnderlinedText;
