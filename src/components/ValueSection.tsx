import ValueCard from "@/components/ValueCard";

export default function ValueSection({
  title,
  values,
  className = "",
}: {
  title: string;
  values: { title: string; description: string }[];
  className?: string;
}) {
  const columnCount =
    values.length === 1
      ? "grid-cols-1"
      : values.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section className={`py-16 px-6 md:px-24 text-center ${className}`}>
      <h2 className="text-2xl font-semibold mb-8 text-heading">{title}</h2>
      <div className={`grid gap-6 text-left ${columnCount}`}>
        {values.map((val, index) => (
          <ValueCard key={index} {...val} />
        ))}
      </div>
    </section>
  );
}
