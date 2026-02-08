'use client';

import { useEffect, useRef } from 'react';
import { crimsonPro } from '@/app/fonts';
import { roboto } from '@/app/fonts';
import { openSans } from '@/app/fonts';
import { sourceSansPro } from '@/app/fonts';
import LogoSVG from '@/components/logoSVG';

export default function CustomLogo() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const spotlightRef = useRef<SVGPolygonElement | null>(null);

  /* =======================
     SHARED ANGLE
  ======================= */
  const targetAngle = useRef(Math.PI / 2);
  const currentAngle = useRef(Math.PI / 2);
  const velocity = useRef(0);

  /* =======================
     INTERACTION STATE
  ======================= */
  const interactionEnabled = useRef(false);
  const idleTime = useRef(0);

  /* =======================
     SVG CONSTANTS
  ======================= */
  const TIP_X = 100;
  const TIP_Y = 15;
  const BASE_Y = 200;
  const MIN_DOWN_ANGLE = 0.15;
  const MAX_DOWN_ANGLE = Math.PI - 0.15;
  const SPREAD = (45 * Math.PI) / 180;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 200;
      const my = ((e.clientY - rect.top) / rect.height) * 200;

      // mouse must be below logo
      if (my <= TIP_Y) {
        interactionEnabled.current = false;
        return;
      }

      const dx = mx - TIP_X;
      const dy = my - TIP_Y;
      const rawAngle = Math.atan2(dy, dx);

      // angle saturation
      if (rawAngle < MIN_DOWN_ANGLE || rawAngle > MAX_DOWN_ANGLE) {
        interactionEnabled.current = false;
        return;
      }

      interactionEnabled.current = true;
      idleTime.current = 0;
      targetAngle.current = rawAngle;
    };

    const handleMouseLeave = () => {
      interactionEnabled.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let rafId: number;

    const animate = () => {
      // idle breathing
      if (!interactionEnabled.current) {
        idleTime.current += 0.01;
        targetAngle.current = Math.PI / 2 + Math.sin(idleTime.current) * 0.05;
      }

      // spring physics
      const stiffness = 0.08;
      const damping = 0.82;

      const force = (targetAngle.current - currentAngle.current) * stiffness;
      velocity.current = (velocity.current + force) * damping;
      currentAngle.current += velocity.current;

      // apply to text
      const textAngleDeg =
        (Math.PI / 2 - currentAngle.current) * (-180 / Math.PI);
      svgRef.current?.style.setProperty('--angle', `${textAngleDeg}deg`);

      // update spotlight triangle
      const intersectX = (a: number) => {
        const clamped = Math.max(MIN_DOWN_ANGLE, Math.min(MAX_DOWN_ANGLE, a));
        const sin = Math.sin(clamped);
        const t = (BASE_Y - TIP_Y) / sin;
        return TIP_X + t * Math.cos(clamped);
      };

      const leftX = intersectX(currentAngle.current - SPREAD);
      const rightX = intersectX(currentAngle.current + SPREAD);

      if (spotlightRef.current) {
        spotlightRef.current.setAttribute(
          'points',
          `${TIP_X},${TIP_Y} ${leftX},${BASE_Y} ${rightX},${BASE_Y}`,
        );
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-screen h-screen"
        preserveAspectRatio="xMidYMid meet"
        style={{ '--angle': '0deg' } as React.CSSProperties}
      >
        {/* LOGO */}
        <g transform="translate(100 15)">
          <LogoSVG width="22" height="24" x={-11} y={-12} />
        </g>

        {/* SPOTLIGHT TRIANGLE WITH GRADIENT + GLOW */}
        <polygon
          ref={spotlightRef}
          points="100,15 80,200 120,200"
          fill="url(#spotlightGradient)"
          style={{
            filter: 'blur(4px) drop-shadow(0 0 20px rgba(255,255,255,0.3))',
            transition: 'opacity 0.1s ease',
            opacity: 0.18,
          }}
        />

        {/* DEFINITIONS */}
        <defs>
          {/* Fading radial gradient for spotlight */}
          <radialGradient
            id="spotlightGradient"
            cx="50%"
            cy="0%"
            r="100%"
            fx="50%"
            fy="0%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="60%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Text arcs */}
          <path id="arc-inner" d="M 70 10 A 31 28 0 0 0 130 10" />
          <path id="arc-middle" d="M 70 16 A 31 26 0 0 0 130 16" />
          <path id="arc-outer" d="M 70 22 A 31 24 0 0 0 130 22" />
        </defs>

        {/* CURVED TEXT */}
        <g className="rotate-inner">
          <text
            className={`${roboto.className} fill-white text-[4px] font-semibold tracking-[0.5px]`}
            textAnchor="middle"
          >
            <textPath href="#arc-inner" startOffset="50%">
              creating legacies
            </textPath>
          </text>
        </g>

        <g className="rotate-middle">
          <text
            className={`${roboto.className} fill-white text-[4px] font-semibold tracking-[0.5px]`}
            textAnchor="middle"
          >
            <textPath href="#arc-middle" startOffset="50%">
              one student
            </textPath>
          </text>
        </g>

        <g className="rotate-outer">
          <text
            className={`${roboto.className} fill-white text-[4px] font-semibold tracking-[0.5px]`}
            textAnchor="middle"
          >
            <textPath href="#arc-outer" startOffset="50%">
              at a time...
            </textPath>
          </text>
        </g>
      </svg>

      <style jsx>{`
        .rotate-inner {
          transform-origin: 100px 15px;
          transform: rotate(calc(var(--angle) * 0.6));
        }
        .rotate-middle {
          transform-origin: 100px 15px;
          transform: rotate(calc(var(--angle) * 0.85));
        }
        .rotate-outer {
          transform-origin: 100px 15px;
          transform: rotate(var(--angle));
        }
      `}</style>
    </div>
  );
}
