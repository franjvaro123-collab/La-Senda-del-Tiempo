import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

type Rarity = 'Bronce' | 'Plata' | 'Oro';
type ArtefactSlot = 'casco' | 'pechera' | 'brazalete' | 'bota';
type ArtefactSet = 'Valquiria' | 'Coloso' | 'Furia' | 'Cronos';
type ArtefactStatType = 'hp' | 'atk' | 'def' | 'spd';

interface ArtefactStatRoll {
  stat: ArtefactStatType;
  val: number;
}

interface OwnedArtefactPayload {
  uid: string;
  templateId: string;
  slot: ArtefactSlot;
  name: string;
  set: ArtefactSet;
  rarity: Rarity;
  level: number;
  mainStat: ArtefactStatRoll;
  subStats: [ArtefactStatRoll, ArtefactStatRoll];
}

type TradeOffer =
  | {
      kind: 'weapon';
      weaponId: string;
      name: string;
      rarity: Rarity;
      level: number;
    }
  | {
      kind: 'artefact';
      artefact: OwnedArtefactPayload;
    }
  | {
      kind: 'gold';
      amount: number;
    }
  | {
      kind: 'crystals';
      amount: number;
    };

const VALID_RARITIES = new Set<Rarity>(['Bronce', 'Plata', 'Oro']);
const VALID_SLOTS = new Set<ArtefactSlot>(['casco', 'pechera', 'brazalete', 'bota']);
const VALID_SETS = new Set<ArtefactSet>(['Valquiria', 'Coloso', 'Furia', 'Cronos']);
const VALID_STATS = new Set<ArtefactStatType>(['hp', 'atk', 'def', 'spd']);

function sanitizeStatRoll(raw: unknown): ArtefactStatRoll | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.stat !== 'string' || !VALID_STATS.has(r.stat as ArtefactStatType)) return null;
  if (typeof r.val !== 'number' || !Number.isFinite(r.val) || r.val <= 0) return null;
  return { stat: r.stat as ArtefactStatType, val: Math.min(9999, Math.floor(r.val)) };
}

function sanitizeTradeOffer(raw: unknown): TradeOffer | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const kind = obj.kind;

  if (kind === 'gold' || kind === 'crystals') {
    const amount = typeof obj.amount === 'number' && Number.isFinite(obj.amount) ? Math.floor(obj.amount) : 0;
    const maxCap = kind === 'gold' ? 100_000_000 : 1_000_000;
    if (amount < 1 || amount > maxCap) return null;
    return { kind, amount };
  }

  if (kind === 'weapon') {
    if (typeof obj.weaponId !== 'string' || !obj.weaponId.trim()) return null;
    const rarity: Rarity =
      typeof obj.rarity === 'string' && VALID_RARITIES.has(obj.rarity as Rarity)
        ? (obj.rarity as Rarity)
        : 'Bronce';
    const level =
      typeof obj.level === 'number' && Number.isFinite(obj.level) && obj.level >= 1
        ? Math.min(20, Math.floor(obj.level))
        : 1;
    const name =
      typeof obj.name === 'string' && obj.name.trim()
        ? obj.name.trim().slice(0, 48)
        : obj.weaponId.slice(0, 48);
    return {
      kind: 'weapon',
      weaponId: obj.weaponId.slice(0, 48),
      name,
      rarity,
      level,
    };
  }

  if (kind === 'artefact') {
    const artRaw = obj.artefact as Record<string, unknown> | undefined;
    if (!artRaw || typeof artRaw !== 'object') return null;
    if (typeof artRaw.uid !== 'string' || !artRaw.uid.trim()) return null;
    if (typeof artRaw.templateId !== 'string' || !artRaw.templateId.trim()) return null;
    if (typeof artRaw.slot !== 'string' || !VALID_SLOTS.has(artRaw.slot as ArtefactSlot)) return null;
    if (typeof artRaw.set !== 'string' || !VALID_SETS.has(artRaw.set as ArtefactSet)) return null;
    const rarity: Rarity =
      typeof artRaw.rarity === 'string' && VALID_RARITIES.has(artRaw.rarity as Rarity)
        ? (artRaw.rarity as Rarity)
        : 'Bronce';
    const mainStat = sanitizeStatRoll(artRaw.mainStat);
    const subRaw = Array.isArray(artRaw.subStats) ? artRaw.subStats : [];
    const sub0 = sanitizeStatRoll(subRaw[0]);
    const sub1 = sanitizeStatRoll(subRaw[1]);
    if (!mainStat || !sub0 || !sub1) return null;
    const level =
      typeof artRaw.level === 'number' && Number.isFinite(artRaw.level) && artRaw.level >= 1
        ? Math.min(20, Math.floor(artRaw.level))
        : 1;
    const name =
      typeof artRaw.name === 'string' && artRaw.name.trim()
        ? artRaw.name.trim().slice(0, 48)
        : artRaw.templateId.slice(0, 48);
    return {
      kind: 'artefact',
      artefact: {
        uid: artRaw.uid.slice(0, 64),
        templateId: artRaw.templateId.slice(0, 48),
        slot: artRaw.slot as ArtefactSlot,
        name,
        set: artRaw.set as ArtefactSet,
        rarity,
        level,
        mainStat,
        subStats: [sub0, sub1],
      },
    };
  }

  return null;
}

