"""
Dataset generation script for ReviewIQ AI.
Generates:
1. data/sample_reviews.csv - 105+ rich synthetic reviews across 5 fictional smartphones
2. data/training_aspect_sentiment.csv - Labeled aspect-sentence dataset for ABSA training and evaluation
"""

import os
import csv

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
os.makedirs(DATA_DIR, exist_ok=True)

# 5 Fictional Smartphone Products
PRODUCTS = [
    {
        "product_id": "prod_nova_x",
        "product_name": "Nova X Pro",
        "category": "Flagship Smartphone",
        "description": "Next-gen flagship with 200MP ultra-sensor, titanium frame, and 144Hz AMOLED display."
    },
    {
        "product_id": "prod_pixelwave_9",
        "product_name": "PixelWave 9",
        "category": "AI Camera Smartphone",
        "description": "AI-first photography powerhouse featuring tensor computing, clean UI, and real-time computational photography."
    },
    {
        "product_id": "prod_galaxysphere_s25",
        "product_name": "GalaxySphere S25",
        "category": "Productivity Smartphone",
        "description": "Ultra-premium productivity flagship with integrated stylus, quad-lens optical zoom, and 6500mAh power system."
    },
    {
        "product_id": "prod_ifruit_17",
        "product_name": "iFruit 17",
        "category": "Premium Smartphone",
        "description": "Sleek aerospace glass design, A19 Bionic neural chip, dynamic island, and unified ecosystem software."
    },
    {
        "product_id": "prod_onemax_ultra",
        "product_name": "OneMax Ultra",
        "category": "Performance Smartphone",
        "description": "Speed-focused gaming flagship with 150W ultra-fast charging, liquid vapor chamber cooling, and stereo acoustic resonance."
    }
]

