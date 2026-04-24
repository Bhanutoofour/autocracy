import Image from "next/image";
import CountrySwitcherButton from "./_components/CountrySwitcherButton";
import LocationGate from "./_components/LocationGate";
import GlobalHeader from "./_components/GlobalHeader";
import HomeProductsSection from "./_components/HomeProductsSection";
import { titleToSlug } from "@/utils/slug";
import { getActiveIndustries } from "@/actions/industryAction";
import { getActiveProducts } from "@/actions/productAction";
import {
  AnimatedAwardsSection,
  AnimatedTestimonialsSection,
} from "./_components/HomeAnimatedSections";

const asset = "/home-assets/imports/Final-1/";

const fallbackIndustries = [
  {
    title: "Agriculture",
    image: "7f60e1c3df8e63febda1944bedd2854950affd6e.png",
  },
  {
    title: "Construction",
    image: "17685258b73f41282e6007005b6d9a993a08de26.png",
  },
  {
    title: "Landscaping",
    image: "82aa72403df4827948c292a0322a06091d498468.png",
  },
  {
    title: "Water Conservation",
    image: "9b6af6ec8958651a036927ec24ff6cab560236ef.png",
  },
  { title: "Solar", image: "d0c7c5f1f56a52183f8f154be5750cb44bc29825.png" },
  {
    title: "Army Or Defence",
    image: "45e1522bd4ed8312223a50ebad220d15fc4e5524.png",
  },
  {
    title: "OFC Telecommunication",
    image: "032f1530adf57211e22495cccd59ff0a6d6be4d0.png",
  },
  {
    title: "Water Management",
    image: "9b6af6ec8958651a036927ec24ff6cab560236ef.png",
  },
];

const fallbackProducts = [
  { name: "Trenchers", image: "282576ad5e8a2a7d8bdf398187b6cfa2059de92a.png" },
  {
    name: "Wheel Trenchers",
    image: "d0c7c5f1f56a52183f8f154be5750cb44bc29825.png",
  },
  {
    name: "Walk Behind Trencher",
    image: "6c90a6d63f96a270777ab13c4d1c1d927e332433.png",
  },
  {
    name: "Post Hole Digger",
    image: "043c80512a640c617815f93fba4eac4d60617dfd.png",
  },
  {
    name: "Attachments",
    image: "7f60e1c3df8e63febda1944bedd2854950affd6e.png",
  },
  {
    name: "Sand Filler",
    image: "d0c7c5f1f56a52183f8f154be5750cb44bc29825.png",
  },
  {
    name: "Pole Stacker",
    image: "043c80512a640c617815f93fba4eac4d60617dfd.png",
  },
  {
    name: "Landscaping Equipment",
    image: "82aa72403df4827948c292a0322a06091d498468.png",
  },
  {
    name: "Agricultural Attachments",
    image: "7f60e1c3df8e63febda1944bedd2854950affd6e.png",
  },
  {
    name: "Aquatic Weed Harvester",
    image: "9b6af6ec8958651a036927ec24ff6cab560236ef.png",
  },
  {
    name: "Amphibious Excavator",
    image: "c2505b2efaf24ad9893f1179569e418a553b84cd.png",
  },
  {
    name: "Floating Pontoon",
    image: "9b6af6ec8958651a036927ec24ff6cab560236ef.png",
  },
];

const industryHref = (industryTitle: string) =>
  `/industries/${titleToSlug(industryTitle)}`;

const strengths = [
  {
    title: "Versatile Trenching Solutions for Every Terrain",
    body: "From narrow urban corridors to rugged rural sites, our compact trenchers and utility excavation machines are designed to handle diverse projects in telecom, water, agriculture, defence, and solar. Expect fuel efficiency, smooth maneuverability, and reliable performance-wherever the job takes you.",
  },
  {
    title: "Smarter, Faster Alternatives to Excavators",
    body: "Whether it's laying fiber cables, drip irrigation lines, or defence communication systems, our machines offer a cleaner, quicker way to trench. Perfect for municipal projects, border surveillance, and even garden sprinkler installations.",
  },
  {
    title: "Trusted Equipment for Critical Projects",
    body: "Deployed across government, EPC, and CSR projects, we also offer pole erectors, floating trash collectors, aquatic weed and sod harvesters, and tractor-mounted forklifts. Field-tested, low-maintenance, and operator-friendly-built to power India's progress.",
  },
];

