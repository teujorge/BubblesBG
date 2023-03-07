import { css, keyframes } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";

type Position = {
    x: number;
    y: number;
};

type ColorRGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export const Bubbles = ({
    quantity = 4,
    blur = 100, // px
    minSpeed = 25, // px/s
    maxSpeed = 75, // px/s
    minSize = 10, // window width %
    maxSize = 55 // window width %,
}: {
    quantity?: number;
    blur?: number;
    minSpeed?: number;
    maxSpeed?: number;
    minSize?: number;
    maxSize?: number;
}) => {
    // single bubble component
    const Bubble = ({ bubbleId }: { bubbleId: string }) => {
        const [initialPosition, setInitialPosition] = useState<Position>({
            x: -maxSize - blur,
            y: -maxSize - blur
        });

        const [finalPosition, setFinalPosition] = useState<Position>({
            x: -maxSize - blur,
            y: -maxSize - blur
        });

        const [color, setColor] = useState<ColorRGBA>({
            r: 0,
            g: 0,
            b: 0,
            a: 0
        });

        const [size, setSize] = useState<number>(0);

        const bubbleRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            bubbleRef.current!.addEventListener("animationiteration", resetBubble, false);

            return () => {
                bubbleRef.current!.removeEventListener("animationiteration", resetBubble, false);
            };
        }, []);

        function resetBubble() {
            setSize(randSize());
            setColor(randColor());

            const newInitialPosition = randInitialPosition();
            setInitialPosition({ ...newInitialPosition });

            const newFinalPosition = randFinalPosition(newInitialPosition);
            setFinalPosition({ ...newFinalPosition });
        }

        function randInitialPosition(): Position {
            return {
                x: Math.random() * window.innerWidth - widthPercentageToPixels(maxSize) / 2,
                y: window.innerHeight + blur
            };
        }

        function randFinalPosition(origin: Position): Position {
            return {
                x: Math.random() * window.innerWidth - widthPercentageToPixels(maxSize) / 2 - origin.x,
                y: -1 * (origin.y + Math.random() * widthPercentageToPixels(maxSize) + widthPercentageToPixels(maxSize) + blur)
            };
        }

        function randSpeed(): number {
            const speed = Math.random() * maxSpeed + minSpeed;
            return speed > 0 ? speed : 1;
        }

        function randSize(): number {
            const percentage = Math.random() * maxSize + minSize;
            const size = widthPercentageToPixels(percentage);
            return size >= 0 ? size : 0;
        }

        function widthPercentageToPixels(p: number): number {
            return (window.innerWidth * p) / 100;
        }

        function randColor(): ColorRGBA {
            const minOpacity = 0.25;
            const maxOpacity = 0.75;

            return {
                r: Math.random() * 200,
                g: Math.random() * 200,
                b: Math.random() * 200,
                a: Math.random() * (maxOpacity - minOpacity) + minOpacity
            };
        }

        function calcAnimTime(): number {
            if (size < 10) return 50;

            const dx = finalPosition.x - initialPosition.x;
            const dy = finalPosition.y - initialPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // v = d/t
            const time = distance / randSpeed();

            const sToMs = 1000;
            return time * sToMs;
        }

        const floatAnim = keyframes`
    0% {
        transform: translate(0px, 0px);
    }

    100% {
        transform: translate(
          ${finalPosition.x}px,
          ${finalPosition.y}px
        );
    }
    `;

        return (
            <div
                id={bubbleId}
                ref={bubbleRef}
                className={css`
                    z-index: -5;
                    position: fixed;
                    top: ${initialPosition.y}px;
                    left: ${initialPosition.x}px;

                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background-color: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a});

                    filter: blur(${blur}px);
                    animation: ${floatAnim} ${calcAnimTime()}ms linear infinite;
                `}
            />
        );
    };

    let bubbles: JSX.Element[] = [];
    for (let i = 0; i < quantity; i++) {
        bubbles.push(<Bubble key={`floating-bubble-${i}`} bubbleId={`floating-bubble-id-${i}`} />);
    }

    return <>{bubbles.map((b) => b)}</>;
};