# Reviews for each product (21 reviews per product = 105 reviews)
# Richly varied: Positive, Negative, Neutral, Mixed, Negation, Multi-aspect
REVIEWS = {
    "prod_nova_x": [
        ("The camera captures unbelievable night photos and the display is gorgeous, but the battery drains fast when gaming.", 4, "mixed"),
        ("Outstanding performance with zero lag in heavy apps. The build quality feels sturdy and premium in hand.", 5, "positive"),
        ("Battery backup is terribly weak. I have to recharge twice before evening, which is disappointing for the price.", 2, "negative"),
        ("The 144Hz AMOLED display is bright outdoors and touch response is lightning quick.", 5, "positive"),
        ("Camera optics are sharp, but audio from the bottom speaker sounds hollow and lacks bass.", 3, "mixed"),
        ("At this price tag of twelve hundred dollars, it feels slightly overpriced compared to competitors.", 3, "neutral"),
        ("Software UI has too much bloatware pre-installed, though the processor handles multitasking easily.", 3, "mixed"),
        ("Fast charging works as advertised, going from zero to eighty percent in twenty-five minutes.", 5, "positive"),
        ("The design looks sleek with the matte finish, but durability is questionable after a light drop left a scratch.", 3, "mixed"),
        ("Wi-Fi and 5G connectivity are solid, maintaining full signal even in basement parking.", 5, "positive"),
        ("Camera shutter speed is instant and portrait shots have natural bokeh, highly recommend for photography.", 5, "positive"),
        ("Disappointed with the thermal performance; the phone gets uncomfortably hot during long video calls.", 2, "negative"),
        ("Build quality is decent with the titanium chassis, but the rear glass gathers fingerprints quickly.", 4, "neutral"),
        ("The display resolution is crisp, yet the auto-brightness sensor reacts sluggishly in low light.", 3, "mixed"),
        ("Microphone and audio call clarity are crystal clear. Bluetooth pairing with my headphones is instant.", 5, "positive"),
        ("Charging speed is phenomenal, though the charging brick is unfortunately not included in the box.", 3, "mixed"),
        ("Operating software is clean and intuitive with smooth animations and regular security patches.", 5, "positive"),
        ("The price is exorbitant for what it delivers. You can get better battery life elsewhere.", 2, "negative"),
        ("Superb durability; accidentally dropped it on hardwood floor and there was not a single dent.", 5, "positive"),
        ("Camera low-light video is somewhat noisy, but daytime pictures are vibrant and clear.", 4, "mixed"),
        ("Overall balanced device. Performance is smooth for everyday social media and browsing.", 4, "positive")
    ],
    "prod_pixelwave_9": [
        ("The computational camera is hands down the best on the market, capturing skin tones with immaculate accuracy.", 5, "positive"),
        ("Clean software interface with zero bloatware and prompt Android updates is a breath of fresh air.", 5, "positive"),
        ("Battery life is mediocre at best; barely reaches four hours of screen-on time on cellular data.", 2, "negative"),
        ("The design is unique with the camera visor, and the ergonomic curved edges feel comfortable.", 4, "positive"),
        ("Fingerprint scanner under the display is frustratingly slow and often fails to recognize my thumb.", 2, "negative"),
        ("Great audio quality with rich stereo separation when watching movies without headphones.", 5, "positive"),
        ("The price point is competitive and offers tremendous value for flagship-level photography.", 5, "positive"),
        ("Charging is painfully slow capped at twenty-seven watts, taking nearly ninety minutes for a full charge.", 2, "negative"),
        ("Connectivity issues occur frequently; mobile data drops randomly when switching cell towers.", 2, "negative"),
        ("Display colors are vibrant and accurate, though maximum peak brightness struggles under direct noon sunlight.", 3, "mixed"),
        ("Build quality feels solid, but the glossy visor bar is prone to micro-scratches over time.", 3, "mixed"),
        ("The AI software features like live translation and photo unblur actually work like magic.", 5, "positive"),
        ("Gaming performance is not bad, but it does thermal throttle after thirty minutes in Genshin Impact.", 3, "mixed"),
        ("Battery is not terrible for light users, but heavy power users will definitely need a power bank.", 3, "neutral"),
        ("Price to performance ratio is well balanced compared to rival flagships.", 4, "positive"),
        ("Speaker volume is adequately loud for podcasts and calls, though lacks deep low-end frequencies.", 3, "neutral"),
        ("Durability passed the test; survived a rainy bike commute with no water ingress whatsoever.", 5, "positive"),
        ("Camera zoom beyond 10x loses sharpness rapidly, but standard 1x and 5x optical shots look spectacular.", 4, "mixed"),
        ("Software user interface is smooth, yet a few system app stutter bugs appeared after the latest patch.", 3, "mixed"),
        ("Charges slowly, but battery standby overnight drain is barely two percent.", 4, "mixed"),
        ("Outstanding camera and display combo, making editing photos on the go an absolute delight.", 5, "positive")
    ],
    "prod_galaxysphere_s25": [
        ("The 6500mAh battery is an absolute beast lasting two full days of heavy productivity work.", 5, "positive"),
        ("Dynamic AMOLED display with anti-reflective coating is the finest screen ever put on a smartphone.", 5, "positive"),
        ("Camera 100x space zoom is impressive for concerts, while 200MP detail allows deep cropping.", 5, "positive"),
        ("The phone is very heavy and bulky in the pocket, making one-handed operation difficult.", 3, "negative"),
        ("Price tag is astronomical; over fourteen hundred dollars is hard to justify for most buyers.", 2, "negative"),
        ("Multitasking performance with the S-Pen and split-screen mode is unmatched by any other handset.", 5, "positive"),
        ("Charging tops out at 45W which feels modest for such a massive battery cell.", 3, "mixed"),
        ("Stereo speakers tuned by Dolby Atmos deliver punchy sound and clear dialogue for movies.", 5, "positive"),
        ("Software UI has too many duplicate services and Samsung account prompts out of the box.", 3, "mixed"),
        ("Armor aluminum build and Gorilla Armor glass offer unmatched drop and scratch durability.", 5, "positive"),
        ("5G reception and Wi-Fi 7 speeds are blazing fast with rock-solid stability.", 5, "positive"),
        ("Camera shutter lag still causes occasional motion blur when taking photos of moving pets.", 3, "negative"),
        ("Display brightness reaches 3000 nits, effortlessly readable under the harshest desert sun.", 5, "positive"),
        ("Design is industrial and boxy; sharp corners can dig into your palm during prolonged use.", 3, "mixed"),
        ("Battery optimization software is intelligent, putting unused background apps to sleep effectively.", 5, "positive"),
        ("Price is steep, but trade-in deals make it acceptable for power users seeking longevity.", 4, "neutral"),
        ("Audio output via USB-C DAC is pristine with high-resolution lossless audio support.", 5, "positive"),
        ("Performance never throttles even during 8K video rendering and continuous benchmark runs.", 5, "positive"),
        ("Durability is top-tier; IP68 rating survived an accidental dip into a swimming pool unharmed.", 5, "positive"),
        ("The camera telephoto is wonderful, but ultra-wide lens exhibits edge distortion in dim lighting.", 3, "mixed"),
        ("Comprehensive flagship that nails battery, screen, and processing speed, despite high price.", 5, "positive")
    ],
    "prod_ifruit_17": [
        ("A19 Bionic chip provides blistering performance, opening apps instantly with zero frame drops.", 5, "positive"),
        ("Camera cinematic 4K video recording and spatial audio are unmatched in the industry.", 5, "positive"),
        ("Battery health holds up well and easily delivers all-day usage on a single charge.", 4, "positive"),
        ("The price is absurdly high and base storage remains stingy for a premium flagship.", 2, "negative"),
        ("iOS software ecosystem is polished and seamless, though file transfer with Windows is frustrating.", 3, "mixed"),
        ("Sleek minimalist design with titanium frame feels extraordinarily luxurious and lightweight.", 5, "positive"),
        ("Display with 120Hz ProMotion is butter smooth and colors are calibrated for photo accuracy.", 5, "positive"),
        ("Charging speed is disappointingly limited to 25W, lagging far behind modern fast-charge standards.", 2, "negative"),
        ("Ceramic shield durability prevented glass shattering when it slipped out of my jacket.", 5, "positive"),
        ("Speakers sound spacious with decent bass response and distortion-free volume at maximum levels.", 5, "positive"),
        ("Wi-Fi and satellite connectivity provide great peace of mind in remote outdoor regions.", 5, "positive"),
        ("Camera struggles with lens flare reflections when recording light sources at night.", 3, "negative"),
        ("Display brightness is excellent, but the dynamic island cutout occasionally obscures widescreen videos.", 3, "mixed"),
        ("Build quality is second to none with precision tolerances and tight seam craftsmanship.", 5, "positive"),
        ("Price to value is questionably low if you only use basic messaging and web browsing.", 2, "negative"),
        ("Software updates are guaranteed for six years, making this an excellent long-term investment.", 5, "positive"),
        ("Performance in gaming is blazing fast, but thermal dissipation could be better as the frame warms up.", 3, "mixed"),
        ("Battery charges safely, but the lack of an included charging adapter is penny-pinching.", 3, "mixed"),
        ("Microphone quality for recording voice memos and podcasts is studio grade.", 5, "positive"),
        ("Design aesthetics are gorgeous, though the camera module protrudes significantly on flat desks.", 4, "neutral"),
        ("Premium device with top-tier video camera and performance, albeit burdened by an exorbitant price.", 4, "positive")
    ],
    "prod_onemax_ultra": [
        ("The 150W ultra-fast charging is unbelievable, replenishing the battery from dead to full in twenty minutes.", 5, "positive"),
        ("Gaming performance is insane with vapor chamber cooling keeping temperatures icy cool during PUBG.", 5, "positive"),
        ("Display refresh rate is super responsive and 2K resolution looks strikingly sharp.", 5, "positive"),
        ("Camera performance in low light is noisy and muddy, lagging far behind Google and Apple.", 2, "negative"),
        ("Aggressive price offers unbeatable hardware specifications per dollar spent.", 5, "positive"),
        ("Battery capacity of 5500mAh easily lasts through an intense day of gaming and streaming.", 5, "positive"),
        ("Software UI contains annoying notifications and bloatware that require tedious debloating.", 2, "negative"),
        ("Dual stereo speakers produce thunderous volume with immersive spatial gaming acoustics.", 5, "positive"),
        ("Build quality uses plastic frame accents that feel slightly cheap compared to glass flagships.", 3, "mixed"),
        ("Design with RGB notification accent on the back gives a modern cyber gaming flair.", 4, "positive"),
        ("Connectivity with dual 5G SIMs and Wi-Fi 7 is rock solid with minimal ping in multiplayer games.", 5, "positive"),
        ("Charging brick is included in the box with a sturdy braided cable, fantastic customer touch.", 5, "positive"),
        ("Camera color science is inconsistent, sometimes over-saturating greens and skies.", 3, "negative"),
        ("Durability is moderate; the screen lacks the latest Gorilla Armor protection against drops.", 3, "neutral"),
        ("Display peak brightness is decent indoors, but slightly washed out in direct glaring sunlight.", 3, "mixed"),
        ("Performance benchmarks set record highs, handling video export with remarkable speed.", 5, "positive"),
        ("Price is very aggressive, offering flagship speed at nearly half the cost of major brands.", 5, "positive"),
        ("Software skin feels unpolished with occasional mistranslations in settings menus.", 2, "negative"),
        ("Audio headphone jack is surprisingly preserved with Hi-Res certification, a rare win.", 5, "positive"),
        ("Battery stamina is solid, but rapid charging causes noticeable warmth during the first ten minutes.", 3, "mixed"),
        ("A gaming and charging beast that cuts corners on camera and software to keep the price accessible.", 4, "mixed")
    ]
}

