import { Truck, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: 'Secure Checkout',
      description: 'SSL encrypted connection & safe Cash on Delivery checkout.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Truck,
      title: 'Cash on Delivery',
      description: 'Pay with cash at your doorstep. Risk-free shopping experience.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Checked',
      description: 'Every product is hand-inspected and tested before shipping.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: RotateCcw,
      title: 'Fast Delivery & Returns',
      description: 'Dispatched within 24 hours. Easy, hassle-free returns.',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badge.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{badge.title}</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{badge.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
