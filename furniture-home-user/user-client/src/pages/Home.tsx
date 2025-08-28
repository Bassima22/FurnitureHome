
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";

const categories = [
  { title: "kitchen", slug: "kitchen" , image: "/kitchen.jpg"},
  { title: "living room", slug: "living-room", image: "/livingroom.jpg" },
  { title: "bedroom", slug: "bedroom" , image:"/bedroom.jpg"},
  { title: "contact us", slug: "contact-us" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="relative h-[42vh] md:h-[54vh] bg-[url('/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow">
            FURNITURE HOME
          </h1>
        </div>
      </section>

      
      <div className="relative flex-1 bg-[url('/about.jpg')] bg-cover bg-center bg-no-repeat">
   
        <div className="relative -mt-16 md:-mt-24 max-w-7xl mx-auto px-4 z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <CategoryCard key={c.slug} {...c} />
            ))}
          </div>
        </div>

       
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold mb-2">About us</h2>
          <p className="max-w-prose text-gray-900 leading-relaxed">
            <b>Tel:</b> xxxxxxxx <br/>
            <b>Email:</b> xxxxxx@xxxxx.xxx<br/>
            Since 1992, we’ve been crafting furniture in Lebanon with care, comfort, and everyday living in mind. From cozy kitchens to welcoming living rooms and restful bedrooms, our pieces are made to last—and made to feel like home. Explore our collections or tailor a design that fits your space perfectly.
          </p>
        </div>

        {/* fade bayda la tbayen homogene */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 md:h-10 bg-gradient-to-b from-transparent to-white" />
      </div>

      <footer className="py-10" />
    </div>
  );
}