def generate_sample_reviews_csv():
    filepath = os.path.join(DATA_DIR, "sample_reviews.csv")
    rows = []
    review_counter = 1

    for prod in PRODUCTS:
        pid = prod["product_id"]
        pname = prod["product_name"]
        cat = prod["category"]
        reviews = REVIEWS.get(pid, [])
        for text, rating, sentiment_label in reviews:
            rows.append({
                "review_id": f"rev_{review_counter:03d}",
                "product_id": pid,
                "product_name": pname,
                "category": cat,
                "review_text": text,
                "rating": rating,
                "source_type": "synthetic_demo"
            })
            review_counter += 1

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        fieldnames = ["review_id", "product_id", "product_name", "category", "review_text", "rating", "source_type"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[OK] Generated {len(rows)} sample reviews at {filepath}")
    return filepath

# Labeled aspect-level training & evaluation sentences for ABSA
# Aspect categories: Camera, Battery, Display, Performance, Price, Design, Build quality,
# Audio and speakers, Software and user interface, Connectivity, Charging, Durability
TRAINING_SAMPLES = [
    # Camera
    ("Camera", "The camera captures unbelievable night photos with stunning dynamic range.", "Positive"),
    ("Camera", "Camera optics are sharp, producing crisp and detailed portrait shots.", "Positive"),
    ("Camera", "The computational camera is hands down the best on the market for skin tones.", "Positive"),
    ("Camera", "Low-light photos are muddy, noisy, and completely unusable.", "Negative"),
    ("Camera", "Camera shutter lag still causes frequent motion blur on moving subjects.", "Negative"),
    ("Camera", "Camera zoom beyond 10x loses sharpness rapidly, but 1x shots look great.", "Mixed"),
    ("Camera", "The camera telephoto is wonderful, but ultra-wide lens exhibits distortion.", "Mixed"),
    ("Camera", "The camera has standard 50 megapixel sensor with triple lens setup.", "Neutral"),
    ("Camera", "Camera low-light video is not bad, but daytime shots are definitely better.", "Positive"),
    ("Camera", "The front selfie camera is definitely not good in dim lighting.", "Negative"),

    # Battery
    ("Battery", "The 6500mAh battery is an absolute beast lasting two full days.", "Positive"),
    ("Battery", "Battery backup is exceptional, giving over ten hours of screen time.", "Positive"),
    ("Battery", "Battery health holds up well and easily delivers all-day usage.", "Positive"),
    ("Battery", "Battery backup is terribly weak and drains out before afternoon.", "Negative"),
    ("Battery", "Battery life is mediocre at best, barely reaching four hours.", "Negative"),
    ("Battery", "The battery drains quickly when gaming, but lasts fine on standby.", "Mixed"),
    ("Battery", "Battery is not terrible for light users, but power users will struggle.", "Mixed"),
    ("Battery", "The device houses a typical 5000 milliamp hour lithium ion cell.", "Neutral"),
    ("Battery", "Battery drain is not bad after the recent system update.", "Positive"),
    ("Battery", "The battery is not lasting as long as the marketing promised.", "Negative"),

    # Display
    ("Display", "The 144Hz AMOLED display is bright, fluid, and beautifully calibrated.", "Positive"),
    ("Display", "Dynamic AMOLED display with anti-reflective coating is stunning.", "Positive"),
    ("Display", "Display with 120Hz ProMotion is butter smooth with vivid colors.", "Positive"),
    ("Display", "The screen suffers from awful green tint and noticeable flicker.", "Negative"),
    ("Display", "Maximum peak brightness struggles terribly under direct noon sunlight.", "Negative"),
    ("Display", "Display colors are vibrant, though peak brightness is weak outdoors.", "Mixed"),
    ("Display", "The display resolution is crisp, yet auto-brightness reacts sluggishly.", "Mixed"),
    ("Display", "The handset features a 6.7 inch OLED screen with 120Hz refresh.", "Neutral"),
    ("Display", "Screen clarity is not bad for an entry-tier panel.", "Positive"),
    ("Display", "The display response is not responsive during rapid typing.", "Negative"),

    # Performance
    ("Performance", "Outstanding performance with zero lag or frame drops in heavy apps.", "Positive"),
    ("Performance", "A19 Bionic chip provides blistering performance and speed.", "Positive"),
    ("Performance", "Multitasking performance and split screen rendering are unmatched.", "Positive"),
    ("Performance", "The phone stutters constantly and freezes when opening multiple tabs.", "Negative"),
    ("Performance", "Thermal performance is awful; it gets uncomfortably hot quickly.", "Negative"),
    ("Performance", "Gaming performance is fast, but it does thermal throttle after 30 mins.", "Mixed"),
    ("Performance", "Performance is smooth for light tasks, but chokes on heavy gaming.", "Mixed"),
    ("Performance", "The processor runs at standard factory clock speeds without overclocking.", "Neutral"),
    ("Performance", "Speed is not slow, handling daily apps with ease.", "Positive"),
    ("Performance", "Processor speed is not fast enough to justify this flagship branding.", "Negative"),

    # Price
    ("Price", "Aggressive price offers unbeatable hardware specifications per dollar.", "Positive"),
    ("Price", "The price point is competitive and offers tremendous overall value.", "Positive"),
    ("Price", "Price to performance ratio is well balanced compared to rival flagships.", "Positive"),
    ("Price", "Price tag is astronomical and hard to justify for most buyers.", "Negative"),
    ("Price", "At twelve hundred dollars, it feels egregiously overpriced.", "Negative"),
    ("Price", "Price is steep, but trade-in deals make it acceptable for power users.", "Mixed"),
    ("Price", "The pricing is reasonable on sale, but full retail is a bit much.", "Mixed"),
    ("Price", "Retail pricing is currently set at eight hundred and ninety nine dollars.", "Neutral"),
    ("Price", "The price is not expensive considering the bundled accessories.", "Positive"),
    ("Price", "The retail price is not affordable for average working students.", "Negative"),

    # Design
    ("Design", "Sleek minimalist design with titanium frame feels extraordinarily luxurious.", "Positive"),
    ("Design", "The design is unique with the camera visor and comfortable curved edges.", "Positive"),
    ("Design", "Design with RGB notification accent gives a modern cyber gaming flair.", "Positive"),
    ("Design", "The phone is ugly, awkward to hold, and extremely thick.", "Negative"),
    ("Design", "Industrial boxy design with sharp corners digs painfully into your palm.", "Negative"),
    ("Design", "The design looks sleek, but the glossy back is an absolute fingerprint magnet.", "Mixed"),
    ("Design", "Aesthetics are gorgeous, though the camera module protrudes significantly.", "Mixed"),
    ("Design", "The smartphone adopts standard rounded rectangular chassis proportions.", "Neutral"),
    ("Design", "The ergonomics and outer look are not bad in hand.", "Positive"),
    ("Design", "The overall design is not appealing or ergonomic for small hands.", "Negative"),

    # Build quality
    ("Build quality", "Build quality is second to none with precision tolerances and tight seams.", "Positive"),
    ("Build quality", "Armor aluminum build and Gorilla glass offer unmatched structural rigidity.", "Positive"),
    ("Build quality", "The build quality feels sturdy, solid, and premium in hand.", "Positive"),
    ("Build quality", "Build quality feels cheap with creaky plastic panels and loose buttons.", "Negative"),
    ("Build quality", "The chassis flexes when squeezed and feels flimsy.", "Negative"),
    ("Build quality", "Build quality is decent with titanium frame, but rear glass scratches easily.", "Mixed"),
    ("Build quality", "Solid frame construction, but volume buttons feel slightly wobbly.", "Mixed"),
    ("Build quality", "Constructed using an aluminum alloy midframe and tempered glass back.", "Neutral"),
    ("Build quality", "The chassis materials are not cheap at all.", "Positive"),
    ("Build quality", "The build quality is not durable enough for daily drops.", "Negative"),

    # Audio and speakers
    ("Audio and speakers", "Stereo speakers tuned with Dolby Atmos deliver punchy sound and bass.", "Positive"),
    ("Audio and speakers", "Great audio quality with rich stereo separation when watching movies.", "Positive"),
    ("Audio and speakers", "Microphone and audio call clarity are crystal clear.", "Positive"),
    ("Audio and speakers", "Audio from the bottom speaker sounds hollow, tinny, and lacks bass.", "Negative"),
    ("Audio and speakers", "Speaker volume is too quiet and crackles at high decibels.", "Negative"),
    ("Audio and speakers", "Speaker volume is adequately loud for podcasts, though lacks bass.", "Mixed"),
    ("Audio and speakers", "Audio is clear on calls, but music playback sounds flat.", "Mixed"),
    ("Audio and speakers", "Features dual stereo speaker grills positioned on top and bottom.", "Neutral"),
    ("Audio and speakers", "Acoustic output is not quiet and fills the entire bedroom.", "Positive"),
    ("Audio and speakers", "Speaker quality is not clear and muffles vocal tracks.", "Negative"),

    # Software and user interface
    ("Software and user interface", "Operating software is clean and intuitive with smooth animations.", "Positive"),
    ("Software and user interface", "Clean software interface with zero bloatware and prompt updates.", "Positive"),
    ("Software and user interface", "iOS software ecosystem is polished, fluid, and seamless.", "Positive"),
    ("Software and user interface", "Software UI has unbearable bloatware and intrusive ad notifications.", "Negative"),
    ("Software and user interface", "Software skin feels unpolished with buggy navigation glitches.", "Negative"),
    ("Software and user interface", "Software UI is smooth, yet a few system app stutter bugs appeared.", "Mixed"),
    ("Software and user interface", "Clean stock launcher, but settings menu is confusingly organized.", "Mixed"),
    ("Software and user interface", "Shipped with Android 15 out of the box with stock launcher.", "Neutral"),
    ("Software and user interface", "The operating system is not bloated compared to rivals.", "Positive"),
    ("Software and user interface", "The user interface is not intuitive for first-time smartphone users.", "Negative"),

    # Connectivity
    ("Connectivity", "Wi-Fi and 5G connectivity are solid, maintaining full signal.", "Positive"),
    ("Connectivity", "5G reception and Wi-Fi 7 speeds are blazing fast with rock-solid stability.", "Positive"),
    ("Connectivity", "Dual SIM 5G network reception connects instantly without dropping packets.", "Positive"),
    ("Connectivity", "Connectivity issues occur frequently; mobile data drops randomly.", "Negative"),
    ("Connectivity", "Bluetooth range is pathetic and disconnects when walking into next room.", "Negative"),
    ("Connectivity", "Cellular reception is strong in cities, but weak in rural areas.", "Mixed"),
    ("Connectivity", "Wi-Fi speeds are ultra fast, though Bluetooth pairing is occasionally flaky.", "Mixed"),
    ("Connectivity", "Supports sub-6GHz 5G bands and Bluetooth 5.4 wireless protocol.", "Neutral"),
    ("Connectivity", "Network signal reception is not weak even in elevators.", "Positive"),
    ("Connectivity", "Cellular connectivity is not reliable when traveling on highways.", "Negative"),

    # Charging
    ("Charging", "The 150W ultra-fast charging replenishes battery to full in 20 minutes.", "Positive"),
    ("Charging", "Fast charging works as advertised, reaching 80 percent in 25 minutes.", "Positive"),
    ("Charging", "Wireless charging is convenient and Qi2 magnetic alignment snaps tight.", "Positive"),
    ("Charging", "Charging is painfully slow capped at 20W, taking over two hours.", "Negative"),
    ("Charging", "Overheats dangerously during fast charging and stops halfway.", "Negative"),
    ("Charging", "Fast charging speed is phenomenal, though charging brick is not in the box.", "Mixed"),
    ("Charging", "Charges fast initially, but slows down dramatically after 70 percent.", "Mixed"),
    ("Charging", "Charges via standard USB Type C port with 30 watt power delivery.", "Neutral"),
    ("Charging", "Charging speed is not slow when using the official adapter.", "Positive"),
    ("Charging", "Wireless charging speed is not fast enough for quick top-ups.", "Negative"),

    # Durability
    ("Durability", "Ceramic shield durability prevented glass shattering when dropped on stone.", "Positive"),
    ("Durability", "Superb durability; dropped it on hardwood floor without a single dent.", "Positive"),
    ("Durability", "IP68 water resistance survived an accidental dip into pool unharmed.", "Positive"),
    ("Durability", "Durability is terrible; light drop from pocket shattered back glass completely.", "Negative"),
    ("Durability", "The screen scratched deeply from simply being in pocket with keys.", "Negative"),
    ("Durability", "The frame survived drops, but camera lens glass cracked easily.", "Mixed"),
    ("Durability", "Good water protection, but outer paint coating chips over time.", "Mixed"),
    ("Durability", "Rated IP68 for dust ingress and water submersion up to 1.5 meters.", "Neutral"),
    ("Durability", "Structural durability is not fragile despite the slim glass profile.", "Positive"),
    ("Durability", "The screen glass is not scratch-resistant against fine beach sand.", "Negative")
]

def generate_training_csv():
    filepath = os.path.join(DATA_DIR, "training_aspect_sentiment.csv")
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["aspect", "sentence", "sentiment"])
        for aspect, sentence, sentiment in TRAINING_SAMPLES:
            writer.writerow([aspect, sentence, sentiment])

    print(f"[OK] Generated {len(TRAINING_SAMPLES)} training samples at {filepath}")
    return filepath

if __name__ == "__main__":
    generate_sample_reviews_csv()
    generate_training_csv()
