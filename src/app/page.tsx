import { QimenCalculator } from '@/components/qimen/QimenCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          奇門遁甲 · 日家奇門
        </h1>
        <QimenCalculator />
      </div>
    </main>
  );
}
