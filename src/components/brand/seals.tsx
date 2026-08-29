export function BantenSeal({ className }: { className?: string }) {
  return (
    <img
      src="/brand/lambang-banten.png"
      alt="Lambang Provinsi Banten"
      className={className}
    />
  );
}

export function DishubSeal({ className }: { className?: string }) {
  return (
    <img
      src="/brand/lambang-perhubungan.png"
      alt="Lambang Dinas Perhubungan"
      className={className}
    />
  );
}

export function BrandLockup({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const muted = variant === "dark" ? "text-sidebar-muted" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-2.5">
      <BantenSeal className="size-11 shrink-0 object-contain" />
      <DishubSeal className="size-11 shrink-0 object-contain" />
      <div className="min-w-0">
        <p className="font-display text-lg leading-none">SIMASET</p>
        <p className={`mt-1 text-[10px] tracking-[0.12em] uppercase ${muted}`}>
          Dishub Provinsi Banten
        </p>
      </div>
    </div>
  );
}
