// Product structure:
// id          : string  -> unique identifier (e.g. "xtrn-001")
// name        : string  -> product name
// sport       : string  -> sport category
// category    : string  -> product type within that sport
// brand       : string  -> always "XTRN"
// price       : number  -> price in INR
// image       : string  -> image URL or local asset path
// description : string  -> short marketing description

const products = [
  // ---------------- RUNNING (7) ----------------
  { id: "xtrn-001", name: "XTRN Velocity Runner", sport: "Running", category: "Shoes", brand: "XTRN", price: 4999, image: "/assets/products/running-shoes-1.jpg", description: "Lightweight mesh running shoes with responsive foam cushioning for long-distance comfort." },
  { id: "xtrn-002", name: "XTRN Pace Tee", sport: "Running", category: "T-Shirts", brand: "XTRN", price: 999, image: "/assets/products/running-tshirt-1.jpg", description: "Moisture-wicking running tee that keeps you dry and cool on every mile." },
  { id: "xtrn-003", name: "XTRN Sprint Shorts", sport: "Running", category: "Shorts", brand: "XTRN", price: 1299, image: "/assets/products/running-shorts-1.jpg", description: "Breathable lightweight shorts with built-in liner for chafe-free runs." },
  { id: "xtrn-004", name: "XTRN Windshield Jacket", sport: "Running", category: "Jackets", brand: "XTRN", price: 3499, image: "/assets/products/running-jacket-1.jpg", description: "Wind-resistant packable jacket designed for early morning and rainy runs." },
  { id: "xtrn-005", name: "XTRN Compression Set", sport: "Running", category: "Clothing", brand: "XTRN", price: 2199, image: "/assets/products/running-clothing-1.jpg", description: "Full compression running set that supports muscles during high-intensity training." },
  { id: "xtrn-006", name: "XTRN Cushion Socks", sport: "Running", category: "Socks", brand: "XTRN", price: 499, image: "/assets/products/running-socks-1.jpg", description: "Arch-support running socks with cushioned heel and blister-free stitching." },
  { id: "xtrn-007", name: "XTRN Runner's Belt", sport: "Running", category: "Accessories", brand: "XTRN", price: 899, image: "/assets/products/running-belt-1.jpg", description: "Adjustable hydration belt with phone pocket for on-the-go runners." },

  // ---------------- FOOTBALL (7) ----------------
  { id: "xtrn-008", name: "XTRN Strike Boots", sport: "Football", category: "Boots", brand: "XTRN", price: 5999, image: "/assets/products/football-boots-1.jpg", description: "Firm-ground football boots with molded studs for explosive traction on turf." },
  { id: "xtrn-009", name: "XTRN Matchday Jersey", sport: "Football", category: "Jerseys", brand: "XTRN", price: 1999, image: "/assets/products/football-jersey-1.jpg", description: "Breathable performance jersey built for full 90-minute comfort." },
  { id: "xtrn-010", name: "XTRN Pitch Shorts", sport: "Football", category: "Shorts", brand: "XTRN", price: 1199, image: "/assets/products/football-shorts-1.jpg", description: "Lightweight football shorts with stretch panels for unrestricted movement." },
  { id: "xtrn-011", name: "XTRN Pro Football", sport: "Football", category: "Footballs", brand: "XTRN", price: 1499, image: "/assets/products/football-ball-1.jpg", description: "Match-quality football with textured surface for precise control and flight." },
  { id: "xtrn-012", name: "XTRN Guard Shin Pads", sport: "Football", category: "Shin Guards", brand: "XTRN", price: 799, image: "/assets/products/football-shinguard-1.jpg", description: "Lightweight shin guards with ventilated shell for maximum leg protection." },
  { id: "xtrn-013", name: "XTRN Keeper Gloves", sport: "Football", category: "Goalkeeper", brand: "XTRN", price: 2499, image: "/assets/products/football-gkgloves-1.jpg", description: "Latex-palm goalkeeper gloves designed for superior grip and shot-stopping." },
  { id: "xtrn-014", name: "XTRN Captain's Armband", sport: "Football", category: "Accessories", brand: "XTRN", price: 399, image: "/assets/products/football-armband-1.jpg", description: "Elastic captain's armband with secure grip strip." },

  // ---------------- BASKETBALL (6) ----------------
  { id: "xtrn-015", name: "XTRN Crossover Hi", sport: "Basketball", category: "Shoes", brand: "XTRN", price: 6499, image: "/assets/products/basketball-shoes-1.jpg", description: "High-top basketball sneakers with ankle support and impact-absorbing midsole." },
  { id: "xtrn-016", name: "XTRN Hoop Jersey", sport: "Basketball", category: "Jerseys", brand: "XTRN", price: 1799, image: "/assets/products/basketball-jersey-1.jpg", description: "Mesh basketball jersey engineered for airflow during fast-paced play." },
  { id: "xtrn-017", name: "XTRN Baseline Shorts", sport: "Basketball", category: "Shorts", brand: "XTRN", price: 1399, image: "/assets/products/basketball-shorts-1.jpg", description: "Loose-fit basketball shorts with moisture-wicking fabric." },
  { id: "xtrn-018", name: "XTRN Court Basketball", sport: "Basketball", category: "Basketballs", brand: "XTRN", price: 1699, image: "/assets/products/basketball-ball-1.jpg", description: "Indoor-outdoor basketball with deep-channel grip for consistent handling." },
  { id: "xtrn-019", name: "XTRN Crew Socks", sport: "Basketball", category: "Socks", brand: "XTRN", price: 599, image: "/assets/products/basketball-socks-1.jpg", description: "Cushioned crew socks built for high-impact court movement." },
  { id: "xtrn-020", name: "XTRN Warmup Hoodie", sport: "Basketball", category: "Clothing", brand: "XTRN", price: 2799, image: "/assets/products/basketball-hoodie-1.jpg", description: "Pre-game warmup hoodie with relaxed fit and soft fleece lining." },

  // ---------------- TENNIS (6) ----------------
  { id: "xtrn-021", name: "XTRN Power Racket", sport: "Tennis", category: "Rackets", brand: "XTRN", price: 5499, image: "/assets/products/tennis-racket-1.jpg", description: "Graphite-composite racket balancing power and control for all skill levels." },
  { id: "xtrn-022", name: "XTRN Court Glide Shoes", sport: "Tennis", category: "Shoes", brand: "XTRN", price: 5299, image: "/assets/products/tennis-shoes-1.jpg", description: "Herringbone-sole tennis shoes for quick lateral movement and court grip." },
  { id: "xtrn-023", name: "XTRN Match Balls (Pack of 3)", sport: "Tennis", category: "Balls", brand: "XTRN", price: 599, image: "/assets/products/tennis-balls-1.jpg", description: "Pressurized tennis balls offering consistent bounce for match play." },
  { id: "xtrn-024", name: "XTRN Ace Polo", sport: "Tennis", category: "Clothing", brand: "XTRN", price: 1699, image: "/assets/products/tennis-polo-1.jpg", description: "Breathable polo shirt with UV protection for on-court comfort." },
  { id: "xtrn-025", name: "XTRN Rally Skirt", sport: "Tennis", category: "Shorts/Skirts", brand: "XTRN", price: 1499, image: "/assets/products/tennis-skirt-1.jpg", description: "Flexible pleated skirt with built-in shorts for full freedom of movement." },
  { id: "xtrn-026", name: "XTRN Racket Bag", sport: "Tennis", category: "Bags", brand: "XTRN", price: 2999, image: "/assets/products/tennis-bag-1.jpg", description: "Padded racket bag with dedicated compartments for gear and accessories." },

  // ---------------- SWIMMING (6) ----------------
  { id: "xtrn-027", name: "XTRN Streamline Swimsuit", sport: "Swimming", category: "Swimwear", brand: "XTRN", price: 1999, image: "/assets/products/swim-suit-1.jpg", description: "Chlorine-resistant swimsuit designed for low drag and fast laps." },
  { id: "xtrn-028", name: "XTRN Clear Vision Goggles", sport: "Swimming", category: "Goggles", brand: "XTRN", price: 899, image: "/assets/products/swim-goggles-1.jpg", description: "Anti-fog swim goggles with UV protection and adjustable strap." },
  { id: "xtrn-029", name: "XTRN Silicone Cap", sport: "Swimming", category: "Caps", brand: "XTRN", price: 499, image: "/assets/products/swim-cap-1.jpg", description: "Durable silicone swim cap that reduces drag and protects hair." },
  { id: "xtrn-030", name: "XTRN Board Shorts", sport: "Swimming", category: "Shorts", brand: "XTRN", price: 1299, image: "/assets/products/swim-shorts-1.jpg", description: "Quick-dry board shorts built for pool and open-water sessions." },
  { id: "xtrn-031", name: "XTRN Microfiber Towel", sport: "Swimming", category: "Towels", brand: "XTRN", price: 799, image: "/assets/products/swim-towel-1.jpg", description: "Compact, fast-drying microfiber towel perfect for swim bags." },
  { id: "xtrn-032", name: "XTRN Kickboard", sport: "Swimming", category: "Training Equipment", brand: "XTRN", price: 999, image: "/assets/products/swim-kickboard-1.jpg", description: "Buoyant kickboard for leg-strength and technique training." },

  // ---------------- TRAINING (6) ----------------
  { id: "xtrn-033", name: "XTRN Flex Trainer Shoes", sport: "Training", category: "Training Shoes", brand: "XTRN", price: 4499, image: "/assets/products/training-shoes-1.jpg", description: "Cross-training shoes with flexible outsole ideal for gym and HIIT workouts." },
  { id: "xtrn-034", name: "XTRN Grind Tee", sport: "Training", category: "T-Shirts", brand: "XTRN", price: 899, image: "/assets/products/training-tshirt-1.jpg", description: "Quick-dry training tee with four-way stretch fabric." },
  { id: "xtrn-035", name: "XTRN Lift Shorts", sport: "Training", category: "Shorts", brand: "XTRN", price: 1199, image: "/assets/products/training-shorts-1.jpg", description: "Durable training shorts with zip pockets for gym essentials." },
  { id: "xtrn-036", name: "XTRN Track Pants", sport: "Training", category: "Track Pants", brand: "XTRN", price: 1799, image: "/assets/products/training-trackpants-1.jpg", description: "Tapered track pants with ribbed cuffs for warmups and cooldowns." },
  { id: "xtrn-037", name: "XTRN Core Hoodie", sport: "Training", category: "Hoodies", brand: "XTRN", price: 2599, image: "/assets/products/training-hoodie-1.jpg", description: "Fleece-lined training hoodie for pre and post-workout comfort." },
  { id: "xtrn-038", name: "XTRN Grip Gloves", sport: "Training", category: "Gloves", brand: "XTRN", price: 999, image: "/assets/products/training-gloves-1.jpg", description: "Padded training gloves with wrist support for weightlifting." },

  // ---------------- CYCLING (6) ----------------
  { id: "xtrn-039", name: "XTRN Road Bicycle", sport: "Cycling", category: "Bicycles", brand: "XTRN", price: 34999, image: "/assets/products/cycling-bicycle-1.jpg", description: "Lightweight aluminum-frame road bicycle built for speed and endurance." },
  { id: "xtrn-040", name: "XTRN Aero Helmet", sport: "Cycling", category: "Helmets", brand: "XTRN", price: 2999, image: "/assets/products/cycling-helmet-1.jpg", description: "Aerodynamic cycling helmet with multi-vent cooling system." },
  { id: "xtrn-041", name: "XTRN Race Jersey", sport: "Cycling", category: "Jerseys", brand: "XTRN", price: 2199, image: "/assets/products/cycling-jersey-1.jpg", description: "Aerodynamic cycling jersey with rear pockets for on-ride storage." },
  { id: "xtrn-042", name: "XTRN Padded Shorts", sport: "Cycling", category: "Shorts", brand: "XTRN", price: 2499, image: "/assets/products/cycling-shorts-1.jpg", description: "Gel-padded cycling shorts for long-distance saddle comfort." },
  { id: "xtrn-043", name: "XTRN Clip Cycling Shoes", sport: "Cycling", category: "Shoes", brand: "XTRN", price: 4999, image: "/assets/products/cycling-shoes-1.jpg", description: "Stiff-soled cycling shoes compatible with clipless pedal systems." },
  { id: "xtrn-044", name: "XTRN Ride Gloves", sport: "Cycling", category: "Gloves", brand: "XTRN", price: 999, image: "/assets/products/cycling-gloves-1.jpg", description: "Padded cycling gloves that reduce vibration and improve grip." },

  // ---------------- BOXING (6) ----------------
  { id: "xtrn-045", name: "XTRN Power Boxing Gloves", sport: "Boxing", category: "Gloves", brand: "XTRN", price: 2999, image: "/assets/products/boxing-gloves-1.jpg", description: "Padded boxing gloves offering high-density foam protection for heavy training." },
  { id: "xtrn-046", name: "XTRN Ring Shoes", sport: "Boxing", category: "Shoes", brand: "XTRN", price: 3499, image: "/assets/products/boxing-shoes-1.jpg", description: "Lightweight high-top boxing shoes for quick footwork and ankle support." },
  { id: "xtrn-047", name: "XTRN Fight Shorts", sport: "Boxing", category: "Shorts", brand: "XTRN", price: 1599, image: "/assets/products/boxing-shorts-1.jpg", description: "Satin boxing shorts with elastic waistband for unrestricted movement." },
  { id: "xtrn-048", name: "XTRN Hand Wraps", sport: "Boxing", category: "Hand Wraps", brand: "XTRN", price: 399, image: "/assets/products/boxing-handwraps-1.jpg", description: "Elastic cotton hand wraps that protect knuckles and wrists during training." },
  { id: "xtrn-049", name: "XTRN Head Guard", sport: "Boxing", category: "Head Guards", brand: "XTRN", price: 2199, image: "/assets/products/boxing-headguard-1.jpg", description: "Padded sparring head guard with adjustable chin strap for full coverage." },
  { id: "xtrn-050", name: "XTRN Mouth Guard", sport: "Boxing", category: "Accessories", brand: "XTRN", price: 299, image: "/assets/products/boxing-mouthguard-1.jpg", description: "Boil-and-bite mouth guard offering custom fit and impact protection." },
];

export default products;