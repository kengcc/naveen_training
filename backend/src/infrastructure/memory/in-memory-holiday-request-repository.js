const clone = (value) => structuredClone(value);

export class InMemoryHolidayRequestRepository {
  constructor(seed = []) {
    this.items = new Map(seed.map((item) => [item.id, clone(item)]));
  }

  async save(request) {
    this.items.set(request.id, clone(request));
    return clone(request);
  }

  async findById(id) {
    const item = this.items.get(id);
    return item ? clone(item) : null;
  }

  async listByUserId(userId) {
    return [...this.items.values()].filter((item) => item.userId === userId).map(clone);
  }

  async listPending() {
    return [...this.items.values()].filter((item) => item.status === 'pending').map(clone);
  }
}
