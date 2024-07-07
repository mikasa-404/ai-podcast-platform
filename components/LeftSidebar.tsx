"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden pl-2">
            PodCraft AI
          </h1>
        </Link>
        {sidebarLinks.map(({ label, imgURL, route }) => {
          const isActive =
            pathName === route || pathName.startsWith(`${route}/`);
          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex cursor-pointer items-center py-4 gap-3 max-lg:px-4 justify-center lg:justify-start",
                { "bg-nav-focus border-r-4 border-green-1": isActive }
              )}
            >
              <Image src={imgURL} alt="logo" width={24} height={24} />
              <p className=" font-extrabold text-white">{label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
