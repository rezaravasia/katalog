import { Eye, KeyRound, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { api } from "../../lib/api";
import { storeSettings } from "../../mocks/storeSettings";
import type { StoreSettings } from "../../types/catalog";

type EditableSettings = StoreSettings;

function WhatsAppPreview({ value }: { value: string }) {
  const chunks = value.split(/(\*[^*]+\*)/g);

  return <div className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
    {chunks.map((chunk, index) => chunk.startsWith("*") && chunk.endsWith("*")
      ? <strong key={index} className="font-bold text-gray-950">{chunk.slice(1, -1)}</strong>
      : <span key={index}>{chunk}</span>)}
  </div>;
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<EditableSettings>(storeSettings);
  const [notice, setNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => api.adminSettings().then((result) => result.data),
  });

  useEffect(() => {
    if (!data) return;
    setSettings((current) => ({
      ...current,
      ...data,
      logoUrl: data.logoUrl ?? "",
      address: data.address ?? "",
      openHours: data.openHours ?? "",
    }));
  }, [data]);

  const preview = useMemo(() => settings.messageTemplate
    .replaceAll("{nama_toko}", settings.storeName || "Nama Toko")
    .replaceAll("{items}", "1. Contoh Produk\n   Jumlah: 1\n   Harga: Rp50.000")
    .replaceAll("{total}", "50.000")
    .replaceAll("{nama_pembeli}", "Budi Santoso")
    .replaceAll("{no_hp}", "0812-3456-7890")
    .replaceAll("{catatan}", "Pengiriman sore hari"), [settings]);

  const save = useMutation({
    mutationFn: () => api.updateSettings({
      storeName: settings.storeName,
      logoUrl: settings.logoUrl || null,
      whatsappNumber: settings.whatsappNumber,
      address: settings.address || null,
      openHours: settings.openHours || null,
      messageTemplate: settings.messageTemplate,
      description: settings.description,
    }),
    onSuccess: ({ data: saved }) => {
      setSettings((current) => ({ ...current, ...saved, logoUrl: saved.logoUrl ?? "", address: saved.address ?? "", openHours: saved.openHours ?? "" }));
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setNotice("Pengaturan berhasil disimpan.");
    },
    onError: (saveError) => setNotice((saveError as Error).message),
  });

  const changePassword = useMutation({
    mutationFn: () => api.changePassword(passwords.currentPassword, passwords.newPassword),
    onSuccess: () => {
      queryClient.clear();
      navigate("/admin/login?passwordChanged=1", { replace: true });
    },
    onError: (changeError) => setPasswordNotice((changeError as Error).message),
  });

  const update = <K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) => {
    setNotice("");
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return <div>
    <div><p className="text-xs font-bold uppercase tracking-[.15em] text-gray-500">Toko</p><h1 className="mt-1 text-2xl font-bold">Pengaturan</h1></div>
    {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-xs font-bold text-danger">{(error as Error).message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); save.mutate(); }} className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-5">
        <section className="rounded-lg border border-border bg-white p-4 sm:p-5">
          <h2 className="text-lg font-bold">Profil Toko</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold sm:col-span-2">Nama toko<Input required className="mt-2" value={settings.storeName} onChange={(event) => update("storeName", event.target.value)}/></label>
            <label className="block text-xs font-bold">Nomor WhatsApp<Input required className="mt-2 font-mono" placeholder="6281234567890" value={settings.whatsappNumber} onChange={(event) => update("whatsappNumber", event.target.value)}/></label>
            <label className="block text-xs font-bold">Jam operasional<Input className="mt-2" value={settings.openHours} onChange={(event) => update("openHours", event.target.value)}/></label>
            <label className="block text-xs font-bold sm:col-span-2">URL logo (opsional)<Input type="url" className="mt-2" placeholder="https://..." value={settings.logoUrl} onChange={(event) => update("logoUrl", event.target.value)}/></label>
            <label className="block text-xs font-bold sm:col-span-2">Alamat<textarea className="mt-2 min-h-24 w-full rounded-lg border border-border bg-white p-3 text-sm outline-none focus:border-primary" value={settings.address} onChange={(event) => update("address", event.target.value)}/></label>
          </div>
        </section>
        <section className="rounded-lg border border-border bg-white p-4 sm:p-5">
          <h2 className="text-lg font-bold">Template Pesan WhatsApp</h2>
          <p className="mt-2 text-xs leading-5 text-gray-500">Gunakan placeholder: {"{nama_toko}"}, {"{items}"}, {"{total}"}, {"{nama_pembeli}"}, {"{no_hp}"}, dan {"{catatan}"}. Tanda <code>*teks*</code> akan menjadi tebal di WhatsApp.</p>
          <textarea required className="mt-4 min-h-72 w-full rounded-lg border border-border bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-primary" value={settings.messageTemplate} onChange={(event) => update("messageTemplate", event.target.value)}/>
        </section>
        {notice && <p className={`rounded-md p-3 text-xs font-bold ${save.isError ? "bg-red-50 text-danger" : "bg-green-50 text-success"}`}>{notice}</p>}
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || save.isPending}><Save size={16}/>{save.isPending ? "Menyimpan…" : "Simpan Pengaturan"}</Button>
      </div>
      <aside className="h-fit rounded-lg border border-border bg-white p-4 sm:p-5 lg:sticky lg:top-20">
        <div className="flex items-center gap-2"><Eye size={18}/><h2 className="text-lg font-bold">Preview Pesan</h2></div>
        <p className="mt-2 text-xs leading-5 text-gray-500">Tampilan ini meniru format pesan WhatsApp. Karakter pembungkus bold tidak ditampilkan.</p>
        <div className="mt-4 rounded-md border border-border bg-gray-50 p-4"><WhatsAppPreview value={preview}/></div>
      </aside>
    </form>
    <section className="mt-5 max-w-2xl rounded-lg border border-border bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2"><KeyRound size={18}/><h2 className="text-lg font-bold">Keamanan Akun</h2></div>
      <p className="mt-2 text-xs leading-5 text-gray-500">Ubah kata sandi pemilik toko. Setelah berhasil, Anda akan diminta masuk kembali.</p>
      <form onSubmit={(event) => {
        event.preventDefault();
        setPasswordNotice("");
        if (passwords.newPassword !== passwords.confirmPassword) return setPasswordNotice("Konfirmasi kata sandi baru tidak sama.");
        changePassword.mutate();
      }} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold sm:col-span-2">Kata sandi saat ini<Input required minLength={8} maxLength={100} autoComplete="current-password" type="password" className="mt-2" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}/></label>
        <label className="block text-xs font-bold">Kata sandi baru<Input required minLength={8} maxLength={100} autoComplete="new-password" type="password" className="mt-2" value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}/></label>
        <label className="block text-xs font-bold">Ulangi kata sandi baru<Input required minLength={8} maxLength={100} autoComplete="new-password" type="password" className="mt-2" value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}/></label>
        {passwordNotice && <p className="rounded-md bg-red-50 p-3 text-xs font-bold text-danger sm:col-span-2">{passwordNotice}</p>}
        <Button type="submit" className="sm:col-span-2 sm:w-fit" disabled={changePassword.isPending}><KeyRound size={16}/>{changePassword.isPending ? "Mengubah…" : "Ubah Kata Sandi"}</Button>
      </form>
    </section>
  </div>;
}
