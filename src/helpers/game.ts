// src/game.ts

// Lógica del juego, funciones relacionadas con el juego

export let playerInTurn = { userId: '', userName: '', userAvatar: '' };
export let canDraw = false;

export function removeChatMessages(messages: HTMLElement) {
  while (messages.firstChild) {
    messages.removeChild(messages.firstChild);
  }
}

export function getSenderName(chatMessagePayload: any, userId: string) {
  return userId === chatMessagePayload.senderId ? 'Tú' : chatMessagePayload.senderName;
}

export function setPlayerInTurn(roundInfo: any) {
  if (!roundInfo) return;
  playerInTurn = roundInfo.playerInTurn;
}

export function isPlayerInTurn(userId: string) {
  return playerInTurn.userId === userId;
}

export function setCanDrawCanvas(canDrawCanvas: boolean) {
  canDraw = canDrawCanvas;
}

export function canDrawCanvas() {
  return canDraw;
}

export function handleEventType(
  communicationInterface: any,
  messages: HTMLElement,
  userId: string,
  ctx: CanvasRenderingContext2D,
  canvasOffsetX: number
) {
  switch (communicationInterface.gameEventType) {
    case 'ROUND_NOTIFICATION':
      handleRoundNotification(communicationInterface.roundNotificationPayload);
      break;
    case 'CHAT_MESSAGE':
      handleChatMessage(communicationInterface.chatMessagePayload, messages, userId);
      break;
    case 'GAME_OVER':
      handleGameOver(messages);
      break;
    case 'USER_DRAW':
      handleSentDraw(communicationInterface.drawPayload, ctx);
      break;
    case 'MOUSE_UP':
      handleSentMouseUp(ctx);
      break;
    default:
      console.error('Invalid game event type', communicationInterface);
  }
}

export function handleRoundNotification(payload: any) {
  setPlayerInTurn(payload.roundInfo);
  setCanDrawCanvas(isPlayerInTurn(payload.roundInfo.playerInTurn.userId));
  alert(payload.message);
}

export function handleChatMessage(chatMessagePayload: any, messages: HTMLElement, userId: string) {
  const senderName = getSenderName(chatMessagePayload, userId);
  const item = document.createElement('li');
  item.textContent = `${senderName}: ${chatMessagePayload.message}`;
  messages.appendChild(item);
}

export function handlePlayerDrawing(e: MouseEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, socket: WebSocket, canvasOffsetX: number, userId: string) {
  if (!canDrawCanvas() || !isPlayerPainting()) return;

  draw(e, ctx, canvasOffsetX);

  const gameEventType = 'USER_DRAW';
  const x = e.clientX - canvasOffsetX;
  const y = e.clientY;
  const drawPayload = { x, y };

  socket.send(JSON.stringify({
    gameEventType,
    drawPayload
  }));
}

export function handleSentDraw(userDrawPayload: any, ctx: CanvasRenderingContext2D) {
  if (isPlayerInTurn(userDrawPayload.userId)) return;

  const { x, y } = userDrawPayload;
  ctx.lineTo(x, y);
  ctx.stroke();
}

export function handleSentMouseUp(ctx: CanvasRenderingContext2D) {
  if (isPlayerInTurn(playerInTurn.userId)) return;
  handleMouseUp(ctx);
}

export function handleGameOver(messages: HTMLElement) {
  removeChatMessages(messages);
  console.log("Game has finished");
  alert("Game has finished");
}

// Funciones adicionales para manejar eventos del mouse y dibujo
let isPainting = false;

export function draw(e: MouseEvent, ctx: CanvasRenderingContext2D, canvasOffsetX: number) {
  if (!isPainting) return;

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
  ctx.stroke();
}

export function handleMouseDown(e: MouseEvent) {
  isPainting = true;
}

export function handleMouseUp(ctx: CanvasRenderingContext2D) {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
}

export function isPlayerPainting() {
  return isPainting;
}
