import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  ChevronLeft,
  Coins,
  Copy,
  DoorOpen,
  Gem,
  PlusCircle,
  RefreshCw,
  Shield,
  Sparkles,
  Sword,
  Users,
  X,
} from 'lucide-react';
import type { Hero, OwnedArtefact, Rarity, TradeOffer, TradeRoomState } from '../types/game';
import {
  ARTEFACT_STAT_SHORT,
  WEAPON_CATALOG,
  getEquipmentMaxLevel,
  getScaledArtefactStats,
  getScaledWeaponStats,
  getWeaponLevel,
} from '../data/gameData';
import {
  ArtefactPieceIllustration,
  GoldCoinIcon,
  MagicCrystalIcon,
  RARITY_BADGE_STYLE,
  RARITY_CARD_FRAME,
  WeaponIllustration,
} from './Icons';

interface TradeViewProps {
  playerName: string;
  heroes: Hero[];
  gold: number;
  crystals: number;
  ownedWeapons: string[];
  weaponLevels: Record<string, number>;
  ownedArtefacts: OwnedArtefact[];
  onBack: () => void;
  onTradeCompleted: (given: TradeOffer, received: TradeOffer) => void;
  onNotify: (msg: string) => void;
}

type TradeTab = 'armas' | 'artefactos' | 'oro' | 'cristales';

const RARITY_RANK: Record<Rarity, number> = {
  Oro: 3,
  Plata: 2,
  Bronce: 1,
};

