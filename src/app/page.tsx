import { QimenCalculator } from '@/components/qimen/QimenCalculator';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-radial from-teal-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
            <span className="text-xs tracking-[0.3em] uppercase text-stone-500">
              專業命理排盤系統
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-gold mb-3">
            奇門遁甲
          </h1>
          <p className="text-lg md:text-xl text-stone-400 font-display tracking-wider">
            日家奇門 · 洞察天機
          </p>
        </header>

        <QimenCalculator />
      </div>
    </main>
  );
}
