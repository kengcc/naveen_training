const clone = (value) => structuredClone(value);

function keyFor(userId, year) {
  return `${userId}:${year}`;
}

export class InMemoryLeaveBalanceRepository {
  constructor(seed = []) {
    this.items = new Map(seed.map((item) => [keyFor(item.userId, item.year), clone(item)]));
  }

  async save(balance) {
    this.items.set(keyFor(balance.userId, balance.year), clone(balance));
    return clone(balance);
  }

  async findByUserIdAndYear(userId, year) {
    const item = this.items.get(keyFor(userId, year));
    return item ? clone(item) : null;
  }

  async listByUserId(userId) {
    return [...this.items.values()].filter((item) => item.userId === userId).map(clone);
  }
}
