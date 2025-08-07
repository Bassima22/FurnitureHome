type DataName = {
  text: string;
};

const Topbar = ({ text }: DataName) => {
  return (
   <div className="h-[10%] flex items-centre mt-0 mb-2 ml-2">
  <span className="text-black font-mono text-lg italic font-bold leading-none whitespace-nowrap">
    {text}
  </span>
</div>

  );
};

export default Topbar;
