import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { storeSettings } from "../../mocks/storeSettings";
import { useSettings } from "../../lib/queries";
import { StoreLogo } from "./StoreLogo";
export function CheckoutLayout() { const { data: savedSettings } = useSettings(); const settings = savedSettings ?? storeSettings; return <div className="min-h-screen"><header className="border-b border-border bg-white"><div className="page-container flex h-16 items-center justify-between"><Link to="/keranjang" className="flex items-center gap-2 text-sm font-bold"><ArrowLeft size={18}/> Kembali</Link><span className="flex items-center gap-2 font-heading font-bold"><StoreLogo logoUrl={settings.logoUrl} className="h-8 w-8" iconSize={18}/>{settings.storeName}</span></div></header><Outlet /></div>; }
