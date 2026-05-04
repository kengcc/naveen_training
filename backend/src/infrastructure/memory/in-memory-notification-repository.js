const clone = (value) => structuredClone(value);

export class InMemoryNotificationRepository {
  constructor(seed = []) {
    this.items = seed.map(clone);
  }

  async record(notification) {
    const normalized = {
      ...notification,
      createdAt: notification.createdAt ?? new Date().toISOString()
    };

    this.items.push(clone(normalized));
    return clone(normalized);
  }

  async all() {
    return this.items.map(clone);
  }
}
