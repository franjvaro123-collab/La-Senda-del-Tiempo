import React from 'react';

export type PortraitRenderer = (g: string) => React.ReactNode;

export const PORTRAITS_PART_1: Record<string, PortraitRenderer> = {
  // 1. Aprendiz de guardia: earnest young bronze-era squire with dented pot helm, iron pauldrons, banded tunic & wooden-shafted steel spear
  aprendiz: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#060913" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="36%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fff5eb" />
          <stop offset="45%" stopColor="#f5c6a5" />
          <stop offset="100%" stopColor="#b87651" />
        </radialGradient>
        <linearGradient id={`${g}_arm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="90" fill="#60a5fa" opacity="0.16" />
      <path d="M18 190 L55 155 M182 55 L145 90" stroke="#93c5fd" strokeOpacity="0.25" strokeWidth="2" />
      <g className="hero-alive">
        {/* Spear held diagonally */}
        <line x1="166" y1="36" x2="144" y2="240" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <polygon points="166,14 156,48 166,43 176,48" fill="#e2e8f0" stroke="#090d16" strokeWidth="2" />
        <polygon points="166,14 166,43 176,48" fill="#94a3b8" />
        {/* Guard Tunic & Leather Straps */}
        <path d="M36 242 C40 188 64 164 100 162 C136 164 160 188 164 242 Z" fill="#2563eb" stroke="#090d16" strokeWidth="2.5" />
        <path d="M68 164 L100 238 L132 164" fill="#1d4ed8" stroke="#090d16" strokeWidth="1.8" />
        <path d="M54 174 L144 218 M146 174 L56 218" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        <circle cx="100" cy="196" r="7" fill="#facc15" stroke="#090d16" strokeWidth="1.8" />
        {/* Single iron shoulder pauldron */}
        <path d="M36 196 C40 164 68 156 80 174 L60 198 Z" fill={`url(#${g}_arm)`} stroke="#090d16" strokeWidth="2.2" />
        {/* Neck & Head */}
        <rect x="89" y="142" width="22" height="24" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M69 92 C69 66 131 66 131 92 C131 122 117 146 100 148 C83 146 69 122 69 92 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        {/* Bandage on cheek */}
        <rect x="108" y="114" width="14" height="6" rx="2" transform="rotate(-12 108 114)" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        {/* Big determined eyes */}
        <g className="hero-blink">
          <ellipse cx="86" cy="107" rx="8" ry="7" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="87" cy="107" r="4.8" fill="#0284c7" />
          <circle cx="87" cy="107" r="2.3" fill="#090d16" />
          <circle cx="85" cy="104.5" r="2" fill="#fff" />
          <ellipse cx="114" cy="107" rx="8" ry="7" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="113" cy="107" r="4.8" fill="#0284c7" />
          <circle cx="113" cy="107" r="2.3" fill="#090d16" />
          <circle cx="111" cy="104.5" r="2" fill="#fff" />
        </g>
        <path d="M77 97 L94 100 M123 97 L106 100" stroke="#090d16" strokeWidth="3" strokeLinecap="round" />
        <path d="M94 131 Q100 135 107 130" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
        {/* Messy brown fringe under open helmet */}
        <path d="M66 96 L78 82 L88 94 L98 78 L110 95 L122 80 L134 96 C126 70 74 70 66 96 Z" fill="#78350f" stroke="#090d16" strokeWidth="2" />
        {/* Steel Recruit Kettle Helm with brass ridge */}
        <path d="M60 88 C62 46 138 46 140 88 L148 94 L52 94 Z" fill={`url(#${g}_arm)`} stroke="#090d16" strokeWidth="2.4" />
        <rect x="96" y="54" width="8" height="36" rx="3" fill="#eab308" stroke="#090d16" strokeWidth="1.5" />
      </g>
      <g className="hero-fx-float">
        <circle cx="32" cy="64" r="3" fill="#60a5fa" />
        <circle cx="174" cy="176" r="3.5" fill="#facc15" opacity="0.8" />
      </g>
    </>
  ),

  // 2. Doncella: gentle temple maiden with flowing blonde twin braids, white & sapphire lace gown, flower hairpin, glowing water chalice
  doncella: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="60%" stopColor="#0f294a" />
          <stop offset="100%" stopColor="#071022" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff7f0" />
          <stop offset="50%" stopColor="#ffdfc8" />
          <stop offset="100%" stopColor="#d4967a" />
        </radialGradient>
        <linearGradient id={`${g}_hr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="100" r="88" fill="#67e8f9" opacity="0.18" />
      <circle cx="100" cy="96" r="62" fill="none" stroke="#bae6fd" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 6" />
      <g className="hero-alive">
        {/* Twin thick braided pigtails */}
        <path d="M62 110 C48 140 48 178 56 218 L70 218 C66 182 68 144 74 118 Z" fill={`url(#${g}_hr)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M138 110 C152 140 152 178 144 218 L130 218 C134 182 132 144 126 118 Z" fill={`url(#${g}_hr)`} stroke="#090d16" strokeWidth="2.2" />
        <circle cx="62" cy="166" r="4" fill="#38bdf8" />
        <circle cx="138" cy="166" r="4" fill="#38bdf8" />
        {/* Maiden Dress + White Lace Capelet */}
        <path d="M36 242 C42 184 62 162 100 162 C138 162 158 184 164 242 Z" fill="#1d4ed8" stroke="#090d16" strokeWidth="2.4" />
        <path d="M46 186 Q72 204 100 186 Q128 204 154 186 L134 158 H66 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2" />
        <path d="M84 176 L100 198 L116 176" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        {/* Neck & Soft Rounded Face */}
        <rect x="91" y="140" width="18" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M69 92 C69 64 131 64 131 92 C131 120 116 144 100 146 C84 144 69 120 69 92 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <ellipse cx="81" cy="117" rx="6" ry="3" fill="#fb7185" opacity="0.3" />
        <ellipse cx="119" cy="117" rx="6" ry="3" fill="#fb7185" opacity="0.3" />
        {/* Sparkly Cyan Eyes */}
        <g className="hero-blink">
          <ellipse cx="86" cy="107" rx="8.5" ry="8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <ellipse cx="86.5" cy="107.5" rx="5.5" ry="6.5" fill="#06b6d4" />
          <circle cx="86.5" cy="107" r="2.6" fill="#090d16" />
          <circle cx="84.5" cy="104" r="2.2" fill="#fff" />
          <circle cx="88.5" cy="110" r="1.2" fill="#fef08a" />
          <ellipse cx="114" cy="107" rx="8.5" ry="8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <ellipse cx="113.5" cy="107.5" rx="5.5" ry="6.5" fill="#06b6d4" />
          <circle cx="113.5" cy="107" r="2.6" fill="#090d16" />
          <circle cx="111.5" cy="104" r="2.2" fill="#fff" />
          <circle cx="115.5" cy="110" r="1.2" fill="#fef08a" />
        </g>
        <path d="M77 96 Q86 92 94 96 M106 96 Q114 92 123 96" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        <path d="M95 129 Q100 134 105 129" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
        {/* Parted Golden Hair + White Lace Headband */}
        <path d="M64 104 C62 66 80 48 100 48 C120 48 138 66 136 104 C124 84 110 74 100 88 C90 74 76 84 64 104 Z" fill={`url(#${g}_hr)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M66 80 Q100 58 134 80 L130 70 Q100 48 70 70 Z" fill="#ffffff" stroke="#090d16" strokeWidth="2" />
        <circle cx="70" cy="82" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
        {/* Radiant Golden Chalice */}
        <path d="M142 184 H172 L164 206 H150 Z" fill="#fde047" stroke="#090d16" strokeWidth="2" />
        <rect x="155" y="206" width="4" height="16" fill="#eab308" stroke="#090d16" strokeWidth="1.5" />
        <ellipse cx="157" cy="224" rx="12" ry="4" fill="#fde047" stroke="#090d16" strokeWidth="1.8" />
        <circle cx="157" cy="176" r="9" fill="#67e8f9" opacity="0.65" />
      </g>
      <g className="hero-fx-float">
        <circle cx="157" cy="164" r="3" fill="#fff" />
        <circle cx="34" cy="94" r="3.5" fill="#67e8f9" opacity="0.8" />
      </g>
    </>
  ),

  // 3. Duende: crouched green-skinned goblin rogue with huge pointed ears, hooked nose, jagged grin & poison-tipped twin daggers
  duende: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="65%" stopColor="#052e16" />
          <stop offset="100%" stopColor="#021109" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="42%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="50%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#3f6212" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="126" r="84" fill="#4ade80" opacity="0.16" />
      <g className="hero-alive">
        {/* Tattered Hooded Cloak */}
        <path d="M28 242 C32 184 56 156 100 156 C144 156 168 184 172 242 Z" fill="#292524" stroke="#090d16" strokeWidth="2.5" />
        <path d="M52 170 L100 220 L148 170 L132 242 H68 Z" fill="#78350f" stroke="#090d16" strokeWidth="2" />
        {/* Huge Pointed Goblin Ears */}
        <path d="M68 106 L22 76 L56 120 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M132 106 L178 76 L144 120 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <circle cx="34" cy="92" r="3" fill="#facc15" stroke="#090d16" strokeWidth="1.2" />
        {/* Sharp Goblin Head */}
        <path d="M66 94 C66 64 134 64 134 94 C134 124 114 154 100 158 C86 154 66 124 66 94 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.5" />
        {/* Wild Mohawk / Spiky Tufts */}
        <path d="M74 78 L66 50 L88 68 L100 38 L112 68 L134 50 L126 78 Z" fill="#1e293b" stroke="#090d16" strokeWidth="2.2" />
        {/* Yellow Cat-Slit Eyes */}
        <g className="hero-blink">
          <ellipse cx="84" cy="108" rx="9" ry="7" fill="#fef08a" stroke="#090d16" strokeWidth="1.8" />
          <ellipse cx="85" cy="108" rx="2.5" ry="5.5" fill="#090d16" />
          <ellipse cx="116" cy="108" rx="9" ry="7" fill="#fef08a" stroke="#090d16" strokeWidth="1.8" />
          <ellipse cx="115" cy="108" rx="2.5" ry="5.5" fill="#090d16" />
        </g>
        <path d="M72 95 L94 103 M128 95 L106 103" stroke="#090d16" strokeWidth="3.5" strokeLinecap="round" />
        {/* Sharp Nose + Fang Grin */}
        <path d="M98 114 L103 125 L95 126" fill="#4d7c0f" stroke="#090d16" strokeWidth="1.8" />
        <path d="M80 133 Q100 148 120 133 Q100 138 80 133 Z" fill="#090d16" />
        <polygon points="86,136 90,143 94,137" fill="#fff" />
        <polygon points="106,137 110,143 114,136" fill="#fff" />
        {/* Twin Poison Daggers */}
        <path d="M26 226 L56 176 L62 192 L38 232 Z" fill="#a3e635" stroke="#090d16" strokeWidth="2" />
        <path d="M174 226 L144 176 L138 192 L162 232 Z" fill="#a3e635" stroke="#090d16" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="44" cy="158" r="4" fill="#4ade80" opacity="0.85" />
        <circle cx="158" cy="156" r="3.5" fill="#a3e635" opacity="0.85" />
      </g>
    </>
  ),

  // 4. Leñador: burly woodsman with broad jaw, thick auburn beard, red flannel & fur vest, massive double-bit axe
  lenador: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a3412" />
          <stop offset="65%" stopColor="#2c1006" />
          <stop offset="100%" stopColor="#0d0502" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fbd3b8" />
          <stop offset="50%" stopColor="#e29f77" />
          <stop offset="100%" stopColor="#9e5a37" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="92" fill="#fb923c" opacity="0.16" />
      <g className="hero-alive">
        {/* Giant Lumberjack Axe over shoulder */}
        <rect x="148" y="64" width="10" height="176" rx="3" transform="rotate(14 148 64)" fill="#78350f" stroke="#090d16" strokeWidth="2.2" />
        <path d="M132 54 C178 44 190 96 142 108 L138 78 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2.4" />
        <path d="M168 58 C184 70 182 94 166 102" fill="none" stroke="#94a3b8" strokeWidth="3" />
        {/* Broad Torso with Red Flannel + Fur Vest */}
        <path d="M22 242 C24 182 54 156 100 156 C146 156 176 182 178 242 Z" fill="#dc2626" stroke="#090d16" strokeWidth="2.6" />
        <path d="M44 168 L156 168 M34 198 L166 198 M70 162 V242 M130 162 V242" stroke="#7f1d1d" strokeWidth="3" opacity="0.55" />
        <path d="M56 158 L76 242 H50 L36 174 Z M144 158 L124 242 H150 L164 174 Z" fill="#78350f" stroke="#090d16" strokeWidth="2" />
        {/* Thick Neck & Square Jaw */}
        <rect x="84" y="138" width="32" height="26" rx="6" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M64 88 C64 60 136 60 136 88 L134 128 C126 148 112 156 100 156 C88 156 74 148 66 128 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        {/* Bushy Reddish-Brown Hair & Thick Beard */}
        <path d="M58 92 C56 54 84 42 100 44 C116 42 144 54 142 92 C132 76 114 70 100 74 C86 70 68 76 58 92 Z" fill="#7c2d12" stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="84" cy="102" rx="7.5" ry="5.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="84" cy="102" r="3.8" fill="#d97706" />
          <circle cx="84" cy="102" r="1.8" fill="#090d16" />
          <ellipse cx="116" cy="102" rx="7.5" ry="5.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="116" cy="102" r="3.8" fill="#d97706" />
          <circle cx="116" cy="102" r="1.8" fill="#090d16" />
        </g>
        <path d="M72 91 L94 97 M128 91 L106 97" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
        {/* Full Rugged Beard */}
        <path d="M64 114 C64 150 82 172 100 174 C118 172 136 150 136 114 C122 126 110 120 100 124 C90 120 78 126 64 114 Z" fill="#7c2d12" stroke="#090d16" strokeWidth="2.4" />
        <path d="M90 128 Q100 134 110 128" fill="none" stroke="#fef3c7" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g className="hero-fx-float">
        <ellipse cx="30" cy="84" rx="6" ry="3" transform="rotate(-25 30 84)" fill="#fb923c" />
        <ellipse cx="170" cy="168" rx="5" ry="2.5" transform="rotate(30 170 168)" fill="#fdba74" />
      </g>
    </>
  ),

  // 5. Pastor: peaceful valley shepherd wearing wide straw hat, cream wool mantle, holding wooden crook + small fluffy lamb emblem
  pastor: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="65%" stopColor="#063b2a" />
          <stop offset="100%" stopColor="#031a12" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff0e0" />
          <stop offset="50%" stopColor="#eec09e" />
          <stop offset="100%" stopColor="#ba7d58" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="88" fill="#34d399" opacity="0.18" />
      <g className="hero-alive">
        {/* Curved Shepherd's Crook */}
        <path d="M164 240 L166 104 C166 78 140 76 140 96 C140 106 150 110 156 106" fill="none" stroke="#92400e" strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="150" cy="116" r="5" fill="#34d399" />
        {/* Shepherd Tunic + Fluffy Wool Shawl */}
        <path d="M38 242 C42 184 64 162 100 162 C136 162 158 184 162 242 Z" fill="#059669" stroke="#090d16" strokeWidth="2.4" />
        <path d="M54 168 C64 190 82 198 100 198 C118 198 136 190 146 168 C134 156 116 154 100 158 C84 154 66 156 54 168 Z" fill="#fef3c7" stroke="#090d16" strokeWidth="2.2" />
        {/* Face */}
        <rect x="90" y="140" width="20" height="22" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M68 92 C68 64 132 64 132 92 C132 120 116 144 100 146 C84 144 68 120 68 92 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M62 106 Q72 80 100 84 Q128 80 138 106 C132 76 114 68 100 68 C86 68 68 76 62 106 Z" fill="#d97706" stroke="#090d16" strokeWidth="2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="108" rx="7.5" ry="6.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="108" r="4.5" fill="#10b981" />
          <circle cx="86" cy="108" r="2" fill="#090d16" />
          <circle cx="84.5" cy="106" r="1.8" fill="#fff" />
          <ellipse cx="114" cy="108" rx="7.5" ry="6.5" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="108" r="4.5" fill="#10b981" />
          <circle cx="114" cy="108" r="2" fill="#090d16" />
          <circle cx="112.5" cy="106" r="1.8" fill="#fff" />
        </g>
        <path d="M93 130 Q100 136 107 130" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        {/* Wide Straw Hat with Crimson Ribbon */}
        <ellipse cx="100" cy="72" rx="64" ry="13" fill="#eab308" stroke="#090d16" strokeWidth="2.2" />
        <path d="M72 70 C74 42 126 42 128 70 Z" fill="#facc15" stroke="#090d16" strokeWidth="2.2" />
        <path d="M73 65 H127" stroke="#dc2626" strokeWidth="4.5" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="148" r="4" fill="#fef08a" opacity="0.85" />
        <circle cx="176" cy="64" r="3" fill="#6ee7b7" />
      </g>
    </>
  ),

  // 6. Robot de chatarra: asymmetrical scrap-metal automaton with mismatched optics, riveted steel jaw, steam pipe & giant wrench
  robot: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id={`${g}_mtl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <path d="M20 40 H70 M130 40 H180 M30 190 H80" stroke="#22d3ee" strokeOpacity="0.24" strokeWidth="1.5" />
      <g className="hero-alive">
        {/* Giant Wrench on back */}
        <path d="M148 232 L170 112" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
        <circle cx="172" cy="104" r="16" fill="#64748b" stroke="#090d16" strokeWidth="2.4" />
        <rect x="166" y="88" width="12" height="16" fill="#0f172a" />
        {/* Heavy Boilerplate Chest + Glowing Reactor Core */}
        <path d="M30 242 L42 166 L158 166 L170 242 Z" fill={`url(#${g}_mtl)`} stroke="#090d16" strokeWidth="2.8" />
        <rect x="46" y="162" width="32" height="24" rx="5" fill="#ea580c" stroke="#090d16" strokeWidth="2.2" />
        <rect x="122" y="162" width="32" height="24" rx="5" fill="#475569" stroke="#090d16" strokeWidth="2.2" />
        <circle cx="100" cy="204" r="17" fill="#090d16" stroke="#f59e0b" strokeWidth="3" />
        <circle cx="100" cy="204" r="10" fill="#22d3ee" />
        <circle cx="96" cy="200" r="3" fill="#fff" />
        {/* Exhaust pipe & Neck pistons */}
        <rect x="52" y="128" width="8" height="36" fill="#475569" stroke="#090d16" strokeWidth="2" />
        <rect x="86" y="142" width="28" height="24" fill="#334155" stroke="#090d16" strokeWidth="2" />
        {/* Boxy Scrap Head + Antenna */}
        <path d="M104 60 L114 34 L124 44" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="124" cy="44" r="4.5" fill="#fb7185" />
        <rect x="62" y="60" width="76" height="84" rx="14" fill={`url(#${g}_mtl)`} stroke="#090d16" strokeWidth="2.8" />
        <rect x="70" y="72" width="60" height="30" rx="8" fill="#090d16" stroke="#334155" strokeWidth="2" />
        {/* Mismatched Robot Optics */}
        <g className="hero-blink">
          <circle cx="88" cy="87" r="9.5" fill="#22d3ee" />
          <circle cx="85" cy="84" r="3" fill="#fff" />
          <circle cx="116" cy="87" r="6" fill="#facc15" />
          <circle cx="114.5" cy="85" r="2" fill="#fff" />
        </g>
        {/* Vent Grille Jaw */}
        <rect x="78" y="114" width="44" height="16" rx="4" fill="#1e293b" stroke="#090d16" strokeWidth="2" />
        <path d="M88 114 V130 M100 114 V130 M112 114 V130" stroke="#94a3b8" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="48" cy="118" r="5" fill="#cbd5e1" opacity="0.4" />
        <circle cx="42" cy="104" r="7" fill="#e2e8f0" opacity="0.28" />
      </g>
    </>
  ),

  // 7. Chamán: tribal spirit-caller with horned animal-skull headdress, glowing teal warpaints, feather mantle & spirit totem
  chaman: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="65%" stopColor="#1d0938" />
          <stop offset="100%" stopColor="#090314" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#c98563" />
          <stop offset="55%" stopColor="#9d5c3e" />
          <stop offset="100%" stopColor="#522a19" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="112" r="92" fill="#2dd4bf" opacity="0.18" />
      <g className="hero-alive">
        {/* Spirit Totem Staff */}
        <line x1="164" y1="90" x2="152" y2="240" stroke="#5c311e" strokeWidth="7" strokeLinecap="round" />
        <rect x="148" y="84" width="32" height="44" rx="6" fill="#78350f" stroke="#090d16" strokeWidth="2.2" />
        <circle cx="158" cy="100" r="4" fill="#2dd4bf" />
        <circle cx="170" cy="100" r="4" fill="#2dd4bf" />
        <path d="M154 114 H174" stroke="#facc15" strokeWidth="3" />
        {/* Long Dark Wild Hair */}
        <path d="M52 94 C40 144 38 190 48 230 L152 230 C162 190 160 144 148 94 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2.4" />
        {/* Feather Collar & Tribal Robes */}
        <path d="M36 242 C42 184 62 162 100 162 C138 162 158 184 164 242 Z" fill="#6b21a8" stroke="#090d16" strokeWidth="2.5" />
        <path d="M48 166 L64 196 L78 168 L92 200 L108 200 L122 168 L136 196 L152 166 Z" fill="#facc15" stroke="#090d16" strokeWidth="2" />
        <circle cx="100" cy="176" r="8" fill="#2dd4bf" stroke="#090d16" strokeWidth="2" />
        {/* Head & Glowing Warpaint */}
        <rect x="90" y="140" width="20" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M68 94 C68 68 132 68 132 94 C132 122 117 146 100 148 C83 146 68 122 68 94 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M72 114 L84 118 M72 120 L82 123 M128 114 L116 118 M128 120 L118 123" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
        <g className="hero-blink">
          <ellipse cx="86" cy="107" rx="8" ry="6" fill="#090d16" />
          <circle cx="86" cy="107" r="4" fill="#2dd4bf" />
          <ellipse cx="114" cy="107" rx="8" ry="6" fill="#090d16" />
          <circle cx="114" cy="107" r="4" fill="#2dd4bf" />
        </g>
        {/* Horned Bone Skull Crown */}
        <path d="M68 86 C64 46 136 46 132 86 L118 76 L100 88 L82 76 Z" fill="#fef3c7" stroke="#090d16" strokeWidth="2.4" />
        <path d="M70 68 C48 56 44 38 54 24 C56 42 62 52 74 58 Z" fill="#fde68a" stroke="#090d16" strokeWidth="2" />
        <path d="M130 68 C152 56 156 38 146 24 C144 42 138 52 126 58 Z" fill="#fde68a" stroke="#090d16" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <path d="M30 130 Q38 114 32 98" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="96" r="4" fill="#5eead4" />
      </g>
    </>
  ),

  // 8. Grumete: cocky young pirate deckhand with crimson bandana, eye-patch, striped shirt & curved cutlass
  grumete: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="65%" stopColor="#08203e" />
          <stop offset="100%" stopColor="#030a18" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fbd0b4" />
          <stop offset="50%" stopColor="#dfa17e" />
          <stop offset="100%" stopColor="#a05e3d" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <path d="M10 210 Q60 185 110 210 T195 205" fill="none" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="4" />
      <g className="hero-alive">
        {/* Curved Pirate Cutlass */}
        <path d="M148 236 C168 188 182 136 176 102 C164 134 150 182 138 236 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2.2" />
        <path d="M132 204 C148 194 162 204 156 220" fill="none" stroke="#facc15" strokeWidth="4" />
        {/* Striped Sailor Shirt + Open Blue Coat */}
        <path d="M36 242 C42 184 64 162 100 162 C136 162 158 184 164 242 Z" fill="#1d4ed8" stroke="#090d16" strokeWidth="2.5" />
        <path d="M74 162 H126 L122 242 H78 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2" />
        <path d="M76 180 H124 M77 198 H123 M78 216 H122" stroke="#1e3a8a" strokeWidth="5" />
        <path d="M62 162 L84 182 M138 162 L116 182" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
        {/* Head */}
        <rect x="90" y="140" width="20" height="24" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M68 90 C68 62 132 62 132 90 C132 120 117 144 100 146 C83 144 68 120 68 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        {/* Gold Hoop Earring */}
        <circle cx="65" cy="114" r="5" fill="none" stroke="#facc15" strokeWidth="2.6" />
        {/* Eye + Eyepatch */}
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8" ry="7" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="87" cy="105" r="4.6" fill="#d97706" />
          <circle cx="87" cy="105" r="2.2" fill="#090d16" />
          <circle cx="85" cy="102.5" r="1.8" fill="#fff" />
        </g>
        <line x1="76" y1="88" x2="132" y2="112" stroke="#090d16" strokeWidth="2.6" />
        <path d="M104 98 H124 V108 C124 115 104 115 104 108 Z" fill="#090d16" stroke="#334155" strokeWidth="1.5" />
        {/* Cocky Grin */}
        <path d="M90 128 Q104 136 114 126" fill="none" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
        {/* Spiky Hair & Crimson Bandana */}
        <path d="M64 96 L58 78 L78 86 L92 70 L108 86 L124 72 L136 94 Z" fill="#1f2937" stroke="#090d16" strokeWidth="2" />
        <path d="M64 84 C68 50 132 50 136 84 Q100 72 64 84 Z" fill="#ef4444" stroke="#090d16" strokeWidth="2.2" />
        <path d="M134 78 L158 88 L146 98 Z" fill="#dc2626" stroke="#090d16" strokeWidth="1.8" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="70" r="3" fill="#38bdf8" />
        <circle cx="176" cy="154" r="3.5" fill="#bae6fd" />
      </g>
    </>
  ),

  // 9. Ladrón: midnight shadow thief wearing deep violet hood, half-mask & venomous emerald twin-blades
  ladron: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="65%" stopColor="#110b29" />
          <stop offset="100%" stopColor="#05030e" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#f3cbb0" />
          <stop offset="55%" stopColor="#c78b68" />
          <stop offset="100%" stopColor="#7c4c34" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="110" r="88" fill="#c084fc" opacity="0.16" />
      <g className="hero-alive">
        {/* Stealth Hood + Mantle */}
        <path d="M30 242 C34 180 56 154 100 154 C144 154 166 180 170 242 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2.5" />
        <path d="M50 108 C48 44 152 44 150 108 L158 176 L42 176 Z" fill="#312e81" stroke="#090d16" strokeWidth="2.5" />
        <path d="M74 168 L100 220 L126 168" fill="#4c1d95" stroke="#090d16" strokeWidth="2" />
        {/* Shadowed Face & Emerald Thief Mask */}
        <path d="M70 92 C70 68 130 68 130 92 C130 120 116 144 100 146 C84 144 70 120 70 92 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <path d="M68 110 C84 118 116 118 132 110 C128 136 114 146 100 148 C86 146 72 136 68 110 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.6" />
        {/* Narrow Sly Emerald Eyes */}
        <g className="hero-blink">
          <path d="M76 102 Q85 96 94 103 Q85 110 76 102 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="102.5" r="3.8" fill="#10b981" />
          <circle cx="86" cy="102.5" r="1.6" fill="#090d16" />
          <path d="M124 102 Q115 96 106 103 Q115 110 124 102 Z" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="102.5" r="3.8" fill="#10b981" />
          <circle cx="114" cy="102.5" r="1.6" fill="#090d16" />
        </g>
        {/* Hood Rim overhang */}
        <path d="M50 110 C64 78 82 68 100 78 C118 68 136 78 150 110 C142 52 58 52 50 110 Z" fill="#1e1b4b" stroke="#090d16" strokeWidth="2.2" />
        {/* Glowing Venom Blade */}
        <path d="M148 232 L176 138 L184 128 L182 152 L158 238 Z" fill="#10b981" stroke="#090d16" strokeWidth="2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="32" cy="140" r="6" fill="#c084fc" opacity="0.3" />
        <circle cx="172" cy="86" r="3" fill="#10b981" />
      </g>
    </>
  ),

  // 10. El Viajero del Tiempo: protagonist in dark-navy temporal coat, billowing cyan scarf, chrono-gear emblem & glowing cyan time-blade
  viajero: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="55%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#050816" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="45%" stopColor="#ffe0c8" />
          <stop offset="100%" stopColor="#c48a6a" />
        </radialGradient>
        <linearGradient id={`${g}_hr`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      {/* Chrono Clock Gear Halo in Background */}
      <circle cx="100" cy="96" r="66" fill="none" stroke="#fde047" strokeOpacity="0.4" strokeWidth="2.5" strokeDasharray="8 6" />
      <circle cx="100" cy="96" r="54" fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="1.8" />
      <g className="hero-alive">
        {/* Billowing Cyan Scarf Tail */}
        <path d="M62 160 Q28 164 16 196 Q34 212 62 192 Z" fill="#0ea5e9" stroke="#090d16" strokeWidth="2" />
        {/* Chrono-Blade */}
        <path d="M144 240 L182 108 L190 98 L188 122 L156 240 Z" fill="#22d3ee" stroke="#090d16" strokeWidth="2.2" />
        <line x1="150" y1="224" x2="180" y2="122" stroke="#fff" strokeWidth="2" opacity="0.8" />
        <rect x="136" y="192" width="26" height="7" rx="2" transform="rotate(16 136 192)" fill="#eab308" stroke="#090d16" strokeWidth="1.6" />
        {/* Hero High-Collar Coat */}
        <path d="M32 242 C36 184 58 158 100 158 C142 158 164 184 168 242 Z" fill="#0f172a" stroke="#090d16" strokeWidth="2.6" />
        <path d="M64 162 L100 226 L136 162" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
        <circle cx="100" cy="196" r="8" fill="#fde047" stroke="#090d16" strokeWidth="1.8" />
        <circle cx="100" cy="196" r="4" fill="#22d3ee" />
        {/* Scarf Wrap */}
        <path d="M66 154 Q100 174 134 154 L138 178 Q100 192 62 178 Z" fill="#0284c7" stroke="#090d16" strokeWidth="2.2" />
        {/* Neck & Hero Face */}
        <rect x="90" y="138" width="20" height="22" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M68 88 C68 62 132 62 132 88 C132 118 117 144 100 146 C83 144 68 118 68 88 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <g className="hero-blink">
          <ellipse cx="85" cy="105" rx="8.5" ry="7.2" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="105.5" r="5" fill="#22d3ee" />
          <circle cx="86" cy="105" r="2.3" fill="#090d16" />
          <circle cx="84" cy="102.5" r="2" fill="#fff" />
          <ellipse cx="115" cy="105" rx="8.5" ry="7.2" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="105.5" r="5" fill="#22d3ee" />
          <circle cx="114" cy="105" r="2.3" fill="#090d16" />
          <circle cx="112" cy="102.5" r="2" fill="#fff" />
        </g>
        <path d="M75 95 L94 98 M125 95 L106 98" stroke="#090d16" strokeWidth="3" strokeLinecap="round" />
        <path d="M94 130 Q100 134 106 130" fill="none" stroke="#7c3e2e" strokeWidth="2" strokeLinecap="round" />
        {/* Swept Dynamic Cyan Spiky Hair */}
        <path d="M52 98 L46 66 L68 74 L78 36 L98 60 L110 34 L122 62 L142 42 L136 74 L154 68 L142 102 C132 80 120 76 110 96 C102 74 96 74 88 96 C78 78 68 82 52 98 Z" fill={`url(#${g}_hr)`} stroke="#090d16" strokeWidth="2.3" />
        <path d="M72 64 Q100 54 126 68" stroke="#fff" strokeOpacity="0.65" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
      <g className="hero-fx-float">
        <circle cx="32" cy="60" r="10" fill="none" stroke="#fde047" strokeWidth="1.8" strokeDasharray="3 2" />
        <circle cx="32" cy="60" r="3.5" fill="#22d3ee" />
      </g>
    </>
  ),

  // 11. Vikingo: ferocious northern berserker with towering horned iron helm, braided fiery beard, wolf-fur cape & frost battleaxe
  vikingo: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="65%" stopColor="#081433" />
          <stop offset="100%" stopColor="#030714" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fbd5bc" />
          <stop offset="55%" stopColor="#d9946c" />
          <stop offset="100%" stopColor="#945130" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="90" fill="#93c5fd" opacity="0.16" />
      <g className="hero-alive">
        {/* Frost Battleaxe */}
        <rect x="156" y="102" width="8" height="138" fill="#5c3a21" stroke="#090d16" strokeWidth="1.8" />
        <path d="M162 108 C192 98 196 154 162 162 Z" fill="#bae6fd" stroke="#090d16" strokeWidth="2.2" />
        {/* Fur Shoulders & Runic Armor */}
        <path d="M24 242 C28 182 56 156 100 156 C144 156 172 182 176 242 Z" fill="#334155" stroke="#090d16" strokeWidth="2.6" />
        <path d="M32 180 C44 150 68 148 82 168 L62 194 Z M168 180 C156 150 132 148 118 168 L138 194 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2.2" />
        {/* Face */}
        <path d="M66 90 C66 64 134 64 134 90 C134 122 118 150 100 152 C82 150 66 122 66 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <g className="hero-blink">
          <ellipse cx="84" cy="104" rx="8" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="84" cy="104" r="4" fill="#38bdf8" />
          <circle cx="84" cy="104" r="1.8" fill="#090d16" />
          <ellipse cx="116" cy="104" rx="8" ry="6" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="116" cy="104" r="4" fill="#38bdf8" />
          <circle cx="116" cy="104" r="1.8" fill="#090d16" />
        </g>
        <path d="M74 93 L95 99 M126 93 L105 99" stroke="#7f1d1d" strokeWidth="3.6" strokeLinecap="round" />
        {/* Braided Red Beard */}
        <path d="M66 116 C66 148 82 170 100 174 C118 170 134 148 134 116 C120 126 80 126 66 116 Z" fill="#dc2626" stroke="#090d16" strokeWidth="2.2" />
        <path d="M88 156 L82 186 L96 186 Z M112 156 L118 186 L104 186 Z" fill="#b91c1c" stroke="#090d16" strokeWidth="1.8" />
        {/* Horned Viking Helmet */}
        <path d="M62 90 C64 50 136 50 138 90 Z" fill="#64748b" stroke="#090d16" strokeWidth="2.5" />
        <path d="M66 76 C38 68 30 44 40 28 C48 48 58 58 70 62 Z" fill="#fef3c7" stroke="#090d16" strokeWidth="2.2" />
        <path d="M134 76 C162 68 170 44 160 28 C152 48 142 58 130 62 Z" fill="#fef3c7" stroke="#090d16" strokeWidth="2.2" />
        <rect x="96" y="60" width="8" height="36" fill="#94a3b8" stroke="#090d16" strokeWidth="1.6" />
      </g>
      <g className="hero-fx-float">
        <polygon points="28,46 33,56 28,66 23,56" fill="#bae6fd" />
        <polygon points="174,174 179,184 174,194 169,184" fill="#e0f2fe" />
      </g>
    </>
  ),

  // 12. Caballero: noble silver-armored paladin with feathered royal crest helm, golden lion chest plate & radiant broadsword
  caballero: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="65%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#040814" />
        </linearGradient>
        <linearGradient id={`${g}_pl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fff0e5" />
          <stop offset="50%" stopColor="#eab99a" />
          <stop offset="100%" stopColor="#a87051" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#bae6fd" opacity="0.18" />
      <g className="hero-alive">
        {/* Royal Plume Crest */}
        <path d="M98 54 C96 22 126 16 142 32 C126 42 114 48 106 58 Z" fill="#2563eb" stroke="#090d16" strokeWidth="2" />
        {/* Sun Broadsword */}
        <path d="M148 240 L174 114 L182 104 L184 124 L160 240 Z" fill="#fde047" stroke="#090d16" strokeWidth="2.2" />
        <rect x="138" y="192" width="28" height="6" rx="2" transform="rotate(14 138 192)" fill="#eab308" stroke="#090d16" strokeWidth="1.5" />
        {/* Knight Plate Armor + Blue Tabard */}
        <path d="M28 242 C32 182 56 156 100 156 C144 156 168 182 172 242 Z" fill={`url(#${g}_pl)`} stroke="#090d16" strokeWidth="2.6" />
        <path d="M74 164 H126 L122 242 H78 Z" fill="#2563eb" stroke="#090d16" strokeWidth="2" />
        <polygon points="100,178 108,194 100,210 92,194" fill="#facc15" stroke="#090d16" strokeWidth="1.5" />
        {/* Open-visor Face */}
        <path d="M69 90 C69 64 131 64 131 90 C131 120 116 144 100 146 C84 144 69 120 69 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="85" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="86" cy="105" r="4.5" fill="#2563eb" />
          <circle cx="86" cy="105" r="2" fill="#090d16" />
          <ellipse cx="115" cy="105" rx="8" ry="6.8" fill="#fff" stroke="#090d16" strokeWidth="1.6" />
          <circle cx="114" cy="105" r="4.5" fill="#2563eb" />
          <circle cx="114" cy="105" r="2" fill="#090d16" />
        </g>
        <path d="M94 130 H106" stroke="#7c3e2e" strokeWidth="2" strokeLinecap="round" />
        {/* Blonde locks & Silver Sallet Helm */}
        <path d="M64 96 L78 82 L100 92 L122 82 L136 96 Z" fill="#fde047" stroke="#090d16" strokeWidth="1.8" />
        <path d="M64 88 C66 48 134 48 136 88 L124 80 H76 Z" fill={`url(#${g}_pl)`} stroke="#090d16" strokeWidth="2.4" />
        <path d="M74 80 H126" stroke="#facc15" strokeWidth="3.2" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="64" r="3" fill="#fde047" />
        <circle cx="170" cy="166" r="2.5" fill="#fff" />
      </g>
    </>
  ),

  // 13. Elfa: graceful sylvan archer with long pointed ears, silver-white hair, emerald circlet, leaf cloak & glowing bow
  elfa: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="65%" stopColor="#04261c" />
          <stop offset="100%" stopColor="#02100c" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fff7f2" />
          <stop offset="50%" stopColor="#f5d0bc" />
          <stop offset="100%" stopColor="#c49078" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#6ee7b7" opacity="0.16" />
      <g className="hero-alive">
        {/* Long Silver-White Flowing Hair */}
        <path d="M56 92 C44 138 40 186 48 228 L152 228 C160 186 156 138 144 92 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2.2" />
        {/* Sylvan Archer Bow */}
        <path d="M148 108 C184 148 184 202 148 238" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round" />
        <line x1="148" y1="108" x2="148" y2="238" stroke="#fef08a" strokeWidth="1.6" />
        {/* Leaf-trimmed Forest Tunic */}
        <path d="M40 242 C44 186 64 162 100 162 C136 162 156 186 160 242 Z" fill="#047857" stroke="#090d16" strokeWidth="2.4" />
        <path d="M62 166 L100 202 L138 166 L124 218 H76 Z" fill="#10b981" stroke="#090d16" strokeWidth="1.8" />
        <circle cx="100" cy="186" r="6" fill="#fde047" stroke="#090d16" strokeWidth="1.5" />
        {/* Pointed Elf Ears */}
        <path d="M69 102 L40 84 L68 114 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M131 102 L160 84 L132 114 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        {/* Delicate Face */}
        <rect x="91" y="140" width="18" height="22" rx="7" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="1.8" />
        <path d="M70 90 C70 64 130 64 130 90 C130 120 115 144 100 146 C85 144 70 120 70 90 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.2" />
        <g className="hero-blink">
          <ellipse cx="86" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="86" cy="105.5" r="4.8" fill="#10b981" />
          <circle cx="86" cy="105" r="2.2" fill="#090d16" />
          <circle cx="84" cy="102.5" r="2" fill="#fff" />
          <ellipse cx="114" cy="105" rx="8.2" ry="7.4" fill="#fff" stroke="#090d16" strokeWidth="1.5" />
          <circle cx="114" cy="105.5" r="4.8" fill="#10b981" />
          <circle cx="114" cy="105" r="2.2" fill="#090d16" />
          <circle cx="112" cy="102.5" r="2" fill="#fff" />
        </g>
        <path d="M95 130 Q100 133 105 130" fill="none" stroke="#9d4e4e" strokeWidth="1.8" strokeLinecap="round" />
        {/* Parted Silver Bangs & Golden Circlet */}
        <path d="M64 102 C64 64 82 50 100 50 C118 50 136 64 136 102 C122 82 110 74 100 92 C90 74 78 82 64 102 Z" fill="#f8fafc" stroke="#090d16" strokeWidth="2.2" />
        <path d="M70 78 Q100 66 130 78" fill="none" stroke="#fde047" strokeWidth="3" />
        <polygon points="100,66 105,74 100,82 95,74" fill="#34d399" stroke="#090d16" strokeWidth="1.4" />
      </g>
      <g className="hero-fx-float">
        <ellipse cx="32" cy="68" rx="6" ry="3" transform="rotate(24 32 68)" fill="#6ee7b7" />
        <ellipse cx="170" cy="94" rx="5" ry="2.5" transform="rotate(-24 170 94)" fill="#34d399" />
      </g>
    </>
  ),

  // 14. Monje: serene bald shaolin healer with forehead incense marks, oversized prayer beads, saffron robes & golden chi sphere
  monje: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="65%" stopColor="#3b1106" />
          <stop offset="100%" stopColor="#120502" />
        </linearGradient>
        <radialGradient id={`${g}_sk`} cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fbd3b4" />
          <stop offset="55%" stopColor="#d5946d" />
          <stop offset="100%" stopColor="#945636" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#facc15" opacity="0.18" />
      <g className="hero-alive">
        {/* Saffron Monk Robes */}
        <path d="M36 242 C40 184 62 158 100 158 C138 158 160 184 164 242 Z" fill="#f97316" stroke="#090d16" strokeWidth="2.5" />
        <path d="M68 160 L118 242 H70 L56 174 Z" fill="#9a3412" stroke="#090d16" strokeWidth="2" />
        {/* Oversized Wooden Prayer Beads */}
        <circle cx="78" cy="168" r="7" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
        <circle cx="92" cy="176" r="7.5" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
        <circle cx="108" cy="176" r="7.5" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
        <circle cx="122" cy="168" r="7" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
        {/* Bald Head with Forehead Dots */}
        <rect x="90" y="138" width="20" height="22" rx="8" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2" />
        <path d="M68 88 C68 54 132 54 132 88 C132 120 117 144 100 146 C83 144 68 120 68 88 Z" fill={`url(#${g}_sk)`} stroke="#090d16" strokeWidth="2.4" />
        <circle cx="92" cy="72" r="2" fill="#f59e0b" />
        <circle cx="100" cy="72" r="2" fill="#f59e0b" />
        <circle cx="108" cy="72" r="2" fill="#f59e0b" />
        {/* Serene Half-Lidded Eyes */}
        <g className="hero-blink">
          <path d="M77 104 Q86 110 95 104" fill="none" stroke="#090d16" strokeWidth="3" strokeLinecap="round" />
          <path d="M105 104 Q114 110 123 104" fill="none" stroke="#090d16" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M77 94 Q86 91 94 94 M106 94 Q114 91 123 94" fill="none" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M93 128 Q100 134 107 128" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
        {/* Floating Golden Chi Sphere */}
        <circle cx="152" cy="196" r="18" fill="#facc15" opacity="0.4" />
        <circle cx="152" cy="196" r="10" fill="#fef08a" stroke="#f97316" strokeWidth="2" />
        <circle cx="149" cy="193" r="3" fill="#fff" />
      </g>
      <g className="hero-fx-float">
        <circle cx="34" cy="134" r="3.5" fill="#fde047" />
        <circle cx="166" cy="74" r="3" fill="#fb923c" />
      </g>
    </>
  ),

  // 15. Centinela: imposing monolithic steel juggernaut with cyan visor slit, towering shoulder bulwarks & cyber-tower shield
  centinela: (g) => (
    <>
      <defs>
        <linearGradient id={`${g}_bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id={`${g}_st`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${g}_bg)`} />
      <circle cx="100" cy="108" r="88" fill="#38bdf8" opacity="0.14" />
      <g className="hero-alive">
        {/* Massive Shoulder Fortress Plates */}
        <path d="M18 242 L26 154 L70 144 L130 144 L174 154 L182 242 Z" fill={`url(#${g}_st)`} stroke="#090d16" strokeWidth="2.8" />
        <path d="M68 158 L100 202 L132 158" fill="#1e293b" stroke="#22d3ee" strokeWidth="2.4" />
        {/* Monolithic Helmeted Head + Glowing Cyan Visor */}
        <path d="M62 114 C62 56 138 56 138 114 L126 150 L100 158 L74 150 Z" fill={`url(#${g}_st)`} stroke="#090d16" strokeWidth="2.8" />
        <path d="M100 44 L109 78 H91 Z" fill="#e2e8f0" stroke="#090d16" strokeWidth="2" />
        <path d="M72 96 H128 L120 110 H80 Z" fill="#090d16" />
        <line x1="78" y1="103" x2="122" y2="103" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" />
        {/* Tower Shield */}
        <path d="M132 166 H184 V212 C184 232 158 242 158 242 C158 242 132 232 132 212 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="158,180 168,202 158,224 148,202" fill="#22d3ee" />
      </g>
      <g className="hero-fx-float">
        <rect x="28" y="84" width="6" height="6" fill="#38bdf8" opacity="0.7" />
        <rect x="168" y="64" width="5" height="5" fill="#22d3ee" opacity="0.7" />
      </g>
    </>
  ),
};
