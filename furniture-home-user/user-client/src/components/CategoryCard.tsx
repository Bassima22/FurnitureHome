import { Link } from "react-router-dom";

type Props = { title: string; slug: string; image?: string };

export default function CategoryCard({ title, slug, image }: Readonly<Props>) {
  const target = slug === "contact-us" ? "/contact" : `/category/${slug}?section=item`;

  return (
    <Link
      to={target}
      className="
        group                        
        relative block overflow-clip
        rounded-2xl border border-neutral-200
        bg-neutral-100 text-neutral-900
        shadow-sm transition
        hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400
      "
    >
      {/* Title overlay */}
      <div
        className="
          absolute inset-0 z-10
          flex items-center justify-center
          bg-white transition-colors duration-500
          group-hover:bg-transparent              /* ⬅️ react to parent hover */
        "
      >
        <span className="text-xl font-medium capitalize">{title}</span>
      </div>

      {/* Image layer (hidden until hover) */}
      <div
        className="
          h-32 md:h-48
          bg-neutral-200 bg-center bg-cover
          opacity-0 group-hover:opacity-100       
          scale-100 group-hover:scale-105         
          transition-all duration-700
        "
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      />
    </Link>
  );
}
