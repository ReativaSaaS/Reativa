import { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ end, suffix = '', className = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          let current = 0
          const increment = end / 50
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              current = end
              clearInterval(timer)
            }
            setCount(Math.floor(current))
          }, 30)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}
