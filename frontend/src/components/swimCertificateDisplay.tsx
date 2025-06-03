import { downloadSwimCert } from "@/swim_cert";
import { Download, FileImage, FileText } from "lucide-react";

export default function SwimCertificateDisplay({ path }: { path: string }) {
  const size = 40
  const stroke = 1
  const icon = path.endsWith(".pdf") ? <FileText size={size} strokeWidth={stroke} /> : <FileImage size={size} strokeWidth={stroke} />;
  const ext = path.match(/\.([^.]+)$/)?.[1] ?? null;

  async function handleDownload() {
    const ok = await downloadSwimCert(path);
    if (!ok) console.warn("Download failed");
  }

  return (
    <div
      className="border rounded-xl items-center flex gap-3 p-2 hover:bg-neutral-100 hover:cursor-pointer group w-auto"
      onClick={handleDownload}>
      {icon}
      <span>Schwimmnachweis | {ext?.toUpperCase()}</span>
      <Download className="invisible group-hover:visible" />
    </div>
  )
}