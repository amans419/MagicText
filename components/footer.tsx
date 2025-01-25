import Link from "next/link";
import { Rocket, Sparkles } from "lucide-react";
import { title } from "process";

export default function Footer() {
  const page = [
    { name: "Home", href: "#" },
    { name: "Sign In", href: "/register" },
    { name: "Editor", href: "/editor" },
  ];

  const contact = [
    { name: "Email", href: "mailto:updates@magictext.tech" },
    { name: "Twitter", href: "https://x.com/urvishmali" },
    { name: "GitHub", href: "https://github.com/KrishnaCodez" },
  ];

  const friends = [
    {
      name: "All in AI Tools",
      href: "https://allinai.tools",
      title: "The Best AI Tools",
    },

    {
      name: "MagicBox.Tools - AI Tools Diresctory",
      href: "https://magicbox.tools",
      title: "MagicBox.Tools - AI Tools Directory ",
    },
    { name: "Sprunked", href: "https://sprunked.dev" },

    {
      name: "AI Just Works",
      href: "https://aijustworks.com",
      title: "AI Just Works",
    },
    {
      name: "ToolPilot",
      href: "https://www.toolpilot.ai",
      title: "ToolPilot",
    },
    {
      name: "AIToolly",
      href: "https://AIToolly.com",
      title: "Best AI Tools Directory",
    },
    {
      name: "links.onionai.so",
      href: "https://links.onionai.so",
    },
  ];

  return (
    <footer className="w-full bg-black text-gray-400 py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl">
        <div className="col-span-2 md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-2 text-white mb-4">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-bold">MagicText</h2>
          </div>
          <p className="text-sm max-w-md">
            Upload your images, customize the text placement, and share your
            creations instantly. Whether you're a design novice or pro, Text
            Magic helps you achieve stunning results effortlessly.{" "}
          </p>
          <p className="text-sm mt-4">
            Our intuitive platform lets you create professional-looking designs
            with just a few clicks.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Pages</h3>
          <ul className="space-y-2">
            {page.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2">
            {contact.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Friends</h3>
          <ul className="space-y-2">
            {friends.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  title={item?.title}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
