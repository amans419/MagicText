"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";
import FlipBook from "@/components/book-flip";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { Header } from "@/components/header";


const Page = () => {

  const router = useRouter();
  const { user } = useUser();
  const { session } = useSessionContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !session?.user) {
      router.push("/register");
    } else {
      router.push("/editor");
    }
  };


  return (
    <section>
      <div className="">
        <Header />
        <div className="grid container items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center pt-24 pb-12 text-center lg:mx-auto lg:items-start lg:px-0 lg:text-left">
            <div>
              <AnimatedGradientText>
                🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                  )}
                >
                  Introducing V2 Beta
                </span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </div>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {/* TestLayr */}
              Transform Your Photos with Text Magic{" "}
              <span className="text-3xl">✨</span>
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Create stunning text-behind-image designs in seconds. No design
              skills needed - just upload, position, edit and share your
              masterpiece.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <ShimmerButton className="shadow-2xl w-full sm:w-auto" onClick={handleClick}>
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight w-full sm:w-auto text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center justify-center">
                  <ArrowUpRight className="mr-2 size-5" />
                  Create Your Design
                </span>
              </ShimmerButton>
            </div>
          </div>
          <div className="relative aspect-[3/4]">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 800 800"
                className="size-full text-muted-foreground opacity-20"
              >
                {Array.from(Array(720).keys()).map((dot, index, array) => {
                  const angle = 0.2 * index;
                  const scalar = 40 + index * (360 / array.length);
                  const x = Math.round(Math.cos(angle) * scalar);
                  const y = Math.round(Math.sin(angle) * scalar);

                  return (
                    <circle
                      key={index}
                      r={(3 * index) / array.length}
                      cx={400 + x}
                      cy={400 + y}
                      opacity={1 - Math.sin(angle)}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="max-md:pb-10">
              <FlipBook />
            </div>

          </div>
        </div>



        <Footer />

      </div>
    </section>
  );
};

export default Page;
