import { css, keyframes } from "@emotion/css";
import React, { useEffect, useRef, useState } from "react";
export const Bubbles = ({ quantity = 4, blur = 100, // px
minSpeed = 25, // px/s
maxSpeed = 75, // px/s
minSize = 10, // window width %
maxSize = 55 // window width %,
 }) => {
    // single bubble component
    const Bubble = ({ bubbleId }) => {
        const [initialPosition, setInitialPosition] = useState({
            x: -maxSize - blur,
            y: -maxSize - blur
        });
        const [finalPosition, setFinalPosition] = useState({
            x: -maxSize - blur,
            y: -maxSize - blur
        });
        const [color, setColor] = useState({
            r: 0,
            g: 0,
            b: 0,
            a: 0
        });
        const [size, setSize] = useState(0);
        const bubbleRef = useRef(null);
        useEffect(() => {
            bubbleRef.current.addEventListener("animationiteration", resetBubble, false);
            return () => {
                bubbleRef.current.removeEventListener("animationiteration", resetBubble, false);
            };
        }, []);
        function resetBubble() {
            setSize(randSize());
            setColor(randColor());
            const newInitialPosition = randInitialPosition();
            setInitialPosition(Object.assign({}, newInitialPosition));
            const newFinalPosition = randFinalPosition(newInitialPosition);
            setFinalPosition(Object.assign({}, newFinalPosition));
        }
        function randInitialPosition() {
            return {
                x: Math.random() * window.innerWidth - widthPercentageToPixels(maxSize) / 2,
                y: window.innerHeight + blur
            };
        }
        function randFinalPosition(origin) {
            return {
                x: Math.random() * window.innerWidth - widthPercentageToPixels(maxSize) / 2 - origin.x,
                y: -1 * (origin.y + Math.random() * widthPercentageToPixels(maxSize) + widthPercentageToPixels(maxSize) + blur)
            };
        }
        function randSpeed() {
            const speed = Math.random() * maxSpeed + minSpeed;
            return speed > 0 ? speed : 1;
        }
        function randSize() {
            const percentage = Math.random() * maxSize + minSize;
            const size = widthPercentageToPixels(percentage);
            return size >= 0 ? size : 0;
        }
        function widthPercentageToPixels(p) {
            return (window.innerWidth * p) / 100;
        }
        function randColor() {
            const minOpacity = 0.25;
            const maxOpacity = 0.75;
            return {
                r: Math.random() * 200,
                g: Math.random() * 200,
                b: Math.random() * 200,
                a: Math.random() * (maxOpacity - minOpacity) + minOpacity
            };
        }
        function calcAnimTime() {
            if (size < 10)
                return 50;
            const dx = finalPosition.x - initialPosition.x;
            const dy = finalPosition.y - initialPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // v = d/t
            const time = distance / randSpeed();
            const sToMs = 1000;
            return time * sToMs;
        }
        const floatAnim = keyframes `
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
        return (React.createElement("div", { id: bubbleId, ref: bubbleRef, className: css `
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
                ` }));
    };
    let bubbles = [];
    for (let i = 0; i < quantity; i++) {
        bubbles.push(React.createElement(Bubble, { key: `floating-bubble-${i}`, bubbleId: `floating-bubble-id-${i}` }));
    }
    return React.createElement(React.Fragment, null, bubbles.map((b) => b));
};
//# sourceMappingURL=Bubbles.js.map