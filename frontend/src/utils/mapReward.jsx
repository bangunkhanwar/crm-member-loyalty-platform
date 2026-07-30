export function mapReward(r) {
  return {
    id: r.id,
    name: r.name,
    image: r.image,
    pointRequired: r.pointsNeeded,
    category: r.category || 'Voucher',
    daysLeft: r.expiryDays,
    status: r.stock > 0 ? 'tersedia' : 'habis',
  };
}