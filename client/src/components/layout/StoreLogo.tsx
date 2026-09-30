import { Store } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

type StoreLogoProps = { logoUrl?: string | null; className?: string; iconSize?: number };

export function StoreLogo({ logoUrl, className, iconSize = 17 }: StoreLogoProps) {
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => setUnavailable(false), [logoUrl]);

  if (logoUrl && !unavailable) return <img src={logoUrl} alt="Logo toko" onError={() => setUnavailable(true)} className={cn("shrink-0 rounded-lg border border-border bg-white object-cover", className)}/>;
  return <span className={cn("grid shrink-0 place-items-center rounded-lg bg-primary text-white", className)}><Store size={iconSize}/></span>;
}
