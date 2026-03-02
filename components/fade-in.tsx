'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
    children: React.ReactNode
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    duration?: number
    className?: string
    fullWidth?: boolean
}

export function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.5,
    className = '',
    fullWidth = false,
}: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current)
        }
    }, [])

    const getTransform = () => {
        switch (direction) {
            case 'up':
                return 'translateY(24px)'
            case 'down':
                return 'translateY(-24px)'
            case 'left':
                return 'translateX(24px)'
            case 'right':
                return 'translateX(-24px)'
            case 'none':
                return 'none'
        }
    }

    return (
        <div
            ref={ref}
            className={`${fullWidth ? 'w-full' : ''} ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : getTransform(),
                transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
            }}
        >
            {children}
        </div>
    )
}
