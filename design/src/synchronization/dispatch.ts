import type { AuthorizedPublisher, EventStore } from '../contracts/ports';
export async function dispatchPending(store: EventStore, publisher: AuthorizedPublisher): Promise<void> {
  for (const event of await store.pending()) {
    await publisher.publish(event);
    await store.delivered(event.id);
  }
}
