import React, { ReactNode, useEffect, useRef } from 'react';

interface WrapBoxProps {
    scrollToBottomWhenDataChange?: any;
    children: ReactNode;
}

const WrapBox: React.FC<WrapBoxProps> = ({ children, scrollToBottomWhenDataChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [scrollToBottomWhenDataChange]);
    return (
        <div
            ref={containerRef}
            className="overflow-auto"
            style={{ height: 430, scrollbarWidth: 'none' }}
        >

            {children}
        </div>
    );
};

export default WrapBox;

