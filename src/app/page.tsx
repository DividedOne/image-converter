import { DropArea } from "~/components/drop-area/ui/drop-area";

export default function HomePage() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]"
      ></div>
      <section className="flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="flex flex-col items-center justify-center gap-2 text-4xl leading-snug font-medium text-slate-200">
          <span className="relative text-7xl font-bold tracking-wider text-sky-100 italic text-shadow-lg text-shadow-sky-200 before:absolute before:top-1/2 before:left-0 before:h-2 before:w-[100px] before:-translate-y-1/4 before:bg-slate-950">
            D1
          </span>{" "}
          Image Converter
        </h1>
        <DropArea />
      </section>
    </>
  );
}
