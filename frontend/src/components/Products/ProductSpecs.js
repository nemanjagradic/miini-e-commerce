const ProductSpecs = ({ weight, dimensions, size }) => {
  const specs = [
    { label: "Weight", value: weight },
    { label: "Dimensions", value: dimensions },
    ...(size ? [{ label: "Size", value: size }] : []),
  ];

  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Product details
      </h3>
      <dl className="space-y-3">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex gap-4">
            <dt className="w-28 shrink-0 text-sm font-medium text-gray-700">
              {label}
            </dt>
            <dd className="text-sm text-gray-600">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ProductSpecs;
