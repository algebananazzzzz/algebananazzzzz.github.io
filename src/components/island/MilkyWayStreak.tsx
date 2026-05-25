import { useMemo } from 'react';
import './MilkyWay.module.css';

type Dust = { x: number; y: number; r: number; op: number; warm: boolean };

export default function MilkyWayStreak() {
  const dust = useMemo<Dust[]>(() => {
    const out: Dust[] = [];
    for (let i = 0; i < 480; i++) {
      const u = Math.random();
      const v = (Math.random() - 0.5) * 2;
      const thickness = 0.55 - Math.abs(u - 0.5) * 0.55;
      const localY = v * thickness;
      const cx = u * 200;
      const cy = 30 + localY * 36 - (u - 0.5) * 18;
      const r =
        Math.random() < 0.04
          ? 0.6 + Math.random() * 0.8
          : Math.random() < 0.25
            ? 0.3 + Math.random() * 0.4
            : 0.12 + Math.random() * 0.28;
      const op = 0.3 + Math.random() * 0.65;
      const warm = Math.random() < 0.08;
      out.push({ x: cx, y: cy, r, op, warm });
    }
    return out;
  }, []);

  return (
    <svg viewBox="0 0 200 60" className="mw-streak" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="streakRadial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#dccaff" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#02040e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="streakWarm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEC43" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFC700" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="streakCool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
        <filter id="streakBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <ellipse
        cx="100"
        cy="30"
        rx="110"
        ry="22"
        fill="url(#streakRadial)"
        opacity="1"
        transform="rotate(-8 100 30)"
        filter="url(#streakBlur)"
      />
      <ellipse
        cx="100"
        cy="30"
        rx="130"
        ry="12"
        fill="url(#streakRadial)"
        opacity="0.85"
        transform="rotate(-4 100 30)"
        filter="url(#streakBlur)"
      />
      <ellipse
        cx="110"
        cy="30"
        rx="80"
        ry="6"
        fill="#ffffff"
        opacity="0.18"
        transform="rotate(-7 110 30)"
        filter="url(#streakBlur)"
      />
      <ellipse
        cx="112"
        cy="28"
        rx="42"
        ry="11"
        fill="url(#streakWarm)"
        opacity="0.85"
        transform="rotate(-8 112 28)"
        filter="url(#streakBlur)"
      />
      <ellipse
        cx="30"
        cy="38"
        rx="30"
        ry="8"
        fill="url(#streakCool)"
        opacity="0.8"
        transform="rotate(-12 30 38)"
        filter="url(#streakBlur)"
      />
      <ellipse
        cx="170"
        cy="22"
        rx="26"
        ry="6"
        fill="url(#streakCool)"
        opacity="0.6"
        transform="rotate(-12 170 22)"
        filter="url(#streakBlur)"
      />

      <g filter="url(#streakBlur)" opacity="0.95">
        {dust.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.warm ? '#FFE08A' : '#ffffff'}
            opacity={d.op}
          />
        ))}
      </g>
    </svg>
  );
}
