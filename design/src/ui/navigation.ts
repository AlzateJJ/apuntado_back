import type { CloseCommand } from '../contracts/model';
import type { GameGateway } from '../contracts/ports';
export async function requestClose(gateway: GameGateway, gameId: string, command: CloseCommand): Promise<string> {
  const result = await gateway.close(gameId, command);
  return result.next === 'home' ? '/' : `/games/${gameId}/next-round`;
}