const testimonials = [
  {
    quote:
      "The Dhruva 100 mini trencher worked great for our solar project in Gujarat. It made trenching for grounding and earthing lines quick and accurate, even in tight solar rows. Perfect choice for anyone working on solar EPC projects!",
    name: "Ajay",
    location: "Gujarat",
  },
  {
    quote:
      "The Rudra 100 chain trencher proved highly efficient for our water pipeline installation project in Chhattisgarh. It delivered clean, consistent trenches, reducing manual excavation and ensuring faster completion. A dependable choice for water management contractors handling rural or municipal pipeline projects.",
    name: "Rajkumar",
    location: "Chhattisgarh",
  },
  {
    quote:
      "We used the Rudra 100 XT for utility pipeline installation in Bihar, and it worked perfectly! Fast, clean trenches and smooth operations made our job much easier. Great machine for water utility projects.",
    name: "Bijesh",
    location: "Bihar",
  },
  {
    quote:
      "We have used the Rudra 150 XT Trencher for farm pipeline installation in Maharashtra, and it worked great! Clean trenches, less rework, and faster results - perfect for agriculture irrigation needs.",
    name: "Prakash Kumar",
    location: "Maharashtra",
  },
  {
    quote:
      "For OFC trenching work, the machine helped us maintain consistent depth and width across long stretches. The output was predictable and the site team could complete work faster.",
    name: "Naveen",
    location: "Telangana",
  },
  {
    quote:
      "The equipment performed well in compact village roads where bigger excavators could not move freely. It saved time, reduced restoration work, and kept the trench line neat.",
    name: "Ramesh",
    location: "Karnataka",
  },
  {
    quote:
      "Autocracy's support team guided our operators during setup and trial runs. The machine was easy to handle, and maintenance requirements stayed low during the project.",
    name: "Suresh",
    location: "Andhra Pradesh",
  },
];

const clients = [
  { name: "MEIL", src: "/images/clients/meil.png", width: 220, height: 78 },
  { name: "LARSEN & TOUBRO", src: "/images/clients/larsen-toubro.png", width: 220, height: 72 },
  { name: "STL", src: "/images/clients/stl.png", width: 140, height: 64 },
  { name: "BlueDrop Enviro", src: "/images/clients/bluedrop-enviro.png", width: 148, height: 74 },
  { name: "HMDA", src: "/images/clients/hmda.png", width: 154, height: 74 },
];

const certifications = [
  {
    title: "Information Security Management System",
    image: "20fb7c0a981653f0e648c11357f8d5e84d4bf80f.png",
  },
  {
    title: "Energy Management System",
    image: "2c871ff8415db3797e1f3754fd16cd3e461d9ec4.png",
  },
  {
    title: "Environment Management System",
    image: "b290301bdfbaf8815eaa4ccc4b373d50ad10a72c.png",
  },
  {
    title: "Quality Management System",
    image: "5a5fe0c5d1b94d43eec8084c6a5fe95c978f76c8.png",
  },
  {
    title: "Occupational Health & Safety Management System",
    image: "754cfb6a040601d6eed2b68c2c33b1bfd0d8f7a5.png",
  },
  {
    title: "Zero Defect Zero Effect (ZED Bronze)",
    image: "f98f85bff9744c11c44e13b942a4fb6cdabf572f.png",
  },
];

const awards = [
  {
    title: "National Start Up Award(NSA) 2023",
    image: "3056053c919b3aff3851ac44bf1a0d364c1b7324.png",
  },
  {
    title: "COWE - Women Entrepreneur of the Year...",
    image: "6f79ddcbbf2d6df60bdc72d10ee750b4062fe76d.png",
  },
  {
    title: "Business World Emerging Entrepreneur",
    image: "4c8d790d9f0e269594d166de2a1f2bc31756cb7d.png",
  },
  {
    title: "Stanford Seed Spark Winner",
    image: "28fe76fafbd6a96b61c2da01d6e43907611ed888.png",
  },
  {
    title: "IEDRA Excellence Award",
    image: "e01088c2bc9dc1e016102c3d92b7aa506b5fe0d8.png",
  },
];

