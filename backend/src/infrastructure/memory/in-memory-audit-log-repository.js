const clone = (value) => structuredClone(value);

export class InMemoryAuditLogRepository {
  constructor(seed = []) {
    this.items = seed.map(clone);
  }

  async record(entry) {
    const normalized = {
      ...entry,
      createdAt: entry.createdAt ?? new Date().toISOString()
    };

    this.items.push(clone(normalized));
    return clone(normalized);
  }

  async all() {
    return this.items.map(clone);
  }
}
