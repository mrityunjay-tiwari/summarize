import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import IconStack from "./iconstack";
import { MdArrowOutward } from "react-icons/md";

export default function CTA() {
  return (
    <section className="min-h-95 mt-52 -mb-36 z-20 mx-28 bg-linear-to-t from-blue-200 to-white rounded-b-4xl overflow-hidden ">
      <div className="mx-auto flex justify-self-center gap-100 items-end">
        <div className="flex flex-col gap-8 ">
          <h1 className="font-bold text-2xl md:text-4xl text-blue-900">
            Save Time, Money, And
            <br /> Run A Better Startup <br />
          </h1>
          <p>
            SaaSCraft integrates with the platforms you already use,
            <br /> making it easy to bring everything together in one place.
          </p>
          <div className="flex items-center max-w-xl bg-white shadow-lg rounded-full p-1 border border-gray-100">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="rounded-full text-lg shadow-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-5 py-2 text-gray-700 placeholder:text-gray-400"
            />
            <Button
              className="rounded-full bg-linear-to-t from-blue-700 via-blue-600 to-blue-400 m-1"
              asChild
              size="lg"
            >
              <Link href="#">
                <span>Get Started</span>
                <span>
                  <MdArrowOutward />
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <div className="-mb-44 flex gap-2">
            <IconStack />
            <div className="-mt-12">
              <IconStack />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
