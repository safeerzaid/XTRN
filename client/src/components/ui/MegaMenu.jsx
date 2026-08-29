import { useNavigate } from "react-router-dom";

/**
 * MegaMenu
 *
 * Props:
 *   data       — one entry from Navigation.js (e.g. navigationData.men)
 *   navKey     — the top-level nav key: 'men' | 'women' | 'sports' | 'accessories'
 *
 * Navigation logic:
 *   men        → /men/<item>       e.g. /men/T-Shirts
 *   women      → /women/<item>     e.g. /women/Hoodies
 *   sports     → /products/<item>  e.g. /products/football  (lowercased)
 *   accessories → /accessories/<item>
 */
function MegaMenu({ data, navKey }) {
  const navigate = useNavigate();

  const columnCount =
    data.sections.length >= 8
      ? 4
      : data.sections.length;

  const handleItemClick = (item) => {
    if (!navKey) return;

    if (navKey === "sports") {
      // Sports items are sport names — lowercase them to match the route param
      navigate(`/products/${item.toLowerCase()}`);
    } else if (navKey === "men") {
      navigate(`/men/${item}`);
    } else if (navKey === "women") {
      navigate(`/women/${item}`);
    } else if (navKey === "accessories") {
      navigate(`/accessories/${item}`);
    }
  };

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
                    <button
                      key={item}
                      onClick={() => handleItemClick(item)}
                      className="cursor-pointer text-left text-[18px] leading-tight text-gray-500 transition-colors duration-200 hover:text-black"
                    >
                      {item}
                    </button>
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