"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface SparklesProps {
    id?: string;
    background?: string;
    minSize?: number;
    maxSize?: number;
    particleDensity?: number;
    className?: string;
    particleColor?: string;
}

export const SparklesCore = (props: SparklesProps) => {
    const {
        id,
        background,
        minSize,
        maxSize,
        particleDensity,
        className,
        particleColor,
    } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const particles = useRef<any[]>([]);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            setContext(ctx);
        }
    }, []);

    useEffect(() => {
        if (context) {
            const resizeCanvas = () => {
                if (canvasRef.current && context) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                    initParticles();
                }
            };

            const initParticles = () => {
                const density = particleDensity || 120;
                const count = (window.innerWidth * window.innerHeight) / 1000000 * density;
                particles.current = [];
                for (let i = 0; i < count; i++) {
                    particles.current.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        size: Math.random() * ((maxSize || 3) - (minSize || 1)) + (minSize || 1),
                        speedX: Math.random() * 0.5 - 0.25,
                        speedY: Math.random() * 0.5 - 0.25,
                        opacity: Math.random(),
                    });
                }
            };

            const animate = () => {
                context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                particles.current.forEach((p) => {
                    context.beginPath();
                    context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    context.fillStyle = particleColor || "#FFFFFF";
                    context.globalAlpha = p.opacity;
                    context.fill();

                    p.x += p.speedX;
                    p.y += p.speedY;

                    if (p.x < 0) p.x = window.innerWidth;
                    if (p.x > window.innerWidth) p.x = 0;
                    if (p.y < 0) p.y = window.innerHeight;
                    if (p.y > window.innerHeight) p.y = 0;
                });
                requestAnimationFrame(animate);
            };

            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();
            animate();

            return () => {
                window.removeEventListener("resize", resizeCanvas);
            };
        }
    }, [context]);

    return (
        <canvas
            ref={canvasRef}
            id={id}
            className={cn("h-full w-full", className)}
            style={{
                background: background || "transparent",
            }}
        />
    );
};
