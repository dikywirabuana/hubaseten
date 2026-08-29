import { Camera, MapPin, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { compressImage, readDeviceGeo, readJpegGps } from "@/lib/simaset/geo-photo";
import { Button } from "@/components/ui/button";

export function CameraGeotag({
  photo,
  lat,
  lng,
  onChange,
}: {
  photo: string | null;
  lat: number | null;
  lng: number | null;
  onChange: (next: { photo: string | null; lat: number | null; lng: number | null }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setHint("Membaca foto dan koordinat…");
    try {
      const [compressed, exif, device] = await Promise.all([
        compressImage(file),
        readJpegGps(file),
        readDeviceGeo(),
      ]);
      const geo = exif ?? device;
      onChange({
        photo: compressed,
        lat: geo?.lat ?? lat,
        lng: geo?.lng ?? lng,
      });
      setHint(
        geo
          ? `Koordinat tersimpan ${geo.lat.toFixed(6)}, ${geo.lng.toFixed(6)}`
          : "Foto tersimpan. Izinkan lokasi agar koordinat terisi otomatis.",
      );
    } catch (err) {
      setHint(err instanceof Error ? err.message : "Gagal memproses foto");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 sm:col-span-2">
      <p className="text-sm font-medium">Kamera & geotag</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Ambil foto aset. Koordinat GPS dari kamera atau perangkat disimpan otomatis.
      </p>
      <div className="mt-3 flex flex-wrap items-start gap-3">
        {photo ? (
          <img src={photo} alt="Foto aset" className="h-28 w-36 rounded-md object-cover" />
        ) : (
          <div className="grid h-28 w-36 place-items-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground">
            Belum ada foto
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
              <Camera className="size-4" /> {busy ? "Memproses…" : "Ambil / unggah foto"}
            </Button>
            {photo && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  onChange({ photo: null, lat, lng });
                  setHint(null);
                }}
              >
                <Trash2 className="size-4" /> Hapus foto
              </Button>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {lat != null && lng != null
              ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
              : "Koordinat belum terisi"}
          </p>
          {hint ? <p className="text-xs text-accent">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
