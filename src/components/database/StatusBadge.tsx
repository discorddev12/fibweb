export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    WANTED: "bg-red-900/60 text-red-300 border-red-700",
    "UNDER SURVEILLANCE": "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    "IN CUSTODY": "bg-green-900/60 text-green-300 border-green-700",
    CLASSIFIED: "bg-purple-900/60 text-purple-300 border-purple-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${colors[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}
