import { useEffect } from "react";

const ShopTheLook = () => {
  useEffect(() => {
    const scriptId = "interactive-img-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");

      script.id = scriptId;
      script.src = "https://interactive-img.com/js/include.js";
      script.async = true;

      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="w-full bg-[#f5f5f3] py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500">
            XTRN Collection
          </p>

          <h2 className="text-4xl font-medium uppercase tracking-tight text-neutral-900 md:text-6xl">
            Shop The Look
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
            Explore the complete XTRN collection. Hover over each product
            to discover more.
          </p>
        </div>

        {/* Interactive Image */}
        <div className="relative w-full">
          <div
            className="iactiveImg"
            data-ii="71729"
          />
        </div>

      </div>
    </section>
  );
};

export default ShopTheLook;