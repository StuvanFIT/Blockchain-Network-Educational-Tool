import React, { useState, useEffect } from 'react';


interface TypewriterProps {
    key:number;
    text:string;
    speed?: number; //ms per character
    onComplete?: () => void; // Optional callback when done typing
};

//React uses the key prop to determine whether a component should be re-used or replaced.
//By changing the key, React destroys the old component and creates a fresh instance — ensuring useEffect starts clean and state is fully reset
const Typewriter: React.FC<TypewriterProps> = ({key, text, speed=50, onComplete}) => {

    const [displayedText, setDisplayedText] = useState('');
    

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {

            const newLetter = text[currentIndex];

            if (newLetter) {
                setDisplayedText(prev => prev+ newLetter);
            }

            if (currentIndex >= text.length){
                clearInterval(interval);
                onComplete?.();
            }

            currentIndex++;
        }, speed)

        return () => clearInterval(interval)

    }, [text, speed, onComplete])

    return (
        <p className="whitespace-pre-wrap font-mono text-gray-800 text-lg leading-relaxed">
            {displayedText}
        </p>
    );
}

export {Typewriter}