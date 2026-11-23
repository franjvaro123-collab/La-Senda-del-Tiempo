import React from 'react';
import type { PortraitRenderer } from './PortraitsPart1';

export const PORTRAITS_PART_2: Record<string, PortraitRenderer> = {
  // 16. Karateka: fiery martial artist with white sleeveless gi, crimson headband, scarred brow & blazing dragon fist
  karateka: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="65%" stopColor="#2b0808" />
          <stop offset="100%" stopColor="#0c0202" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffe0c8" />
          <stop offset="50%" stopColor="#d99a74" />
          <stop offset="100%" stopColor="#945636" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="90" fill="#fb923c" opacity="0.2" />
      <g className="hero-alive">
        {/* Headband tails blowing right */}
        <path d="M132 76 L168 62 L158 76 L176 80 L132 86 Z" fill="#ef4444" stroke="#090d16" strokeWidth="1.8" />
        {/* Muscular Chest + White Sleeveless Gi & Black Belt */}
        <path d="M36 242 C42 184 64 162 100 162 C136 162 158 184 164 242 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2.5" />
        <path d="M84 162 L100 206 L116 162 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M72 162 L100 218 L128 162" fill="none" stroke="#090d16" strokeWidth="3" />
        <rect x="64" y="216" width="72" height="12" rx="2" fill="#18181b" />
        {/* Head & Fierce Expression */}
        <rect x="89" y="140" width="22" height="24" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M68 90 C68 62 132 62 132 90 C132 120 116 144 100 146 C84 144 68 120 68 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M112 94 L120 112" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
        <g className="hero-blink">
          <ellipse cx="85" cy="105" rx="8" ry="6.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="105" r="4.2" fill="#ef4444" />
          <circle cx="86" cy="105" r="2" fill="#090d16" />
          <ellipse cx="115" cy="105" rx="8" ry="6.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="105" r="4.2" fill="#ef4444" />
          <circle cx="114" cy="105" r="2" fill="#090d16" />
        </g>
        <path d="M74 93 L95 99 M126 93 L105 99" stroke="#090d16" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M92 132 Q100 126 108 132" fill="none" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
        {/* Tall Jet-Black Spiky Hair & Red Headband */}
        <path d="M56 90 L48 58 L70 68 L78 30 L96 56 L108 28 L120 58 L138 38 L134 70 L152 62 L140 94 Z" fill="#18181b" stroke="#090d16" strokeWidth="2.3" />
        <path d="M66 86 Q100 76 134 86 L134 75 Q100 65 66 75 Z" fill="#ef4444" stroke="#090d16" strokeWidth="2" />
        {/* Flaming Fist */}
        <circle cx="152" cy="198" r="20" fill="#f97316" opacity="0.48" />
        <path d="M142 204 C136 184 152 164 160 176 C168 164 176 188 162 208 Z" fill="#fde047" stroke="#ea580c" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="30" cy="176" r="10" fill="#f97316" opacity="0.45" />
        <circle cx="30" cy="176" r="4.5" fill="#fef08a" />
      </g>
    </>
  ),

  // 17. Mosquetero: dashing royal duelist with wide plumed hat, neat goatee & mustache, ruffled white collar & gleaming silver rapier
  mosquetero: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="65%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#060916" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffe5d2" />
          <stop offset="50%" stopColor="#e2aa87" />
          <stop offset="100%" stopColor="#a36848" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#fde047" opacity="0.14" />
      <g className="hero-alive">
        {/* Silver Rapier with Basket Hilt */}
        <path d="M142 238 L184 102 L188 96 L186 112 L150 240 Z" fill="#f1f5f9" stroke="#090d16" strokeWidth="2" />
        <ellipse cx="148" cy="202" rx="14" ry="8" transform="rotate(20 148 202)" fill="none" stroke="#facc15" strokeWidth="3.5" />
        {/* Blue Cavalier Tabard & White Ruffled Lace Collar */}
        <path d="M36 242 C40 184 62 158 100 158 C138 158 160 184 164 242 Z" fill="#2563eb" stroke="#090d16" strokeWidth="2.5" />
        <path d="M70 162 L100 206 L130 162 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2" />
        <path d="M90 170 V218 M78 190 H122" stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
        {/* Head & Wavy Chestnut Locks */}
        <path d="M62 104 C56 130 58 152 68 162 L132 162 C142 152 144 130 138 104 Z" fill="#78350f" stroke="#090d16" strokeWidth="2" />
        <rect x="90" y="140" width="20" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M69 90 C69 64 131 64 131 90 C131 120 116 144 100 146 C84 144 69 120 69 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="104" rx="7.8" ry="6.6" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="87" cy="104" r="4.3" fill="#0ea5e9" />
          <circle cx="87" cy="104" r="1.9" fill="#090d16" />
          <ellipse cx="114" cy="104" rx="7.8" ry="6.6" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="113" cy="104" r="4.3" fill="#0ea5e9" />
          <circle cx="113" cy="104" r="1.9" fill="#090d16" />
        </g>
        {/* Stylish Mustache + Goatee + Smirk */}
        <path d="M84 126 Q94 122 100 126 Q106 122 116 126" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="96,136 104,136 100,145" fill="#451a03" />
        <path d="M91 131 Q102 135 111 129" fill="none" stroke="#7c2d12" strokeWidth="1.8" />
        {/* Feathered Cavalier Hat */}
        <ellipse cx="100" cy="68" rx="60" ry="12" fill="#1e3a8a" stroke="#090d16" strokeWidth="2.2" />
        <path d="M72 66 C76 42 124 42 128 66 Z" fill="#2563eb" stroke="#090d16" strokeWidth="2.2" />
        <path d="M120 48 C148 28 164 42 156 60 C140 56 128 54 120 48 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="1.8" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="96" r="3" fill="#fde047" />
        <circle cx="172" cy="156" r="2.5" fill="#fff" />
      </g>
    </>
  ),

  // 18. Bufón: mischievous harlequin jester with split violet/crimson diamond suit, twin belled horns & floating arcane cards
  bufon: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7e22ce" />
          <stop offset="65%" stopColor="#1e0638" />
          <stop offset="100%" stopColor="#0b0217" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#d8b4fe" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#f472b6" opacity="0.16" />
      <g className="hero-alive">
        {/* Split Harlequin Suit & Spiked Collar */}
        <path d="M36 242 C42 184 64 160 100 160 L100 242 Z" fill="#9333ea" stroke="#090d16" strokeWidth="2.4" />
        <path d="M100 160 C136 160 158 184 164 242 L100 242 Z" fill="#e11d48" stroke="#090d16" strokeWidth="2.4" />
        <path d="M56 162 L72 192 L88 168 L100 198 L112 168 L128 192 L144 162 Z" fill="#fde047" stroke="#090d16" strokeWidth="2" />
        {/* Porcelain Jester Face with Diamond & Star Makeup */}
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <polygon points="86,114 90,120 86,126 82,120" fill="#e11d48" />
        <polygon points="114,114 118,120 114,126 110,120" fill="#9333ea" />
        <g className="hero-blink">
          <ellipse cx="86" cy="104" rx="8" ry="7" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="104" r="4.5" fill="#f43f5e" />
          <circle cx="86" cy="104" r="2" fill="#090d16" />
          <ellipse cx="114" cy="104" rx="8" ry="7" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="104" r="4.5" fill="#9333ea" />
          <circle cx="114" cy="104" r="2" fill="#090d16" />
        </g>
        <path d="M88 128 Q100 139 112 128" fill="none" stroke="#e11d48" strokeWidth="2.4" strokeLinecap="round" />
        {/* Two-Horn Belled Jester Cap */}
        <path d="M68 86 C52 44 28 48 26 68 C44 64 58 72 68 84 Z" fill="#9333ea" stroke="#090d16" strokeWidth="2.2" />
        <path d="M132 86 C148 44 172 48 174 68 C156 64 142 72 132 84 Z" fill="#e11d48" stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 84 C74 56 126 56 132 84 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2" />
        <circle cx="26" cy="70" r="6" fill="#fde047" stroke="#090d16" strokeWidth="1.6" />
        <circle cx="174" cy="70" r="6" fill="#fde047" stroke="#090d16" strokeWidth="1.6" />
        {/* Floating Playing Cards */}
        <rect x="144" y="164" width="20" height="28" rx="3" transform="rotate(-14 144 164)" fill="#f8fafc" stroke="#e11d48" strokeWidth="2" />
        <rect x="160" y="176" width="20" height="28" rx="3" transform="rotate(12 160 176)" fill="#f8fafc" stroke="#9333ea" strokeWidth="2" />
        <polygon points="154,174 158,179 154,184 150,179" fill="#e11d48" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="144" r="3" fill="#f472b6" />
        <circle cx="174" cy="128" r="3.5" fill="#fde047" />
      </g>
    </>
  ),

  // 19. Francotirador: cool tactical sharpshooter in camo hood, emerald targeting monocle scope & long-barrel precision sniper rifle
  francotirador: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="65%" stopColor="#091914" />
          <stop offset="100%" stopColor="#030806" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#f5cfb4" />
          <stop offset="55%" stopColor="#ca906e" />
          <stop offset="100%" stopColor="#8a563b" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      {/* Crosshair Reticle in Background */}
      <circle cx="115" cy="104" r="56" fill="none" stroke="#34d399" strokeOpacity="0.28" strokeWidth="1.5" />
      <path d="M115 40 V60 M115 148 V168 M50 104 H70 M160 104 H180" stroke="#34d399" strokeOpacity="0.28" strokeWidth="1.5" />
      <g className="hero-alive">
        {/* Long Sniper Rifle */}
        <line x1="114" y1="228" x2="192" y2="108" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
        <line x1="158" y1="160" x2="192" y2="108" stroke="#10b981" strokeWidth="2.5" />
        <rect x="138" y="160" width="22" height="7" rx="2" transform="rotate(-56 138 160)" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
        {/* Tactical Ghillie Coat & High Collar */}
        <path d="M34 242 C38 184 60 158 100 158 C140 158 162 184 166 242 Z" fill="#1e293b" stroke="#090d16" strokeWidth="2.5" />
        <path d="M58 164 L100 202 L142 164" fill="#065f46" stroke="#090d16" strokeWidth="2" />
        {/* Head */}
        <path d="M68 90 C68 64 132 64 132 90 C132 120 116 144 100 146 C84 144 68 120 68 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="85" cy="105" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105" r="4" fill="#10b981" />
          <circle cx="86" cy="105" r="1.8" fill="#090d16" />
          <ellipse cx="115" cy="105" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105" r="4" fill="#10b981" />
          <circle cx="114" cy="105" r="1.8" fill="#090d16" />
        </g>
        {/* Glowing Sniper Scope Monocle over Right Eye */}
        <circle cx="115" cy="105" r="12" fill="rgba(16,185,129,0.34)" stroke="#facc15" strokeWidth="2.5" />
        <line x1="127" y1="105" x2="136" y2="100" stroke="#94a3b8" strokeWidth="3" />
        <path d="M93 130 H108" stroke="#7c3e2e" strokeWidth="2" strokeLinecap="round" />
        {/* Silver-Grey Swept Hair & Half-Hood */}
        <path d="M54 96 C54 52 146 52 146 96 C134 74 114 66 96 76 C78 66 64 78 54 96 Z" fill="#64748b" stroke="#090d16" strokeWidth="2.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="186" cy="102" r="4" fill="#34d399" />
      </g>
    </>
  ),

  // 20. Cavernícola: primal prehistoric brute with sabertooth pelt across shoulder, bone necklace, wild mane & giant wooden club
  cavernicola: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="65%" stopColor="#2e1204" />
          <stop offset="100%" stopColor="#120601" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#eab088" />
          <stop offset="55%" stopColor="#bc764d" />
          <stop offset="100%" stopColor="#7c4222" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="90" fill="#fbbf24" opacity="0.16" />
      <g className="hero-alive">
        {/* Giant Spiked Caveman Club */}
        <path d="M148 240 L166 108 C178 96 190 112 182 148 L158 240 Z" fill="#78350f" stroke="#090d16" strokeWidth="2.4" />
        <polygon points="164,124 152,118 166,112" fill="#fef3c7" stroke="#090d16" strokeWidth="1.4" />
        <polygon points="184,132 194,126 184,142" fill="#fef3c7" stroke="#090d16" strokeWidth="1.4" />
        {/* Muscular Torso + Spotted Sabertooth Pelt */}
        <path d="M26 242 C30 182 56 156 100 156 C144 156 170 182 174 242 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.5" />
        <path d="M40 172 L134 242 H32 Z" fill="#f59e0b" stroke="#090d16" strokeWidth="2.2" />
        <circle cx="62" cy="202" r="5" fill="#78350f" />
        <circle cx="84" cy="222" r="6" fill="#78350f" />
        {/* Fang Tooth Necklace */}
        <polygon points="82,166 86,180 90,166" fill="#fef3c7" stroke="#090d16" strokeWidth="1.3" />
        <polygon points="96,170 100,186 104,170" fill="#fef3c7" stroke="#090d16" strokeWidth="1.3" />
        <polygon points="110,166 114,180 118,166" fill="#fef3c7" stroke="#090d16" strokeWidth="1.3" />
        {/* Broad Wild Face & Messy Mane */}
        <path d="M52 126 C44 64 72 44 100 46 C128 44 156 64 148 126 Z" fill="#451a03" stroke="#090d16" strokeWidth="2.4" />
        <path d="M68 92 C68 68 132 68 132 92 C132 122 116 146 100 148 C84 146 68 122 68 92 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M60 88 L76 74 L94 86 L108 70 L124 86 L140 76 L134 98 C114 84 86 84 66 98 Z" fill="#451a03" stroke="#090d16" strokeWidth="2" />
        <g className="hero-blink">
          <ellipse cx="85" cy="105" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="85" cy="105" r="3.8" fill="#fbbf24" />
          <circle cx="85" cy="105" r="1.8" fill="#090d16" />
          <ellipse cx="115" cy="105" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="115" cy="105" r="3.8" fill="#fbbf24" />
          <circle cx="115" cy="105" r="1.8" fill="#090d16" />
        </g>
        <path d="M74 94 L94 100 M126 94 L106 100" stroke="#090d16" strokeWidth="4" strokeLinecap="round" />
        <path d="M68 118 C68 148 84 166 100 168 C116 166 132 148 132 118 C118 128 82 128 68 118 Z" fill="#451a03" stroke="#090d16" strokeWidth="2.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="68" r="3.5" fill="#fbbf24" />
      </g>
    </>
  ),

  // 21. Bruja: enchanting midnight witch with starry crooked spire hat, violet waves, gothic corset & levitating arcane orb
  bruja: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="65%" stopColor="#1e0940" />
          <stop offset="100%" stopColor="#080217" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff5f7" />
          <stop offset="55%" stopColor="#f5d0de" />
          <stop offset="100%" stopColor="#c490a8" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#e879f9" opacity="0.18" />
      <g className="hero-alive">
        {/* Flowing Lavender-Violet Hair */}
        <path d="M52 94 C36 140 34 190 46 230 L154 230 C166 190 164 140 148 94 Z" fill="#c084fc" stroke="#090d16" strokeWidth="2.3" />
        {/* Gothic Witch Dress & Gold Collar */}
        <path d="M36 242 C42 184 64 160 100 160 C136 160 158 184 164 242 Z" fill="#4c1d95" stroke="#090d16" strokeWidth="2.4" />
        <path d="M74 162 L100 220 L126 162 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2" />
        <circle cx="100" cy="182" r="7" fill="#e879f9" stroke="#facc15" strokeWidth="2" />
        {/* Face */}
        <rect x="91" y="140" width="18" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105.5" r="4.8" fill="#f59e0b" />
          <circle cx="86" cy="105" r="2.2" fill="#090d16" />
          <circle cx="84" cy="102.5" r="2" fill="#fff" />
          <ellipse cx="114" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105.5" r="4.8" fill="#f59e0b" />
          <circle cx="114" cy="105" r="2.2" fill="#090d16" />
          <circle cx="112" cy="102.5" r="2" fill="#fff" />
        </g>
        <path d="M93 130 Q100 135 107 130" fill="none" stroke="#9d174d" strokeWidth="2" strokeLinecap="round" />
        {/* Crooked Pointed Witch Hat with Gold Buckle */}
        <ellipse cx="100" cy="76" rx="64" ry="13" fill="#4c1d95" stroke="#090d16" strokeWidth="2.2" />
        <path d="M70 74 L92 16 L128 32 L114 44 L130 74 Z" fill="#6d28d9" stroke="#090d16" strokeWidth="2.2" />
        <path d="M74 69 H126" stroke="#facc15" strokeWidth="4" />
        {/* Floating Arcane Crystal Orb */}
        <circle cx="154" cy="196" r="18" fill="#e879f9" opacity="0.45" />
        <circle cx="154" cy="196" r="11" fill="#c084fc" stroke="#fff" strokeWidth="2" />
        <circle cx="150" cy="192" r="3.5" fill="#fff" />
      </g>
      <g className="hero-fx-float">
        <polygon points="34,64 37,72 45,75 37,78 34,86 31,78 23,75 31,72" fill="#fde047" />
      </g>
    </>
  ),

  // 22. Ninja: lethal shinobi master with silver spiky hair, crimson glowing eyes, face mask & twin shadow katanas
  ninja: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="60%" stopColor="#1e103d" />
          <stop offset="100%" stopColor="#050311" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fce2d0" />
          <stop offset="55%" stopColor="#d19a79" />
          <stop offset="100%" stopColor="#8a563c" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#c084fc" opacity="0.16" />
      <g className="hero-alive">
        {/* Twin Shadow Katanas Crossed */}
        <path d="M24 236 L58 106 L64 98 L62 118 L34 238 Z" fill="#c084fc" stroke="#090d16" strokeWidth="2" />
        <path d="M176 236 L142 106 L136 98 L138 118 L166 238 Z" fill="#c084fc" stroke="#090d16" strokeWidth="2" />
        {/* Shinobi Vest + Crimson Sash */}
        <path d="M36 242 C42 184 64 158 100 158 C136 158 158 184 164 242 Z" fill="#0f172a" stroke="#090d16" strokeWidth="2.5" />
        <path d="M64 160 L100 218 L136 160" fill="#312e81" stroke="#4338ca" strokeWidth="2" />
        <path d="M72 204 L128 192" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
        {/* Head + Shinobi Mask */}
        <path d="M69 90 C69 64 131 64 131 90 C131 120 116 144 100 146 C84 144 69 120 69 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 110 C84 118 116 118 132 110 C128 138 114 148 100 150 C86 148 72 138 68 110 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2.2" />
        {/* Sharp Crimson Shinobi Eyes */}
        <g className="hero-blink">
          <path d="M75 101 Q85 96 94 103 Q85 109 75 101 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="102" r="3.8" fill="#f43f5e" />
          <circle cx="86" cy="102" r="1.6" fill="#090d16" />
          <path d="M125 101 Q115 96 106 103 Q115 109 125 101 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="102" r="3.8" fill="#f43f5e" />
          <circle cx="114" cy="102" r="1.6" fill="#090d16" />
        </g>
        {/* Silver Spiky Hair + Metal Headplate */}
        <path d="M54 94 L46 62 L68 70 L78 34 L98 58 L108 32 L120 58 L138 40 L134 72 L152 64 L142 96 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2.2" />
        <rect x="80" y="76" width="40" height="10" rx="2" fill="#94a3b8" stroke="#090d16" strokeWidth="1.6" />
      </g>
      <g className="hero-fx-float">
        <polygon points="34,74 42,78 34,82 30,90 26,82 18,78 26,74 30,66" fill="#e2e8f0" />
      </g>
    </>
  ),

  // 23. Faraón: golden sun sovereign with striped royal Nemes headdress, cobra uraeus, jeweled collar & glowing Ankh scepter
  faraon: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="65%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#09081a" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#e8a779" />
          <stop offset="55%" stopColor="#b97549" />
          <stop offset="100%" stopColor="#7c4221" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="100" r="88" fill="#fde047" opacity="0.22" />
      <g className="hero-alive">
        {/* Golden Ankh Scepter */}
        <line x1="164" y1="128" x2="154" y2="240" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="164" cy="108" rx="11" ry="15" fill="none" stroke="#fde047" strokeWidth="5" />
        <line x1="146" y1="126" x2="182" y2="126" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
        {/* Royal Obsidian Robes + Jeweled Pectoral Collar */}
        <path d="M34 242 C38 182 60 156 100 156 C140 156 162 182 166 242 Z" fill="#0f172a" stroke="#090d16" strokeWidth="2.5" />
        <path d="M56 162 Q100 218 144 162 L126 154 H74 Z" fill="#facc15" stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 176 Q100 198 132 176" fill="none" stroke="#0284c7" strokeWidth="4" />
        <circle cx="100" cy="196" r="6" fill="#38bdf8" stroke="#090d16" strokeWidth="1.5" />
        {/* Nemes Royal Headdress (gold & lapis lazuli stripes) */}
        <path d="M46 154 L58 62 C72 42 128 42 142 62 L154 154 L132 154 L126 88 C114 76 86 76 74 88 L68 154 Z" fill="#eab308" stroke="#090d16" strokeWidth="2.4" />
        <path d="M56 80 H144 M53 98 H147 M50 116 H150 M48 134 H152" stroke="#1d4ed8" strokeWidth="4.5" />
        {/* Sun-kissed Sovereign Face with Kohl Eyeliner */}
        <path d="M72 88 C72 68 128 68 128 88 C128 118 115 142 100 144 C85 142 72 118 72 88 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <path d="M74 103 Q85 97 94 104 Q85 110 74 103 Z" fill="#fff" stroke="#090d16" strokeWidth="2" />
          <circle cx="86" cy="103" r="4.2" fill="#facc15" />
          <circle cx="86" cy="103" r="1.8" fill="#090d16" />
          <path d="M126 103 Q115 97 106 104 Q115 110 126 103 Z" fill="#fff" stroke="#090d16" strokeWidth="2" />
          <circle cx="114" cy="103" r="4.2" fill="#facc15" />
          <circle cx="114" cy="103" r="1.8" fill="#090d16" />
        </g>
        <path d="M93 129 H107" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
        {/* False Royal Chin Beard & Cobra Gem */}
        <polygon points="96,143 104,143 102,162 98,162" fill="#eab308" stroke="#090d16" strokeWidth="1.5" />
        <circle cx="100" cy="60" r="6" fill="#38bdf8" stroke="#fef08a" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="30" cy="70" r="4" fill="#fde047" />
        <circle cx="172" cy="62" r="3" fill="#38bdf8" />
      </g>
    </>
  ),

  // 24. Centauro: towering armored half-horse warlord with sweeping bronze mane, war-paint scars & heavy war spear
  centauro: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="65%" stopColor="#241209" />
          <stop offset="100%" stopColor="#0c0603" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#f2b88f" />
          <stop offset="55%" stopColor="#bc764c" />
          <stop offset="100%" stopColor="#7a4223" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="90" fill="#fb923c" opacity="0.16" />
      <g className="hero-alive">
        {/* Equine Armored Lower Hindquarters visible behind */}
        <path d="M18 242 C22 204 42 184 74 188 L158 194 C172 204 176 224 176 242 Z" fill="#7c2d12" stroke="#090d16" strokeWidth="2.5" />
        {/* War Spear */}
        <line x1="166" y1="24" x2="152" y2="240" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <polygon points="166,6 154,48 166,40 178,48" fill="#fde047" stroke="#090d16" strokeWidth="2" />
        {/* Broad Centaur Chest & Bronze Harness */}
        <path d="M52 202 C56 164 74 152 100 152 C126 152 144 164 148 202 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M56 164 L138 206 M144 164 L62 206" stroke="#b45309" strokeWidth="9" strokeLinecap="round" />
        <circle cx="100" cy="184" r="9" fill="#fde047" stroke="#090d16" strokeWidth="2" />
        {/* Wild Chestnut Mane */}
        <path d="M54 88 C42 132 42 162 54 186 L146 186 C158 162 158 132 146 88 Z" fill="#451a03" stroke="#090d16" strokeWidth="2.2" />
        {/* Head & Red War Paint */}
        <path d="M68 88 C68 62 132 62 132 88 C132 118 117 142 100 144 C83 142 68 118 68 88 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M72 114 L88 118 M128 114 L112 118" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
        <g className="hero-blink">
          <ellipse cx="85" cy="102" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="102" r="4" fill="#f59e0b" />
          <circle cx="86" cy="102" r="1.8" fill="#090d16" />
          <ellipse cx="115" cy="102" rx="7.5" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="102" r="4" fill="#f59e0b" />
          <circle cx="114" cy="102" r="1.8" fill="#090d16" />
        </g>
        <path d="M74 91 L94 96 M126 91 L106 96" stroke="#451a03" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M62 90 C62 50 138 50 138 90 C124 72 112 68 100 84 C88 68 76 72 62 90 Z" fill="#7c2d12" stroke="#090d16" strokeWidth="2.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="30" cy="136" r="4" fill="#fb923c" />
      </g>
    </>
  ),

  // 25. Valkiria: radiant winged shieldmaiden with feathered angelic wings, winged golden helm, white-gold armor & sun-spear
  valkiria: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="55%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#080d1a" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff7f0" />
          <stop offset="55%" stopColor="#f5cbb4" />
          <stop offset="100%" stopColor="#c48a6c" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="92" fill="#fef08a" opacity="0.22" />
      <g className="hero-alive">
        {/* Angelic Feathered Wings */}
        <path d="M98 156 C44 88 6 82 4 134 C18 156 48 168 84 182 Z" fill="#fffbeb" stroke="#eab308" strokeWidth="2.2" />
        <path d="M102 156 C156 88 194 82 196 134 C182 156 152 168 116 182 Z" fill="#fffbeb" stroke="#eab308" strokeWidth="2.2" />
        <path d="M94 158 C56 112 24 108 22 138 M106 158 C144 112 176 108 178 138" fill="none" stroke="#bae6fd" strokeWidth="2.6" />
        {/* Long Golden Hair */}
        <path d="M56 92 C44 138 40 186 48 226 L152 226 C160 186 156 138 144 92 Z" fill="#fde047" stroke="#090d16" strokeWidth="2.2" />
        {/* Celestial White & Gold Valkyrie Armor */}
        <path d="M38 242 C42 184 64 160 100 160 C136 160 158 184 162 242 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2.4" />
        <path d="M62 166 L100 208 L138 166 L124 242 H76 Z" fill="#eab308" stroke="#090d16" strokeWidth="2" />
        <circle cx="100" cy="192" r="7" fill="#38bdf8" stroke="#fff" strokeWidth="1.6" />
        {/* Head */}
        <rect x="91" y="140" width="18" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105.5" r="4.8" fill="#38bdf8" />
          <circle cx="86" cy="105" r="2.2" fill="#090d16" />
          <circle cx="84" cy="102.5" r="2" fill="#fff" />
          <ellipse cx="114" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105.5" r="4.8" fill="#38bdf8" />
          <circle cx="114" cy="105" r="2.2" fill="#090d16" />
          <circle cx="112" cy="102.5" r="2" fill="#fff" />
        </g>
        <path d="M94 130 Q100 134 106 130" fill="none" stroke="#9d4e4e" strokeWidth="1.8" />
        {/* Golden Winged Crown */}
        <path d="M64 100 C64 64 82 50 100 50 C118 50 136 64 136 100 C122 80 110 74 100 88 C90 74 78 80 64 100 Z" fill="#fef08a" stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 82 Q100 66 132 82 L126 68 L100 58 L74 68 Z" fill="#facc15" stroke="#090d16" strokeWidth="2" />
        <path d="M68 78 L38 46 L66 64 Z M132 78 L162 46 L134 64 Z" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
        {/* Sun Spear */}
        <line x1="164" y1="76" x2="152" y2="240" stroke="#eab308" strokeWidth="5.5" />
        <polygon points="165,44 157,80 173,80" fill="#38bdf8" stroke="#090d16" strokeWidth="1.8" />
      </g>
      <g className="hero-fx-float">
        <circle cx="32" cy="60" r="3" fill="#fef08a" />
        <circle cx="170" cy="170" r="3" fill="#38bdf8" />
      </g>
    </>
  ),

  // 26. Samurái: legendary crimson-armored swordsman with horned crescent kabuto, oni half-mask, wind katana & sakura petals
  samurai: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="65%" stopColor="#1e0810" />
          <stop offset="100%" stopColor="#090307" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fce0c8" />
          <stop offset="55%" stopColor="#d1936f" />
          <stop offset="100%" stopColor="#8a5234" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="90" fill="#fb7185" opacity="0.18" />
      <g className="hero-alive">
        {/* Wind-infused Katana */}
        <path d="M142 240 L182 104 L190 94 L188 118 L154 240 Z" fill="#a3e635" stroke="#090d16" strokeWidth="2.2" />
        <rect x="136" y="192" width="26" height="6" rx="2" transform="rotate(15 136 192)" fill="#eab308" stroke="#090d16" strokeWidth="1.5" />
        {/* Lacquered Crimson Samurai Armor (O-Yoroi) */}
        <path d="M28 242 C32 182 56 156 100 156 C144 156 168 182 172 242 Z" fill="#b91c1c" stroke="#090d16" strokeWidth="2.6" />
        <path d="M36 178 H76 M124 178 H164 M34 196 H72 M128 196 H166" stroke="#facc15" strokeWidth="3" />
        <path d="M74 162 L100 218 L126 162 Z" fill="#18181b" stroke="#090d16" strokeWidth="2" />
        {/* Head & Fierce Menpo Oni Half-Mask */}
        <path d="M68 90 C68 64 132 64 132 90 C132 120 116 146 100 148 C84 146 68 120 68 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 112 L84 120 H116 L132 112 C128 138 114 148 100 150 C86 148 72 138 68 112 Z" fill="#18181b" stroke="#facc15" strokeWidth="1.8" />
        <path d="M84 130 L90 122 L96 130 M104 130 L110 122 L116 130" fill="#f8fafc" />
        <g className="hero-blink">
          <path d="M75 101 Q85 95 94 102 Q85 108 75 101 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="101.5" r="3.8" fill="#fb7185" />
          <circle cx="86" cy="101.5" r="1.6" fill="#090d16" />
          <path d="M125 101 Q115 95 106 102 Q115 108 125 101 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="101.5" r="3.8" fill="#fb7185" />
          <circle cx="114" cy="101.5" r="1.6" fill="#090d16" />
        </g>
        {/* Kabuto Helmet with Golden Crescent Crest */}
        <path d="M52 94 C54 46 146 46 148 94 Z" fill="#991b1b" stroke="#090d16" strokeWidth="2.4" />
        <path d="M100 66 L68 28 L92 54 L100 42 L108 54 L132 28 Z" fill="#facc15" stroke="#090d16" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <ellipse cx="30" cy="64" rx="6" ry="3" transform="rotate(28 30 64)" fill="#fda4af" />
        <ellipse cx="168" cy="166" rx="6" ry="3" transform="rotate(-24 168 166)" fill="#fb7185" />
        <ellipse cx="44" cy="182" rx="5" ry="2.5" fill="#fecdd3" />
      </g>
    </>
  ),

  // 27. Mago: supreme pyromancer archmage with swept snow-white hair, blazing flame halo, high crimson collar & fire-orb staff
  mago: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="65%" stopColor="#2b0612" />
          <stop offset="100%" stopColor="#0f0206" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fff3eb" />
          <stop offset="55%" stopColor="#e8b89c" />
          <stop offset="100%" stopColor="#ab7558" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="92" fill="#fb923c" opacity="0.2" />
      <g className="hero-alive">
        {/* Arcane Fire Halo */}
        <circle cx="100" cy="94" r="54" fill="none" stroke="#fde047" strokeWidth="3.2" strokeDasharray="16 6" opacity="0.85" />
        <circle cx="100" cy="94" r="46" fill="none" stroke="#f97316" strokeWidth="1.6" opacity="0.6" />
        {/* Long Swept White Hair */}
        <path d="M54 90 C42 138 40 186 48 228 L152 228 C160 186 158 138 146 90 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2.2" />
        {/* High-Collared Crimson & Gold Archmage Robes */}
        <path d="M36 242 C40 184 62 158 100 158 C138 158 160 184 164 242 Z" fill="#dc2626" stroke="#090d16" strokeWidth="2.5" />
        <path d="M48 166 L62 130 L82 162 M152 166 L138 130 L118 162" fill="#991b1b" stroke="#facc15" strokeWidth="2.2" />
        <path d="M74 164 L100 220 L126 164 Z" fill="#facc15" stroke="#090d16" strokeWidth="2" />
        <circle cx="100" cy="188" r="8" fill="#fb923c" stroke="#090d16" strokeWidth="1.6" />
        {/* Face */}
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="105" r="4.4" fill="#f97316" />
          <circle cx="86" cy="105" r="2" fill="#090d16" />
          <ellipse cx="114" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="105" r="4.4" fill="#f97316" />
          <circle cx="114" cy="105" r="2" fill="#090d16" />
        </g>
        <path d="M62 96 C62 56 138 56 138 96 C124 74 112 72 100 88 C88 72 76 74 62 96 Z" fill="#ffffff" stroke="#090d16" strokeWidth="2.2" />
        {/* Blazing Fire Staff */}
        <line x1="164" y1="118" x2="154" y2="240" stroke="#78350f" strokeWidth="5.5" />
        <circle cx="164" cy="108" r="14" fill="#f97316" opacity="0.5" />
        <circle cx="164" cy="108" r="8" fill="#fef08a" stroke="#dc2626" strokeWidth="2.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="30" cy="176" r="11" fill="#f97316" opacity="0.45" />
        <circle cx="30" cy="176" r="5" fill="#fef08a" />
      </g>
    </>
  ),

  // 28. Druida: ancient emerald archdruid with branching stag antlers, mossy leaf mantle, glowing runic staff & nature fireflies
  druida: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="65%" stopColor="#042217" />
          <stop offset="100%" stopColor="#02100a" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fde6d2" />
          <stop offset="55%" stopColor="#cfa07f" />
          <stop offset="100%" stopColor="#8d5e41" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="90" fill="#34d399" opacity="0.18" />
      <g className="hero-alive">
        {/* Branching Stag Antlers */}
        <path d="M76 74 C58 50 52 32 60 16 M60 44 L42 34 M124 74 C142 50 148 32 140 16 M140 44 L158 34" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="16" r="4.5" fill="#34d399" />
        <circle cx="140" cy="16" r="4.5" fill="#34d399" />
        {/* Emerald Waves */}
        <path d="M54 92 C40 140 40 188 48 228 L152 228 C160 188 160 140 146 92 Z" fill="#10b981" stroke="#090d16" strokeWidth="2.2" />
        {/* Mossy Leaf Mantle */}
        <path d="M36 242 C40 184 62 158 100 158 C138 158 160 184 164 242 Z" fill="#047857" stroke="#090d16" strokeWidth="2.4" />
        <path d="M48 168 L74 196 L100 176 L126 196 L152 168 L134 156 H66 Z" fill="#059669" stroke="#34d399" strokeWidth="2" />
        {/* Head */}
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105" r="4.5" fill="#34d399" />
          <circle cx="86" cy="105" r="2" fill="#090d16" />
          <ellipse cx="114" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105" r="4.5" fill="#34d399" />
          <circle cx="114" cy="105" r="2" fill="#090d16" />
        </g>
        <path d="M62 96 C62 58 138 58 138 96 C122 76 110 74 100 90 C90 74 78 76 62 96 Z" fill="#34d399" stroke="#090d16" strokeWidth="2.2" />
        {/* Living Nature Staff */}
        <path d="M156 240 C164 190 160 146 166 112" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <circle cx="166" cy="108" r="10" fill="#6ee7b7" stroke="#065f46" strokeWidth="2.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="32" cy="126" r="4" fill="#fef08a" opacity="0.85" />
        <circle cx="176" cy="70" r="3" fill="#6ee7b7" />
      </g>
    </>
  ),

  // 29. Sacerdotisa: radiant high priestess of time with golden veil, sacred sun-wheel halo, pearl white vestments & golden bell-staff
  sacerdotisa: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#854d0e" />
          <stop offset="55%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#08071a" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff8f2" />
          <stop offset="55%" stopColor="#f5d2be" />
          <stop offset="100%" stopColor="#c49078" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="100" r="92" fill="#fef08a" opacity="0.22" />
      <g className="hero-alive">
        {/* Sacred Temporal Wheel Halo */}
        <circle cx="100" cy="92" r="56" fill="none" stroke="#fde047" strokeWidth="3" strokeDasharray="10 6" opacity="0.88" />
        <circle cx="100" cy="92" r="44" fill="none" stroke="#fffbeb" strokeWidth="1.5" opacity="0.6" />
        {/* Silk Veil & Golden Hair */}
        <path d="M44 106 C32 156 32 204 42 240 L158 240 C168 204 168 156 156 106 C144 64 56 64 44 106 Z" fill="#fef9c3" opacity="0.72" stroke="#eab308" strokeWidth="2" />
        {/* Vestments */}
        <path d="M40 242 C44 186 64 160 100 160 C136 160 156 186 160 242 Z" fill="#fffbeb" stroke="#090d16" strokeWidth="2.4" />
        <path d="M74 164 L100 220 L126 164 Z" fill="#eab308" stroke="#090d16" strokeWidth="2" />
        <circle cx="100" cy="186" r="6.5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
        {/* Delicate Face */}
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105.5" r="4.8" fill="#facc15" />
          <circle cx="86" cy="105" r="2.2" fill="#090d16" />
          <circle cx="84" cy="102.5" r="2" fill="#fff" />
          <ellipse cx="114" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105.5" r="4.8" fill="#facc15" />
          <circle cx="114" cy="105" r="2.2" fill="#090d16" />
          <circle cx="112" cy="102.5" r="2" fill="#fff" />
        </g>
        <path d="M95 130 Q100 134 105 130" fill="none" stroke="#9d4e4e" strokeWidth="1.8" />
        {/* Hair & Tiara */}
        <path d="M64 98 C64 62 82 48 100 48 C118 48 136 62 136 98 C122 80 110 74 100 90 C90 74 78 80 64 98 Z" fill="#fef08a" stroke="#090d16" strokeWidth="2.2" />
        <path d="M70 76 Q100 60 130 76" fill="none" stroke="#facc15" strokeWidth="3.5" />
        <circle cx="100" cy="66" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
        {/* Sun Staff */}
        <line x1="164" y1="116" x2="154" y2="240" stroke="#eab308" strokeWidth="5.5" />
        <circle cx="164" cy="106" r="11" fill="#fff" stroke="#facc15" strokeWidth="3.5" />
      </g>
      <g className="hero-fx-float">
        <circle cx="30" cy="56" r="3.5" fill="#fef08a" />
        <circle cx="174" cy="164" r="3" fill="#38bdf8" />
      </g>
    </>
  ),

  // 30. Vampira: high-craft comic-anime crimson countess with gothic castle spires, blood moon, silver-platinum layered hair, winged ruby eyes, ornate gold-velvet collar & glowing crimson orb
  vampira: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#3b0724" />
          <stop offset="42%" stopColor="#1b061d" />
          <stop offset="100%" stopColor="#07030d" />
        </linearGradient>
        <radialGradient id={`${g}_moon`} cx="50%" cy="30%" r="48%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="28%" stopColor="#fb7185" />
          <stop offset="56%" stopColor="#be123c" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${g}_sk`} cx="46%" cy="36%" r="64%">
          <stop offset="0%" stopColor="#fff8fa" />
          <stop offset="58%" stopColor="#f6dfe7" />
          <stop offset="100%" stopColor="#cba6b8" />
        </radialGradient>
        <linearGradient id={`${g}_hair`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#f1f5f9" />
          <stop offset="68%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={`${g}_hairSh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#3b1d47" />
        </linearGradient>
        <linearGradient id={`${g}_velvet`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="55%" stopColor="#881337" />
          <stop offset="100%" stopColor="#3b0518" />
        </linearGradient>
        <linearGradient id={`${g}_coat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#280b24" />
          <stop offset="55%" stopColor="#120516" />
          <stop offset="100%" stopColor="#050208" />
        </linearGradient>
        <linearGradient id={`${g}_gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <radialGradient id={`${g}_orb`} cx="38%" cy="34%" r="62%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="38%" stopColor="#fb7185" />
          <stop offset="76%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
      </defs>
      {/* Night sky & giant radiant blood moon */}
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="74" r="94" fill={`url(#${g}_moon)`} />
      <circle cx="100" cy="72" r="46" fill="#fda4af" opacity="0.32" />
      {/* Gothic cathedral / castle spires in background */}
      <g fill="#120415" opacity="0.72">
        <path d="M0 240 V120 L14 82 L28 120 V240 Z" />
        <path d="M168 240 V116 L184 74 L200 116 V240 Z" />
        <path d="M26 240 V142 L38 118 L50 142 V240 Z" />
        <path d="M150 240 V144 L162 122 L174 144 V240 Z" />
      </g>
      {/* Atmospheric night mist */}
      <ellipse cx="100" cy="215" rx="115" ry="38" fill="#881337" opacity="0.22" />

      <g className="hero-alive">
        {/* Flowing back silver-platinum hair with cel-shaded depth */}
        <path
          d="M36 94 C16 144 18 198 28 244 L172 244 C182 198 184 144 164 94 C150 44 50 44 36 94 Z"
          fill={`url(#${g}_hairSh)`}
          stroke="#09040e"
          strokeWidth="2.8"
        />
        <path
          d="M42 92 C28 142 30 192 40 242 L160 242 C170 192 172 142 158 92 C144 48 56 48 42 92 Z"
          fill={`url(#${g}_hair)`}
          stroke="#09040e"
          strokeWidth="2.2"
        />
        {/* High flared aristocratic vampire cape collar with gold trim */}
        <path
          d="M28 244 L18 134 L66 154 L100 184 L134 154 L182 134 L172 244 Z"
          fill={`url(#${g}_coat)`}
          stroke="#09040e"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M24 140 L64 158 L100 190 L136 158 L176 140 L164 244 H36 Z"
          fill={`url(#${g}_velvet)`}
          stroke={`url(#${g}_gold)`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Sculpted Gothic Bodice & Shoulder Frills */}
        <path
          d="M44 244 C48 186 64 162 100 162 C136 162 152 186 156 244 Z"
          fill={`url(#${g}_coat)`}
          stroke="#09040e"
          strokeWidth="2.6"
        />
        {/* Crimson corset lacing & ornate gold filigree */}
        <path d="M74 176 L100 226 L126 176 L116 166 H84 Z" fill="#4c0519" stroke={`url(#${g}_gold)`} strokeWidth="2.1" />
        <path d="M84 190 L116 202 M116 190 L84 202 M88 206 L112 216 M112 206 L88 216" stroke="#facc15" strokeWidth="1.5" opacity="0.9" />
        {/* Ornate Ruby Brooch */}
        <polygon points="100,168 110,181 100,195 90,181" fill="#e11d48" stroke={`url(#${g}_gold)`} strokeWidth="2.2" />
        <polygon points="100,172 105,181 100,189 95,181" fill="#fda4af" opacity="0.65" />
        <circle cx="97" cy="177" r="1.8" fill="#ffffff" />

        {/* Neck, shadow & gothic lace choker */}
        <path d="M90 136 H110 V165 C106 170 94 170 90 165 Z" fill={`url(#${g}_sk)`} stroke="#09040e" strokeWidth="2" />
        <path d="M90 136 Q100 148 110 136 V146 Q100 153 90 146 Z" fill="#b98a9e" opacity="0.65" />
        <rect x="88" y="148" width="24" height="6.5" rx="2" fill="#180412" stroke={`url(#${g}_gold)`} strokeWidth="1.2" />
        <circle cx="100" cy="151.5" r="2.6" fill="#e11d48" stroke="#fef08a" strokeWidth="0.9" />

        {/* Pointed Aristocratic Ears */}
        <path d="M68 100 L56 94 L66 112 Z" fill={`url(#${g}_sk)`} stroke="#09040e" strokeWidth="2" />
        <path d="M132 100 L144 94 L134 112 Z" fill={`url(#${g}_sk)`} stroke="#09040e" strokeWidth="2" />

        {/* Anime Face Contour with Chin & Soft Cel Shadow */}
        <path
          d="M67 88 C67 58 133 58 133 88 C133 114 122 134 108 142 C103 145 97 145 92 142 C78 134 67 114 67 88 Z"
          fill={`url(#${g}_sk)`}
          stroke="#09040e"
          strokeWidth="2.5"
        />
        {/* Soft Rose Cheek Blush */}
        <ellipse cx="78" cy="116" rx="6.5" ry="3.2" fill="#fb7185" opacity="0.28" />
        <ellipse cx="122" cy="116" rx="6.5" ry="3.2" fill="#fb7185" opacity="0.28" />
        {/* Delicate Anime Nose */}
        <path d="M100 111 L98.5 117 L101 118" fill="none" stroke="#9e6d82" strokeWidth="1.4" strokeLinecap="round" />

        {/* Detailed Winged Crimson Anime Eyes */}
        <g className="hero-blink">
          {/* Left Eye */}
          <path d="M72 99 C78 93 90 93 95 101" fill="none" stroke="#09040e" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M74 101 C78 96 89 96 93 102 C92 109 88 112 83 112 C77 112 74 107 74 101 Z" fill="#ffffff" stroke="#09040e" strokeWidth="1.5" />
          <ellipse cx="84.5" cy="104.5" rx="5.6" ry="6.2" fill="#9f1239" />
          <ellipse cx="84.5" cy="105.5" rx="4.2" ry="4.8" fill="#f43f5e" />
          <ellipse cx="84.5" cy="104.2" rx="2.3" ry="2.8" fill="#18020b" />
          <circle cx="82" cy="101.5" r="2.2" fill="#ffffff" />
          <circle cx="87.2" cy="107.4" r="1.2" fill="#ffe4e6" />
          {/* Right Eye */}
          <path d="M128 99 C122 93 110 93 105 101" fill="none" stroke="#09040e" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M126 101 C122 96 111 96 107 102 C108 109 112 112 117 112 C123 112 126 107 126 101 Z" fill="#ffffff" stroke="#09040e" strokeWidth="1.5" />
          <ellipse cx="115.5" cy="104.5" rx="5.6" ry="6.2" fill="#9f1239" />
          <ellipse cx="115.5" cy="105.5" rx="4.2" ry="4.8" fill="#f43f5e" />
          <ellipse cx="115.5" cy="104.2" rx="2.3" ry="2.8" fill="#18020b" />
          <circle cx="113" cy="101.5" r="2.2" fill="#ffffff" />
          <circle cx="118.2" cy="107.4" r="1.2" fill="#ffe4e6" />
          {/* Fine Eyebrows */}
          <path d="M74 91 Q84 87 93 92" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <path d="M126 91 Q116 87 107 92" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Confident Vampire Smirk with Tiny Fang */}
        <path d="M91 128 Q100 134 110 127" fill="none" stroke="#881337" strokeWidth="2.1" strokeLinecap="round" />
        <polygon points="104,129 106.4,134.5 108.5,128.4" fill="#ffffff" stroke="#09040e" strokeWidth="0.7" />

        {/* Layered Front Silver Bangs + Side Framing Locks + Specular Halo */}
        <path
          d="M56 102 C56 54 78 38 100 38 C122 38 144 54 144 102 C136 82 128 74 119 94 C114 74 106 70 100 94 C94 70 86 74 81 94 C72 74 64 82 56 102 Z"
          fill={`url(#${g}_hair)`}
          stroke="#09040e"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Side cascading locks */}
        <path d="M62 84 C52 114 50 152 60 184 C65 162 66 130 70 102 Z" fill={`url(#${g}_hair)`} stroke="#09040e" strokeWidth="2.2" />
        <path d="M138 84 C148 114 150 152 140 184 C135 162 134 130 130 102 Z" fill={`url(#${g}_hair)`} stroke="#09040e" strokeWidth="2.2" />
        {/* Anime hair specular gleam */}
        <path d="M72 64 Q100 50 128 64" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />

        {/* Ornate Gothic Gold & Ruby Tiara */}
        <path
          d="M70 62 L81 42 L91 55 L100 30 L109 55 L119 42 L130 62 Q100 54 70 62 Z"
          fill={`url(#${g}_gold)`}
          stroke="#09040e"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polygon points="100,40 105,50 100,58 95,50" fill="#e11d48" stroke="#fff1f2" strokeWidth="1" />

        {/* Glowing Crimson Support Orb floating in foreground */}
        <circle cx="164" cy="186" r="22" fill="#e11d48" opacity="0.28" />
        <circle cx="164" cy="186" r="13" fill={`url(#${g}_orb)`} stroke="#fda4af" strokeWidth="1.8" />
        <ellipse cx="160" cy="181" rx="3.2" ry="2" transform="rotate(-30 160 181)" fill="#ffffff" opacity="0.85" />
      </g>

      {/* Dynamic Crimson Bat Silhouettes & Glowing Embers */}
      <g className="hero-fx-float">
        <path d="M16 58 Q28 44 40 56 Q33 62 28 57 Q22 63 16 58 Z" fill="#180412" stroke="#fb7185" strokeWidth="1.2" />
        <path d="M156 48 Q170 34 184 48 Q176 54 170 49 Q163 55 156 48 Z" fill="#180412" stroke="#fb7185" strokeWidth="1.2" />
        <circle cx="24" cy="126" r="3.2" fill="#fda4af" opacity="0.9" />
        <circle cx="176" cy="120" r="2.8" fill="#fb7185" opacity="0.85" />
        <circle cx="34" cy="176" r="2.2" fill="#fef08a" opacity="0.8" />
      </g>
    </>
  ),

  // 31. Sirena: high-craft comic-anime ocean siren healer with sunlit reef rays, flowing iridescent aqua hair, coral-pearl tiara, scale corset & radiant pearl trident
  sirena: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="46%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#031326" />
        </linearGradient>
        <radialGradient id={`${g}_sun`} cx="50%" cy="18%" r="64%">
          <stop offset="0%" stopColor="#ecfeff" stopOpacity="0.82" />
          <stop offset="42%" stopColor="#38bdf8" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#031326" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${g}_sk`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff9f6" />
          <stop offset="56%" stopColor="#f6d8cd" />
          <stop offset="100%" stopColor="#c59488" />
        </radialGradient>
        <linearGradient id={`${g}_hair`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="72%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id={`${g}_hairDark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id={`${g}_gown`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id={`${g}_gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id={`${g}_pearl`} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#cffafe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </radialGradient>
      </defs>
      {/* Sunlit ocean sanctuary & diagonal volumetric god-rays */}
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="72" r="102" fill={`url(#${g}_sun)`} />
      <g fill="#e0f2fe" opacity="0.16">
        <polygon points="18,0 56,0 92,240 44,240" />
        <polygon points="82,0 116,0 138,240 100,240" />
        <polygon points="142,0 178,0 198,240 156,240" />
      </g>
      {/* Coral reef silhouettes at bottom */}
      <path d="M0 240 V190 C10 182 20 194 26 206 C32 192 42 194 46 240 Z" fill="#083344" opacity="0.7" />
      <path d="M156 240 C162 198 174 186 184 198 C190 184 196 188 200 198 V240 Z" fill="#083344" opacity="0.7" />

      <g className="hero-alive">
        {/* Back billowing ocean-wave hair */}
        <path
          d="M32 96 C12 146 16 200 26 244 L174 244 C184 200 188 146 168 96 C152 44 48 44 32 96 Z"
          fill={`url(#${g}_hairDark)`}
          stroke="#061729"
          strokeWidth="2.8"
        />
        <path
          d="M40 94 C24 146 28 196 38 242 L162 242 C172 196 176 146 160 94 C146 48 54 48 40 94 Z"
          fill={`url(#${g}_hair)`}
          stroke="#061729"
          strokeWidth="2.2"
        />

        {/* Iridescent Fin Ears with Gold Ear-Pearls */}
        <path d="M66 98 C44 84 34 98 48 112 C56 116 62 114 67 110 Z" fill="#67e8f9" stroke="#061729" strokeWidth="2.1" />
        <path d="M134 98 C156 84 166 98 152 112 C144 116 138 114 133 110 Z" fill="#67e8f9" stroke="#061729" strokeWidth="2.1" />
        <path d="M62 103 L46 98 M62 108 L48 108" stroke="#ecfeff" strokeWidth="1.2" opacity="0.8" />
        <path d="M138 103 L154 98 M138 108 L152 108" stroke="#ecfeff" strokeWidth="1.2" opacity="0.8" />

        {/* Iridescent Scale Bodice & Flowing Silk Shawl */}
        <path
          d="M36 244 C40 184 62 158 100 158 C138 158 160 184 164 244 Z"
          fill={`url(#${g}_gown)`}
          stroke="#061729"
          strokeWidth="2.8"
        />
        {/* Translucent Flowing Water Sash */}
        <path
          d="M42 190 Q100 226 158 190 L164 218 Q100 246 36 218 Z"
          fill="#a5f3fc"
          opacity="0.34"
          stroke="#ecfeff"
          strokeWidth="1.2"
        />
        {/* Golden Seashell Chestplate Detail & Pearl Strand */}
        <path d="M68 174 Q84 164 100 180 Q116 164 132 174 L126 208 Q100 220 74 208 Z" fill="#0369a1" stroke={`url(#${g}_gold)`} strokeWidth="2" />
        <path d="M70 164 Q100 184 130 164" fill="none" stroke="#fef9c3" strokeWidth="3.2" strokeDasharray="3.5 4.2" strokeLinecap="round" />
        <circle cx="100" cy="182" r="8.5" fill={`url(#${g}_pearl)`} stroke={`url(#${g}_gold)`} strokeWidth="2.2" />

        {/* Neck & Face */}
        <path d="M90 136 H110 V164 C105 168 95 168 90 164 Z" fill={`url(#${g}_sk)`} stroke="#061729" strokeWidth="2" />
        <path
          d="M68 88 C68 58 132 58 132 88 C132 115 121 134 108 142 C103 145 97 145 92 142 C79 134 68 115 68 88 Z"
          fill={`url(#${g}_sk)`}
          stroke="#061729"
          strokeWidth="2.4"
        />
        <ellipse cx="78" cy="116" rx="6" ry="3" fill="#fb7185" opacity="0.25" />
        <ellipse cx="122" cy="116" rx="6" ry="3" fill="#fb7185" opacity="0.25" />
        <path d="M100 111 L99 116.5 L101 117.5" fill="none" stroke="#a6736a" strokeWidth="1.3" strokeLinecap="round" />

        {/* Expressive Luminous Sea-Glass Anime Eyes */}
        <g className="hero-blink">
          {/* Left Eye */}
          <path d="M73 99 C79 93 90 93 95 101" fill="none" stroke="#061729" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M75 101 C79 96 90 96 94 102 C93 110 89 113 84 113 C78 113 75 108 75 101 Z" fill="#ffffff" stroke="#061729" strokeWidth="1.5" />
          <ellipse cx="85" cy="105" rx="5.8" ry="6.4" fill="#0369a1" />
          <ellipse cx="85" cy="106.5" rx="4.5" ry="4.8" fill="#22d3ee" />
          <ellipse cx="85" cy="104.5" rx="2.2" ry="2.6" fill="#042f2e" />
          <circle cx="82.5" cy="101.8" r="2.3" fill="#ffffff" />
          <circle cx="87.8" cy="108" r="1.2" fill="#cffafe" />
          {/* Right Eye */}
          <path d="M127 99 C121 93 110 93 105 101" fill="none" stroke="#061729" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M125 101 C121 96 110 96 106 102 C107 110 111 113 116 113 C122 113 125 108 125 101 Z" fill="#ffffff" stroke="#061729" strokeWidth="1.5" />
          <ellipse cx="115" cy="105" rx="5.8" ry="6.4" fill="#0369a1" />
          <ellipse cx="115" cy="106.5" rx="4.5" ry="4.8" fill="#22d3ee" />
          <ellipse cx="115" cy="104.5" rx="2.2" ry="2.6" fill="#042f2e" />
          <circle cx="112.5" cy="101.8" r="2.3" fill="#ffffff" />
          <circle cx="117.8" cy="108" r="1.2" fill="#cffafe" />
          <path d="M75 91 Q84 88 93 92" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M125 91 Q116 88 107 92" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Gentle Serene Smile */}
        <path d="M93 128 Q100 134 107 128" fill="none" stroke="#b96d6d" strokeWidth="2" strokeLinecap="round" />

        {/* Layered Front Aqua Bangs + Framing Locks + Pearl Sheen */}
        <path
          d="M57 100 C57 54 78 39 100 39 C122 39 143 54 143 100 C134 80 124 72 116 90 C110 72 104 70 100 91 C96 70 90 72 84 90 C76 72 66 80 57 100 Z"
          fill={`url(#${g}_hair)`}
          stroke="#061729"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M62 86 C52 118 52 156 62 190 C68 164 68 130 70 102 Z" fill={`url(#${g}_hair)`} stroke="#061729" strokeWidth="2.1" />
        <path d="M138 86 C148 118 148 156 138 190 C132 164 132 130 130 102 Z" fill={`url(#${g}_hair)`} stroke="#061729" strokeWidth="2.1" />
        <path d="M72 63 Q100 50 128 63" fill="none" stroke="#ecfeff" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />

        {/* Ornate Golden Coral & Seashell Tiara */}
        <path
          d="M72 68 Q100 46 128 68 L119 76 Q100 64 81 76 Z"
          fill={`url(#${g}_gold)`}
          stroke="#061729"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="58" r="7.5" fill={`url(#${g}_pearl)`} stroke={`url(#${g}_gold)`} strokeWidth="2" />
        <circle cx="83" cy="65" r="3.8" fill="#fb7185" stroke="#fff" strokeWidth="1" />
        <circle cx="117" cy="65" r="3.8" fill="#fb7185" stroke="#fff" strokeWidth="1" />

        {/* Radiant Golden Pearl Trident-Staff */}
        <line x1="168" y1="108" x2="156" y2="244" stroke={`url(#${g}_gold)`} strokeWidth="5.8" strokeLinecap="round" />
        <path
          d="M150 92 C152 108 168 114 168 114 C168 114 184 108 186 92"
          fill="none"
          stroke={`url(#${g}_gold)`}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <polygon points="150,80 146,96 154,96" fill="#fef08a" stroke="#061729" strokeWidth="1.5" />
        <polygon points="186,80 182,96 190,96" fill="#fef08a" stroke="#061729" strokeWidth="1.5" />
        <circle cx="168" cy="96" r="10.5" fill={`url(#${g}_pearl)`} stroke="#38bdf8" strokeWidth="2.4" />
      </g>

      {/* Bioluminescent Bubbles & Healing Water Ribbons */}
      <g className="hero-fx-float">
        <path d="M12 162 Q40 146 56 170" fill="none" stroke="#67e8f9" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
        <circle cx="24" cy="62" r="5.5" fill="#cffafe" opacity="0.58" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="34" cy="136" r="3.8" fill="#67e8f9" opacity="0.78" />
        <circle cx="182" cy="60" r="4.2" fill="#a5f3fc" opacity="0.7" stroke="#ffffff" strokeWidth="1" />
        <circle cx="28" cy="196" r="3" fill="#ecfeff" opacity="0.75" />
      </g>
    </>
  ),

  // 32. Esqueleto: high-craft comic-anime crypt vanguard warrior with sculpted cel-shaded skull, blazing emerald soul-fire eyes, cracked bronze-gold helm, rune blade & round battle shield
  esqueleto: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#1a2634" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#050811" />
        </linearGradient>
        <radialGradient id={`${g}_soul`} cx="50%" cy="42%" r="54%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.46" />
          <stop offset="55%" stopColor="#047857" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#050811" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}_bone`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="50%" stopColor="#e7e2d5" />
          <stop offset="100%" stopColor="#9c9282" />
        </linearGradient>
        <linearGradient id={`${g}_helm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="45%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#3b1806" />
        </linearGradient>
        <linearGradient id={`${g}_steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="48%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id={`${g}_cloak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a2f" />
          <stop offset="100%" stopColor="#07130f" />
        </linearGradient>
      </defs>
      {/* Crypt Stone Archway & Spectral Emerald Glow */}
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <path d="M16 240 V96 C16 32 184 32 184 96 V240 Z" fill="#09101e" stroke="#1e293b" strokeWidth="4" />
      <circle cx="100" cy="108" r="94" fill={`url(#${g}_soul)`} />

      <g className="hero-alive">
        {/* Tattered Crypt Mantle */}
        <path
          d="M20 244 L36 154 L100 140 L164 154 L180 244 Z"
          fill={`url(#${g}_cloak)`}
          stroke="#07090f"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Dark Ribcage Torso with Sculpted Ivory Ribs & Leather Cross-Belt */}
        <path
          d="M50 244 C54 184 70 158 100 158 C130 158 146 184 150 244 Z"
          fill="#0b1120"
          stroke="#07090f"
          strokeWidth="2.8"
        />
        <g stroke={`url(#${g}_bone)`} strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M72 174 Q100 184 128 174" />
          <path d="M74 192 Q100 202 126 192" />
          <path d="M78 210 Q100 218 122 210" />
          <path d="M84 226 Q100 232 116 226" />
          <line x1="100" y1="156" x2="100" y2="236" strokeWidth="6.5" />
        </g>
        {/* Diagonal Leather Strap & Bronze Buckle */}
        <path d="M62 162 L138 232" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
        <path d="M62 162 L138 232" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 6" />
        <rect x="93" y="190" width="14" height="14" rx="2" fill="#f59e0b" stroke="#07090f" strokeWidth="2" />

        {/* Layered Spiked Bronze Shoulder Pauldrons */}
        <path
          d="M28 184 C34 150 64 144 82 162 L72 188 Z"
          fill={`url(#${g}_helm)`}
          stroke="#07090f"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M36 176 L72 164" stroke="#fef08a" strokeWidth="1.8" opacity="0.7" />
        <path
          d="M172 184 C166 150 136 144 118 162 L128 188 Z"
          fill={`url(#${g}_helm)`}
          stroke="#07090f"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M164 176 L128 164" stroke="#fef08a" strokeWidth="1.8" opacity="0.7" />

        {/* Cervical Spine Neck */}
        <rect x="92" y="144" width="16" height="18" rx="3" fill={`url(#${g}_bone)`} stroke="#07090f" strokeWidth="2" />
        <line x1="93" y1="150" x2="107" y2="150" stroke="#78716c" strokeWidth="1.8" />
        <line x1="93" y1="156" x2="107" y2="156" stroke="#78716c" strokeWidth="1.8" />

        {/* Sculpted Comic-Anime Skull with Cheekbones & Jaw */}
        <path
          d="M66 94 C66 58 134 58 134 94 C134 110 128 120 121 126 L118 148 C109 154 91 154 82 148 L79 126 C72 120 66 110 66 94 Z"
          fill={`url(#${g}_bone)`}
          stroke="#07090f"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Zygomatic Cheek Shading */}
        <path d="M72 114 Q82 124 88 120 M128 114 Q118 124 112 120" fill="none" stroke="#a8a29e" strokeWidth="2.2" strokeLinecap="round" />
        {/* Clenched Jaw & Sharp Teeth */}
        <rect x="83" y="133" width="34" height="15" rx="3" fill="#fefce8" stroke="#1c1917" strokeWidth="2" />
        <g stroke="#1c1917" strokeWidth="1.9">
          <line x1="89" y1="133" x2="89" y2="148" />
          <line x1="96" y1="133" x2="96" y2="148" />
          <line x1="104" y1="133" x2="104" y2="148" />
          <line x1="111" y1="133" x2="111" y2="148" />
          <line x1="83" y1="140.5" x2="117" y2="140.5" />
        </g>
        {/* Nasal Cavity */}
        <path d="M100 112 L94.5 126 L100 124 L105.5 126 Z" fill="#0f172a" />

        {/* Deep Shadowed Eye Sockets with Blazing Emerald-Gold Soul Fire */}
        <path d="M73 99 C76 91 90 92 94 102 C92 112 78 114 73 99 Z" fill="#07090f" />
        <path d="M127 99 C124 91 110 92 106 102 C108 112 122 114 127 99 Z" fill="#07090f" />
        <g className="hero-blink">
          <circle cx="84" cy="102" r="5.5" fill="#10b981" opacity="0.5" />
          <circle cx="84" cy="102" r="3.4" fill="#4ade80" />
          <circle cx="84" cy="102" r="1.6" fill="#fef08a" />
          <circle cx="116" cy="102" r="5.5" fill="#10b981" opacity="0.5" />
          <circle cx="116" cy="102" r="3.4" fill="#4ade80" />
          <circle cx="116" cy="102" r="1.6" fill="#fef08a" />
        </g>

        {/* Battle-Worn Ornate Bronze & Gold Nasal Helm */}
        <path
          d="M58 88 C58 40 142 40 142 88 C126 78 112 76 104 82 L100 104 L96 82 C88 76 74 78 58 88 Z"
          fill={`url(#${g}_helm)`}
          stroke="#07090f"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Golden Central Crest & Rivets */}
        <path d="M100 44 V96" stroke="#fde047" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M64 80 Q100 68 136 80" fill="none" stroke="#fbbf24" strokeWidth="2.4" />
        <path d="M74 56 L84 68 L80 77" fill="none" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="72" cy="77" r="2" fill="#fef08a" />
        <circle cx="128" cy="77" r="2" fill="#fef08a" />

        {/* Rune-Etched Broadsword held on right */}
        <polygon points="168,72 178,88 166,242 154,242" fill={`url(#${g}_steel)`} stroke="#07090f" strokeWidth="2.6" strokeLinejoin="round" />
        <line x1="168" y1="86" x2="160" y2="206" stroke="#34d399" strokeWidth="2" opacity="0.85" />
        <rect x="142" y="196" width="38" height="8" rx="2.5" fill={`url(#${g}_helm)`} stroke="#07090f" strokeWidth="2.2" />

        {/* Studded Ancient Round Battle Shield on left */}
        <ellipse cx="34" cy="208" rx="26" ry="34" fill={`url(#${g}_helm)`} stroke="#fbbf24" strokeWidth="3.2" />
        <ellipse cx="34" cy="208" rx="19" ry="26" fill="#451a03" stroke="#07090f" strokeWidth="1.8" />
        <circle cx="34" cy="208" r="8" fill={`url(#${g}_steel)`} stroke="#07090f" strokeWidth="2" />
        <circle cx="34" cy="186" r="2" fill="#fef08a" />
        <circle cx="34" cy="230" r="2" fill="#fef08a" />
        <circle cx="18" cy="208" r="2" fill="#fef08a" />
        <circle cx="50" cy="208" r="2" fill="#fef08a" />
      </g>

      {/* Spectral Crypt Wisps & Floating Embers */}
      <g className="hero-fx-float">
        <circle cx="24" cy="68" r="4" fill="#4ade80" opacity="0.85" />
        <circle cx="178" cy="126" r="3.4" fill="#86efac" opacity="0.8" />
        <circle cx="38" cy="128" r="2.4" fill="#fef08a" opacity="0.75" />
      </g>
    </>
  ),
};
