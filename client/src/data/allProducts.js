const products = [
  // ---------------- RUNNING ----------------

  {
    id: "xtrn-001",
    name: "XTRN Velocity Runner",
    sport: "Running",
    category: "Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 4999,
    availability: "In Stock",
    image: "/assets/products/running-shoes-1.jpg",
    description: "Lightweight mesh running shoes with responsive foam cushioning for long-distance comfort."
  },

  {
    id: "xtrn-002",
    name: "XTRN Pace Tee",
    sport: "Running",
    category: "T-Shirts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/running-tshirt-1.jpg",
    description: "Moisture-wicking running tee that keeps you dry and cool on every mile."
  },

  {
    id: "xtrn-003",
    name: "XTRN Sprint Shorts",
    sport: "Running",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1299,
    availability: "In Stock",
    image: "/assets/products/running-shorts-1.jpg",
    description: "Breathable lightweight shorts with built-in liner for chafe-free runs."
  },

  {
    id: "xtrn-004",
    name: "XTRN Windshield Jacket",
    sport: "Running",
    category: "Jackets",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 3499,
    availability: "In Stock",
    image: "/assets/products/running-jacket-1.jpg",
    description: "Wind-resistant packable jacket designed for early morning and rainy runs."
  },

  {
    id: "xtrn-005",
    name: "XTRN Compression Set",
    sport: "Running",
    category: "Clothing",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2199,
    availability: "In Stock",
    image: "/assets/products/running-clothing-1.jpg",
    description: "Full compression running set that supports muscles during high-intensity training."
  },

  {
    id: "xtrn-006",
    name: "XTRN Cushion Socks",
    sport: "Running",
    category: "Socks",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 499,
    availability: "In Stock",
    image: "/assets/products/running-socks-1.jpg",
    description: "Arch-support running socks with cushioned heel and blister-free stitching."
  },

  {
    id: "xtrn-007",
    name: "XTRN Runner's Belt",
    sport: "Running",
    category: "Accessories",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 899,
    availability: "In Stock",
    image: "/assets/products/running-belt-1.jpg",
    description: "Adjustable hydration belt with phone pocket for on-the-go runners."
  },


  // ---------------- FOOTBALL ----------------

  {
    id: "xtrn-008",
    name: "XTRN Strike Boots",
    sport: "Football",
    category: "Boots",
    gender: "Men",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 5999,
    availability: "In Stock",
    image: "/assets/products/football-boots-1.jpg",
    description: "Firm-ground football boots with molded studs for explosive traction on turf."
  },

  {
    id: "xtrn-009",
    name: "XTRN Matchday Jersey",
    sport: "Football",
    category: "Jerseys",
    gender: "Men",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "/assets/products/football-jersey-1.jpg",
    description: "Breathable performance jersey built for full 90-minute comfort."
  },

  {
    id: "xtrn-010",
    name: "XTRN Pitch Shorts",
    sport: "Football",
    category: "Shorts",
    gender: "Men",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1199,
    availability: "In Stock",
    image: "/assets/products/football-shorts-1.jpg",
    description: "Lightweight football shorts with stretch panels for unrestricted movement."
  },

  {
    id: "xtrn-011",
    name: "XTRN Pro Football",
    sport: "Football",
    category: "Footballs",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 1499,
    availability: "In Stock",
    image: "/assets/products/football-ball-1.jpg",
    description: "Match-quality football with textured surface for precise control and flight."
  },

  {
    id: "xtrn-012",
    name: "XTRN Guard Shin Pads",
    sport: "Football",
    category: "Shin Guards",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 799,
    availability: "In Stock",
    image: "/assets/products/football-shinguard-1.jpg",
    description: "Lightweight shin guards with ventilated shell for maximum leg protection."
  },

  {
    id: "xtrn-013",
    name: "XTRN Keeper Gloves",
    sport: "Football",
    category: "Goalkeeper",
    gender: "Unisex",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 2499,
    availability: "In Stock",
    image: "/assets/products/football-gkgloves-1.jpg",
    description: "Latex-palm goalkeeper gloves designed for superior grip and shot-stopping."
  },

  {
    id: "xtrn-014",
    name: "XTRN Football Socks",
    sport: "Football",
    category: "Socks",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 599,
    availability: "In Stock",
    image: "/assets/products/football-socks-1.jpg",
    description: "Performance football socks with arch support and breathable fabric for match-day comfort."
  },

  {
    id: "xtrn-015",
    name: "XTRN Phantom Speed Boots",
    sport: "Football",
    category: "Boots",
    gender: "Men",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 7499,
    availability: "In Stock",
    image: "/assets/products/football-boots-2.jpg",
    description: "Lightweight speed boots engineered for quick acceleration and sharp changes of direction."
  },

  {
    id: "xtrn-016",
    name: "XTRN Control Pro Boots",
    sport: "Football",
    category: "Boots",
    gender: "Men",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 6799,
    availability: "In Stock",
    image: "/assets/products/football-boots-3.jpg",
    description: "Control-focused football boots with textured upper for improved touch and ball control."
  },

  {
    id: "xtrn-017",
    name: "XTRN Away Jersey",
    sport: "Football",
    category: "Jerseys",
    gender: "Men",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2199,
    availability: "In Stock",
    image: "/assets/products/football-jersey-2.jpg",
    description: "Lightweight away jersey with moisture-wicking fabric for match-day performance."
  },

  {
    id: "xtrn-018",
    name: "XTRN Training Jersey",
    sport: "Football",
    category: "Jerseys",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1499,
    availability: "In Stock",
    image: "/assets/products/football-jersey-3.jpg",
    description: "Comfortable training jersey designed for daily football sessions and drills."
  },

  {
    id: "xtrn-019",
    name: "XTRN Elite Match Shorts",
    sport: "Football",
    category: "Shorts",
    gender: "Men",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1399,
    availability: "In Stock",
    image: "/assets/products/football-shorts-2.jpg",
    description: "Stretch performance shorts designed for unrestricted movement during matches."
  },

  {
    id: "xtrn-020",
    name: "XTRN Training Shorts",
    sport: "Football",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/football-shorts-3.jpg",
    description: "Breathable training shorts with a lightweight construction for everyday sessions."
  },

  {
    id: "xtrn-021",
    name: "XTRN Training Football",
    sport: "Football",
    category: "Footballs",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/football-ball-2.jpg",
    description: "Durable training football built for regular practice and intensive drills."
  },

  {
    id: "xtrn-022",
    name: "XTRN Elite Match Ball",
    sport: "Football",
    category: "Footballs",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 2499,
    availability: "In Stock",
    image: "/assets/products/football-ball-3.jpg",
    description: "Premium match football with consistent flight and responsive touch."
  },

  {
    id: "xtrn-023",
    name: "XTRN Flex Shin Guards",
    sport: "Football",
    category: "Shin Guards",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/football-shinguard-2.jpg",
    description: "Flexible protective shin guards with lightweight construction for comfortable movement."
  },

  {
    id: "xtrn-024",
    name: "XTRN Pro Shield Shin Guards",
    sport: "Football",
    category: "Shin Guards",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 1299,
    availability: "In Stock",
    image: "/assets/products/football-shinguard-3.jpg",
    description: "Impact-resistant shin guards designed for reliable protection during competitive play."
  },

  {
    id: "xtrn-025",
    name: "XTRN Elite Keeper Gloves",
    sport: "Football",
    category: "Goalkeeper",
    gender: "Unisex",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 3299,
    availability: "In Stock",
    image: "/assets/products/football-gkgloves-2.jpg",
    description: "Professional goalkeeper gloves with high-grip latex palms for confident saves."
  },

  {
    id: "xtrn-026",
    name: "XTRN Training Keeper Gloves",
    sport: "Football",
    category: "Goalkeeper",
    gender: "Unisex",
    size: [7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 1799,
    availability: "In Stock",
    image: "/assets/products/football-gkgloves-3.jpg",
    description: "Durable goalkeeper gloves designed for daily training and practice sessions."
  },

  {
    id: "xtrn-027",
    name: "XTRN Performance Football Socks",
    sport: "Football",
    category: "Socks",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 699,
    availability: "In Stock",
    image: "/assets/products/football-socks-2.jpg",
    description: "Moisture-wicking football socks with supportive compression around the foot."
  },

  {
    id: "xtrn-028",
    name: "XTRN Grip Football Socks",
    sport: "Football",
    category: "Socks",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 799,
    availability: "In Stock",
    image: "/assets/products/football-socks-3.jpg",
    description: "Performance socks with grip zones for a secure feel inside football boots."
  },

  {
    id: "xtrn-029",
    name: "XTRN Match Replica Jersey",
    sport: "Football",
    category: "Jerseys",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1899,
    availability: "In Stock",
    image: "/assets/products/football-jersey-4.jpg",
    description: "Classic football replica jersey with a relaxed fit and breathable construction."
  },

  {
    id: "xtrn-030",
    name: "XTRN Pro Training Shorts",
    sport: "Football",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1099,
    availability: "In Stock",
    image: "/assets/products/football-shorts-4.jpg",
    description: "Quick-drying football training shorts built for repeated high-intensity sessions."
  },


  // ---------------- BASKETBALL ----------------

  {
    id: "xtrn-031",
    name: "XTRN Crossover Hi",
    sport: "Basketball",
    category: "Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 6499,
    availability: "In Stock",
    image: "/assets/products/basketball-shoes-1.jpg",
    description: "High-top basketball sneakers with ankle support and impact-absorbing midsole."
  },

  {
    id: "xtrn-032",
    name: "XTRN Hoop Jersey",
    sport: "Basketball",
    category: "Jerseys",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1799,
    availability: "In Stock",
    image: "/assets/products/basketball-jersey-1.jpg",
    description: "Mesh basketball jersey engineered for airflow during fast-paced play."
  },

  {
    id: "xtrn-033",
    name: "XTRN Baseline Shorts",
    sport: "Basketball",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1399,
    availability: "In Stock",
    image: "/assets/products/basketball-shorts-1.jpg",
    description: "Loose-fit basketball shorts with moisture-wicking fabric."
  },

  {
    id: "xtrn-034",
    name: "XTRN Court Basketball",
    sport: "Basketball",
    category: "Basketballs",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 1699,
    availability: "In Stock",
    image: "/assets/products/basketball-ball-1.jpg",
    description: "Indoor-outdoor basketball with deep-channel grip for consistent handling."
  },

  {
    id: "xtrn-035",
    name: "XTRN Crew Socks",
    sport: "Basketball",
    category: "Socks",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 599,
    availability: "In Stock",
    image: "/assets/products/basketball-socks-1.jpg",
    description: "Cushioned crew socks built for high-impact court movement."
  },

  {
    id: "xtrn-036",
    name: "XTRN Warmup Hoodie",
    sport: "Basketball",
    category: "Clothing",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2799,
    availability: "In Stock",
    image: "/assets/products/basketball-hoodie-1.jpg",
    description: "Pre-game warmup hoodie with relaxed fit and soft fleece lining."
  },


  // ---------------- TENNIS ----------------

  {
    id: "xtrn-037",
    name: "XTRN Power Racket",
    sport: "Tennis",
    category: "Rackets",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 5499,
    availability: "In Stock",
    image: "/assets/products/tennis-racket-1.jpg",
    description: "Graphite-composite racket balancing power and control for all skill levels."
  },

  {
    id: "xtrn-038",
    name: "XTRN Court Glide Shoes",
    sport: "Tennis",
    category: "Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 5299,
    availability: "In Stock",
    image: "/assets/products/tennis-shoes-1.jpg",
    description: "Herringbone-sole tennis shoes for quick lateral movement and court grip."
  },

  {
    id: "xtrn-039",
    name: "XTRN Match Balls (Pack of 3)",
    sport: "Tennis",
    category: "Balls",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 599,
    availability: "In Stock",
    image: "/assets/products/tennis-balls-1.jpg",
    description: "Pressurized tennis balls offering consistent bounce for match play."
  },

  {
    id: "xtrn-040",
    name: "XTRN Ace Polo",
    sport: "Tennis",
    category: "Clothing",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1699,
    availability: "In Stock",
    image: "/assets/products/tennis-polo-1.jpg",
    description: "Breathable polo shirt with UV protection for on-court comfort."
  },

  {
    id: "xtrn-041",
    name: "XTRN Rally Skirt",
    sport: "Tennis",
    category: "Shorts/Skirts",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1499,
    availability: "In Stock",
    image: "/assets/products/tennis-skirt-1.jpg",
    description: "Flexible pleated skirt with built-in shorts for full freedom of movement."
  },

  {
    id: "xtrn-042",
    name: "XTRN Racket Bag",
    sport: "Tennis",
    category: "Bags",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 2999,
    availability: "In Stock",
    image: "/assets/products/tennis-bag-1.jpg",
    description: "Padded racket bag with dedicated compartments for gear and accessories."
  },


  // ---------------- SWIMMING ----------------

  // swim wear (w)

  {
    id: "xtrn-043",
    name: "Racerback One-Piece Swimsuit",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M"],
    brand: "XTRN",
    price: 2199,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720933/swim_wear_women_1_u5xh2g.webp",
    description: "A vibrant royal blue one-piece swimsuit featuring a sporty racerback design, scoop neckline, and sleek contoured panelling for active water wear."
  },

    {
    id: "xtrn-044",
    name: "XTRN Streamline Swimsuit-black",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720931/swim_wear_women_2_vm3de4.webp",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

    {
    id: "xtrn-045",
    name: "XTRN Streamline Swimsuit-white",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720930/swim_wear_women_3_ond9pr.webp",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

    {
    id: "xtrn-046",
    name: "XTRN Streamline Swimsuite-qw",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720927/swim_wear_women_5_ktjbkj.webp",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

    {
    id: "xtrn-047",
    name: "XTRN Streamline Swimsuit-ut",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720925/swim_wear_women_6_dcquzl.webp",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

    {
    id: "xtrn-048",
    name: "XTRN Streamline Swimsuit-blue",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Women",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786720924/swim_wear_women_7_h3zrbr.webp",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

  // swim wear men

   {
    id: "xtrn-049",
    name: "XTRN Streamline Swimsuit-vbn",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Men",
    size: ["XS", "S", "M"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786723945/swim_wear_3_oxerfs.jpg",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

   {
    id: "xtrn-050",
    name: "XTRN Streamline Swimsuit-posj",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Men",
    size: [ "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786723946/swim_war_2_m_tzai7j.jpg",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

   {
    id: "xtrn-051",
    name: "XTRN Streamline Swimsuit-21",
    sport: "Swimming",
    category: "Swimwear",
    gender: "Men",
    size: ["XS", "S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1999,
    availability: "In Stock",
    image: "https://res.cloudinary.com/duvfdxql9/image/upload/v1786723947/swim_wear1_m_yzhq1h.jpg",
    description: "Chlorine-resistant swimsuit designed for low drag and fast laps."
  },

  // --------------------------------------------------------------------------


  {
    id: "xtrn-052",
    name: "XTRN Clear Vision Goggles",
    sport: "Swimming",
    category: "Goggles",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 899,
    availability: "In Stock",
    image: "/assets/products/swim-goggles-1.jpg",
    description: "Anti-fog swim goggles with UV protection and adjustable strap."
  },

  {
    id: "xtrn-053",
    name: "XTRN Silicone Cap",
    sport: "Swimming",
    category: "Caps",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 499,
    availability: "In Stock",
    image: "/assets/products/swim-cap-1.jpg",
    description: "Durable silicone swim cap that reduces drag and protects hair."
  },

  {
    id: "xtrn-054",
    name: "XTRN Board Shorts",
    sport: "Swimming",
    category: "Shorts",
    gender: "Men",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1299,
    availability: "In Stock",
    image: "/assets/products/swim-shorts-1.jpg",
    description: "Quick-dry board shorts built for pool and open-water sessions."
  },

  {
    id: "xtrn-055",
    name: "XTRN Microfiber Towel",
    sport: "Swimming",
    category: "Towels",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 799,
    availability: "In Stock",
    image: "/assets/products/swim-towel-1.jpg",
    description: "Compact, fast-drying microfiber towel perfect for swim bags."
  },

  {
    id: "xtrn-056",
    name: "XTRN Kickboard",
    sport: "Swimming",
    category: "Training Equipment",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/swim-kickboard-1.jpg",
    description: "Buoyant kickboard for leg-strength and technique training."
  },


  // ---------------- TRAINING ----------------

  {
    id: "xtrn-057",
    name: "XTRN Flex Trainer Shoes",
    sport: "Training",
    category: "Training Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 4499,
    availability: "In Stock",
    image: "/assets/products/training-shoes-1.jpg",
    description: "Cross-training shoes with flexible outsole ideal for gym and HIIT workouts."
  },

  {
    id: "xtrn-058",
    name: "XTRN Grind Tee",
    sport: "Training",
    category: "T-Shirts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 899,
    availability: "In Stock",
    image: "/assets/products/training-tshirt-1.jpg",
    description: "Quick-dry training tee with four-way stretch fabric."
  },

  {
    id: "xtrn-059",
    name: "XTRN Lift Shorts",
    sport: "Training",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1199,
    availability: "In Stock",
    image: "/assets/products/training-shorts-1.jpg",
    description: "Durable training shorts with zip pockets for gym essentials."
  },

  {
    id: "xtrn-060",
    name: "XTRN Track Pants",
    sport: "Training",
    category: "Track Pants",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1799,
    availability: "In Stock",
    image: "/assets/products/training-trackpants-1.jpg",
    description: "Tapered track pants with ribbed cuffs for warmups and cooldowns."
  },

  {
    id: "xtrn-061",
    name: "XTRN Core Hoodie",
    sport: "Training",
    category: "Hoodies",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2599,
    availability: "In Stock",
    image: "/assets/products/training-hoodie-1.jpg",
    description: "Fleece-lined training hoodie for pre and post-workout comfort."
  },

  {
    id: "xtrn-062",
    name: "XTRN Grip Gloves",
    sport: "Training",
    category: "Gloves",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/training-gloves-1.jpg",
    description: "Padded training gloves with wrist support for weightlifting."
  },


  // ---------------- CYCLING ----------------

  {
    id: "xtrn-063",
    name: "XTRN Road Bicycle",
    sport: "Cycling",
    category: "Bicycles",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 34999,
    availability: "In Stock",
    image: "/assets/products/cycling-bicycle-1.jpg",
    description: "Lightweight aluminum-frame road bicycle built for speed and endurance."
  },

  {
    id: "xtrn-064",
    name: "XTRN Aero Helmet",
    sport: "Cycling",
    category: "Helmets",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 2999,
    availability: "In Stock",
    image: "/assets/products/cycling-helmet-1.jpg",
    description: "Aerodynamic cycling helmet with multi-vent cooling system."
  },

  {
    id: "xtrn-065",
    name: "XTRN Race Jersey",
    sport: "Cycling",
    category: "Jerseys",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2199,
    availability: "In Stock",
    image: "/assets/products/cycling-jersey-1.jpg",
    description: "Aerodynamic cycling jersey with rear pockets for on-ride storage."
  },

  {
    id: "xtrn-066",
    name: "XTRN Padded Shorts",
    sport: "Cycling",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 2499,
    availability: "In Stock",
    image: "/assets/products/cycling-shorts-1.jpg",
    description: "Gel-padded cycling shorts for long-distance saddle comfort."
  },

  {
    id: "xtrn-067",
    name: "XTRN Clip Cycling Shoes",
    sport: "Cycling",
    category: "Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 4999,
    availability: "In Stock",
    image: "/assets/products/cycling-shoes-1.jpg",
    description: "Stiff-soled cycling shoes compatible with clipless pedal systems."
  },

  {
    id: "xtrn-068",
    name: "XTRN Ride Gloves",
    sport: "Cycling",
    category: "Gloves",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 999,
    availability: "In Stock",
    image: "/assets/products/cycling-gloves-1.jpg",
    description: "Padded cycling gloves that reduce vibration and improve grip."
  },


  // ---------------- BOXING ----------------

  {
    id: "xtrn-069",
    name: "XTRN Power Boxing Gloves",
    sport: "Boxing",
    category: "Gloves",
    gender: "Unisex",
    size: [8, 10, 12, 14, 16],
    brand: "XTRN",
    price: 2999,
    availability: "In Stock",
    image: "/assets/products/boxing-gloves-1.jpg",
    description: "Padded boxing gloves offering high-density foam protection for heavy training."
  },

  {
    id: "xtrn-070",
    name: "XTRN Ring Shoes",
    sport: "Boxing",
    category: "Shoes",
    gender: "Unisex",
    size: [6, 7, 8, 9, 10, 11],
    brand: "XTRN",
    price: 3499,
    availability: "In Stock",
    image: "/assets/products/boxing-shoes-1.jpg",
    description: "Lightweight high-top boxing shoes for quick footwork and ankle support."
  },

  {
    id: "xtrn-071",
    name: "XTRN Fight Shorts",
    sport: "Boxing",
    category: "Shorts",
    gender: "Unisex",
    size: ["S", "M", "L", "XL"],
    brand: "XTRN",
    price: 1599,
    availability: "In Stock",
    image: "/assets/products/boxing-shorts-1.jpg",
    description: "Satin boxing shorts with elastic waistband for unrestricted movement."
  },

  {
    id: "xtrn-072",
    name: "XTRN Hand Wraps",
    sport: "Boxing",
    category: "Hand Wraps",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 399,
    availability: "In Stock",
    image: "/assets/products/boxing-handwraps-1.jpg",
    description: "Elastic cotton hand wraps that protect knuckles and wrists during training."
  },

  {
    id: "xtrn-073",
    name: "XTRN Head Guard",
    sport: "Boxing",
    category: "Head Guards",
    gender: "Unisex",
    size: ["S", "M", "L"],
    brand: "XTRN",
    price: 2199,
    availability: "In Stock",
    image: "/assets/products/boxing-headguard-1.jpg",
    description: "Padded sparring head guard with adjustable chin strap for full coverage."
  },

  {
    id: "xtrn-074",
    name: "XTRN Mouth Guard",
    sport: "Boxing",
    category: "Accessories",
    gender: "Unisex",
    size: [],
    brand: "XTRN",
    price: 299,
    availability: "In Stock",
    image: "/assets/products/boxing-mouthguard-1.jpg",
    description: "Boil-and-bite mouth guard offering custom fit and impact protection."
  }
];

export default products;