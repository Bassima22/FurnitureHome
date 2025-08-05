type DataName= {
    text:string;
}
const Topbar = ({text}:DataName) => {
  return (
    <div className="border border-red-500 rounded-md p-4 w-full max-w-5xl mx-auto mt-4 text-center">
      <span className="text-red-500 font-mono italic text-3xl font-bold" >{text}</span>
    </div>
  );
};

export default Topbar