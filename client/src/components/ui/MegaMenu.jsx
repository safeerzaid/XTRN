function MegaMenu({ data }) {
  return (
    <div className="absolute top-full left-0 z-40 w-full">
      <div className="bg-white shadow-lg">
        <div className="mx-auto max-w-[1400px] px-14 py-8">
          
          <div className="flex justify-center gap-16">
            {data.sections.map((section) => (
              <div key={section.title}>

                <h3 className="mb-4 text-center text-sm font-bold">
                  {section.title}
                </h3>

                <div className="flex flex-col gap-2 text-center">
                  {section.items.map((item) => (
                    <p
                      key={item}
                      className="text-sm text-gray-600"
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