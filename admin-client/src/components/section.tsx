const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 border border-red-300 rounded p-4 m-2">
      <h2 className="text-center font-semibold text-red-500 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default Section;
