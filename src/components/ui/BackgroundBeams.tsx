import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BackgroundBeams = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={parentRef}
            className={cn(
                "h-full relative flex items-center w-full justify-center overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 z-0">
                <Beams containerRef={containerRef} parentRef={parentRef} />
            </div>
            <div className="relative z-10 w-full">{children}</div>
            <div
                ref={containerRef}
                className="absolute bottom-0 bg-white dark:bg-zinc-950 w-full h-px z-20"
            />
        </div>
    );
};

const Beams = ({
    containerRef,
    parentRef,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const beams = [
        {
            initialX: 10,
            translateX: 10,
            duration: 7,
            repeatDelay: 3,
            delay: 2,
        },
        {
            initialX: 600,
            translateX: 600,
            duration: 3,
            repeatDelay: 3,
            delay: 4,
        },
        {
            initialX: 100,
            translateX: 100,
            duration: 7,
            repeatDelay: 7,
            className: "h-20",
        },
        {
            initialX: 400,
            translateX: 400,
            duration: 5,
            repeatDelay: 14,
            delay: 4,
        },
        {
            initialX: 800,
            translateX: 800,
            duration: 11,
            repeatDelay: 2,
            className: "h-20",
        },
        {
            initialX: 1000,
            translateX: 1000,
            duration: 4,
            repeatDelay: 2,
            className: "h-12",
        },
        {
            initialX: 1200,
            translateX: 1200,
            duration: 6,
            repeatDelay: 4,
            delay: 2,
            className: "h-6",
        },
    ];

    return (
        <>
            {beams.map((beam, index) => (
                <CollisionMechanism
                    key={index}
                    containerRef={containerRef}
                    parentRef={parentRef}
                    beamOptions={beam}
                />
            ))}
        </>
    );
};

const CollisionMechanism = React.forwardRef<
    HTMLDivElement,
    {
        containerRef: React.RefObject<HTMLDivElement | null>;
        parentRef: React.RefObject<HTMLDivElement | null>;
        beamOptions?: {
            initialX?: number;
            translateX?: number;
            initialY?: number;
            translateY?: number;
            rotate?: number;
            className?: string;
            duration?: number;
            delay?: number;
            repeatDelay?: number;
        };
    }
>(({ containerRef, parentRef, beamOptions }, _ref) => {
    const beamRef = useRef<HTMLDivElement>(null);
    const [collision, setCollision] = useState<{
        detected: boolean;
        coordinates: { x: number; y: number } | null;
    }>({
        detected: false,
        coordinates: null,
    });
    const beamKey = 0;
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const checkCollision = () => {
            if (
                beamRef.current &&
                containerRef.current &&
                parentRef.current &&
                !collision.detected
            ) {
                const beamRect = beamRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const parentRect = parentRef.current.getBoundingClientRect();

                if (beamRect.bottom >= containerRect.top) {
                    const relativeX =
                        beamRect.left - parentRect.left + beamRect.width / 2;
                    const relativeY = beamRect.bottom - parentRect.top;

                    setCollision({
                        detected: true,
                        coordinates: {
                            x: relativeX,
                            y: relativeY,
                        },
                    });
                }
            }
        };

        const animationInterval = setInterval(checkCollision, 50);

        return () => clearInterval(animationInterval);
    }, [collision.detected, containerRef, parentRef]);

    useEffect(() => {
        if (collision.detected) {
            setTimeout(() => {
                setCollision({ detected: false, coordinates: null });
                setCycle((prev) => prev + 1);
            }, 2000);
        }
    }, [collision.detected]);

    return (
        <>
            <motion.div
                key={beamKey + cycle}
                ref={beamRef}
                animate="animate"
                initial={{
                    translateY: beamOptions?.initialY || "-200px",
                    translateX: beamOptions?.initialX || "0px",
                    rotate: beamOptions?.rotate || 0,
                }}
                variants={{
                    animate: {
                        translateY: beamOptions?.translateY || "1800px",
                        translateX: beamOptions?.translateX || "0px",
                        rotate: beamOptions?.rotate || 0,
                    },
                }}
                transition={{
                    duration: beamOptions?.duration || 8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    delay: beamOptions?.delay || 0,
                    repeatDelay: beamOptions?.repeatDelay || 0,
                }}
                className={cn(
                    "absolute left-0 top-0 m-auto h-14 w-px rounded-full bg-gradient-to-t from-blue-500 via-indigo-500 to-transparent",
                    beamOptions?.className
                )}
            />
            {collision.detected && collision.coordinates && (
                <Explosion
                    key={`${collision.coordinates.x}-${collision.coordinates.y}`}
                    className=""
                    style={{
                        left: `${collision.coordinates.x}px`,
                        top: `${collision.coordinates.y}px`,
                        transform: "translate(-50%, -50%)",
                    }}
                />
            )}
        </>
    );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
    const spans = Array.from({ length: 20 }, (_, i) => i);

    return (
        <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute -inset-full h-10 w-10 m-auto rounded-full bg-blue-500/30 blur-xl"
            />
            {spans.map((i) => (
                <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                        opacity: 0,
                        scale: [1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 1.5 + 0.5,
                        ease: "easeOut",
                    }}
                    className="absolute h-px w-px rounded-full bg-blue-500"
                />
            ))}
        </div>
    );
};
