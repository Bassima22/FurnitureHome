import { Link } from "react-router-dom";

type Props = { title: string; slug: string; image?: string };

export default function CategoryCard({ title, slug, image }: Readonly<Props>) {
  // If the category is "contact-us", link to /contact instead
  const target = slug === "contact-us" ? "/contact" : `/category/${slug}?section=item`;

  return (
    <Link
      to={target}
      className="
        overflow-clip
        relative block rounded-2xl border border-neutral-200
        bg-neutral-100 text-neutral-900
        shadow-sm transition
        hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400
      "
    >
      {/* optional background image
      {image && (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-10 transition-opacity"
          />
        </>
      )} */}
      <div
        className="
        absolute bg-white z-10 
        w-full h-full top-0 flex items-center justify-center
        hover:bg-transparent"
      >
        <span className="text-xl font-medium capitalize">{title}</span>
      </div>
      <div className="h-32 md:h-48 bg-yellow-300"></div>
    </Link>
  );
}
