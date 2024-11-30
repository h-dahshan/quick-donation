export default function FormSection({
  children,
  label,
}: Readonly<{
  children: React.ReactNode;
  label: string;
}>) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-l font-semibold tracking-tight">{label}</h2>
      {children}
    </div>
  );
}