const awardsGallery = [
  "6b849aac67e51dd6efd614142f26a669baad2aef.png",
  "1712120617244.jpg",
];

const stories = [
  {
    logo: "6f79ddcbbf2d6df60bdc72d10ee750b4062fe76d.png",
    title: "The Right Machine For The Right Job",
    excerpt:
      "Autocracy Machinery is India’s leading manufacturer of speciality construction, agricultural and infrastructure machinery...",
  },
  {
    logo: "4c8d790d9f0e269594d166de2a1f2bc31756cb7d.png",
    title: "New age for agriculture, infrastructure sector",
    excerpt:
      "Autocracy Machinery was recognised for delivering purpose-built heavy machinery for agriculture and infrastructure...",
  },
  {
    logo: "e01088c2bc9dc1e016102c3d92b7aa506b5fe0d8.png",
    title:
      "15 Women-led Startups Pitched to 11 Investors in 3rd Edn. of TiE Women Pitch Competition",
    excerpt:
      "Visakhapatnam: In an industry where there is a rare presence of women, Santhoshi Buddh showcased innovation...",
  },
  {
    logo: "28fe76fafbd6a96b61c2da01d6e43907611ed888.png",
    title:
      "Santoshi, who stepped into an impossible field, overcame criticism, a...",
    excerpt:
      "Autocracy Machinery was featured among promising women-led startups showcasing engineering excellence and resilience...",
  },
];

function Logo() {
  return (
    <a
      aria-label="Autocracy Machinery home"
      className="block w-[168px] sm:w-[190px]"
      href="/"
    >
      <Image
        alt="Autocracy Machinery"
        className="h-auto w-full"
        height={150}
        priority
        src="/logo.png"
        width={668}
      />
    </a>
  );
}

