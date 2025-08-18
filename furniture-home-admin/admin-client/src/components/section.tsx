const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const isGallery = title.toLowerCase() === "gallery";
 

  return (
    <div
      className={`flex-1 py-1 border border-black rounded p-4 m-2 ${
        isGallery ? "bg-blue-100" : "bg-gray-300"
      }`}
    >
      <h2 className="text-center font-semibold text-black mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default Section;
