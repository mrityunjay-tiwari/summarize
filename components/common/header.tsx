import {FileText} from "lucide-react";
import NavLink from "./nav-link";
import {auth} from "@/utils/auth";
import Image from "next/image";

export default async function Header() {
  const user = await auth();
  return (
    <nav className="container flex items-center justify-between lg:px-10 px-2 py-4 mx-auto">
      <div className="flex">
        <NavLink href={"/"} className="gap-1 lg:gap-2 flex items-center ">
          <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 hover:rotate-12 hover:cursor-pointer transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">
            Summarize
          </span>
        </NavLink>
      </div>
      <div className="flex gap-3 md:gap-8 items-center">
        <div>
          {!user ? (
            <NavLink href={"/#pricing"}>Pricing</NavLink>
          ) : (
            <NavLink href={"/dashboard"}>Your Summaries</NavLink>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <NavLink href={"/upload"}>Upload PDF</NavLink>

            <div className="gap-1 flex items-center">
              <Image
                src={user?.user?.image ?? ""}
                alt=""
                width={24}
                height={24}
                className="rounded-full"
              />

              <div className="text-rose-800">Pro</div>
            </div>
          </div>
        )}

        {!user && <NavLink href={"/sign-in"}>SignIn</NavLink>}
      </div>
    </nav>
  );
}