interface RoomParticipant {
  playerId: string;
  playerName: string;
  offer: TradeOffer | null;
  ready: boolean;
  connected: boolean;
}

interface TradeRoom {
  code: string;
  host: RoomParticipant;
  guest: RoomParticipant | null;
  status: 'waiting' | 'trading' | 'completed';
  updatedAt: number;
}

interface ClientMeta {
  playerId: string;
  roomCode: string | null;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const rooms = new Map<string, TradeRoom>();
const clientMeta = new WeakMap<WebSocket, ClientMeta>();
const roomSockets = new Map<string, Set<WebSocket>>();

function generateRoomCode(): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    if (!rooms.has(code)) return code;
  }
  return Date.now().toString(36).toUpperCase().slice(-6).padStart(6, 'A');
}

function sanitizeCode(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

function sendJson(ws: WebSocket, payload: unknown): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcastRoom(code: string, extraEvent?: { type: string; data: unknown }): void {
  const room = rooms.get(code);
  const sockets = roomSockets.get(code);
  if (!room || !sockets) return;

  const statePayload = {
    type: 'room:state',
    room: {
      code: room.code,
      status: room.status,
      host: room.host,
      guest: room.guest,
    },
  };

  for (const sock of sockets) {
    sendJson(sock, statePayload);
    if (extraEvent) {
      sendJson(sock, extraEvent);
    }
  }
}

function attachSocketToRoom(ws: WebSocket, code: string, playerId: string): void {
  const prev = clientMeta.get(ws);
  if (prev?.roomCode && prev.roomCode !== code) {
    detachSocketFromRoom(ws);
  }
  clientMeta.set(ws, { playerId, roomCode: code });
  let set = roomSockets.get(code);
  if (!set) {
    set = new Set<WebSocket>();
    roomSockets.set(code, set);
  }
  set.add(ws);
}

function detachSocketFromRoom(ws: WebSocket): void {
  const meta = clientMeta.get(ws);
  if (!meta?.roomCode) return;

  const code = meta.roomCode;
  const set = roomSockets.get(code);
  if (set) {
    set.delete(ws);
    if (set.size === 0) {
      roomSockets.delete(code);
    }
  }

  const room = rooms.get(code);
  if (room) {
    if (room.host.playerId === meta.playerId) {
      room.host.connected = false;
      room.host.ready = false;
    } else if (room.guest && room.guest.playerId === meta.playerId) {
      room.guest.connected = false;
      room.guest.ready = false;
    }
    room.updatedAt = Date.now();
    if (!room.host.connected && (!room.guest || !room.guest.connected)) {
      // Keep room briefly for reconnects; periodic cleanup removes stale rooms
    } else {
      broadcastRoom(code);
    }
  }

  clientMeta.set(ws, { playerId: meta.playerId, roomCode: null });
}

// Prune inactive rooms every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [code, room] of rooms.entries()) {
    if (room.updatedAt < cutoff) {
      rooms.delete(code);
      roomSockets.delete(code);
    }
  }
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, rooms: rooms.size });
  });

  const wss = new WebSocketServer({ server, path: '/ws/trade' });

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as Record<string, unknown>;
        const type = typeof msg.type === 'string' ? msg.type : '';
        const playerId = typeof msg.playerId === 'string' ? msg.playerId.slice(0, 64) : '';
        const playerName =
          typeof msg.playerName === 'string' && msg.playerName.trim()
            ? msg.playerName.trim().slice(0, 24)
            : 'Viajero';

        if (!playerId) {
          sendJson(ws, { type: 'room:error', message: 'Identificador de jugador inválido.' });
          return;
        }

        if (type === 'room:create') {
          const code = generateRoomCode();
          const room: TradeRoom = {
            code,
            host: {
              playerId,
              playerName,
              offer: null,
              ready: false,
              connected: true,
            },
            guest: null,
            status: 'waiting',
            updatedAt: Date.now(),
          };
          rooms.set(code, room);
          attachSocketToRoom(ws, code, playerId);
          broadcastRoom(code);
          return;
        }

        if (type === 'room:join') {
          const code = sanitizeCode(msg.code);
          if (code.length !== 6) {
            sendJson(ws, {
              type: 'room:error',
              message: 'El código debe tener exactamente 6 letras o números en mayúscula.',
            });
            return;
          }
          const room = rooms.get(code);
          if (!room) {
            sendJson(ws, {
              type: 'room:error',
              message: `No existe ninguna sala activa con el código ${code}.`,
            });
            return;
          }

          if (room.host.playerId === playerId) {
            room.host.connected = true;
            room.host.playerName = playerName;
          } else if (room.guest && room.guest.playerId === playerId) {
            room.guest.connected = true;
            room.guest.playerName = playerName;
          } else if (!room.guest) {
            room.guest = {
              playerId,
              playerName,
              offer: null,
              ready: false,
              connected: true,
            };
          } else if (!room.guest.connected) {
            room.guest = {
              playerId,
              playerName,
              offer: null,
              ready: false,
              connected: true,
            };
          } else {
            sendJson(ws, {
              type: 'room:error',
              message: `La sala ${code} ya está llena (2/2 jugadores).`,
            });
            return;
          }

          if (room.status === 'waiting' && room.guest?.connected) {
            room.status = 'trading';
          }
          room.updatedAt = Date.now();
          attachSocketToRoom(ws, code, playerId);
          broadcastRoom(code);
          return;
        }

        const code = sanitizeCode(msg.code);
        const room = rooms.get(code);
        if (!room) {
          sendJson(ws, { type: 'room:error', message: 'La sala ya no existe.' });
          return;
        }

        const actor =
          room.host.playerId === playerId
            ? room.host
            : room.guest?.playerId === playerId
              ? room.guest
              : null;

        if (!actor) {
          sendJson(ws, { type: 'room:error', message: 'No perteneces a esta sala.' });
          return;
        }

        if (type === 'trade:offer') {
          if (room.status === 'completed') return;
          actor.offer = msg.offer === null ? null : sanitizeTradeOffer(msg.offer);
          // Reset ready flags when either player modifies their offer
          room.host.ready = false;
          if (room.guest) room.guest.ready = false;
          room.updatedAt = Date.now();
          broadcastRoom(code);
          return;
        }

        if (type === 'trade:ready') {
          if (room.status === 'completed') return;
          if (!actor.offer) {
            sendJson(ws, {
              type: 'room:error',
              message: 'Selecciona primero un arma, artefacto, oro o cristales para intercambiar.',
            });
            return;
          }
          actor.ready = Boolean(msg.ready);
          room.updatedAt = Date.now();

          if (
            room.guest &&
            room.host.connected &&
            room.guest.connected &&
            room.host.offer &&
            room.guest.offer &&
            room.host.ready &&
            room.guest.ready
          ) {
            room.status = 'completed';
            const swapPayload = {
              tradeId: `tr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
              hostPlayerId: room.host.playerId,
              guestPlayerId: room.guest.playerId,
              hostOffer: room.host.offer,
              guestOffer: room.guest.offer,
            };
            broadcastRoom(code, { type: 'trade:executed', data: swapPayload });
          } else {
            broadcastRoom(code);
          }
          return;
        }

        if (type === 'room:reset') {
          room.host.offer = null;
          room.host.ready = false;
          if (room.guest) {
            room.guest.offer = null;
            room.guest.ready = false;
          }
          room.status = room.guest?.connected ? 'trading' : 'waiting';
          room.updatedAt = Date.now();
          broadcastRoom(code);
          return;
        }

        if (type === 'room:leave') {
          if (room.host.playerId === playerId) {
            const sockets = roomSockets.get(code);
            if (sockets) {
              for (const sock of sockets) {
                if (sock !== ws) {
                  sendJson(sock, {
                    type: 'room:error',
                    message: 'El anfitrión cerró la sala de intercambio.',
                  });
                }
              }
            }
            rooms.delete(code);
            roomSockets.delete(code);
          } else if (room.guest && room.guest.playerId === playerId) {
            room.guest = null;
            room.host.ready = false;
            room.status = 'waiting';
            room.updatedAt = Date.now();
            detachSocketFromRoom(ws);
            broadcastRoom(code);
          }
        }
      } catch {
        sendJson(ws, { type: 'room:error', message: 'Mensaje inválido.' });
      }
    });

    ws.on('close', () => {
      detachSocketFromRoom(ws);
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Senda del Tiempo server running on http://0.0.0.0:${port}`);
  });
}

startServer();
