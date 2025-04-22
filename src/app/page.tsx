import { DropArea } from "~/components/drop-area/ui/drop-area";

export default function HomePage() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]"
      ></div>
      <section>
        <h1 className="text-sky-400">HEHE</h1>
        <DropArea />
      </section>
    </>
  );
}