function Icon({
  name,
  className = "size-5",
}: {
  name:
    | "phone"
    | "search"
    | "chevron"
    | "download"
    | "play"
    | "menu"
    | "linkedin"
    | "youtube"
    | "twitter"
    | "facebook";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v11" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M9 7.3v9.4c0 .8.9 1.3 1.6.9l7.4-4.7c.6-.4.6-1.4 0-1.8l-7.4-4.7c-.7-.4-1.6.1-1.6.9Z" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg {...common}>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5ZM.4 8h4.2v15H.4V8Zm7 0h4v2h.06c.56-1.06 1.94-2.2 4-2.2 4.28 0 5.07 2.82 5.07 6.49V23h-4.2v-7.64c0-1.82-.03-4.16-2.53-4.16-2.53 0-2.92 1.98-2.92 4.03V23H6.4V8Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M23.5 7.2a3.04 3.04 0 0 0-2.14-2.15C19.47 4.5 12 4.5 12 4.5s-7.47 0-9.36.55A3.04 3.04 0 0 0 .5 7.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 4.8 3.04 3.04 0 0 0 2.14 2.15C4.53 19.5 12 19.5 12 19.5s7.47 0 9.36-.55a3.04 3.04 0 0 0 2.14-2.15A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-4.8ZM9.55 15.2V8.8L15.8 12l-6.25 3.2Z" />
      </svg>
    );
  }

  if (name === "twitter") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4-1.7-5.6-.2a4 4 0 0 0-1.2 3.7 11.3 11.3 0 0 1-8.2-4.1 4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.3a11.2 11.2 0 0 0 6.1 1.8c7.3 0 11.4-6 11.4-11.3v-.5c.8-.5 1.5-1.2 2-2Z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.5 8H16V5h-2.5C10.5 5 9 6.8 9 9.6V12H7v3h2v7h3v-7h3l.5-3H12V9.8c0-1.1.3-1.8 1.5-1.8Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Header() {
  const nav = [
    { label: "Industries", href: "/#industries" },
    { label: "Products", href: "/#products" },
    { label: "Company", href: "/about-us" },
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/#stories" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="bg-[var(--brand-yellow)] text-xs font-bold uppercase text-[var(--ink)]">
        <div className="site-container flex h-8 items-center justify-end">
          <div className="flex items-center gap-5">
            <a
              className="hidden items-center gap-2 sm:flex"
              href="tel:+918790473345"
            >
              <Icon className="size-4" name="phone" />
              Call +91 87904 73345
            </a>
            <a className="hidden items-center gap-2 md:flex" href="/find-a-dealer">
              <Icon className="size-4" name="search" />
              Find a dealer
            </a>
            <CountrySwitcherButton />
          </div>
        </div>
      </div>

      <div className="site-container flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden h-6 items-center gap-6 font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-normal text-[var(--ink)] lg:flex">
          {nav.map((item) => (
            <a
              className="flex h-6 items-center justify-center gap-1 text-center transition hover:text-[#b88900]"
              href={item.href}
              key={item.label}
            >
              {item.label}
              {["Industries", "Products", "Company"].includes(item.label) ? (
                <Icon className="size-4" name="chevron" />
              ) : null}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            className="flex h-10 items-center justify-center gap-2 border border-[var(--ink)] px-4 text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-normal text-[#0a0a0b] transition hover:bg-black/5"
            href="/brochure"
          >
            <Icon className="size-5" name="download" />
            Brochure
          </a>
          <a
            className="button-gold-text flex h-10 items-center justify-center bg-[var(--ink)] px-6 text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[14px] font-semibold uppercase leading-5 tracking-normal transition hover:bg-[#2d2d2d]"
            href="#contact"
            style={{ color: "#f9c300" }}
          >
            Get a quote
          </a>
        </div>
        <details className="relative lg:hidden">
          <summary
            aria-label="Open menu"
            className="grid size-11 cursor-pointer list-none place-items-center border border-black/15 [&::-webkit-details-marker]:hidden"
          >
            <Icon name="menu" />
          </summary>
          <div className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] border border-black/10 bg-white p-4 shadow-2xl">
            <nav className="grid gap-1 text-sm font-black uppercase text-[var(--ink)]">
              {nav.map((item) => (
                <a
                  className="px-3 py-3 transition hover:bg-[var(--brand-yellow)]"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[var(--ink)] text-white lg:min-h-[671px]">
      <Image
        alt="Single chain trencher working at a field site"
        className="object-cover opacity-85"
        fill
        priority
        sizes="100vw"
        src={`${asset}032f1530adf57211e22495cccd59ff0a6d6be4d0.png`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,6,10,0.84),rgba(1,6,10,0.38)_52%,rgba(1,6,10,0.1))]" />

      <div className="site-container relative flex min-h-[560px] items-end pb-16 pt-20 lg:min-h-[671px] lg:items-center lg:pb-0">
        <div className="flex w-full max-w-[320px] flex-col items-start gap-6 lg:max-w-[760px]">
          <h1 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-black leading-[1.05] tracking-normal text-white lg:text-[56px]">
            Single chain trencher
          </h1>
          <p className="max-w-[720px] text-base font-normal leading-[1.4] tracking-normal text-white lg:text-[20px]">
            New series designed for trench profiles upto 600mm
            <br className="hidden lg:block" />
            in width and upto 1500mm in depth
          </p>
          <a
            className="flex h-11 w-[132px] items-center justify-center bg-[var(--brand-yellow)] px-4 text-center font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-semibold uppercase leading-5 tracking-normal text-[#0a0a0b] transition hover:brightness-95 lg:h-[60px] lg:w-[204px]"
            href="/contact-us"
          >
            Get a quote
          </a>
        </div>
      </div>

      <div className="absolute bottom-[19px] left-1/2 flex h-4 -translate-x-1/2 items-center gap-2 lg:bottom-9">
        {[0, 1, 2, 3, 4].map((item) => (
          <span
            className={item === 1 ? "size-4 bg-white" : "size-2.5 bg-white/50"}
            key={item}
          />
        ))}
      </div>
    </section>
  );
}

function IndustriesSection({
  industries,
}: {
  industries: { title: string; image: string }[];
}) {
  const resolveIndustryImage = (image: string) => {
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
      return image;
    }
    return `${asset}${image}`;
  };

  return (
    <section className="bg-white py-16 lg:py-20" id="industries">
      <div className="site-container">
        <div className="mb-12 text-center">
          <p className="mb-6 text-[18px] font-normal uppercase leading-none tracking-[0.75em] text-[#243245]">
            Industries
          </p>
          <h2 className="text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[40px] font-bold leading-[1.05] tracking-normal text-[#0a0a0b]">
            Choose Your Industry
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-[30px] lg:grid-cols-4">
          {industries.map((industry, index) => (
            <a
              className="group relative block h-[180px] overflow-hidden rounded-lg bg-[#312e33] sm:h-[250px]"
              href={industryHref(industry.title)}
              key={`${industry.title}-${index}`}
            >
              <Image
                alt={`${industry.title} application`}
                className="object-cover transition duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                src={resolveIndustryImage(industry.image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
              <h3 className="absolute inset-x-0 bottom-0 p-5 align-bottom font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-semibold leading-[1.2] tracking-normal text-white">
                {industry.title}
              </h3>
            </a>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            className="button-gold-text figma-button bg-[var(--ink)]"
            href="/industries"
            style={{ color: "#f9c300" }}
          >
            View all industries
          </a>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="bg-white py-16 lg:py-[72px]">
      <div className="site-container">
        <h2 className="max-w-[640px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[38px] font-bold leading-[1.18] tracking-normal text-[#0a0a0b] lg:text-[48px] lg:leading-[1.2]">
          Built for India. Engineered
          <br />
          for Efficiency.
        </h2>
        <div className="mt-24 grid gap-12 lg:grid-cols-3 lg:gap-[86px]">
          {strengths.map((item) => (
            <article className="pt-0" key={item.title}>
              <div className="mb-6 flex h-4 items-start">
                <span className="h-4 w-[70px] bg-[var(--brand-yellow)]" />
                <span className="ml-2 h-4 w-4 skew-x-[-30deg] bg-[var(--brand-yellow)]" />
              </div>
              <h3 className="max-w-[420px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[24px] font-bold leading-[1.25] tracking-normal text-[#111113]">
                {item.title}
              </h3>
              <p className="mt-6 max-w-[430px] text-[16px] font-normal leading-[1.5] tracking-normal text-[#20242a]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section
      className="bg-[var(--section-gray)] py-16 lg:py-20"
      id="certifications"
    >
      <div className="site-container">
        <h2 className="text-center font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[36px] font-bold leading-[1.12] tracking-normal text-[#0a0a0b] sm:text-[44px]">
          Our Certifications
        </h2>

        <div className="mt-10 flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-6">
          {certifications.map((item, index) => (
            <article
              className={`flex w-[220px] flex-none flex-col items-center justify-start px-4 pb-2 text-center sm:w-[250px] lg:w-auto ${
                index !== certifications.length - 1
                  ? "border-r border-[#cfcfcf]"
                  : ""
              }`}
              key={item.title}
            >
              <div className="relative h-[126px] w-[126px]">
                <Image
                  alt={item.title}
                  className="object-contain"
                  fill
                  sizes="126px"
                  src={`${asset}${item.image}`}
                />
              </div>
              <h3 className="mt-4 max-w-[210px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[18px] font-bold leading-[1.25] text-[#1a1a1a]">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section className="bg-white py-16 lg:py-20" id="stories">
      <div className="site-container">
        <h2 className="font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[32px] font-bold leading-[1.25] tracking-normal text-[#0a0a0b] sm:text-[38px] lg:text-[44px]">
          Our Story,
          <br />
          Through Their Words
        </h2>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((story) => (
            <article
              className="flex h-[354px] w-[86vw] flex-none flex-col border border-[#d5d5d5] bg-white px-6 py-7 sm:w-[44vw] sm:px-7 lg:w-[calc((100%-60px)/4)]"
              key={story.title}
            >
              <div className="relative h-[42px] w-[190px]">
                <Image
                  alt=""
                  className="object-contain object-left"
                  fill
                  sizes="190px"
                  src={`${asset}${story.logo}`}
                />
              </div>
              <h3 className="mt-8 max-w-[270px] font-['Roboto_Condensed','Arial_Narrow',Arial,sans-serif] text-[20px] font-bold leading-[1.25] text-[#1c1c1d]">
                {story.title}
              </h3>
              <p className="mt-5 max-w-[270px] text-[16px] font-normal leading-[1.55] text-[#55565a]">
                {story.excerpt}
              </p>
              <a
                className="mt-auto text-[16px] font-medium leading-5 text-[#2f64b7]"
                href="/about-us"
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HappyClients() {
  return (
    <section className="bg-white pt-12 pb-20 lg:pt-14 lg:pb-24">
      <div className="site-container">
        <aside className="mx-auto w-full max-w-[1260px]">
          <h2 className="w-full text-center font-['Roboto',Arial,Helvetica,sans-serif] text-[40px] font-black leading-[1.2] tracking-normal text-[#0A0A0B]">
            Happy Clients
          </h2>

          <div className="mt-9 flex w-full items-center justify-between gap-10 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {clients.map((client) => (
              <div className="flex h-[78px] min-w-[130px] flex-none items-center justify-center" key={client.name}>
                <Image
                  alt={client.name}
                  className="h-auto w-auto object-contain"
                  height={client.height}
                  sizes={`${client.width}px`}
                  src={client.src}
                  width={client.width}
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="bg-white pt-0" id="contact">
      <div className="site-container">
        <div className="relative z-10 flex translate-y-10 flex-col gap-8 bg-[var(--brand-yellow)] px-8 py-10 text-black sm:translate-y-12 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-12">
          <div>
            <h2 className="max-w-[470px] font-['Roboto',Arial,Helvetica,sans-serif] text-[32px] font-black leading-[1.05] tracking-normal">
              Built for Performance. Branded for You.
            </h2>
            <p className="mt-4 max-w-[470px] font-['Roboto',Arial,Helvetica,sans-serif] text-[16px] font-normal leading-6 tracking-normal text-black/90">
              From trenchers to multi-utility machines, Autocracy Machinery
              delivers rugged, customizable solutions, designed to power
              infrastructure, telecom, and agri projects.
            </p>
          </div>
          <a
            className="button-gold-text figma-button h-[48px] w-full min-w-[138px] bg-[var(--ink)] px-6 text-[20px] leading-none sm:w-auto"
            href="tel:+918790473345"
            style={{ color: "#f9c300" }}
          >
            Get a quote
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerMenus = [
    [
      "About us",
      "Careers",
      "FAQs",
      "Contact us",
      "Hire on rent",
      "Find a dealer",
    ],
    ["Products", "Brochure", "Blog", "Videos"],
    ["sales@autocracymachinery.com", "+91 87904 73345"],
  ];
  const footerHeadings = ["Company", "Resources", "Contact"];
  const resolveFooterHref = (link: string) => {
    const map: Record<string, string> = {
      "About us": "/about-us",
      Careers: "/careers",
      FAQs: "/faqs",
      "Contact us": "/contact-us",
      "Hire on rent": "/contact-us",
      "Find a dealer": "/find-a-dealer",
      Products: "/products",
      Brochure: "/brochure",
      Blog: "/#stories",
      Videos: "/#stories",
      "sales@autocracymachinery.com": "mailto:sales@autocracymachinery.com",
      "+91 87904 73345": "tel:+918790473345",
    };
    return map[link] ?? "/";
  };

  return (
    <footer className="bg-[var(--ink)] pb-12 pt-24 text-white sm:pt-28">
      <div className="site-container grid gap-10 lg:grid-cols-[minmax(320px,0.9fr)_1.1fr] lg:items-start">
        <div>
          <a
            aria-label="Autocracy Machinery home"
            className="inline-flex items-end gap-2"
            href="/"
          >
            <Image
              alt="Autocracy brand mark"
              className="h-[40px] w-[44px]"
              height={40}
              src="/footer-logo-mark.png"
              width={44}
            />
            <Image
              alt="Autocracy Machinery"
              className="h-auto w-[170px]"
              height={39}
              src="/footer-logo-combined.png"
              width={170}
            />
          </a>
          <p className="mt-8 max-w-[430px] font-['Roboto',Arial,Helvetica,sans-serif] text-[12px] font-normal leading-[1.5] tracking-normal text-white/85">
            Autocracy Machinery is a trading style of Aceautocracy Machinery
            Pvt. Limited, a company incorporated in India.
          </p>
          <div className="mt-6 flex items-center gap-6 text-[var(--brand-yellow)]">
            <a
              aria-label="LinkedIn"
              className="grid h-5 w-5 place-items-center transition hover:opacity-80"
              href="https://www.linkedin.com/company/autocracy-machinery/"
              rel="noreferrer"
              target="_blank"
            >
              <Icon className="size-5" name="linkedin" />
            </a>
            <a
              aria-label="YouTube"
              className="grid h-5 w-5 place-items-center transition hover:opacity-80"
              href="https://www.youtube.com/@AutocracyMachinery"
              rel="noreferrer"
              target="_blank"
            >
              <Icon className="size-5" name="youtube" />
            </a>
            <a
              aria-label="Twitter"
              className="grid h-5 w-5 place-items-center transition hover:opacity-80"
              href="https://x.com/aceautocracy"
              rel="noreferrer"
              target="_blank"
            >
              <Icon className="size-5" name="twitter" />
            </a>
            <a
              aria-label="Facebook"
              className="grid h-5 w-5 place-items-center transition hover:opacity-80"
              href="https://www.facebook.com/people/Autocracy-Machinery/61554797280328/"
              rel="noreferrer"
              target="_blank"
            >
              <Icon className="size-5" name="facebook" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-['Roboto',Arial,Helvetica,sans-serif] text-[12px] font-normal leading-[1.5] tracking-normal text-white/95">
            <a className="transition hover:text-[var(--brand-yellow)]" href="/privacy-policy">
              Privacy Policy
            </a>
            <a className="transition hover:text-[var(--brand-yellow)]" href="/terms-and-conditions">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {footerMenus.map((links, columnIndex) => (
            <div
              className="font-['Roboto',Arial,Helvetica,sans-serif] text-[12px] font-normal leading-[1.5] tracking-normal text-white/90"
              key={`footer-col-${columnIndex + 1}`}
            >
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                {footerHeadings[columnIndex]}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      className="transition hover:text-[var(--brand-yellow)]"
                      href={resolveFooterHref(link)}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="site-container mt-10 border-t border-white/15 pt-6 text-sm text-white/55">
        (c) 2026 All Rights Reserved to Autocracy Machinery
      </div>
    </footer>
  );
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Autocracy Machinery",
  legalName: "Aceautocracy Machinery Pvt. Limited",
  url: "https://www.autocracymachinery.com/",
  logo: "https://www.autocracymachinery.com/logo.png",
  email: "sales@autocracymachinery.com",
  telephone: "+91 87904 73345",
  description:
    "Autocracy Machinery manufactures heavy-duty trenchers, utility excavation machines, environmental equipment, and infrastructure machinery for telecom, agriculture, construction, water management, solar, and defence projects.",
};

export default async function Home() {
  let homeIndustries: { title: string; image: string }[] = fallbackIndustries;
  let homeProducts: { name: string; image: string }[] = fallbackProducts;

  try {
    const [dbIndustries, dbProducts] = await Promise.all([
      getActiveIndustries(),
      getActiveProducts(),
    ]);

    if (Array.isArray(dbIndustries) && dbIndustries.length > 0) {
      homeIndustries = dbIndustries.map((industry) => ({
        title: industry.title ?? "",
        image: industry.thumbnail ?? "",
      }));
    }

    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      homeProducts = dbProducts.map((product) => ({
        name: product.title ?? "",
        image: product.thumbnail ?? "",
      }));
    }
  } catch {
    // Keep static fallback homepage cards when DB/env is unavailable.
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#01060a]">
      <LocationGate />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        type="application/ld+json"
      />
      <GlobalHeader />
      <Hero />
      <IndustriesSection industries={homeIndustries} />
      <HomeProductsSection assetBasePath={asset} products={homeProducts} />
      <Strengths />
      <AnimatedAwardsSection
        asset={asset}
        awards={awards}
        awardsGallery={awardsGallery}
      />
      <Certifications />
      <Stories />
      <AnimatedTestimonialsSection testimonials={testimonials} />
      <HappyClients />
      <CtaBand />
      <Footer />
    </main>
  );
}
