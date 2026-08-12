function MegaMenu({ data }) {
  const columnCount =
    data.sections.length >= 8
      ? 4
      : data.sections.length;

  return (
    <div className="absolute top-full left-0 z-40 w-full">
      <div className="bg-white shadow-lg">
        <div className="mx-auto max-w-[1400px] px-14 py-8">

          <div
            className="grid justify-center gap-x-16 gap-y-10 font-nav"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {data.sections.map((section) => (
              <div key={section.title} className="min-w-0">
                
                <h3 className="mb-4 text-left text-[14px] font-bold leading-tight">
                  {section.title}
                </h3>

                <div className="flex flex-col gap-3 text-left">
                  {section.items.map((item) => (
                    <p
                      key={item}
                      className="cursor-pointer text-[18px] leading-tight text-gray-500 transition-colors duration-200 hover:text-black"
                    >
                      {item}
                    </p>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MegaMenu;