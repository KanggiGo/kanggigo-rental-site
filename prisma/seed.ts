import {
  PrismaClient,
  BikeCategory,
  Transmission,
  Currency,
  BikeStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCALES = ["en", "id", "ru", "fr"] as const;
type Locale = (typeof LOCALES)[number];
type L4 = Record<Locale, string>;

type BikeImageSeed = { file: string; alt: string };

type BikeSeed = {
  name: string;
  brand: string;
  category: BikeCategory;
  transmission: Transmission;
  engineCc: number;
  seats: number;
  helmetsIncluded: number;
  pricePerDay: number;
  isFeatured: boolean;
  description: L4;
  images: BikeImageSeed[];
};

const BIKES: BikeSeed[] = [
  {
    name: "Honda Scoopy 110",
    brand: "Honda",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 110,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 6,
    isFeatured: true,
    images: [{ file: "honda-scoopy-110cc-2024-pearl-white.jpg", alt: "Honda Scoopy 110 automatic scooter in pearl white, available for rent in Bali" }],
    description: {
      en: "The Honda Scoopy 110 pairs a 109cc PGM-FI engine with retro Italian-inspired styling, making it one of the easiest and most stylish ways to get around Bali's beach towns. At under 90 kg with a low seat height, it's forgiving for first-time riders, while the idling-stop system and roughly 50+ km/l fuel economy keep running costs low on longer days out. Underseat storage fits a helmet and a change of clothes, and the disc front / drum rear brakes give confident stopping power in traffic.",
      id: "Honda Scoopy 110 memadukan mesin PGM-FI 109cc dengan desain retro ala Italia, menjadikannya salah satu cara paling mudah dan bergaya untuk berkeliling kota pantai di Bali. Dengan bobot di bawah 90 kg dan tinggi jok yang rendah, motor ini nyaman untuk pengendara pemula, sementara sistem idling-stop dan konsumsi bensin lebih dari 50 km/liter menjaga biaya operasional tetap rendah.",
      ru: "Honda Scoopy 110 сочетает 109-кубовый двигатель PGM-FI с ретро-дизайном в итальянском стиле — один из самых простых и стильных способов передвигаться по пляжным городкам Бали. При весе менее 90 кг и низкой посадке он прощает ошибки новичкам, а система idling-stop и расход топлива более 50 км/л держат расходы низкими.",
      fr: "Le Honda Scoopy 110 associe un moteur PGM-FI de 109 cm³ à un style rétro d'inspiration italienne, l'un des moyens les plus simples et les plus élégants de se déplacer dans les villes balnéaires de Bali. Avec moins de 90 kg et une selle basse, il pardonne les erreurs des débutants, tandis que le système idling-stop et une consommation de plus de 50 km/l gardent les coûts bas.",
    },
  },
  {
    name: "Honda Vario 160 ABS",
    brand: "Honda",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 160,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 8,
    isFeatured: true,
    images: [{ file: "honda-vario160-160cc-2025-red.jpg", alt: "Honda Vario 160 ABS automatic scooter in red, available for rent in Bali" }],
    description: {
      en: "The Honda Vario 160 ABS steps up from a standard scooter with a 157cc liquid-cooled eSP+ engine producing 15.2 hp, giving noticeably stronger acceleration for overtaking and hill climbs around Ubud or Uluwatu. Front and rear disc brakes with single-channel ABS add real stopping confidence on wet roads, and the lightweight eSAF frame keeps handling sharp despite the extra power. A good middle-ground pick for riders who want more performance than a basic 110cc scooter without stepping up to a full adventure model.",
      id: "Honda Vario 160 ABS naik kelas dengan mesin eSP+ 157cc berpendingin cairan yang menghasilkan 15,2 hp, memberi akselerasi lebih kuat untuk menyalip atau menanjak di sekitar Ubud dan Uluwatu. Rem cakram depan-belakang dengan ABS satu saluran menambah rasa percaya diri di jalan basah, dan rangka eSAF yang ringan menjaga handling tetap lincah.",
      ru: "Honda Vario 160 ABS поднимает планку жидкостным двигателем eSP+ объёмом 157 см³ мощностью 15,2 л.с., давая заметно более сильное ускорение для обгонов и подъёмов в районе Убуда и Улувату. Дисковые тормоза спереди и сзади с одноканальным ABS добавляют уверенности на мокрой дороге, а лёгкая рама eSAF сохраняет манёвренность.",
      fr: "Le Honda Vario 160 ABS monte en gamme avec un moteur eSP+ de 157 cm³ refroidi par liquide développant 15,2 ch, offrant une accélération nettement plus forte pour dépasser ou grimper autour d'Ubud et d'Uluwatu. Les freins à disque avant et arrière avec ABS monocanal ajoutent de l'assurance sur route mouillée, et le cadre léger eSAF garde une tenue de route précise.",
    },
  },
  {
    name: "Yamaha NMAX 155",
    brand: "Yamaha",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 155,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 9,
    isFeatured: false,
    images: [
      { file: "yamaha-nmax-155cc-2026-black.jpg", alt: "Yamaha NMAX 155 automatic scooter in black, available for rent in Bali" },
      { file: "yamaha-nmax-connected-155cc-2024-yellow.jpg", alt: "Yamaha NMAX 155 automatic scooter in yellow, side view" },
    ],
    description: {
      en: "The Yamaha NMAX 155 runs Yamaha's Blue Core 155cc engine with Variable Valve Actuation, delivering close to 15 hp with genuinely good fuel economy for its size. ABS-linked disc brakes on both wheels and 13-inch wheels give it a planted, confident feel at speed, while the roomy seat and underseat storage make it comfortable for day-long rides between Seminyak and Canggu. It's the sweet spot in our automatic lineup — more presence and power than a 110cc scooter, without the premium price of the Tech Max.",
      id: "Yamaha NMAX 155 mengusung mesin Blue Core 155cc dengan VVA yang menghasilkan hampir 15 hp dengan konsumsi bahan bakar yang efisien. Rem cakram ABS di kedua roda dan velg 13 inci memberi rasa stabil saat melaju kencang, sementara jok yang luas dan bagasi bawah jok membuatnya nyaman untuk perjalanan seharian antara Seminyak dan Canggu.",
      ru: "Yamaha NMAX 155 использует двигатель Blue Core 155 см³ с системой VVA, выдающий почти 15 л.с. при действительно хорошей топливной экономичности. Дисковые тормоза с ABS на обоих колёсах и 13-дюймовые колёса дают уверенное ощущение на скорости, а просторное сиденье и багажник под сиденьем делают его удобным для целодневных поездок между Семиньяком и Чангу.",
      fr: "Le Yamaha NMAX 155 utilise le moteur Blue Core 155 cm³ à VVA, développant près de 15 ch avec une bonne économie de carburant pour sa cylindrée. Les freins à disque ABS sur les deux roues et les jantes de 13 pouces donnent une sensation stable à vitesse, tandis que la selle spacieuse et le rangement sous la selle le rendent confortable pour des journées entières entre Seminyak et Canggu.",
    },
  },
  {
    name: "Yamaha NMAX Turbo Techmax",
    brand: "Yamaha",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 155,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 12,
    isFeatured: true,
    images: [{ file: "yamaha-nmax-turbo-techmax-155cc-2025-magma-black.jpg", alt: "Yamaha NMAX Turbo Tech Max automatic scooter in magma black, available for rent in Bali" }],
    description: {
      en: "The Yamaha NMAX Turbo Tech Max is the flagship of the NMAX range, built on the same 155cc VVA engine but paired with Yamaha's Electric CVT (YECVT) — an electronically controlled transmission with selectable Sport and Town riding modes for a noticeably sharper throttle response. Dual digital displays put speed, trip data, and optional Garmin navigation in view, and Y-Connect smartphone pairing adds call and message alerts on the move. ABS on both wheels and a broad, comfortable seat round out a scooter built for riders who want the newest tech Yamaha offers in Bali.",
      id: "Yamaha NMAX Turbo Tech Max adalah andalan lini NMAX, menggunakan mesin VVA 155cc yang sama namun dipadukan dengan Yamaha Electric CVT (YECVT) — transmisi elektronik dengan mode berkendara Sport dan Town untuk respons gas yang lebih tajam. Dua layar digital menampilkan kecepatan, data perjalanan, dan navigasi Garmin opsional, sementara Y-Connect menambahkan notifikasi panggilan dan pesan saat berkendara.",
      ru: "Yamaha NMAX Turbo Tech Max — флагман линейки NMAX на том же 155-кубовом двигателе VVA, но с электронной трансмиссией YECVT с режимами Sport и Town для более острого отклика на газ. Два цифровых дисплея показывают скорость, данные о поездке и опциональную навигацию Garmin, а Y-Connect добавляет уведомления о звонках и сообщениях в движении.",
      fr: "Le Yamaha NMAX Turbo Tech Max est le fleuron de la gamme NMAX, construit sur le même moteur VVA de 155 cm³ mais associé à la transmission électronique YECVT de Yamaha, avec des modes de conduite Sport et Town sélectionnables pour une réponse à l'accélérateur plus vive. Deux écrans numériques affichent la vitesse, les données de trajet et une navigation Garmin en option, et Y-Connect ajoute des alertes d'appels et de messages en roulant.",
    },
  },
  {
    name: "Yamaha NMax Neo 155",
    brand: "Yamaha",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 155,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 8,
    isFeatured: false,
    images: [
      { file: "yamaha-nmax-neo-155cc-2026-black.jpg", alt: "Yamaha NMax Neo 155 automatic scooter in black, available for rent in Bali" },
      { file: "yamaha-nmax-neo-155cc-2026-matte-blue.jpg", alt: "Yamaha NMax Neo 155 automatic scooter in matte blue, side view" },
    ],
    description: {
      en: "The Yamaha NMax Neo is the entry point into Yamaha's latest-generation NMAX platform — the same 155cc liquid-cooled engine and 15 hp output as the standard NMAX, in a lighter, simpler package with a conventional key instead of the Tech Max's smart electronics. ABS on both wheels and a clean digital instrument panel keep the essentials covered without paying for features you might not use. A practical choice for riders who want NMAX performance and looks at a friendlier daily rate.",
      id: "Yamaha NMax Neo adalah pintu masuk ke platform NMAX generasi terbaru Yamaha — mesin 155cc berpendingin cairan dan tenaga 15 hp yang sama dengan NMAX standar, dalam paket yang lebih ringan dan sederhana dengan kunci konvensional. ABS di kedua roda dan panel instrumen digital yang bersih menjaga fitur esensial tanpa membayar lebih untuk fitur yang mungkin tidak Anda perlukan.",
      ru: "Yamaha NMax Neo — входная точка в новейшую платформу NMAX от Yamaha: тот же 155-кубовый двигатель с жидкостным охлаждением и 15 л.с., что и у стандартного NMAX, в более лёгком и простом исполнении с обычным ключом вместо смарт-электроники Tech Max. ABS на обоих колёсах и чистая цифровая панель приборов сохраняют главное без переплаты за неиспользуемые функции.",
      fr: "Le Yamaha NMax Neo est la porte d'entrée vers la dernière génération de la plateforme NMAX de Yamaha — le même moteur 155 cm³ refroidi par liquide et les mêmes 15 ch que le NMAX standard, dans un ensemble plus léger et plus simple avec une clé conventionnelle plutôt que l'électronique intelligente du Tech Max. L'ABS sur les deux roues et un tableau de bord numérique épuré couvrent l'essentiel sans payer pour des fonctions superflues.",
    },
  },
  {
    name: "Honda ADV 160 ABS",
    brand: "Honda",
    category: "ADVENTURE",
    transmission: "AUTOMATIC",
    engineCc: 160,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 13,
    isFeatured: true,
    images: [{ file: "honda-adv160-160cc-2025-asteroid-black.jpg", alt: "Honda ADV 160 ABS adventure scooter in asteroid black, available for rent in Bali" }],
    description: {
      en: "The Honda ADV 160 ABS is Honda's adventure-styled scooter, built around a 157cc engine producing 16 hp with front-wheel ABS and long-travel Showa suspension that soaks up rougher roads on the way to Kintamani or the backroads around Uluwatu. A two-position adjustable windscreen cuts wind fatigue on longer rides, and 27 litres of underseat storage swallows a full-face helmet plus a day bag. The tall, upright riding position and Honda Smart Key make it a favourite for riders covering more ground in a single day.",
      id: "Honda ADV 160 ABS adalah skuter bergaya adventure dengan mesin 157cc bertenaga 16 hp, ABS roda depan, dan suspensi Showa long-travel yang meredam jalan kasar menuju Kintamani atau jalur pedesaan sekitar Uluwatu. Kaca depan yang dapat diatur mengurangi kelelahan akibat angin, dan bagasi 27 liter di bawah jok cukup untuk helm full-face dan tas harian.",
      ru: "Honda ADV 160 ABS — скутер в стиле adventure с 157-кубовым двигателем мощностью 16 л.с., ABS на переднем колесе и подвеской Showa с большим ходом, которая сглаживает неровные дороги по пути к Кинтамани или на просёлках вокруг Улувату. Регулируемое лобовое стекло снижает усталость от ветра, а багажник под сиденьем на 27 литров вмещает полнолицевой шлем и дневную сумку.",
      fr: "Le Honda ADV 160 ABS est un scooter au style adventure doté d'un moteur de 157 cm³ développant 16 ch, d'un ABS sur la roue avant et d'une suspension Showa à grand débattement qui absorbe les routes accidentées vers Kintamani ou les petites routes autour d'Uluwatu. Un pare-brise réglable réduit la fatigue due au vent, et 27 litres de rangement sous la selle accueillent un casque intégral et un sac de voyage.",
    },
  },
  {
    name: "Yamaha XMAX 250",
    brand: "Yamaha",
    category: "ADVENTURE",
    transmission: "AUTOMATIC",
    engineCc: 250,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 18,
    isFeatured: false,
    images: [
      { file: "yamaha-xmax-connected-250cc-2024-midnight-black.jpg", alt: "Yamaha XMAX 250 adventure scooter in midnight black, available for rent in Bali" },
      { file: "yamaha-xmax-connected-250cc-2025-metallic-black.jpg", alt: "Yamaha XMAX 250 adventure scooter in metallic black, side view" },
    ],
    description: {
      en: "The Yamaha XMAX 250 is a genuine step up in class — a 250cc Blue Core engine with Variable Valve Actuation puts out around 22.5 hp, enough for confident highway overtaking and the climbs around Kintamani and Munduk. Traction control and ABS add a real safety margin on Bali's mix of wet asphalt and gravel-strewn back roads, and the full LED lighting and TFT-style display give it a genuinely premium feel. This is the bike for riders planning multi-day loops around the island rather than short hops along the coast.",
      id: "Yamaha XMAX 250 adalah lompatan kelas yang nyata — mesin Blue Core 250cc dengan VVA menghasilkan sekitar 22,5 hp, cukup untuk menyalip percaya diri di jalan raya dan tanjakan sekitar Kintamani dan Munduk. Traction control dan ABS menambah margin keamanan di jalan Bali yang beragam, sementara lampu LED penuh dan layar TFT memberi kesan premium yang sesungguhnya.",
      ru: "Yamaha XMAX 250 — настоящий переход в другой класс: двигатель Blue Core 250 см³ с VVA выдаёт около 22,5 л.с., достаточно для уверенных обгонов на шоссе и подъёмов у Кинтамани и Мундука. Система контроля тяги и ABS добавляют запас безопасности на смешанных дорогах Бали, а полностью светодиодная оптика и TFT-дисплей создают по-настоящему премиальное ощущение.",
      fr: "Le Yamaha XMAX 250 est un véritable changement de catégorie — un moteur Blue Core 250 cm³ à VVA développe environ 22,5 ch, suffisant pour des dépassements assurés sur autoroute et les montées autour de Kintamani et Munduk. Le contrôle de traction et l'ABS ajoutent une vraie marge de sécurité sur les routes mixtes de Bali, et l'éclairage tout LED avec écran TFT lui donne une sensation vraiment premium.",
    },
  },
  {
    name: "Yamaha XMAX Techmax 250",
    brand: "Yamaha",
    category: "ADVENTURE",
    transmission: "AUTOMATIC",
    engineCc: 250,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 22,
    isFeatured: true,
    images: [{ file: "yamaha-xmax-techmax-250cc-2026-black.jpg", alt: "Yamaha XMAX Tech Max adventure scooter in black, available for rent in Bali" }],
    description: {
      en: "The Yamaha XMAX Tech Max takes the 250cc Blue Core platform and adds the full technology package — a 4.2-inch colour TFT display, an electronically adjustable windscreen with 95mm of travel, traction control, and Y-Connect smartphone integration with Garmin-powered navigation. It's the most capable scooter in our fleet for genuine touring: strong midrange torque for the climb to Kintamani, real wind protection at highway speed, and enough underseat storage and comfort for a full day in the saddle.",
      id: "Yamaha XMAX Tech Max mengambil platform Blue Core 250cc dan menambahkan paket teknologi lengkap — layar TFT warna 4,2 inci, kaca depan elektrik dengan jangkauan 95mm, traction control, dan integrasi Y-Connect dengan navigasi Garmin. Ini adalah skuter paling mumpuni di armada kami untuk touring sesungguhnya, dengan torsi menengah yang kuat untuk tanjakan ke Kintamani.",
      ru: "Yamaha XMAX Tech Max берёт платформу Blue Core 250 см³ и добавляет полный технологический пакет — цветной TFT-дисплей 4,2 дюйма, электрически регулируемое лобовое стекло с ходом 95 мм, контроль тяги и интеграцию Y-Connect с навигацией Garmin. Это самый способный скутер нашего парка для настоящих путешествий, с сильным средним крутящим моментом для подъёма к Кинтамани.",
      fr: "Le Yamaha XMAX Tech Max reprend la plateforme Blue Core 250 cm³ et y ajoute le pack technologique complet — un écran TFT couleur de 4,2 pouces, un pare-brise à réglage électrique avec 95 mm de course, un contrôle de traction et l'intégration Y-Connect avec navigation Garmin. C'est le scooter le plus abouti de notre flotte pour du véritable tourisme, avec un couple médian solide pour la montée vers Kintamani.",
    },
  },
  {
    name: "Yamaha Lexi LX 155",
    brand: "Yamaha",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 155,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 9,
    isFeatured: false,
    images: [{ file: "yamaha-lexi-lx-155cc-2025-blue-black.jpg", alt: "Yamaha Lexi LX 155 automatic scooter in blue and black, available for rent in Bali" }],
    description: {
      en: "The Yamaha Lexi LX 155 brings retro step-through styling to Yamaha's proven 155cc VVA engine, putting out around 15 hp with the same smooth, efficient character as the NMAX line in a lighter, more compact body. Front disc brakes with ABS, a digital instrument panel, and a low, accessible seat height make it an easy, comfortable choice for riders who want NMAX-level performance with a lighter, more upright riding position around Sanur or Ubud.",
      id: "Yamaha Lexi LX 155 menghadirkan gaya retro step-through dengan mesin VVA 155cc andalan Yamaha, menghasilkan sekitar 15 hp dengan karakter halus dan efisien seperti lini NMAX namun dalam bodi yang lebih ringan dan ringkas. Rem cakram depan dengan ABS, panel instrumen digital, dan tinggi jok yang rendah menjadikannya pilihan nyaman di sekitar Sanur atau Ubud.",
      ru: "Yamaha Lexi LX 155 привносит ретро-дизайн с низкой посадкой в проверенный 155-кубовый двигатель VVA Yamaha, выдающий около 15 л.с. с тем же плавным и экономичным характером, что и линейка NMAX, но в более лёгком и компактном корпусе. Передние дисковые тормоза с ABS, цифровая панель приборов и низкая, доступная посадка делают его удобным выбором в районе Санура или Убуда.",
      fr: "Le Yamaha Lexi LX 155 apporte un style rétro à selle basse au moteur VVA 155 cm³ éprouvé de Yamaha, développant environ 15 ch avec le même caractère souple et efficace que la gamme NMAX, dans une carrosserie plus légère et plus compacte. Freins à disque avant avec ABS, tableau de bord numérique et selle basse et accessible en font un choix confortable autour de Sanur ou d'Ubud.",
    },
  },
  {
    name: "Harley-Davidson Sportster Forty-Eight",
    brand: "Harley-Davidson",
    category: "MANUAL",
    transmission: "MANUAL",
    engineCc: 1200,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 45,
    isFeatured: true,
    images: [{ file: "harley-davidson-sportster-forty-eight-1200cc-black.jpg", alt: "Harley-Davidson Sportster Forty-Eight 1200cc cruiser motorcycle in black, available for premium rental in Bali" }],
    description: {
      en: "The Harley-Davidson Sportster Forty-Eight brings genuine big-bike presence to Bali — a 1200cc air-cooled Evolution V-twin producing around 66 hp and a thumping 96 Nm of torque through a five-speed gearbox and belt final drive. The wide front tire and low-slung, blacked-out styling give it unmistakable road presence on the strip through Seminyak or Canggu. This is a premium rental for experienced riders holding a full motorcycle licence — not a first bike, but an unforgettable one for a day or two on the island.",
      id: "Harley-Davidson Sportster Forty-Eight menghadirkan kehadiran motor besar sesungguhnya di Bali — mesin V-twin Evolution air-cooled 1200cc bertenaga sekitar 66 hp dan torsi 96 Nm melalui girboks lima percepatan dan penggerak sabuk. Ban depan lebar dan gaya serba hitam memberi kesan jalan yang tak terlupakan. Sewa premium ini untuk pengendara berpengalaman dengan SIM motor penuh.",
      ru: "Harley-Davidson Sportster Forty-Eight приносит на Бали настоящее присутствие большого байка — воздушный V-твин Evolution объёмом 1200 см³ мощностью около 66 л.с. и крутящим моментом 96 Нм через пятиступенчатую коробку и ремённый привод. Широкая передняя шина и чёрный стиль дают незабываемое впечатление на дороге. Это премиальная аренда для опытных райдеров с полными правами на мотоцикл.",
      fr: "Le Harley-Davidson Sportster Forty-Eight apporte une véritable présence de grosse cylindrée à Bali — un V-twin Evolution refroidi par air de 1200 cm³ développant environ 66 ch et un couple de 96 Nm via une boîte à cinq vitesses et une transmission par courroie. Le pneu avant large et le style tout noir lui donnent une présence inoubliable sur la route. Une location premium pour conducteurs expérimentés titulaires du permis moto complet.",
    },
  },
  {
    name: "Honda PCX 160",
    brand: "Honda",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 160,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 13,
    isFeatured: true,
    images: [{ file: "honda-pcx-2025-black.jpg", alt: "Honda PCX 160 premium automatic scooter in black, available for rent in Bali" }],
    description: {
      en: "The Honda PCX 160 is Honda's premium scooter, built around a 156.9cc liquid-cooled eSP+ engine producing close to 16 hp — enough for confident overtaking on the Sunset Road bypass or the ring road around the airport. A 14-inch front wheel, bigger than most scooters in its class, adds real stability at highway speed, while Honda's Smart Key keyless ignition, a USB Type-C charging port, and roughly 30 litres of underseat storage make it a genuinely comfortable choice for longer days exploring the island.",
      id: "Honda PCX 160 adalah skuter premium Honda, dibangun dengan mesin eSP+ 156,9cc berpendingin cairan yang menghasilkan hampir 16 hp — cukup untuk menyalip percaya diri di jalan lingkar Sunset Road atau sekitar bandara. Roda depan 14 inci, lebih besar dari kebanyakan skuter sekelasnya, menambah stabilitas nyata di kecepatan jalan raya, sementara Smart Key tanpa kunci, port pengisian USB Type-C, dan bagasi bawah jok sekitar 30 liter menjadikannya pilihan yang nyaman untuk hari-hari panjang menjelajahi pulau.",
      ru: "Honda PCX 160 — премиальный скутер Honda на 156,9-кубовом двигателе eSP+ с жидкостным охлаждением, выдающем почти 16 л.с. — этого достаточно для уверенных обгонов на объездной Sunset Road или кольцевой дороге у аэропорта. Переднее колесо диаметром 14 дюймов, крупнее, чем у большинства скутеров этого класса, добавляет устойчивости на скорости шоссе, а бесключевое зажигание Smart Key, порт USB Type-C и багажник под сиденьем примерно на 30 литров делают его по-настоящему удобным выбором для долгих дней исследования острова.",
      fr: "Le Honda PCX 160 est le scooter premium de Honda, construit autour d'un moteur eSP+ de 156,9 cm³ refroidi par liquide développant près de 16 ch — suffisant pour des dépassements assurés sur la rocade de Sunset Road ou le périphérique de l'aéroport. Une roue avant de 14 pouces, plus grande que la plupart des scooters de sa catégorie, ajoute une vraie stabilité à vitesse d'autoroute, tandis que l'allumage sans clé Smart Key de Honda, un port de charge USB-C et environ 30 litres de rangement sous la selle en font un choix vraiment confortable pour de longues journées à explorer l'île.",
    },
  },
  {
    name: "Honda PCX 160 Surf Edition",
    brand: "Honda",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 160,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 14,
    isFeatured: false,
    images: [{ file: "honda-pcx-2025-black-with-surf-rack.jpg", alt: "Honda PCX 160 in black fitted with a rear surf rack, available for rent in Bali" }],
    description: {
      en: "Built on the same 156.9cc PCX platform as our standard model, the Surf Edition adds a factory-style rear rack designed to carry a shortboard or longboard securely on the ride to Canggu, Uluwatu, or Balangan. You still get Honda's Smart Key ignition, USB-C charging, and roughly 30 litres of underseat storage — this is the PCX for riders who want one bike to handle both the daily commute and the morning surf check.",
      id: "Dibangun di atas platform PCX 156,9cc yang sama dengan model standar, Surf Edition menambahkan rak belakang bergaya pabrikan yang dirancang untuk membawa papan selancar dengan aman dalam perjalanan ke Canggu, Uluwatu, atau Balangan. Anda tetap mendapatkan Smart Key Honda, pengisian USB-C, dan bagasi bawah jok sekitar 30 liter — ini adalah PCX untuk pengendara yang ingin satu motor menangani baik perjalanan harian maupun sesi selancar pagi.",
      ru: "Построенный на той же 156,9-кубовой платформе PCX, что и стандартная модель, Surf Edition получает заводского вида задний багажник для надёжной перевозки серф-борда по пути в Чангу, Улувату или Баланган. Вы по-прежнему получаете бесключевое зажигание Smart Key от Honda, зарядку USB-C и багажник под сиденьем примерно на 30 литров — это PCX для тех, кто хочет один байк и для повседневных поездок, и для утреннего сёрфинга.",
      fr: "Construit sur la même plateforme PCX de 156,9 cm³ que notre modèle standard, la Surf Edition ajoute un porte-planche arrière de style constructeur conçu pour transporter un shortboard ou un longboard en toute sécurité vers Canggu, Uluwatu ou Balangan. Vous conservez l'allumage sans clé Smart Key de Honda, la charge USB-C et environ 30 litres de rangement sous la selle — c'est le PCX pour ceux qui veulent un seul scooter pour le trajet quotidien et la session de surf du matin.",
    },
  },
  {
    name: "Yamaha XMAX 250 Matte Green Edition",
    brand: "Yamaha",
    category: "ADVENTURE",
    transmission: "AUTOMATIC",
    engineCc: 250,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 19,
    isFeatured: false,
    images: [{ file: "yamaha-xmax-2026-matte-dark-green-gold-wheels.jpg", alt: "Yamaha XMAX 250 adventure scooter in matte dark green with gold wheels, available for rent in Bali" }],
    description: {
      en: "The same capable 250cc Blue Core engine with Variable Valve Actuation found across our XMAX lineup — around 22.5 hp, traction control, and ABS on both wheels — finished in a matte dark green paint with gold-accented wheels for riders who want the XMAX's touring comfort with a look that stands out from the standard black. Full LED lighting and the spacious underseat storage carry over, making this as practical for the climb to Kintamani as it is distinctive parked outside your villa.",
      id: "Mesin Blue Core 250cc dengan VVA yang sama mumpuninya seperti di seluruh lini XMAX kami — sekitar 22,5 hp, traction control, dan ABS di kedua roda — dengan cat hijau matte dan aksen roda emas untuk pengendara yang menginginkan kenyamanan touring XMAX dengan tampilan yang berbeda dari warna hitam standar. Lampu LED penuh dan bagasi bawah jok yang luas tetap dipertahankan, menjadikannya praktis untuk tanjakan ke Kintamani sekaligus mencolok saat terparkir di depan vila Anda.",
      ru: "Тот же мощный 250-кубовый двигатель Blue Core с системой VVA, что и во всей линейке XMAX — около 22,5 л.с., контроль тяги и ABS на обоих колёсах — в матовой тёмно-зелёной окраске с золотистыми акцентами на колёсах для тех, кто хочет туристический комфорт XMAX с внешним видом, отличным от стандартного чёрного. Полностью светодиодная оптика и просторный багажник под сиденьем сохранены, что делает его таким же практичным для подъёма к Кинтамани, как и эффектным на парковке у вашей виллы.",
      fr: "Le même moteur Blue Core 250 cm³ à VVA que l'on retrouve dans toute notre gamme XMAX — environ 22,5 ch, contrôle de traction et ABS sur les deux roues — dans une peinture vert mat foncé avec des jantes aux accents dorés, pour les conducteurs qui veulent le confort de tourisme du XMAX avec une allure qui se démarque du noir standard. L'éclairage tout LED et le vaste rangement sous la selle sont conservés, ce qui le rend aussi pratique pour la montée vers Kintamani que remarquable garé devant votre villa.",
    },
  },
  {
    name: "Yamaha NMAX 155 Surf Edition",
    brand: "Yamaha",
    category: "SCOOTER_AUTOMATIC",
    transmission: "AUTOMATIC",
    engineCc: 155,
    seats: 2,
    helmetsIncluded: 2,
    pricePerDay: 10,
    isFeatured: false,
    images: [{ file: "yamaha-nmax-2026-black-with-surf-rack.jpg", alt: "Yamaha NMAX 155 in black fitted with a rear surf rack, available for rent in Bali" }],
    description: {
      en: "The same 155cc Blue Core VVA engine and ABS-linked disc brakes as our standard NMAX, fitted with a rear surf rack for riders heading to the breaks at Canggu, Uluwatu, or Balangan. Underseat storage still swallows a full-face helmet, and the roomy seat keeps it comfortable for the ride back with a board strapped on. A practical pick if you want one bike to cover both daily errands and a surf session.",
      id: "Mesin Blue Core 155cc VVA dan rem cakram ABS yang sama seperti NMAX standar, dilengkapi rak belakang untuk pengendara yang menuju spot selancar di Canggu, Uluwatu, atau Balangan. Bagasi bawah jok tetap muat untuk helm full-face, dan joknya yang luas membuatnya nyaman untuk perjalanan pulang dengan papan terikat. Pilihan praktis jika Anda ingin satu motor untuk urusan harian sekaligus sesi selancar.",
      ru: "Тот же 155-кубовый двигатель Blue Core VVA и дисковые тормоза с ABS, что и в стандартном NMAX, с задним багажником для тех, кто едет на споты в Чангу, Улувату или Баланган. Багажник под сиденьем по-прежнему вмещает полнолицевой шлем, а просторное сиденье делает поездку обратно с закреплённой доской комфортной. Практичный выбор, если нужен один байк и для повседневных дел, и для сёрф-сессии.",
      fr: "Le même moteur Blue Core 155 cm³ à VVA et les mêmes freins à disque ABS que notre NMAX standard, équipé d'un porte-planche arrière pour les conducteurs qui rejoignent les spots de Canggu, Uluwatu ou Balangan. Le rangement sous la selle accueille toujours un casque intégral, et la selle spacieuse garde le trajet retour confortable avec une planche attachée. Un choix pratique pour un seul scooter qui couvre à la fois les courses quotidiennes et une session de surf.",
    },
  },
];

type LocationSeed = {
  slug: string;
  name: string;
  isAirport: boolean;
  description: L4;
  deliveryNote: L4;
};

const LOCATIONS: LocationSeed[] = [
  {
    slug: "canggu",
    name: "Canggu",
    isAirport: false,
    description: {
      en: "Canggu is Bali's laid-back surf-and-café hub on the west coast — flat roads and short hops make it easy scooter territory. Scooter rental in Canggu is the fastest way to reach Echo Beach, Berawa, Batu Bolong, and the sunset temple at Tanah Lot, all within a 20-minute ride. Most riders here start with an automatic scooter for the flat coastal roads, then move up to an adventure model for day trips further inland.",
      id: "Canggu adalah pusat surfing dan kafe santai Bali di pantai barat — jalan datar dan jarak pendek membuatnya mudah dijelajahi dengan skuter. Sewa motor di Canggu adalah cara tercepat untuk mencapai Pantai Echo, Berawa, Batu Bolong, dan Pura Tanah Lot saat matahari terbenam, semuanya dalam jarak 20 menit berkendara.",
      ru: "Чангу — непринуждённый сёрф- и кафе-центр Бали на западном побережье: ровные дороги и короткие расстояния делают его удобным для скутера. Аренда скутера в Чангу — самый быстрый способ добраться до пляжей Эко, Бераваи Бату Болонг, а также до храма Танах Лот на закате — всё в 20 минутах езды.",
      fr: "Canggu est le repaire décontracté de surf et de cafés de Bali sur la côte ouest — routes plates et trajets courts en font un terrain de scooter facile. La location de scooter à Canggu est le moyen le plus rapide de rejoindre Echo Beach, Berawa, Batu Bolong et le temple de Tanah Lot au coucher du soleil, tous à moins de 20 minutes.",
    },
    deliveryNote: {
      en: "Free delivery to any hotel or villa in Canggu, Berawa, and Pererenan.",
      id: "Antar gratis ke hotel atau vila mana pun di Canggu, Berawa, dan Pererenan.",
      ru: "Бесплатная доставка в любой отель или виллу в Чангу, Бераве и Переренане.",
      fr: "Livraison gratuite vers tout hôtel ou villa à Canggu, Berawa et Pererenan.",
    },
  },
  {
    slug: "seminyak",
    name: "Seminyak",
    isAirport: false,
    description: {
      en: "Seminyak is Bali's established beach resort area, a short ride from the airport with easy access to Kuta and Legian. Motorbike rental in Seminyak makes it easy to hop between beach clubs, Double Six Beach, and the boutique shops on Jalan Kayu Aya without relying on pricey taxis. It's also the natural base for a scooter rental near the airport, since most Seminyak hotels are a 15-20 minute ride from Ngurah Rai.",
      id: "Seminyak adalah kawasan resor pantai Bali yang mapan, dekat dengan bandara dan mudah dijangkau ke Kuta dan Legian. Sewa motor di Seminyak memudahkan Anda berpindah antar beach club, Pantai Double Six, dan toko-toko butik di Jalan Kayu Aya tanpa bergantung pada taksi yang mahal.",
      ru: "Семиньяк — устоявшийся пляжный курортный район Бали, недалеко от аэропорта, с лёгким доступом к Куте и Легиану. Аренда мотоцикла в Семиньяке позволяет легко добраться до пляжных клубов, пляжа Дабл-Сикс и бутиков на улице Джалан-Кайю-Айя, не полагаясь на дорогие такси.",
      fr: "Seminyak est la station balnéaire la plus établie de Bali, à quelques minutes de l'aéroport avec un accès facile à Kuta et Legian. Louer une moto à Seminyak permet de passer facilement d'un beach club à l'autre, de rejoindre Double Six Beach et les boutiques de Jalan Kayu Aya sans dépendre de taxis coûteux.",
    },
    deliveryNote: {
      en: "Free delivery to any hotel or villa in Seminyak, Kuta, and Legian.",
      id: "Antar gratis ke hotel atau vila mana pun di Seminyak, Kuta, dan Legian.",
      ru: "Бесплатная доставка в любой отель или виллу в Семиньяке, Куте и Легиане.",
      fr: "Livraison gratuite vers tout hôtel ou villa à Seminyak, Kuta et Legian.",
    },
  },
  {
    slug: "uluwatu",
    name: "Uluwatu",
    isAirport: false,
    description: {
      en: "Uluwatu sits on Bali's southern peninsula, famous for its clifftop temples and surf breaks — winding roads reward a confident rider. A scooter rental in Uluwatu is the only practical way to string together Padang Padang, Bingin, and Balangan beaches in a single day, then catch the sunset Kecak dance at Uluwatu Temple. For the cliffside roads here, an automatic scooter with ABS or a small adventure bike is the better choice over a basic moped.",
      id: "Uluwatu terletak di semenanjung selatan Bali, terkenal dengan pura di atas tebing dan ombak surfing kelas dunia — jalan berkelok memberi tantangan bagi pengendara berpengalaman. Sewa skuter di Uluwatu adalah cara paling praktis untuk mengunjungi Pantai Padang Padang, Bingin, dan Balangan dalam satu hari, lalu menyaksikan tari Kecak saat matahari terbenam di Pura Uluwatu.",
      ru: "Улувату расположен на южном полуострове Бали, известен своими храмами на скалах и мировыми сёрф-споттами — извилистые дороги подойдут уверенному водителю. Аренда скутера в Улувату — самый практичный способ объехать пляжи Паданг-Паданг, Бингин и Баланган за один день, а затем увидеть закатный танец кечак у храма Улувату.",
      fr: "Uluwatu se trouve sur la péninsule sud de Bali, célèbre pour ses temples perchés sur les falaises et ses spots de surf — des routes sinueuses qui récompensent les conducteurs confiants. Louer un scooter à Uluwatu est le moyen le plus pratique d'enchaîner les plages de Padang Padang, Bingin et Balangan en une journée, avant d'assister à la danse Kecak au coucher du soleil au temple d'Uluwatu.",
    },
    deliveryNote: {
      en: "Free delivery to any hotel or villa in Uluwatu, Bingin, and Padang Padang.",
      id: "Antar gratis ke hotel atau vila mana pun di Uluwatu, Bingin, dan Padang Padang.",
      ru: "Бесплатная доставка в любой отель или виллу в Улувату, Бингине и Паданг-Паданге.",
      fr: "Livraison gratuite vers tout hôtel ou villa à Uluwatu, Bingin et Padang Padang.",
    },
  },
  {
    slug: "ubud",
    name: "Ubud",
    isAirport: false,
    description: {
      en: "Ubud is Bali's cultural heart, set among rice terraces and jungle in the cooler interior — a scooter is the best way to reach Tegalalang and the surrounding villages. Renting a motorbike in Ubud opens up the Tegalalang rice terraces, the Campuhan Ridge Walk, the Sacred Monkey Forest, and dozens of waterfalls that a car simply can't reach down the narrow village roads. Cooler mountain air here also means a manual bike or adventure scooter handles the hillier routes more comfortably than a small automatic.",
      id: "Ubud adalah jantung budaya Bali, dikelilingi sawah dan hutan di dataran tinggi yang sejuk — skuter adalah cara terbaik untuk mencapai Tegalalang dan desa-desa sekitarnya. Menyewa motor di Ubud membuka akses ke terasering sawah Tegalalang, Campuhan Ridge Walk, Hutan Monyet Suci, dan puluhan air terjun yang sulit dijangkau mobil di jalan desa yang sempit.",
      ru: "Убуд — культурное сердце Бали среди рисовых террас и джунглей в прохладной внутренней части острова: скутер — лучший способ добраться до Тегаллаланга и окрестных деревень. Аренда мотобайка в Убуде открывает доступ к рисовым террасам Тегаллаланг, тропе Чампухан-Ридж, Лесу Обезьян и десяткам водопадов, куда автомобиль просто не проедет по узким деревенским дорогам.",
      fr: "Ubud est le cœur culturel de Bali, entouré de rizières et de jungle dans l'intérieur plus frais de l'île — un scooter est le meilleur moyen d'atteindre Tegalalang et les villages environnants. Louer une moto à Ubud donne accès aux rizières en terrasses de Tegalalang, à la Campuhan Ridge Walk, à la forêt des singes sacrés et à des dizaines de cascades qu'une voiture ne peut simplement pas atteindre sur les routes étroites des villages.",
    },
    deliveryNote: {
      en: "Free delivery to any hotel or villa in central Ubud and Campuhan.",
      id: "Antar gratis ke hotel atau vila mana pun di pusat Ubud dan Campuhan.",
      ru: "Бесплатная доставка в любой отель или виллу в центре Убуда и Кампухане.",
      fr: "Livraison gratuite vers tout hôtel ou villa dans le centre d'Ubud et à Campuhan.",
    },
  },
  {
    slug: "sanur",
    name: "Sanur",
    isAirport: false,
    description: {
      en: "Sanur is a quiet, family-friendly beach town on the east coast, with calm water and flat, easy roads. A scooter rental in Sanur is ideal for families and first-time riders, and it's the closest mainland town to the fast boat harbour for day trips to Nusa Penida and Nusa Lembongan — park at the harbour and pick up right where you left off.",
      id: "Sanur adalah kota pantai yang tenang dan ramah keluarga di pantai timur, dengan air yang tenang dan jalan yang datar dan mudah. Sewa skuter di Sanur ideal untuk keluarga dan pengendara pemula, dan merupakan kota terdekat dengan pelabuhan speedboat untuk perjalanan sehari ke Nusa Penida dan Nusa Lembongan.",
      ru: "Санур — тихий, семейный пляжный городок на восточном побережье со спокойной водой и ровными, лёгкими дорогами. Аренда скутера в Сануре идеальна для семей и начинающих райдеров, а также это ближайший город к причалу быстрых лодок для поездок на Нуса Пенида и Нуса Лембонган.",
      fr: "Sanur est une ville balnéaire calme et familiale sur la côte est, avec une eau calme et des routes plates et faciles. Louer un scooter à Sanur est idéal pour les familles et les débutants, et c'est la ville la plus proche du port des bateaux rapides pour des excursions d'une journée à Nusa Penida et Nusa Lembongan.",
    },
    deliveryNote: {
      en: "Free delivery to any hotel or villa in Sanur.",
      id: "Antar gratis ke hotel atau vila mana pun di Sanur.",
      ru: "Бесплатная доставка в любой отель или виллу в Сануре.",
      fr: "Livraison gratuite vers tout hôtel ou villa à Sanur.",
    },
  },
  {
    slug: "denpasar-airport",
    name: "Ngurah Rai Airport",
    isAirport: true,
    description: {
      en: "Ngurah Rai Airport delivery and collection — flight-detail pickup with a driver meeting you at the terminal. Booking a scooter rental at Bali airport straight off your arrival flight skips the queue for overpriced airport taxis entirely — ride straight to your hotel in Seminyak, Kuta, or Jimbaran the moment you land.",
      id: "Pengantaran dan penjemputan Bandara Ngurah Rai — jemput sesuai detail penerbangan dengan pengemudi menunggu Anda di terminal. Memesan sewa skuter di bandara Bali langsung setelah mendarat membuat Anda tidak perlu antre taksi bandara yang mahal.",
      ru: "Доставка и получение в аэропорту Нгурах Рай — встреча по данным рейса с водителем у терминала. Заказ аренды скутера в аэропорту Бали сразу по прилёте позволяет полностью пропустить очередь за дорогим аэропортовым такси.",
      fr: "Livraison et récupération à l'aéroport de Ngurah Rai — prise en charge selon les détails du vol, avec un chauffeur qui vous accueille au terminal. Réserver une location de scooter à l'aéroport de Bali dès votre arrivée vous évite complètement la file d'attente des taxis d'aéroport hors de prix.",
    },
    deliveryNote: {
      en: "Send your flight details after booking — a small service fee applies and covers airport parking.",
      id: "Kirimkan detail penerbangan Anda setelah pemesanan — biaya layanan kecil berlaku dan mencakup parkir bandara.",
      ru: "Отправьте данные рейса после бронирования — взимается небольшая сервисная плата, включающая парковку в аэропорту.",
      fr: "Envoyez vos détails de vol après la réservation — de petits frais de service s'appliquent et couvrent le stationnement à l'aéroport.",
    },
  },
];

const REVIEWS: { customerName: string; rating: number; comment: string }[] = [
  { customerName: "Emma R.", rating: 5, comment: "Bike was delivered to our villa in Canggu within the hour, full tank, clean helmets. Zero deposit made it so easy compared to the shops on the street." },
  { customerName: "Marco T.", rating: 5, comment: "Rented the ADV 160 for two weeks to get around the south of the island. Well maintained, no issues at all, and the WhatsApp support was fast whenever I had a question." },
  { customerName: "Anastasia K.", rating: 4, comment: "Great experience overall — smooth booking, bike arrived on time at the airport with a driver holding a sign. Would rent again on my next trip." },
  { customerName: "Julien B.", rating: 5, comment: "The NMAX was perfect for two of us getting around Ubud and up to Tegalalang. Return was just as easy — dropped it at our next hotel in Seminyak." },
  { customerName: "Sophie L.", rating: 5, comment: "First time riding in Bali and the Scoopy was an easy, comfortable way to start. Delivery driver even gave us a few tips on routes to avoid traffic." },
  { customerName: "David N.", rating: 4, comment: "Solid manual bike, well serviced. Only wish I'd booked a full month for the discount — will do that next time." },
  { customerName: "Klaus B.", rating: 5, comment: "Rented the Harley for a weekend down to Uluwatu — incredible bike, spotless, and the whole booking process took five minutes on WhatsApp." },
  { customerName: "Chloé D.", rating: 5, comment: "Took the XMAX Tech Max on a three-day loop around the island. The windscreen and storage made it genuinely comfortable for long days in the saddle." },
];

type ArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  daysAgo: number;
  coverImage: string;
};