function getOrCreateTradePlayerId(): string {
  try {
    const existing = sessionStorage.getItem('senda_trade_pid');
    if (existing) return existing;
    const generated = `p_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    sessionStorage.setItem('senda_trade_pid', generated);
    return generated;
  } catch {
    return `p_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function formatOfferLabel(offer: TradeOffer): string {
  if (offer.kind === 'gold') return `${offer.amount.toLocaleString('es-ES')} Oro`;
  if (offer.kind === 'crystals') return `${offer.amount.toLocaleString('es-ES')} Cristales mágicos`;
  if (offer.kind === 'weapon') return `${offer.name} (Nv.${offer.level})`;
  const lvl = offer.artefact.level ?? 1;
  return `${offer.artefact.name} (Nv.${lvl})`;
}

const OfferDisplayCard: React.FC<{
  offer: TradeOffer;
  removable?: boolean;
  onRemove?: () => void;
}> = ({ offer, removable = false, onRemove }) => {
  if (offer.kind === 'gold') {
    return (
      <div className="relative rounded-xl border-2 border-amber-400/65 bg-gradient-to-b from-amber-950/70 via-[#1a1308] to-[#0b0e1a] p-3 min-h-[148px] flex flex-col items-center justify-center text-center gap-1.5 shadow-[0_8px_20px_rgba(245,158,11,0.2)]">
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar oferta"
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 border border-white/20 grid place-items-center text-slate-200 hover:bg-rose-600/80"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-300/50 grid place-items-center">
          <GoldCoinIcon size={32} />
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
          Oro
        </div>
        <div className="text-base font-black text-amber-100 tabular-nums leading-tight">
          {offer.amount.toLocaleString('es-ES')}
        </div>
      </div>
    );
  }

  if (offer.kind === 'crystals') {
    return (
      <div className="relative rounded-xl border-2 border-cyan-400/65 bg-gradient-to-b from-cyan-950/70 via-[#0d192b] to-[#080d1b] p-3 min-h-[148px] flex flex-col items-center justify-center text-center gap-1.5 shadow-[0_8px_20px_rgba(34,211,238,0.2)]">
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar oferta"
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 border border-white/20 grid place-items-center text-slate-200 hover:bg-rose-600/80"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-300/50 grid place-items-center">
          <MagicCrystalIcon size={32} />
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
          Cristales Mágicos
        </div>
        <div className="text-base font-black text-cyan-100 tabular-nums leading-tight">
          {offer.amount.toLocaleString('es-ES')}
        </div>
      </div>
    );
  }

  if (offer.kind === 'weapon') {
    const wDef = WEAPON_CATALOG.find((w) => w.id === offer.weaponId);
    const maxLvl = getEquipmentMaxLevel(offer.rarity);
    const scaled = wDef ? getScaledWeaponStats(wDef, offer.level) : null;
    return (
      <div
        className={`relative rounded-xl border-2 p-2.5 min-h-[148px] flex flex-col items-center justify-center text-center gap-1 ${RARITY_CARD_FRAME[offer.rarity]}`}
      >
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar oferta"
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 border border-white/20 grid place-items-center text-slate-200 hover:bg-rose-600/80"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <div className="w-12 h-12 rounded-xl bg-black/45 border border-white/15 grid place-items-center">
          <WeaponIllustration weaponId={offer.weaponId} size={40} />
        </div>
        <div className="text-[11px] font-extrabold text-white leading-tight line-clamp-2">
          {offer.name}
        </div>
        <div className="flex items-center justify-center gap-1 flex-wrap">
          <span
            className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${RARITY_BADGE_STYLE[offer.rarity]}`}
          >
            {offer.rarity}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[8.5px] font-black text-amber-200 tabular-nums">
            Nv.{offer.level}/{maxLvl}
          </span>
        </div>
        {scaled && (
          <div className="text-[9px] font-bold text-cyan-200 tabular-nums mt-0.5">
            {scaled.atk > 0 ? `+${scaled.atk} ATQ ` : ''}
            {scaled.hp > 0 ? `+${scaled.hp} VID ` : ''}
            {scaled.spd > 0 ? `+${scaled.spd} VEL` : ''}
          </div>
        )}
      </div>
    );
  }

  // Artefact offer
  const art = offer.artefact;
  const scaled = getScaledArtefactStats(art);
  return (
    <div
      className={`relative rounded-xl border-2 p-2.5 min-h-[148px] flex flex-col items-center justify-center text-center gap-1 ${RARITY_CARD_FRAME[art.rarity]}`}
    >
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar oferta"
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 border border-white/20 grid place-items-center text-slate-200 hover:bg-rose-600/80"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <div className="w-12 h-12 rounded-xl bg-black/45 border border-white/15 grid place-items-center">
        <ArtefactPieceIllustration slot={art.slot} set={art.set} size={40} />
      </div>
      <div className="text-[11px] font-extrabold text-white leading-tight line-clamp-2">
        {art.name}
      </div>
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <span
          className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${RARITY_BADGE_STYLE[art.rarity]}`}
        >
          {art.rarity}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[8.5px] font-black text-amber-200 tabular-nums">
          Nv.{scaled.level}/{scaled.maxLevel}
        </span>
      </div>
      <div className="text-[9px] font-bold text-cyan-300">Set de {art.set}</div>
      <div className="text-[9px] font-extrabold text-amber-200 tabular-nums">
        +{scaled.mainStat.val} {ARTEFACT_STAT_SHORT[scaled.mainStat.stat]} · +
        {scaled.subStats[0].val} {ARTEFACT_STAT_SHORT[scaled.subStats[0].stat]} · +
        {scaled.subStats[1].val} {ARTEFACT_STAT_SHORT[scaled.subStats[1].stat]}
      </div>
    </div>
  );
};

export const TradeView: React.FC<TradeViewProps> = ({
  playerName,
  heroes,
  gold,
  crystals,
  ownedWeapons,
  weaponLevels,
  ownedArtefacts,
  onBack,
  onTradeCompleted,
  onNotify,
}) => {
  const playerId = useMemo(() => getOrCreateTradePlayerId(), []);
  const [joinInput, setJoinInput] = useState('');
  const [room, setRoom] = useState<TradeRoomState | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TradeTab>('armas');
  const [goldDraft, setGoldDraft] = useState('');
  const [crystalDraft, setCrystalDraft] = useState('');
  const [tradeSummary, setTradeSummary] = useState<{
    givenName: string;
    receivedName: string;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pendingMsgsRef = useRef<string[]>([]);
  const executedRef = useRef<string | null>(null);
  const onTradeCompletedRef = useRef(onTradeCompleted);
  onTradeCompletedRef.current = onTradeCompleted;

  // Compute unequipped weapons and artefacts ONLY
  const equippedWeaponIds = useMemo(() => {
    const set = new Set<string>();
    heroes.forEach((h) => {
      if (h.weaponId) set.add(h.weaponId);
    });
    return set;
  }, [heroes]);

  const equippedArtefactUids = useMemo(() => {
    const set = new Set<string>();
    heroes.forEach((h) => {
      h.artefacts.forEach((uid) => {
        if (uid) set.add(uid);
      });
    });
    return set;
  }, [heroes]);

  const tradeableWeapons = useMemo(
    () =>
      WEAPON_CATALOG.filter(
        (w) => ownedWeapons.includes(w.id) && !equippedWeaponIds.has(w.id)
      ).sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]),
    [ownedWeapons, equippedWeaponIds]
  );

  const tradeableArtefacts = useMemo(
    () =>
      ownedArtefacts
        .filter((a) => !equippedArtefactUids.has(a.uid))
        .slice()
        .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]),
    [ownedArtefacts, equippedArtefactUids]
  );

  const connectSocket = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${window.location.host}/ws/trade`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      setErrorMsg(null);
      while (pendingMsgsRef.current.length > 0) {
        const msg = pendingMsgsRef.current.shift();
        if (msg) ws.send(msg);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    ws.onerror = () => {
      setErrorMsg('Error de conexión con el servidor de intercambios.');
    };

    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(String(ev.data)) as {
          type: string;
          room?: TradeRoomState;
          message?: string;
          data?: {
            tradeId?: string;
            hostPlayerId: string;
            guestPlayerId: string;
            hostOffer: TradeOffer;
            guestOffer: TradeOffer;
          };
        };

        if (payload.type === 'room:error') {
          setErrorMsg(payload.message || 'Ocurrió un error en la sala.');
          return;
        }

        if (payload.type === 'room:state' && payload.room) {
          setErrorMsg(null);
          setRoom(payload.room);
          if (payload.room.status !== 'completed') {
            executedRef.current = null;
          }
          return;
        }

        if (payload.type === 'trade:executed' && payload.data) {
          const d = payload.data;
          const sig =
            d.tradeId ||
            `${JSON.stringify(d.hostOffer)}_${JSON.stringify(d.guestOffer)}_${d.hostPlayerId}_${d.guestPlayerId}`;
          if (executedRef.current === sig) return;
          executedRef.current = sig;

          const iAmHost = d.hostPlayerId === playerId;
          const given = iAmHost ? d.hostOffer : d.guestOffer;
          const received = iAmHost ? d.guestOffer : d.hostOffer;
          onTradeCompletedRef.current(given, received);
          setTradeSummary({
            givenName: formatOfferLabel(given),
            receivedName: formatOfferLabel(received),
          });
        }
      } catch {
        // ignore malformed packets
      }
    };
  }, [playerId]);

  useEffect(() => {
    connectSocket();
    return () => {
      const ws = wsRef.current;
      if (ws) {
        ws.close();
        wsRef.current = null;
      }
    };
  }, [connectSocket]);

  const sendPacket = useCallback(
    (packet: Record<string, unknown>) => {
      const serialized = JSON.stringify({
        ...packet,
        playerId,
        playerName,
      });
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(serialized);
      } else {
        pendingMsgsRef.current.push(serialized);
        connectSocket();
      }
    },
    [connectSocket, playerId, playerName]
  );

  const handleCreateRoom = () => {
    setErrorMsg(null);
    setTradeSummary(null);
    sendPacket({ type: 'room:create' });
  };

  const handleJoinRoom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = joinInput.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (clean.length !== 6) {
      setErrorMsg('Introduce un código válido de 6 letras o números en mayúscula.');
      return;
    }
    setErrorMsg(null);
    setTradeSummary(null);
    sendPacket({ type: 'room:join', code: clean });
  };

  const handleLeaveRoom = () => {
    if (room) {
      sendPacket({ type: 'room:leave', code: room.code });
    }
    setRoom(null);
    setTradeSummary(null);
    setErrorMsg(null);
  };

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard?.writeText(room.code).catch(() => {});
    setCopied(true);
    onNotify(`Código ${room.code} copiado`);
    setTimeout(() => setCopied(false), 1800);
  };

  const validateOfferStillOwned = useCallback(
    (offer: TradeOffer | null): boolean => {
      if (!offer) return false;
      if (offer.kind === 'gold') return offer.amount >= 1 && gold >= offer.amount;
      if (offer.kind === 'crystals') return offer.amount >= 1 && crystals >= offer.amount;
      if (offer.kind === 'weapon') {
        return ownedWeapons.includes(offer.weaponId) && !equippedWeaponIds.has(offer.weaponId);
      }
      return (
        ownedArtefacts.some((a) => a.uid === offer.artefact.uid) &&
        !equippedArtefactUids.has(offer.artefact.uid)
      );
    },
    [crystals, equippedArtefactUids, equippedWeaponIds, gold, ownedArtefacts, ownedWeapons]
  );

  if (!room) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 pb-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-slate-100 hover:bg-white/15 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Menú</span>
          </button>
          <span className="font-display text-[15px] font-bold text-[#fef0c7]">
            Intercambios
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold border ${
              wsConnected
                ? 'bg-emerald-950/70 border-emerald-400/45 text-emerald-300'
                : 'bg-amber-950/70 border-amber-400/45 text-amber-200'
            }`}
          >
            {wsConnected ? 'En línea' : 'Conectando'}
          </span>
        </div>

        <div className="rounded-2xl border border-amber-400/35 bg-gradient-to-br from-[#1d1736]/95 to-[#0c1122]/95 p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-400/40 grid place-items-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[13.5px] font-extrabold text-amber-100">
              Crear o unirse a una sala
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Solo puedes intercambiar armas sin equipar, artefactos sin equipar, oro o cristales mágicos.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-400/50 bg-rose-950/60 px-3 py-2 text-xs font-bold text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Create Room */}
        <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-[#0f2629]/95 to-[#0b1122]/95 p-4 flex flex-col gap-3">
          <div>
            <div className="text-[14px] font-extrabold text-emerald-100">Crear Sala</div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Genera un código único de 6 letras y números en mayúscula para compartirlo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateRoom}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear Sala Nueva</span>
          </button>
        </div>

        {/* Join Room */}
        <form
          onSubmit={handleJoinRoom}
          className="rounded-2xl border border-sky-400/40 bg-gradient-to-br from-[#121f3a]/95 to-[#0b1122]/95 p-4 flex flex-col gap-3"
        >
          <div>
            <div className="text-[14px] font-extrabold text-sky-100">Unirse a Sala</div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Introduce el código de 6 letras o números en mayúscula (ej. A7K9P2).
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={joinInput}
              maxLength={6}
              onChange={(e) => {
                const formatted = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, '')
                  .slice(0, 6);
                setJoinInput(formatted);
              }}
              placeholder="CÓDIGO (6)"
              className="flex-1 rounded-xl bg-[#080d1d] border border-sky-400/40 px-3.5 py-2.5 text-center font-mono text-base font-extrabold tracking-[0.28em] text-amber-200 uppercase outline-none focus:border-amber-300"
            />
            <button
              type="submit"
              disabled={joinInput.length !== 6}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-extrabold disabled:opacity-40 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Unirse
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Active Room View
  const amHost = room.host.playerId === playerId;
  const me = amHost ? room.host : room.guest;
  const partner = amHost ? room.guest : room.host;

  const myOffer = me?.offer ?? null;
  const partnerOffer = partner?.offer ?? null;

  const bothReadyPossible =
    Boolean(myOffer) &&
    Boolean(partnerOffer) &&
    Boolean(partner?.connected) &&
    room.status !== 'completed';

  const parsedGold = Math.floor(Number(goldDraft) || 0);
  const parsedCrystals = Math.floor(Number(crystalDraft) || 0);

  const sendOffer = (offer: TradeOffer | null) => {
    setErrorMsg(null);
    sendPacket({ type: 'trade:offer', code: room.code, offer });
  };

  const handleToggleReady = () => {
    if (!me?.ready && !validateOfferStillOwned(myOffer)) {
      setErrorMsg('Tu oferta ya no está disponible o fue equipada. Elige otra oferta.');
      sendOffer(null);
      return;
    }
    setErrorMsg(null);
    sendPacket({ type: 'trade:ready', code: room.code, ready: !me?.ready });
  };

  const tabs: { id: TradeTab; label: string; badge: string; icon: React.ReactNode }[] = [
    {
      id: 'armas',
      label: 'Armas',
      badge: `${tradeableWeapons.length}`,
      icon: <Sword className="w-3.5 h-3.5" />,
    },
    {
      id: 'artefactos',
      label: 'Artefactos',
      badge: `${tradeableArtefacts.length}`,
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    {
      id: 'oro',
      label: 'Oro',
      badge: gold.toLocaleString('es-ES'),
      icon: <Coins className="w-3.5 h-3.5" />,
    },
    {
      id: 'cristales',
      label: 'Cristales',
      badge: crystals.toLocaleString('es-ES'),
      icon: <Gem className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 pb-1">
        <button
          type="button"
          onClick={handleLeaveRoom}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-400/35 text-xs font-bold text-rose-200 hover:bg-rose-900/60"
        >
          <DoorOpen className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>
        <span className="font-display text-[14.5px] font-bold text-[#fef0c7]">
          Sala de Intercambio
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-extrabold text-slate-200 inline-flex items-center gap-1">
          <Users className="w-3 h-3 text-sky-300" />
          {partner?.connected ? '2/2' : '1/2'}
        </span>
      </div>

      {/* Room Code Banner */}
      <div className="rounded-2xl border border-amber-400/45 bg-gradient-to-r from-[#231936] to-[#111832] p-3.5 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300">
            Código de Sala
          </div>
          <div className="font-mono text-2xl font-extrabold tracking-[0.26em] text-white mt-0.5">
            {room.code}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyCode}
          className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs font-extrabold text-amber-100 inline-flex items-center gap-1.5 hover:bg-amber-500/30"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-400/50 bg-rose-950/60 px-3 py-2 text-xs font-bold text-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Trade Completed Banner */}
      {room.status === 'completed' && tradeSummary && (
        <div className="rounded-2xl border border-emerald-400/55 bg-gradient-to-b from-emerald-950/75 to-[#0d162a] p-4 text-center flex flex-col items-center gap-2">
          <Sparkles className="w-7 h-7 text-emerald-300" />
          <div className="text-sm font-extrabold text-emerald-100">
            ¡Intercambio Completado!
          </div>
          <p className="text-xs text-slate-200">
            Has entregado <strong>{tradeSummary.givenName}</strong> y recibido{' '}
            <strong className="text-amber-200">{tradeSummary.receivedName}</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 w-full mt-1">
            <button
              type="button"
              onClick={() => {
                setTradeSummary(null);
                setGoldDraft('');
                setCrystalDraft('');
                sendPacket({ type: 'room:reset', code: room.code });
              }}
              className="py-2 rounded-xl bg-emerald-500/25 border border-emerald-400/50 text-xs font-extrabold text-emerald-100 inline-flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nuevo Cambio</span>
            </button>
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-slate-200"
            >
              Salir
            </button>
          </div>
        </div>
      )}

      {/* 2 Offer Slots */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* My Offer */}
        <div
          className={`rounded-2xl border p-2.5 flex flex-col gap-2 ${
            me?.ready
              ? 'border-emerald-400/65 bg-emerald-950/25'
              : 'border-sky-400/35 bg-[#10172b]/95'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-extrabold text-sky-200 truncate">
              Tú ({me?.playerName || playerName})
            </span>
            {me?.ready && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-[9px] font-extrabold text-emerald-300">
                Listo
              </span>
            )}
          </div>

          {myOffer ? (
            <OfferDisplayCard
              offer={myOffer}
              removable={room.status !== 'completed'}
              onRemove={() => sendOffer(null)}
            />
          ) : (
            <div className="min-h-[148px] rounded-xl border border-dashed border-white/20 bg-[#080d1b] flex items-center justify-center p-3 text-center text-[11px] font-semibold text-slate-400">
              Elige un arma, artefacto, oro o cristales abajo
            </div>
          )}
        </div>

        {/* Partner Offer */}
        <div
          className={`rounded-2xl border p-2.5 flex flex-col gap-2 ${
            partner?.ready
              ? 'border-emerald-400/65 bg-emerald-950/25'
              : 'border-amber-400/35 bg-[#10172b]/95'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-extrabold text-amber-200 truncate">
              {partner ? partner.playerName : 'Esperando jugador...'}
            </span>
            {partner?.ready && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-[9px] font-extrabold text-emerald-300">
                Listo
              </span>
            )}
          </div>

          {!partner || !partner.connected ? (
            <div className="min-h-[148px] rounded-xl border border-dashed border-amber-400/25 bg-[#080d1b] flex flex-col items-center justify-center p-3 text-center gap-1.5">
              <Users className="w-6 h-6 text-amber-300/60" />
              <span className="text-[10.5px] font-semibold text-slate-400">
                Comparte el código <strong className="text-amber-200">{room.code}</strong>
              </span>
            </div>
          ) : partnerOffer ? (
            <OfferDisplayCard offer={partnerOffer} />
          ) : (
            <div className="min-h-[148px] rounded-xl border border-dashed border-white/20 bg-[#080d1b] flex items-center justify-center p-3 text-center text-[11px] font-semibold text-slate-400">
              El compañero aún no ha elegido su oferta
            </div>
          )}
        </div>
      </div>

      {/* Ready Toggle */}
      {room.status !== 'completed' && (
        <button
          type="button"
          disabled={!bothReadyPossible}
          onClick={handleToggleReady}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${
            me?.ready
              ? 'bg-amber-500/25 border border-amber-300 text-amber-100'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>
            {me?.ready
              ? 'Esperando confirmación del compañero (Cancelar)'
              : 'Confirmar Intercambio (Listo)'}
          </span>
        </button>
      )}

      {/* 4-Category Trade Picker: Unequipped Weapons, Unequipped Artefacts, Gold, Magic Crystals */}
      {room.status !== 'completed' && (
        <div className="rounded-2xl border border-white/12 bg-[#10162a]/95 p-3 flex flex-col gap-2.5">
          <div className="grid grid-cols-4 gap-1.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl py-2 px-1 border text-[10px] font-extrabold transition-all flex flex-col items-center gap-0.5 leading-tight ${
                    active
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-200 text-slate-950 shadow-[0_4px_14px_rgba(245,158,11,0.35)]'
                      : 'bg-[#090f20] border-white/10 text-slate-300 hover:border-amber-400/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  <span
                    className={`text-[8.5px] font-black tabular-nums truncate max-w-full ${
                      active ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: UNEQUIPPED WEAPONS */}
          {activeTab === 'armas' && (
            <div className="flex flex-col gap-2">
              <div className="text-[10.5px] font-bold text-slate-300">
                Armas sin equipar disponibles ({tradeableWeapons.length})
              </div>
              {tradeableWeapons.length === 0 ? (
                <div className="rounded-xl bg-[#080d1b] border border-white/10 p-3 text-center text-[11px] text-slate-400 leading-relaxed">
                  No tienes armas sin equipar. Solo se pueden intercambiar armas que no estén equipadas en ningún personaje.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto hub-scroll pr-0.5">
                  {tradeableWeapons.map((w) => {
                    const lvl = getWeaponLevel(w.id, weaponLevels, w.rarity);
                    const scaled = getScaledWeaponStats(w, lvl);
                    const isOffered =
                      myOffer?.kind === 'weapon' && myOffer.weaponId === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() =>
                          sendOffer(
                            isOffered
                              ? null
                              : {
                                  kind: 'weapon',
                                  weaponId: w.id,
                                  name: w.name,
                                  rarity: w.rarity,
                                  level: lvl,
                                }
                          )
                        }
                        className={`rounded-xl border p-2 text-left flex items-center gap-2.5 transition-all ${
                          isOffered
                            ? 'ring-2 ring-emerald-400 bg-emerald-950/45 border-emerald-300'
                            : `${RARITY_CARD_FRAME[w.rarity]} hover:brightness-110`
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/15 grid place-items-center shrink-0">
                          <WeaponIllustration weaponId={w.id} size={34} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-extrabold text-white truncate">
                              {w.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${RARITY_BADGE_STYLE[w.rarity]}`}
                            >
                              {w.rarity}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[8.5px] font-black text-amber-200 tabular-nums">
                              Nv.{scaled.level}/{scaled.maxLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[9.5px] font-bold tabular-nums">
                            {scaled.atk > 0 && (
                              <span className="text-rose-200">+{scaled.atk} ATQ</span>
                            )}
                            {scaled.hp > 0 && (
                              <span className="text-emerald-200">+{scaled.hp} VID</span>
                            )}
                            {scaled.spd > 0 && (
                              <span className="text-cyan-200">+{scaled.spd} VEL</span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-[9.5px] font-extrabold shrink-0 ${
                            isOffered
                              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-300/50'
                              : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                          }`}
                        >
                          {isOffered ? 'Ofrecida' : 'Ofrecer'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UNEQUIPPED ARTEFACTS */}
          {activeTab === 'artefactos' && (
            <div className="flex flex-col gap-2">
              <div className="text-[10.5px] font-bold text-slate-300">
                Artefactos sin equipar disponibles ({tradeableArtefacts.length})
              </div>
              {tradeableArtefacts.length === 0 ? (
                <div className="rounded-xl bg-[#080d1b] border border-white/10 p-3 text-center text-[11px] text-slate-400 leading-relaxed">
                  No tienes artefactos sin equipar. Solo se pueden intercambiar artefactos que no estén equipados en ningún personaje.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto hub-scroll pr-0.5">
                  {tradeableArtefacts.map((art) => {
                    const scaled = getScaledArtefactStats(art);
                    const isOffered =
                      myOffer?.kind === 'artefact' && myOffer.artefact.uid === art.uid;
                    return (
                      <button
                        key={art.uid}
                        type="button"
                        onClick={() =>
                          sendOffer(
                            isOffered
                              ? null
                              : {
                                  kind: 'artefact',
                                  artefact: {
                                    ...art,
                                    level: scaled.level,
                                  },
                                }
                          )
                        }
                        className={`rounded-xl border p-2 text-left flex items-center gap-2.5 transition-all ${
                          isOffered
                            ? 'ring-2 ring-emerald-400 bg-emerald-950/45 border-emerald-300'
                            : `${RARITY_CARD_FRAME[art.rarity]} hover:brightness-110`
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/15 grid place-items-center shrink-0">
                          <ArtefactPieceIllustration
                            slot={art.slot}
                            set={art.set}
                            size={34}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-extrabold text-white truncate">
                              {art.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${RARITY_BADGE_STYLE[art.rarity]}`}
                            >
                              {art.rarity}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-300/45 text-[8.5px] font-black text-amber-200 tabular-nums">
                              Nv.{scaled.level}/{scaled.maxLevel}
                            </span>
                          </div>
                          <div className="text-[9.5px] font-bold text-cyan-300 mt-0.5">
                            Set de {art.set}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] font-bold tabular-nums flex-wrap">
                            <span className="text-amber-200">
                              +{scaled.mainStat.val}{' '}
                              {ARTEFACT_STAT_SHORT[scaled.mainStat.stat]}
                            </span>
                            {scaled.subStats.map((sub, idx) => (
                              <span key={idx} className="text-sky-200/90">
                                +{sub.val} {ARTEFACT_STAT_SHORT[sub.stat]}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-[9.5px] font-extrabold shrink-0 ${
                            isOffered
                              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-300/50'
                              : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                          }`}
                        >
                          {isOffered ? 'Ofrecido' : 'Ofrecer'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOLD */}
          {activeTab === 'oro' && (
            <div className="rounded-xl bg-[#090e1d] border border-amber-400/35 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-200">
                  <GoldCoinIcon size={18} />
                  <span>Ofrecer Oro</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-300 tabular-nums">
                  Disponible:{' '}
                  <strong className="text-amber-200">{gold.toLocaleString('es-ES')}</strong>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={gold}
                  value={goldDraft}
                  onChange={(e) => setGoldDraft(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Cantidad de oro"
                  className="flex-1 rounded-xl bg-[#060914] border border-amber-400/40 px-3 py-2 text-sm font-extrabold text-amber-100 tabular-nums outline-none focus:border-amber-300"
                />
                <button
                  type="button"
                  disabled={parsedGold < 1 || parsedGold > gold}
                  onClick={() => sendOffer({ kind: 'gold', amount: parsedGold })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black disabled:opacity-40 hover:brightness-105 active:scale-[0.98]"
                >
                  Ofrecer
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: '+100', val: Math.min(gold, parsedGold + 100) },
                  { label: '+500', val: Math.min(gold, parsedGold + 500) },
                  { label: '+1.000', val: Math.min(gold, parsedGold + 1000) },
                  { label: '50%', val: Math.floor(gold * 0.5) },
                  { label: 'Máx.', val: gold },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    disabled={gold < 1}
                    onClick={() => setGoldDraft(String(Math.max(1, preset.val)))}
                    className="py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/35 text-[10px] font-extrabold text-amber-200 hover:bg-amber-500/25 disabled:opacity-35"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MAGIC CRYSTALS */}
          {activeTab === 'cristales' && (
            <div className="rounded-xl bg-[#090e1d] border border-cyan-400/35 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-200">
                  <MagicCrystalIcon size={18} />
                  <span>Ofrecer Cristales Mágicos</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-300 tabular-nums">
                  Disponibles:{' '}
                  <strong className="text-cyan-200">
                    {crystals.toLocaleString('es-ES')}
                  </strong>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={crystals}
                  value={crystalDraft}
                  onChange={(e) => setCrystalDraft(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Cantidad de cristales"
                  className="flex-1 rounded-xl bg-[#060914] border border-cyan-400/40 px-3 py-2 text-sm font-extrabold text-cyan-100 tabular-nums outline-none focus:border-cyan-300"
                />
                <button
                  type="button"
                  disabled={parsedCrystals < 1 || parsedCrystals > crystals}
                  onClick={() => sendOffer({ kind: 'crystals', amount: parsedCrystals })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-black disabled:opacity-40 hover:brightness-105 active:scale-[0.98]"
                >
                  Ofrecer
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: '+10', val: Math.min(crystals, parsedCrystals + 10) },
                  { label: '+50', val: Math.min(crystals, parsedCrystals + 50) },
                  { label: '+100', val: Math.min(crystals, parsedCrystals + 100) },
                  { label: '50%', val: Math.floor(crystals * 0.5) },
                  { label: 'Máx.', val: crystals },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    disabled={crystals < 1}
                    onClick={() => setCrystalDraft(String(Math.max(1, preset.val)))}
                    className="py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/35 text-[10px] font-extrabold text-cyan-200 hover:bg-cyan-500/25 disabled:opacity-35"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
