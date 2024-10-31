import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";

const Page = () => {
  return (
    <section>
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center py-32 text-center lg:mx-auto lg:items-start lg:px-0 lg:text-left">
            <p className="">New Release</p>
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
              <Link href="/editor">
                <ShimmerButton className="shadow-2xl w-full sm:w-auto">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight w-full sm:w-auto text-white dark:from-white dark:to-slate-900/10 lg:text-lg flex items-center justify-center">
                    <ArrowUpRight className="mr-2 size-5" />
                    Create Your Design
                  </span>
                </ShimmerButton>
              </Link>
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
            <div className="absolute left-[8%] top-[10%] flex aspect-[5/6] w-[38%] justify-center rounded-lg  bg-accent">
              <img
                src="/life.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-[12%] top-[20%] flex aspect-square w-1/5 justify-center rounded-lg  bg-accent">
              <img
                src="/bear.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-[24%] right-[24%] flex aspect-[5/6] w-[38%] justify-center rounded-lg  bg-accent">
              <img
                src="/ride.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