const ARTICLES: ArticleSeed[] = [
  {
    slug: "international-driving-permit-bali-scooter-rules",
    title: "International Driving Permit Rules for Riding a Scooter in Bali",
    category: "Regulations",
    daysAgo: 3,
    coverImage: "international-driving-permit-bali-scooter-rules.jpg",
    excerpt:
      "Indonesian law requires more than just your home licence to ride legally in Bali. Here's what an IDP actually needs to cover, and why a PDF on your phone isn't always enough.",
    body: `To ride a scooter or motorbike in Bali, you need both a valid licence from your home country and a matching International Driving Permit (IDP) that specifically covers motorcycles — usually listed as Category A. A car-only IDP does not cover a motorbike, and vice versa, so it's worth double-checking the categories printed on your permit before you fly.

The IDP has to be arranged before you leave your home country — it cannot be issued locally in Indonesia. Most countries issue them through their national motoring association, and the process is usually quick, but it can't be done at the last minute from Bali itself.

A digital copy (a photo or PDF on your phone) is useful as a backup, but police at checkpoints and insurance providers will often still ask to see the physical document. Carry both if you can, along with your original home-country licence — the IDP is only valid alongside it, not as a standalone replacement.

Enforcement has become noticeably stricter in recent years, with dedicated traffic task forces focusing on foreign riders' documentation. Fines for missing or incorrect paperwork typically run from a few hundred thousand up to around one million rupiah per offence, and travel insurers can refuse to pay out on a claim if you were riding without the correct licence category at the time. It's a small amount of admin before your trip that avoids a genuinely expensive problem if something goes wrong.`,
  },
  {
    slug: "bali-traffic-checkpoint-what-to-expect",
    title: "What Happens If You're Stopped at a Bali Traffic Checkpoint",
    category: "Regulations",
    daysAgo: 9,
    coverImage: "bali-traffic-checkpoint-what-to-expect.jpg",
    excerpt:
      "Checkpoints are a normal part of riding in Bali, especially on the main roads between tourist areas. Here's what officers typically check, and how to handle a stop calmly.",
    body: `Traffic checkpoints are a routine part of riding in Bali, particularly on the busier connecting roads between tourist areas. Some locations are fixed and rarely move, while others rotate in and out during periodic safety campaigns. The road between Kuta and Ubud, the Kuta–Tuban bypass, Sunset Road in Seminyak, and the Ubud bypass near Sayan are all known for regular checks, generally concentrated in the late morning.

At a checkpoint, officers will typically ask for your licence and IDP, check that you and any passenger are wearing helmets, and confirm the bike's registration document (STNK) matches the plate. Having everything organised in one place — helmet on before you even see the checkpoint — makes the stop faster for everyone.

If you do receive a ticket, Indonesia uses a two-ticket system. A blue ticket means you're accepting the violation and paying the fine directly at a bank; a pink ticket means you're contesting it and the matter goes to court, which is a much longer process most visitors want to avoid. Officers will explain which one applies.

One point worth remembering: you should never hand over your passport as collateral during a traffic stop. This isn't standard procedure, even if it's sometimes requested. If asked, it's reasonable to politely decline and offer to follow the officer to the station instead. Staying calm, polite, and cooperative resolves the vast majority of stops quickly.`,
  },
  {
    slug: "bali-helmet-passenger-rules",
    title: "Bali Helmet & Passenger Rules Every Rider Should Know",
    category: "Regulations",
    daysAgo: 15,
    coverImage: "bali-helmet-passenger-rules.jpg",
    excerpt:
      "Helmets, passenger limits, and phone use are the most commonly enforced rules for scooter riders in Bali. Here's what the fines look like and how to stay on the right side of them.",
    body: `A handful of rules account for most of the traffic fines issued to scooter riders in Bali, and all of them are easy to avoid once you know them.

Helmets are mandatory for both the rider and any passenger, full stop. Riding without one, or carrying a passenger without one, typically carries a fine of around IDR 250,000 per unhelmeted person. Every KanggiGo Rental booking includes a helmet for each rider — bring it along even for a five-minute trip to the shop.

Only one passenger is permitted on a standard scooter. Three-up riding, common as it looks in photos of local families, is against the law for anyone renting a bike, tourist or otherwise.

Using a mobile phone while riding — even briefly, at a red light — carries one of the steeper fines, around IDR 750,000, and can carry a custodial penalty in more serious cases. If you need to check a map, pull over safely first, or use a phone mount that doesn't require you to hold the device.

Running a red light or ignoring road markings is fined at roughly IDR 500,000. Bali's intersections can be chaotic and rules of right-of-way aren't always obvious to visitors, so when in doubt, slow down and give way rather than push through a gap.

None of these rules are unusual by international standards — they're broadly the same expectations you'd find riding a scooter anywhere else. The main difference in Bali is the volume of checkpoints, which makes consistent habits worth building from day one.`,
  },
  {
    slug: "five-scenic-scooter-rides-in-bali",
    title: "Five Scenic Rides Every Visitor Should Try in Bali",
    category: "Guides",
    daysAgo: 21,
    coverImage: "five-scenic-scooter-rides-in-bali.jpg",
    excerpt:
      "From clifftop temples to volcano viewpoints, these are the routes that make renting a scooter in Bali worth it — plus a few practical tips before you set off.",
    body: `Bali rewards exploring by scooter more than almost anywhere else in Southeast Asia — the island is small enough to cross in a day, and the best views are rarely on the main road.

Canggu to Tanah Lot is the easiest introduction: flat coastal roads, roughly 30–40 minutes each way, ending at one of Bali's most photographed sea temples right as the sun drops behind it. Time your arrival about an hour before sunset to find parking and walk the coastal path first.

Ubud to Tegalalang takes you inland through the rice terraces the island is famous for, with plenty of small warungs and coffee stops along the way. Continue a little further north and the crowds thin out considerably.

The Uluwatu clifftop loop links Padang Padang, Bingin, and Balangan beaches along a stretch of dramatic coastline, finishing at Uluwatu Temple in time for the sunset Kecak dance. Budget a full day — the roads are narrow and worth taking slowly.

Further north, the ride up to Kintamani rewards riders with a direct view of Mount Batur across its caldera lake. The air noticeably cools as the road climbs, so a light jacket is worth packing even on a hot day.

For something quieter, the Sidemen valley in east Bali sees a fraction of the traffic of the south, with rice terrace views that rival Tegalalang and far fewer people. It's a longer ride from the main tourist areas, best suited to an adventure-category bike with a bit more range.

A few practical notes for any of these: fuel up before you leave rather than assuming you'll find a station along quieter routes, download offline maps in case of patchy signal inland, and pack a light rain layer even in the dry season — Bali's weather changes quickly at altitude.`,
  },
  {
    slug: "riding-safely-in-balis-rainy-season",
    title: "Riding Safely in Bali's Rainy Season: What to Know",
    category: "Guides",
    daysAgo: 28,
    coverImage: "riding-safely-in-balis-rainy-season.jpg",
    excerpt:
      "Bali's wet season runs roughly November through March, and it changes how you should ride. A few adjustments make a real difference to safety on slick roads.",
    body: `Bali's rainy season runs roughly from November through March, with the heaviest downpours typically arriving in the afternoon rather than first thing in the morning. It doesn't mean you should avoid riding — most visitors ride through the wet season without incident — but a few adjustments make a real difference.

Roads get noticeably more slippery in the first few minutes of rain, before the water has washed away the built-up oil and diesel residue on the asphalt. If a downpour starts while you're riding, easing off rather than pushing on through the first five minutes is worth the short delay.

Visibility drops fast in heavy rain, both yours and other drivers'. Slow down, increase the distance you leave to the vehicle ahead, and avoid overtaking until conditions clear. Standing water can hide potholes, so give flooded sections of road a wide, cautious berth rather than riding through at speed.

Check your tyre tread before a longer trip — worn tyres lose grip far faster in the wet than on dry roads. It's a quick visual check worth doing on any rental bike before you set off.

Pack a proper poncho rather than relying on an umbrella or waiting it out under an awning indefinitely — Bali downpours can last an hour or more. If you're planning a longer day trip inland or up to the highlands, check the weather forecast that morning and build in a buffer, since mountain roads are where sudden rain has the biggest effect on visibility and grip.

None of this should discourage riding in the wet season — it's simply a matter of building in a bit more caution and a bit less schedule pressure than you might on a clear dry-season day.`,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("kanggigo-admin-2026", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@kanggigo-rental.example" },
    update: {},
    create: {
      email: "admin@kanggigo-rental.example",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  await prisma.adminUser.upsert({
    where: { email: "staff@kanggigo-rental.example" },
    update: {},
    create: {
      email: "staff@kanggigo-rental.example",
      passwordHash,
      name: "Staff",
      role: "STAFF",
    },
  });

  // Reset content tables on every seed run so edits to the arrays above
  // (descriptions, pricing, copy, images) always take effect, instead of
  // being silently skipped by an upsert that's already found a matching row.
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bike.deleteMany();
  await prisma.location.deleteMany();
  await prisma.article.deleteMany();

  const locationsBySlug = new Map<string, string>();
  for (const loc of LOCATIONS) {
    const location = await prisma.location.create({
      data: {
        slug: loc.slug,
        name: loc.name,
        isAirport: loc.isAirport,
        description: loc.description.en,
        deliveryNote: loc.deliveryNote.en,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            name: loc.name,
            description: loc.description[locale],
          })),
        },
      },
    });
    locationsBySlug.set(loc.slug, location.id);
  }

  const bikeIds: string[] = [];
  for (const bike of BIKES) {
    const slug = bike.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const created = await prisma.bike.create({
      data: {
        slug,
        name: bike.name,
        description: bike.description.en,
        brand: bike.brand,
        category: bike.category,
        transmission: bike.transmission,
        engineCc: bike.engineCc,
        seats: bike.seats,
        helmetsIncluded: bike.helmetsIncluded,
        pricePerDay: bike.pricePerDay,
        pricePerWeek: Math.round(bike.pricePerDay * 6 * 100) / 100,
        pricePerMonth: Math.round(bike.pricePerDay * 20 * 100) / 100,
        currency: Currency.USD,
        status: BikeStatus.AVAILABLE,
        isFeatured: bike.isFeatured,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            name: bike.name,
            description: bike.description[locale],
          })),
        },
        images: {
          create: bike.images.map((img, index) => ({
            url: `/uploads/bikes/${img.file}`,
            altText: img.alt,
            sortOrder: index,
            isCoverImage: index === 0,
          })),
        },
      },
    });
    bikeIds.push(created.id);
  }

  for (const [index, review] of REVIEWS.entries()) {
    await prisma.review.create({
      data: {
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        bikeId: bikeIds[index % bikeIds.length],
        isFeatured: true,
      },
    });
  }

  for (const article of ARTICLES) {
    const publishedAt = new Date(Date.now() - article.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.article.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        coverImageUrl: `/uploads/articles/${article.coverImage}`,
        isPublished: true,
        publishedAt,
      },
    });
  }

  console.log(
    `Seeded ${LOCATIONS.length} locations, ${BIKES.length} bikes, ${REVIEWS.length} reviews, ${ARTICLES.length} articles, 2 admin users.`
  );
  console.log(`Admin login: admin@kanggigo-rental.example / kanggigo-admin-2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
