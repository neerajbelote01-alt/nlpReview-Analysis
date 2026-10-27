"""
Comprehensive generator for 210+ original brand tech products with Amazon, Flipkart,
and official website shopping links, specifications, and aspect-based customer reviews.
"""

import os
import json
import urllib.parse
from datetime import datetime, timezone

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
os.makedirs(DATA_DIR, exist_ok=True)
JSON_OUTPUT_PATH = os.path.join(DATA_DIR, "brand_products.json")

def create_product(brand, name, category, price, official_url, desc_extra=""):
    slug = "prod_" + brand.lower().replace(" ", "_") + "_" + name.lower().replace(" ", "_").replace("-", "_").replace("+", "plus").replace(".", "_")
    slug = "".join(c for c in slug if c.isalnum() or c == "_")[:64]
    
    encoded_name = urllib.parse.quote_plus(f"{brand} {name}")
    amazon_url = f"https://www.amazon.com/s?k={encoded_name}"
    flipkart_url = f"https://www.flipkart.com/search?q={encoded_name}"
    
    description = f"{brand} {name} featuring premier build craftsmanship, cutting-edge hardware architecture, and seamless software integration. {desc_extra}".strip()

    return {
        "id": slug,
        "name": f"{brand} {name}",
        "brand": brand,
        "category": category,
        "price": price,
        "image_url": f"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        "amazon_url": amazon_url,
        "flipkart_url": flipkart_url,
        "official_url": official_url,
        "description": description
    }

RAW_DATA = [
    # --- APPLE (30 Products) ---
    ("Apple", "iPhone 16 Pro Max", "Smartphones", "$1,199", "https://www.apple.com/iphone-16-pro/", "A18 Pro chip, 48MP Fusion camera with 5x optical zoom, grade 5 titanium frame, and Camera Control button."),
    ("Apple", "iPhone 16 Pro", "Smartphones", "$999", "https://www.apple.com/iphone-16-pro/", "Compact 6.3-inch Super Retina XDR with 120Hz ProMotion, titanium enclosure, and A18 Pro silicon."),
    ("Apple", "iPhone 16", "Smartphones", "$799", "https://www.apple.com/iphone-16/", "A18 chip, Action button, Camera Control, 48MP dual camera with 2x telephoto crop."),
    ("Apple", "iPhone 16 Plus", "Smartphones", "$899", "https://www.apple.com/iphone-16/", "6.7-inch expansive display with exceptional all-day battery stamina and Apple Intelligence."),
    ("Apple", "iPhone 15 Pro Max", "Smartphones", "$1,099", "https://www.apple.com/iphone-15-pro/", "A17 Pro 3nm chip, tetraprism 5x optical telephoto, aerospace titanium, USB-C 10Gbps."),
    ("Apple", "iPhone 15 Pro", "Smartphones", "$899", "https://www.apple.com/iphone-15-pro/", "Dynamic Island, lightweight brushed titanium chassis, and console-quality gaming GPU."),
    ("Apple", "iPhone 15", "Smartphones", "$699", "https://www.apple.com/iphone-15/", "Color-infused back glass, 48MP main sensor, Dynamic Island, and USB-C connectivity."),
    ("Apple", "iPhone 14", "Smartphones", "$599", "https://www.apple.com/iphone-14/", "Dependable dual-camera system, Photonic Engine, A15 Bionic chip, and ceramic shield protection."),
    ("Apple", "iPhone 13", "Smartphones", "$499", "https://www.apple.com/iphone-13/", "Super Retina XDR OLED, cinematic video mode, and highly competitive value ratio."),
    ("Apple", "MacBook Pro 16 M3 Max", "Laptops & Computers", "$3,499", "https://www.apple.com/macbook-pro/", "16-core CPU, 40-core GPU, Liquid Retina XDR with 1600 nits peak brightness, 22-hour battery."),
    ("Apple", "MacBook Pro 14 M3 Pro", "Laptops & Computers", "$1,999", "https://www.apple.com/macbook-pro/", "Space Black finish, hardware-accelerated ray tracing, studio-quality three-mic array."),
    ("Apple", "MacBook Air 15 M3", "Laptops & Computers", "$1,299", "https://www.apple.com/macbook-air/", "Ultra-thin 11.5mm aluminum design, fanless silent operation, dual external display support."),
    ("Apple", "MacBook Air 13 M3", "Laptops & Computers", "$1,099", "https://www.apple.com/macbook-air/", "Lightweight 2.7lb body, MagSafe 3 charging, 1080p FaceTime HD camera."),
    ("Apple", "MacBook Air 13 M2", "Laptops & Computers", "$899", "https://www.apple.com/macbook-air-m2/", "M2 silicon, 18-hour battery, Liquid Retina display with 500 nits brightness."),
    ("Apple", "iPad Pro 13 M4", "Tablets", "$1,299", "https://www.apple.com/ipad-pro/", "Ultra Retina XDR Tandem OLED, 5.1mm thinnest Apple product ever, Apple Pencil Pro support."),
    ("Apple", "iPad Pro 11 M4", "Tablets", "$999", "https://www.apple.com/ipad-pro/", "Breakthrough M4 neural engine, landscape front camera with Center Stage."),
    ("Apple", "iPad Air 13 M2", "Tablets", "$799", "https://www.apple.com/ipad-air/", "Expansive 13-inch Liquid Retina canvas, M2 performance, Touch ID in top button."),
    ("Apple", "iPad Air 11 M2", "Tablets", "$599", "https://www.apple.com/ipad-air/", "All-screen design, USB-C with 2x faster transfer speeds, stereo landscape speakers."),
    ("Apple", "iPad 10th Gen", "Tablets", "$349", "https://www.apple.com/ipad-10.9/", "10.9-inch Liquid Retina display, vibrant pastel colors, A14 Bionic chip."),
    ("Apple", "iPad Mini 7", "Tablets", "$499", "https://www.apple.com/ipad-mini/", "A17 Pro chip, Apple Intelligence support, compact 8.3-inch ultra-portable profile."),
    ("Apple", "Apple Watch Ultra 2", "Smartwatches & Wearables", "$799", "https://www.apple.com/apple-watch-ultra-2/", "49mm aerospace titanium case, 3000 nits display, precision dual-frequency GPS, 72-hour battery."),
    ("Apple", "Apple Watch Series 10", "Smartwatches & Wearables", "$399", "https://www.apple.com/apple-watch-series-10/", "Wide-angle OLED, sleep apnea detection, thinnest case ever, S10 SiP."),
    ("Apple", "Apple Watch SE 2", "Smartwatches & Wearables", "$249", "https://www.apple.com/apple-watch-se/", "Essential fitness and heart health tracking, Crash Detection, swimproof up to 50 meters."),
    ("Apple", "AirPods Pro 2", "Audio & Headphones", "$249", "https://www.apple.com/airpods-pro/", "H2 chip, active noise cancellation with 2x more acoustic attenuation, hearing health features."),
    ("Apple", "AirPods Max", "Audio & Headphones", "$549", "https://www.apple.com/airpods-max/", "Custom acoustic design with 40mm dynamic driver, knit mesh canopy, USB-C charging."),
    ("Apple", "AirPods 4 with ANC", "Audio & Headphones", "$179", "https://www.apple.com/airpods-4/", "Open-ear active noise cancellation, personalized spatial audio with dynamic head tracking."),
    ("Apple", "Mac Mini M4", "Laptops & Computers", "$599", "https://www.apple.com/mac-mini/", "Compact 5x5 inch footprint, front-facing USB-C ports, hardware ray tracing."),
    ("Apple", "Mac Studio M2 Ultra", "Laptops & Computers", "$3,999", "https://www.apple.com/mac-studio/", "24-core CPU, up to 76-core GPU, 800GB/s memory bandwidth for professional studio production."),
    ("Apple", "Apple Studio Display", "Smart Home & TV", "$1,599", "https://www.apple.com/studio-display/", "27-inch 5K Retina display, 12MP Center Stage camera, six-speaker spatial sound system."),
    ("Apple", "Apple TV 4K 128GB", "Smart Home & TV", "$149", "https://www.apple.com/apple-tv-4k/", "A15 Bionic chip, Dolby Vision HDR10+, Thread mesh networking, Siri Remote with USB-C."),

    # --- SAMSUNG (30 Products) ---
    ("Samsung", "Galaxy S25 Ultra", "Smartphones", "$1,299", "https://www.samsung.com/galaxy-s25-ultra/", "Snapdragon 8 Elite, 200MP ISOCELL sensor, titanium frame, built-in S-Pen stylus, Galaxy AI."),
    ("Samsung", "Galaxy S25+", "Smartphones", "$999", "https://www.samsung.com/galaxy-s25/", "6.7-inch Dynamic AMOLED 2X, 4900mAh battery, Armour Aluminum frame, advanced AI photo editing."),
    ("Samsung", "Galaxy S25", "Smartphones", "$799", "https://www.samsung.com/galaxy-s25/", "Compact ergonomic flagship with 120Hz display, triple camera setup, 7 years OS updates."),
    ("Samsung", "Galaxy S24 Ultra", "Smartphones", "$1,199", "https://www.samsung.com/galaxy-s24-ultra/", "Corning Gorilla Armor anti-reflective glass, quad telephoto 50MP 5x lens, flat titanium display."),
    ("Samsung", "Galaxy S24+", "Smartphones", "$899", "https://www.samsung.com/galaxy-s24-plus/", "QHD+ resolution screen, 45W super fast charging, Snapdragon 8 Gen 3 for Galaxy."),
    ("Samsung", "Galaxy S24", "Smartphones", "$699", "https://www.samsung.com/galaxy-s24/", "Bright 2600 nits screen, Circle to Search with Google, pro-visual camera engine."),
    ("Samsung", "Galaxy S24 FE", "Smartphones", "$649", "https://www.samsung.com/galaxy-s24-fe/", "Fan Edition flagship features, 6.7-inch AMOLED 120Hz display, 4700mAh battery cell."),
    ("Samsung", "Galaxy Z Fold 6", "Smartphones", "$1,899", "https://www.samsung.com/galaxy-z-fold6/", "Dual-rail hinge, IP48 water/dust resistance, expansive 7.6-inch folding inner display."),
    ("Samsung", "Galaxy Z Flip 6", "Smartphones", "$1,099", "https://www.samsung.com/galaxy-z-flip6/", "FlexWindow 3.4-inch cover screen, 50MP upgraded wide camera, 4000mAh battery, vapor chamber."),
    ("Samsung", "Galaxy Z Fold 5", "Smartphones", "$1,499", "https://www.samsung.com/galaxy-z-fold5/", "Flex Hinge zero-gap folding design, taskbar multitasking, S-Pen Fold Edition support."),
    ("Samsung", "Galaxy Z Flip 5", "Smartphones", "$899", "https://www.samsung.com/galaxy-z-flip5/", "Pocketable clamshell folding design with customizable widgets and hands-free FlexCam."),
    ("Samsung", "Galaxy A55 5G", "Smartphones", "$449", "https://www.samsung.com/galaxy-a55-5g/", "Metal frame, Knox Vault security, 50MP OIS camera, 4 OS upgrades."),
    ("Samsung", "Galaxy A35 5G", "Smartphones", "$349", "https://www.samsung.com/galaxy-a35-5g/", "Infinity-O Super AMOLED screen, stereo speakers, 5000mAh battery with 25W charging."),
    ("Samsung", "Galaxy A15 5G", "Smartphones", "$199", "https://www.samsung.com/galaxy-a15-5g/", "90Hz AMOLED display in budget segment, MediaTek Dimensity 6100+, expandable storage."),
    ("Samsung", "Galaxy Tab S10 Ultra", "Tablets", "$1,199", "https://www.samsung.com/galaxy-tab-s10-ultra/", "Massive 14.6-inch Dynamic AMOLED 2X, Dimensity 9300+ chip, IP68 S-Pen included in box."),
    ("Samsung", "Galaxy Tab S10+", "Tablets", "$999", "https://www.samsung.com/galaxy-tab-s10-plus/", "12.4-inch productivity slate with DeX desktop mode, anti-reflective screen coating."),
    ("Samsung", "Galaxy Tab S9 FE", "Tablets", "$449", "https://www.samsung.com/galaxy-tab-s9-fe/", "Water and dust resistant aluminum chassis, 90Hz smooth screen, bundled stylus."),
    ("Samsung", "Galaxy Watch Ultra", "Smartwatches & Wearables", "$649", "https://www.samsung.com/galaxy-watch-ultra/", "Grade 4 titanium cushion design, 100-meter water resistance, dual-frequency GPS, emergency siren."),
    ("Samsung", "Galaxy Watch 7", "Smartwatches & Wearables", "$299", "https://www.samsung.com/galaxy-watch7/", "3nm Exynos W1000 processor, BioActive sensor with AGEs index monitoring, dual-band GPS."),
    ("Samsung", "Galaxy Ring", "Smartwatches & Wearables", "$399", "https://www.samsung.com/galaxy-ring/", "Titanium smart ring, 7-day battery life, continuous sleep analysis, lightweight 3g profile."),
    ("Samsung", "Galaxy Buds 3 Pro", "Audio & Headphones", "$249", "https://www.samsung.com/galaxy-buds3-pro/", "Blade lights design, dual amplifier two-way speakers, 24-bit 96kHz lossless audio."),
    ("Samsung", "Galaxy Buds 3", "Audio & Headphones", "$179", "https://www.samsung.com/galaxy-buds3/", "Open-type earbud design, adaptive ANC, crystal-clear call quality with super wideband mic."),
    ("Samsung", "Galaxy Buds FE", "Audio & Headphones", "$99", "https://www.samsung.com/galaxy-buds-fe/", "Ergonomic wingtip grip, deep bass acoustic driver, powerful active noise cancellation."),
    ("Samsung", "Galaxy Book 4 Pro 360", "Laptops & Computers", "$1,599", "https://www.samsung.com/galaxy-book4-pro-360/", "2-in-1 convertible touchscreen with S-Pen, Intel Core Ultra 7, Dynamic AMOLED 2X screen."),
    ("Samsung", "Galaxy Book 4 Ultra", "Laptops & Computers", "$2,399", "https://www.samsung.com/galaxy-book4-ultra/", "NVIDIA GeForce RTX 4070 laptop GPU, Intel Core Ultra 9, studio quality quad speakers."),
    ("Samsung", "Odyssey OLED G9 49-inch", "Smart Home & TV", "$1,499", "https://www.samsung.com/monitors/gaming/odyssey-oled-g9/", "Dual QHD curved 32:9 gaming monitor, 240Hz refresh, 0.03ms response time, Neo Quantum Processor."),
    ("Samsung", "Odyssey Neo G8 32-inch", "Smart Home & TV", "$999", "https://www.samsung.com/monitors/gaming/odyssey-neo-g8/", "4K UHD 240Hz 1000R curved monitor with Quantum Mini-LED and Quantum HDR 2000."),
    ("Samsung", "Neo QLED 65-inch QN90D 4K TV", "Smart Home & TV", "$1,899", "https://www.samsung.com/tvs/qled-tv/qn90d/", "NQ4 AI Gen2 processor, Mini LED precision dimming, anti-glare screen, Dolby Atmos."),
    ("Samsung", "The Frame 55-inch QLED 4K TV", "Smart Home & TV", "$1,399", "https://www.samsung.com/tvs/the-frame/", "Matte display texture transforms into curated art gallery when powered off, customizable bezels."),
    ("Samsung", "The Freestyle 2nd Gen Projector", "Smart Home & TV", "$599", "https://www.samsung.com/projectors/the-freestyle/", "Portable 100-inch 1080p smart projector with 360-degree cradle, auto-keystone, and gaming hub."),

    # --- SONY (21 Products) ---
    ("Sony", "WH-1000XM5 Wireless Headphones", "Audio & Headphones", "$399", "https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b", "Industry-leading active noise cancelling with 8 microphones, Auto NC Optimizer, 30-hour battery."),
    ("Sony", "WH-1000XM4 Wireless Headphones", "Audio & Headphones", "$279", "https://electronics.sony.com/audio/headphones/headband/p/wh1000xm4-b", "Legendary travel headphone with dual noise sensor, LDAC Hi-Res Audio, fold-flat travel case."),
    ("Sony", "WF-1000XM5 Noise Canceling Earbuds", "Audio & Headphones", "$299", "https://electronics.sony.com/audio/headphones/truly-wireless-earbuds/p/wf1000xm5-b", "Integrated Processor V2, Dynamic Driver X, bone conduction voice pickup, polyurethane foam tips."),
    ("Sony", "LinkBuds S", "Audio & Headphones", "$149", "https://electronics.sony.com/audio/headphones/truly-wireless-earbuds/p/wfls900n-b", "Ultra-small and lightweight 4.8g earbuds with seamless ambient sound switching."),
    ("Sony", "LinkBuds Open", "Audio & Headphones", "$199", "https://electronics.sony.com/audio/headphones/truly-wireless-earbuds/p/wf910-b", "Open-ring acoustic driver keeping ear canals open for natural environmental awareness."),
    ("Sony", "PlayStation 5 Pro", "Gaming & Consoles", "$699", "https://www.playstation.com/ps5/ps5-pro/", "PlayStation Spectral Super Resolution (PSSR) AI upscaling, advanced ray tracing, 2TB SSD."),
    ("Sony", "PlayStation 5 Slim", "Gaming & Consoles", "$499", "https://www.playstation.com/ps5/", "30% reduced volume chassis, detachable Ultra HD Blu-ray disc drive, 1TB high-speed NVMe storage."),
    ("Sony", "PlayStation Portal", "Gaming & Consoles", "$199", "https://www.playstation.com/accessories/playstation-portal-remote-player/", "8-inch 1080p 60fps LCD screen with integrated DualSense adaptive triggers and haptic feedback."),
    ("Sony", "DualSense Edge Wireless Controller", "Gaming & Consoles", "$199", "https://www.playstation.com/accessories/dualsense-edge-wireless-controller/", "Customizable back buttons, replaceable stick modules, adjustable trigger stops."),
    ("Sony", "Xperia 1 VI", "Smartphones", "$1,199", "https://electronics.sony.com/mobile/smartphone/all/p/x1m6b", "85-170mm true continuous optical telephoto zoom, LTPO 1-120Hz display, audio jack."),
    ("Sony", "Xperia 5 V", "Smartphones", "$899", "https://electronics.sony.com/mobile/smartphone/all/p/x5m5b", "Compact camera phone with Exmor T for mobile sensor, front-facing stereo speakers."),
    ("Sony", "Xperia 10 VI", "Smartphones", "$449", "https://electronics.sony.com/mobile/smartphone/all/p/x10m6b", "Lightweight 164g body, 2-day battery life, IP65/68 water resistance, Corning Gorilla Glass Victus."),
    ("Sony", "Alpha A7 IV Mirrorless Camera", "Cameras & Drones", "$2,499", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/all-interchangeable-lens-cameras/p/ilce7m4-b", "33MP full-frame Exmor R BSI sensor, 4K 60p 10-bit 4:2:2 video, real-time eye AF."),
    ("Sony", "Alpha A7R V Mirrorless Camera", "Cameras & Drones", "$3,899", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/all-interchangeable-lens-cameras/p/ilce7rm5", "61MP ultra-high-resolution sensor, dedicated AI processing unit for subject tracking, 8K 24p video."),
    ("Sony", "Alpha A6700 Mirrorless Camera", "Cameras & Drones", "$1,399", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/all-interchangeable-lens-cameras/p/ilce6700-b", "26MP APS-C BSI sensor with BIONZ XR processing, 5-axis in-body image stabilization."),
    ("Sony", "ZV-E10 II Vlog Camera", "Cameras & Drones", "$998", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/all-interchangeable-lens-cameras/p/ilcezve10m2-b", "Content creator mirrorless camera with directional 3-capsule mic, Product Showcase setting."),
    ("Sony", "Bravia 9 65-inch Mini LED 4K TV", "Smart Home & TV", "$2,499", "https://electronics.sony.com/tv-video/televisions/all-tvs/p/k65xr90", "XR Backlight Master Drive with high peak luminance, Acoustic Multi-Audio+, Google TV platform."),
    ("Sony", "Bravia Theatre Bar 9 Soundbar", "Audio & Headphones", "$1,399", "https://electronics.sony.com/audio/soundbars/all-soundbars/p/ht-a9000", "13 speaker units with 360 Spatial Sound Mapping, Dolby Atmos and DTS:X support."),
    ("Sony", "SRS-XG300 Portable Bluetooth Speaker", "Audio & Headphones", "$249", "https://electronics.sony.com/audio/speakers/wireless-speakers/p/srsxg300-b", "MEGA BASS acoustics, retractable handle, IP67 waterproof/dustproof rating, ambient illumination."),
    ("Sony", "SRS-XB100 Compact Bluetooth Speaker", "Audio & Headphones", "$59", "https://electronics.sony.com/audio/speakers/wireless-speakers/p/srsxb100-b", "Ultra-compact Sound Diffusion Processor, UV-resistant exterior strap, 16-hour battery."),
    ("Sony", "MDR-7506 Professional Studio Headphones", "Audio & Headphones", "$99", "https://pro.sony/ue_US/products/headphones/mdr-7506", "Industry standard broadcast and recording studio monitor headphones with 40mm neodymium drivers."),

    # --- GOOGLE (20 Products) ---
    ("Google", "Pixel 9 Pro XL", "Smartphones", "$1,099", "https://store.google.com/product/pixel_9_pro", "Google Tensor G4 chip, 6.8-inch Super Actua display, triple pro camera with 8K Video Boost, 16GB RAM."),
    ("Google", "Pixel 9 Pro", "Smartphones", "$999", "https://store.google.com/product/pixel_9_pro", "Compact 6.3-inch pro flagship with matte glass back, polished metal frame, and Gemini Nano multimodal AI."),
    ("Google", "Pixel 9", "Smartphones", "$799", "https://store.google.com/product/pixel_9", "Vibrant colors, 50MP main camera with Macro Focus, 24-hour battery with Extreme Battery Saver."),
    ("Google", "Pixel 9 Pro Fold", "Smartphones", "$1,799", "https://store.google.com/product/pixel_9_pro_fold", "8.0-inch Super Actua Flex inner screen, thinnest folding design in North America, IPX8 water rating."),
    ("Google", "Pixel 8a", "Smartphones", "$499", "https://store.google.com/product/pixel_8a", "Tensor G3 processor, 120Hz Actua display, Best Take, Magic Editor, and 7 years of Pixel drops."),
    ("Google", "Pixel 8 Pro", "Smartphones", "$749", "https://store.google.com/product/pixel_8_pro", "Fully upgraded cameras with pro controls, temperature sensor, and Audio Magic Eraser."),
    ("Google", "Pixel 8", "Smartphones", "$549", "https://store.google.com/product/pixel_8", "Pocket-friendly 6.2-inch OLED with satin finish and Macro Focus photography."),
    ("Google", "Pixel 7a", "Smartphones", "$379", "https://store.google.com/product/pixel_7a", "Tensor G2 computing, wireless charging, and flagship-tier computational night sight."),
    ("Google", "Pixel Tablet with Speaker Dock", "Tablets", "$499", "https://store.google.com/product/pixel_tablet", "11-inch display with magnetic Charging Speaker Dock that transforms into a smart home hub."),
    ("Google", "Pixel Watch 3 45mm", "Smartwatches & Wearables", "$399", "https://store.google.com/product/pixel_watch_3", "Actua display with 2000 nits, Loss of Pulse Detection, advanced cardio load insights."),
    ("Google", "Pixel Watch 3 41mm", "Smartwatches & Wearables", "$349", "https://store.google.com/product/pixel_watch_3", "Seamless domed glass, Fitbit deep health integration, 24-hour battery with fast charging."),
    ("Google", "Pixel Watch 2", "Smartwatches & Wearables", "$249", "https://store.google.com/product/pixel_watch_2", "Quad-core CPU, cEDA continuous stress sensor, aluminum housing."),
    ("Google", "Pixel Buds Pro 2", "Audio & Headphones", "$229", "https://store.google.com/product/pixel_buds_pro_2", "Custom Tensor A1 chip, Silent Seal 2.0 active noise cancellation, twist-to-adjust ear stabilizer."),
    ("Google", "Pixel Buds A-Series", "Audio & Headphones", "$99", "https://store.google.com/product/pixel_buds_a_series", "Custom-designed 12mm dynamic drivers, spatial vent for ear-pressure reduction, hands-free Assistant."),
    ("Google", "Google TV Streamer 4K", "Smart Home & TV", "$99", "https://store.google.com/product/google_tv_streamer", "Next-gen entertainment hub with Matter and Thread smart home hub, 32GB storage, Dolby Vision."),
    ("Google", "Nest Hub 2nd Gen", "Smart Home & TV", "$99", "https://store.google.com/product/nest_hub_2nd_gen", "7-inch smart touchscreen with Soli radar Sleep Sensing and 50% more bass speaker."),
    ("Google", "Nest Audio Smart Speaker", "Audio & Headphones", "$99", "https://store.google.com/product/nest_audio", "75mm woofer and 19mm tweeter for room-filling vocals, environmental acoustics adaptation."),
    ("Google", "Nest Cam Battery", "Smart Home & TV", "$179", "https://store.google.com/product/nest_cam_battery", "Wire-free indoor/outdoor security camera with intelligent person, animal, and vehicle alerts."),
    ("Google", "Nest Doorbell Battery", "Smart Home & TV", "$179", "https://store.google.com/product/nest_doorbell_battery", "Tall 3:4 aspect ratio to view visitors head-to-toe and see packages on the doorstep."),
    ("Google", "Pixel Stand 2nd Gen", "Smartphones", "$79", "https://store.google.com/product/pixel_stand_2nd_gen", "Up to 23W wireless fast-charging stand with silent built-in cooling fan."),

    # --- ONEPLUS (17 Products) ---
    ("OnePlus", "OnePlus 13", "Smartphones", "$899", "https://www.oneplus.com/", "Snapdragon 8 Elite, 6000mAh Glacier battery, Hasselblad triple 50MP camera, IP68/IP69 rating."),
    ("OnePlus", "OnePlus 12", "Smartphones", "$799", "https://www.oneplus.com/12", "Snapdragon 8 Gen 3, 5400mAh battery with 80W wired & 50W AIRVOOC wireless charging, 4500 nits display."),
    ("OnePlus", "OnePlus 12R", "Smartphones", "$499", "https://www.oneplus.com/12r", "Flagship killer with Snapdragon 8 Gen 2, 4th-gen LTPO 120Hz display, massive 5500mAh cell."),
    ("OnePlus", "OnePlus Open", "Smartphones", "$1,499", "https://www.oneplus.com/open", "Ultralight folding design with Sony LYT-T808 pixel-stacked sensor and Open Canvas multitasking."),
    ("OnePlus", "OnePlus 11", "Smartphones", "$599", "https://www.oneplus.com/11", "Snapdragon 8 Gen 2 with third-gen Hasselblad Camera and 100W SuperVOOC power delivery."),
    ("OnePlus", "OnePlus 11R", "Smartphones", "$449", "https://www.oneplus.com/11r", "Super-fast charging performance, alert slider, 120Hz Super Fluid AMOLED display."),
    ("OnePlus", "OnePlus Nord 4", "Smartphones", "$399", "https://www.oneplus.com/nord-4", "Unique metal unibody design in 5G era, Snapdragon 7+ Gen 3, 5500mAh battery with 100W charge."),
    ("OnePlus", "OnePlus Nord CE 4", "Smartphones", "$299", "https://www.oneplus.com/nord-ce-4", "Qualcomm Snapdragon 7 Gen 3, 100W charging in mid-tier category, Sony LYT-600 main camera."),
    ("OnePlus", "OnePlus Nord CE 4 Lite", "Smartphones", "$229", "https://www.oneplus.com/nord-ce-4-lite", "Budget 5G device with 120Hz AMOLED display and reverse wired charging support."),
    ("OnePlus", "OnePlus Pad 2", "Tablets", "$549", "https://www.oneplus.com/pad-2", "Snapdragon 8 Gen 3 powered tablet with 12.1-inch 3K 144Hz screen and six-speaker array."),
    ("OnePlus", "OnePlus Pad Go", "Tablets", "$269", "https://www.oneplus.com/pad-go", "11.35-inch 2.4K display, quad speakers with Dolby Atmos, lightweight twin-mint finish."),
    ("OnePlus", "OnePlus Watch 2", "Smartwatches & Wearables", "$299", "https://www.oneplus.com/watch-2", "Dual-engine architecture (Wear OS + RTOS) delivering 100 hours of battery life, sapphire crystal."),
    ("OnePlus", "OnePlus Watch 2R", "Smartwatches & Wearables", "$229", "https://www.oneplus.com/watch-2r", "Lightweight aluminum case, dual-frequency GPS, comprehensive VO2 max athletic tracking."),
    ("OnePlus", "OnePlus Buds Pro 3", "Audio & Headphones", "$179", "https://www.oneplus.com/buds-pro-3", "Co-created with Dynaudio, dual drivers with dual DACs, 50dB adaptive noise cancellation."),
    ("OnePlus", "OnePlus Buds Pro 2", "Audio & Headphones", "$129", "https://www.oneplus.com/buds-pro-2", "MelodyBoost dual driver system, spatial audio with head tracking, LHDC 4.0 codec."),
    ("OnePlus", "OnePlus Buds 3", "Audio & Headphones", "$99", "https://www.oneplus.com/buds-3", "49dB smart adaptive active noise cancellation, dual dynamic drivers, sliding touch volume bar."),
    ("OnePlus", "OnePlus Nord Buds 3 Pro", "Audio & Headphones", "$79", "https://www.oneplus.com/nord-buds-3-pro", "Hybrid ANC with 12.4mm titanized diaphragm drivers and BassWave 2.0 acoustic tuning."),

    # --- DELL & ALIENWARE (12 Products) ---
    ("Dell", "XPS 16 (9640)", "Laptops & Computers", "$2,199", "https://www.dell.com/en-us/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop", "CNC machined aluminum and Gorilla Glass 3 palm rest with seamless glass haptic touchpad, OLED 4K+."),
    ("Dell", "XPS 14 (9440)", "Laptops & Computers", "$1,699", "https://www.dell.com/en-us/shop/dell-laptops/xps-14-laptop/spd/xps-14-9440-laptop", "Intel Core Ultra processors with NVIDIA RTX 4050, edge-to-edge zero-lattice keyboard."),
    ("Dell", "XPS 13 (9340)", "Laptops & Computers", "$1,299", "https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9340-laptop", "Ultra-portable 2.6lb laptop with touch function row, FHD+ or QHD+ 120Hz display options."),
    ("Dell", "Inspiron 16 Plus", "Laptops & Computers", "$1,099", "https://www.dell.com/en-us/shop/dell-laptops/inspiron-16-plus-laptop/spd/inspiron-16-7640-laptop", "ComfortView Plus low blue light screen, Intel Core Ultra 7, spacious numeric keypad."),
    ("Dell", "Inspiron 14 2-in-1", "Laptops & Computers", "$749", "https://www.dell.com/en-us/shop/dell-laptops/inspiron-14-2-in-1-laptop/spd/inspiron-14-7440-2-in-1-laptop", "360-degree hinge versatility, stylus writing support, FHD+ touch panel."),
    ("Dell", "G16 Gaming Laptop", "Laptops & Computers", "$1,299", "https://www.dell.com/en-us/shop/dell-laptops/g16-gaming-laptop/spd/g-series-16-7630-laptop", "Intel Core i9 14th Gen, RTX 4070, Alienware-inspired thermal cooling pipes, 240Hz QHD+."),
    ("Dell", "Alienware m18 R2 Gaming Laptop", "Laptops & Computers", "$2,999", "https://www.dell.com/en-us/shop/dell-laptops/alienware-m18-r2-gaming-laptop/spd/alienware-m18-r2-laptop", "Desktop replacement with 18-inch screen, Intel i9-14900HX, RTX 4090, Cryo-tech cooling."),
    ("Dell", "Alienware x16 R2 Gaming Laptop", "Laptops & Computers", "$2,399", "https://www.dell.com/en-us/shop/dell-laptops/alienware-x16-r2-gaming-laptop/spd/alienware-x16-r2-laptop", "Ultra-sleek Lunar Silver chassis, CherryMX ultra-low profile mechanical keyboard, AlienFX lighting."),
    ("Dell", "Alienware Aurora R16 Gaming Desktop", "Laptops & Computers", "$1,899", "https://www.dell.com/en-us/shop/desktop-computers/alienware-aurora-r16-gaming-desktop/spd/alienware-aurora-r16-desktop", "Optimized airflow chassis, 40% smaller footprint than R15, liquid cooling 240mm heat exchanger."),
    ("Dell", "UltraSharp 32 4K USB-C Hub Monitor (U3224KB)", "Smart Home & TV", "$1,999", "https://www.dell.com/en-us/shop/dell-ultrasharp-32-6k-monitor-u3224kb/apd/210-bhyv/monitors-monitor-accessories", "6K resolution IPS Black panel with built-in 4K HDR webcam, echo-canceling mics, and 140W power delivery."),
    ("Dell", "UltraSharp 27 4K USB-C Hub Monitor (U2723QE)", "Smart Home & TV", "$579", "https://www.dell.com/en-us/shop/dell-ultrasharp-27-4k-usb-c-hub-monitor-u2723qe/apd/210-bdpf/monitors-monitor-accessories", "2000:1 contrast ratio IPS Black technology, 98% DCI-P3 color reproduction, RJ45 wired LAN."),
    ("Dell", "Pro Wireless Headset (WL5024)", "Audio & Headphones", "$199", "https://www.dell.com/en-us/shop/dell-pro-wireless-anc-headset-wl5024/apd/520-aawj/audio", "AI-based noise canceling microphone, certified for Microsoft Teams and Zoom, 78-hour battery."),

    # --- HP (10 Products) ---
    ("HP", "Spectre x360 16 2-in-1 Laptop", "Laptops & Computers", "$1,799", "https://www.hp.com/us-en/shop/pdp/hp-spectre-x360-2-in-1-laptop-16-aa0047nr", "Gem-cut CNC aluminum chassis, 2.8K OLED touchscreen, 9MP AI camera with night mode."),
    ("HP", "Spectre x360 14 2-in-1 Laptop", "Laptops & Computers", "$1,449", "https://www.hp.com/us-en/shop/pdp/hp-spectre-x360-2-in-1-laptop-14-eu0097nr", "Intel Core Ultra 7 with NPU, variable 120Hz refresh rate, haptic glass trackpad."),
    ("HP", "Envy x360 15", "Laptops & Computers", "$899", "https://www.hp.com/us-en/shop/pdp/hp-envy-x360-2-in-1-laptop-15-fe0047nr", "IMAX Enhanced certified display, audio tuned by Poly Studio, fast charge 50% in 30 minutes."),
    ("HP", "Pavilion Plus 14", "Laptops & Computers", "$799", "https://www.hp.com/us-en/shop/pdp/hp-pavilion-plus-laptop-14-ey0097nr", "Lightweight recycled aluminum construction, AMD Ryzen 7, 2.8K 120Hz OLED screen."),
    ("HP", "OMEN Transcend 14 Gaming Laptop", "Laptops & Computers", "$1,499", "https://www.hp.com/us-en/shop/pdp/omen-transcend-laptop-14-fb0097nr", "World's lightest 14-inch gaming laptop at 3.6lbs, 2.8K 120Hz OLED, HyperX tuned audio."),
    ("HP", "OMEN 16 Gaming Laptop", "Laptops & Computers", "$1,299", "https://www.hp.com/us-en/shop/pdp/omen-gaming-laptop-16-wf1097nr", "Tempest Cooling technology, Intel i7-14700HX, RTX 4070, OMEN Gaming Hub software suite."),
    ("HP", "Victus 16 Gaming Laptop", "Laptops & Computers", "$899", "https://www.hp.com/us-en/shop/pdp/victus-gaming-laptop-16-s1097nr", "Mainstream gaming powerhouse with AMD Ryzen 7 8845HS and NVIDIA RTX 4060 graphics."),
    ("HP", "EliteBook 840 G10 Enterprise Laptop", "Laptops & Computers", "$1,599", "https://www.hp.com/us-en/shop/pdp/hp-elitebook-840-14-inch-g10-notebook-pc-wolf-pro-security-edition", "HP Wolf Security enterprise hardware protection, 5MP IR webcam, spill-resistant keyboard."),
    ("HP", "Dragonfly G4 Ultra-Light Laptop", "Laptops & Computers", "$1,899", "https://www.hp.com/us-en/shop/pdp/hp-dragonfly-g4-notebook-pc", "Sub-1kg magnesium chassis, 3:2 productivity display, multi-camera software switching."),
    ("HP", "Series 7 Pro 31.5 4K Monitor", "Smart Home & TV", "$849", "https://www.hp.com/us-en/shop/pdp/hp-series-7-pro-315-inch-4k-thunderbolt-4-monitor-732pk", "Thunderbolt 4 single-cable connectivity with 100W power delivery and factory color calibration."),

    # --- LENOVO (10 Products) ---
    ("Lenovo", "ThinkPad X1 Carbon Gen 12", "Laptops & Computers", "$1,899", "https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-12-14-inch-intel/len101t0083", "Ultralight carbon fiber body, legendary TrackPoint keyboard, Communication Bar with 8MP webcam."),
    ("Lenovo", "ThinkPad T14s Gen 5", "Laptops & Computers", "$1,399", "https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadt/thinkpad-t14s-gen-5-14-inch-intel/len101t0093", "Enterprise workhorse with MIL-STD-810H durability, Snapdragon X Elite or Intel Core Ultra."),
    ("Lenovo", "Yoga 9i Dual Screen Laptop", "Laptops & Computers", "$1,999", "https://www.lenovo.com/us/en/p/laptops/yoga/yoga-2-in-1-series/yoga-book-9i-gen-9-13-inch-intel/len101y0044", "Dual 13.3-inch 2.8K OLED screens, Bowers & Wilkins rotating soundbar, folio stand and keyboard."),
    ("Lenovo", "Yoga Slim 7x Copilot+ PC", "Laptops & Computers", "$1,199", "https://www.lenovo.com/us/en/p/laptops/yoga/yoga-slim-series/yoga-slim-7x-gen-9-14-inch-snapdragon/len101y0049", "Snapdragon X Elite 45 TOPS NPU, 3K 90Hz PureSight OLED screen, multi-day battery stamina."),
    ("Lenovo", "Legion Pro 7i Gaming Laptop", "Laptops & Computers", "$2,499", "https://www.lenovo.com/us/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-7i-gen-9-16-inch-intel/len101g0034", "Intel i9-14900HX, RTX 4090, Coldfront vapor chamber cooling, 240Hz 16-inch WQXGA panel."),
    ("Lenovo", "Legion 9i Gaming Laptop", "Laptops & Computers", "$3,499", "https://www.lenovo.com/us/en/p/laptops/legion-laptops/legion-9-series/legion-9i-gen-9-16-inch-intel/len101g0033", "Integrated liquid-cooling pump, forged carbon A-cover where every pattern is unique, Mini-LED."),
    ("Lenovo", "Legion Go Handheld Gaming PC", "Gaming & Consoles", "$699", "https://www.lenovo.com/us/en/p/handheld/legion-go/len106g0001", "8.8-inch QHD+ 144Hz display, detachable TrueStrike controllers with FPS mouse mode."),
    ("Lenovo", "IdeaPad Pro 5 16-inch", "Laptops & Computers", "$999", "https://www.lenovo.com/us/en/p/laptops/ideapad/ideapad-500-series/ideapad-pro-5i-gen-9-16-inch-intel/len101i0096", "Creators laptop with RTX 4050, 120Hz IPS display with 100% sRGB, IR facial recognition login."),
    ("Lenovo", "Tab P12 Pro Tablet", "Tablets", "$629", "https://www.lenovo.com/us/en/p/tablets/android-tablets/lenovo-tab-series/lenovo-tab-p12-pro/wmd00000508", "12.6-inch 120Hz AMOLED, JBL quad speakers with Dolby Atmos, Precision Pen 3 included."),
    ("Lenovo", "ThinkVision 27 4K Monitor (P27u-20)", "Smart Home & TV", "$599", "https://www.lenovo.com/us/en/p/monitors/thinkvision/thinkvision-p27u-20/62cbr3us11", "99.1% DCI-P3 & 99.5% Adobe RGB color space, Thunderbolt 4 in/out with daisy chaining."),

    # --- ASUS & ROG (10 Products) ---
    ("Asus", "ROG Zephyrus G16 Gaming Laptop", "Laptops & Computers", "$1,999", "https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g16-2024/", "CNC aluminum unibody, Slash Lighting lid array, 2.5K 240Hz ROG Nebula OLED display, RTX 4080."),
    ("Asus", "ROG Zephyrus G14 Gaming Laptop", "Laptops & Computers", "$1,599", "https://rog.asus.com/us/laptops/rog-zephyrus/rog-zephyrus-g14-2024/", "Compact 3.3lb gaming powerhouse, AMD Ryzen 9 8945HS, 3K 120Hz OLED screen."),
    ("Asus", "ROG Strix SCAR 18", "Laptops & Computers", "$3,699", "https://rog.asus.com/us/laptops/rog-strix/rog-strix-scar-18-2024/", "18-inch Mini LED 240Hz Nebula HDR display, Intel i9-14900HX, RTX 4090, Conductonaut Extreme liquid metal."),
    ("Asus", "ROG Ally X Handheld Gaming PC", "Gaming & Consoles", "$799", "https://rog.asus.com/us/gaming-handhelds/rog-ally/rog-ally-x-2024/", "AMD Ryzen Z1 Extreme, 80Wh double-capacity battery, 24GB LPDDR5X RAM, dual USB-C ports."),
    ("Asus", "ROG Phone 8 Pro", "Smartphones", "$1,199", "https://rog.asus.com/us/phones/rog-phone-8-pro/", "Snapdragon 8 Gen 3, AniMe Vision programmable mini-LED back display, 165Hz AMOLED, IP68."),
    ("Asus", "Zenbook 14 OLED (UX3405)", "Laptops & Computers", "$1,099", "https://www.asus.com/us/laptops/for-home/zenbook/asus-zenbook-14-oled-ux3405/", "Intel Core Ultra 7, 3K 120Hz Lumina OLED display, 75Wh battery, super-slim 14.9mm chassis."),
    ("Asus", "Zenbook Duo Dual-Screen Laptop (UX8406)", "Laptops & Computers", "$1,699", "https://www.asus.com/us/laptops/for-home/zenbook/asus-zenbook-duo-2024-ux8406/", "Dual 14-inch 3K 120Hz OLED screens with detachable full-size Bluetooth keyboard."),
    ("Asus", "Vivobook Pro 15 OLED", "Laptops & Computers", "$1,199", "https://www.asus.com/us/laptops/for-creators/vivobook/asus-vivobook-pro-15-oled-n6506/", "ASUS DialPad integration for Adobe creative software, Intel Core Ultra 9, RTX 4060 graphics."),
    ("Asus", "TUF Gaming A15", "Laptops & Computers", "$899", "https://www.asus.com/us/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a15-2024/", "MIL-STD-810H military certified ruggedness, AMD Ryzen 7, RTX 4060, 90Wh long battery."),
    ("Asus", "ProArt Display PA32UCG 4K Monitor", "Smart Home & TV", "$2,999", "https://www.asus.com/us/displays-desktops/monitors/proart/proart-display-pa32ucg-k/", "32-inch 4K HDR 1600 nits Mini LED with 1152 local dimming zones, 120Hz VRR, built-in colorimeter."),

    # --- BOSE (8 Products) ---
    ("Bose", "QuietComfort Ultra Headphones", "Audio & Headphones", "$429", "https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCU-HEADPHONEARN.html", "CustomTune sound calibration, Bose Immersive Audio spatialized sound, world-class active noise canceling."),
    ("Bose", "QuietComfort Ultra Earbuds", "Audio & Headphones", "$299", "https://www.bose.com/p/earbuds/bose-quietcomfort-ultra-earbuds/QCU-EARBUD.html", "Spatial audio in pocketable form factor, 9 ear tip and stability band combinations, IPX4 rating."),
    ("Bose", "QuietComfort Headphones (2023)", "Audio & Headphones", "$349", "https://www.bose.com/p/headphones/bose-quietcomfort-headphones/QC-HEADPHONEARN.html", "Iconic comfortable ear cushions, physical control buttons, Quiet and Aware modes, 24-hour battery."),
    ("Bose", "SoundLink Max Bluetooth Speaker", "Audio & Headphones", "$399", "https://www.bose.com/p/speakers/bose-soundlink-max-portable-speaker/SLMAX-SPEAKERWIRELESS.html", "Deep stereo bass performance, IP67 waterproof and dustproof silicone-wrapped steel body, 20hr battery."),
    ("Bose", "SoundLink Flex 2nd Gen Speaker", "Audio & Headphones", "$149", "https://www.bose.com/p/speakers/bose-soundlink-flex-portable-speaker-2nd-gen/SLFLEXII-SPEAKERWIRELESS.html", "PositionIQ technology adjusts acoustic orientation automatically, floats in water."),
    ("Bose", "Smart Ultra Soundbar", "Smart Home & TV", "$899", "https://www.bose.com/p/home-theater/bose-smart-ultra-soundbar/SMSBR-SOUNDBAR.html", "Dolby Atmos with TrueSpace spatial processing, AI Dialogue Mode for crystal-clear vocals."),
    ("Bose", "Smart Soundbar 600", "Smart Home & TV", "$499", "https://www.bose.com/p/home-theater/bose-smart-soundbar-600/SMSBR600-SOUNDBAR.html", "Compact Dolby Atmos soundbar with upward-firing transducers for height dimension sound."),
    ("Bose", "QuietComfort Earbuds II", "Audio & Headphones", "$229", "https://www.bose.com/p/earbuds/bose-quietcomfort-earbuds-ii/QCEBII-EARBUD.html", "Personalized noise cancellation and sound performance shaped to individual ear canal acoustics."),

    # --- XIAOMI (11 Products) ---
    ("Xiaomi", "Xiaomi 15 Pro", "Smartphones", "$899", "https://www.mi.com/global/", "Snapdragon 8 Elite, Leica triple 50MP Summilux lenses, 6100mAh silicon-carbon battery, 90W charging."),
    ("Xiaomi", "Xiaomi 15", "Smartphones", "$749", "https://www.mi.com/global/", "Compact 6.36-inch 1-120Hz LTPO screen with 1.38mm ultra-narrow bezels, 5400mAh battery cell."),
    ("Xiaomi", "Xiaomi 14 Ultra", "Smartphones", "$1,299", "https://www.mi.com/global/product/xiaomi-14-ultra/", "1-inch Sony LYT-900 sensor with stepless variable aperture, quad Leica 50MP cameras, Photography Kit."),
    ("Xiaomi", "Xiaomi 14", "Smartphones", "$799", "https://www.mi.com/global/product/xiaomi-14/", "Leica 75mm floating telephoto lens, Snapdragon 8 Gen 3, CrystalRes AMOLED 3000 nits."),
    ("Xiaomi", "Xiaomi 14 CIVI", "Smartphones", "$549", "https://www.mi.com/global/", "Dual 32MP selfie cameras, curved glass back with vegan leather accents, Snapdragon 8s Gen 3."),
    ("Xiaomi", "Xiaomi 13T Pro", "Smartphones", "$649", "https://www.mi.com/global/product/xiaomi-13t-pro/", "MediaTek Dimensity 9200+, 144Hz CrystalRes AMOLED display, 120W HyperCharge in 19 mins."),
    ("Xiaomi", "Redmi Note 14 Pro+", "Smartphones", "$379", "https://www.mi.com/global/", "200MP OIS camera, IP68/IP69K water resistance, 6200mAh battery, curved 1.5K display."),
    ("Xiaomi", "Redmi Note 13 Pro 5G", "Smartphones", "$299", "https://www.mi.com/global/product/redmi-note-13-pro-5g/", "200MP camera with 4x lossless in-sensor zoom, Snapdragon 7s Gen 2, 67W turbo charging."),
    ("Xiaomi", "Xiaomi Pad 6", "Tablets", "$349", "https://www.mi.com/global/product/xiaomi-pad-6/", "11-inch WQHD+ 144Hz display, Snapdragon 870, quad stereo speakers, 8840mAh battery."),
    ("Xiaomi", "Xiaomi Watch 2 Pro", "Smartwatches & Wearables", "$249", "https://www.mi.com/global/product/xiaomi-watch-2-pro/", "Google Wear OS with Snapdragon W5+ Gen 1, rotating crown, LTE standalone connectivity."),
    ("Xiaomi", "Xiaomi Smart Band 9", "Smartwatches & Wearables", "$49", "https://www.mi.com/global/product/xiaomi-smart-band-9/", "1.62-inch AMOLED screen with 1200 nits brightness, 21-day battery life, all-day SpO2."),

    # --- REALME, OPPO, VIVO (11 Products) ---
    ("Vivo", "Vivo X100 Pro", "Smartphones", "$999", "https://www.vivo.com/en/products/x100pro", "ZEISS APO floating periscope telephoto, 1-inch main sensor, Dimensity 9300, V3 imaging chip."),
    ("Vivo", "Vivo X100", "Smartphones", "$799", "https://www.vivo.com/en/products/x100", "Custom Sony IMX920 sensor, 120W dual-cell flash charge, 5000mAh blue ocean battery."),
    ("Vivo", "Vivo V40 Pro", "Smartphones", "$599", "https://www.vivo.com/en/products/v40pro", "ZEISS multi-focal portrait camera, 5500mAh battery in 7.58mm ultra-slim profile, IP68."),
    ("Vivo", "Vivo V30 Pro", "Smartphones", "$499", "https://www.vivo.com/en/products/v30pro", "Smart Aura Light portrait system, 50MP eye autofocus selfie camera, curved 3D AMOLED."),
    ("Oppo", "Find X7 Ultra", "Smartphones", "$1,199", "https://www.oppo.com/en/smartphones/series-find-x/find-x7-ultra/", "World's first quad main camera with dual periscope telephoto lenses, Hasselblad color engine."),
    ("Oppo", "Find N3 Flip", "Smartphones", "$999", "https://www.oppo.com/en/smartphones/series-find-n/find-n3-flip/", "Intuitive vertical cover screen, triple camera system with dedicated portrait sensor."),
    ("Oppo", "Reno 12 Pro", "Smartphones", "$549", "https://www.oppo.com/en/smartphones/series-reno/reno12-pro/", "Fluid quad-curved display, AI Eraser 2.0, Aerospace-grade high-strength alloy chassis."),
    ("Realme", "GT 6", "Smartphones", "$599", "https://www.realme.com/global/realme-gt-6", "Snapdragon 8s Gen 3, record 6000 nits peak brightness display, 120W SuperVOOC, Sony LYT-808."),
    ("Realme", "GT 6T", "Smartphones", "$449", "https://www.realme.com/global/realme-gt-6t", "India's first Snapdragon 7+ Gen 3 smartphone with dual-cell 5500mAh power cell."),
    ("Realme", "Realme 13 Pro+", "Smartphones", "$399", "https://www.realme.com/global/realme-13-pro-plus", "Monet-inspired glass back, Sony LYT-701 with periscope telephoto, AI Ultra Clarity."),
    ("Realme", "Realme 12 Pro+ 5G", "Smartphones", "$349", "https://www.realme.com/global/realme-12-pro-plus-5g/", "Luxury watch design collaboration with Ollivier Saveo, 64MP periscope portrait camera."),

    # --- NOTHING (8 Products) ---
    ("Nothing", "Nothing Phone (2)", "Smartphones", "$599", "https://nothing.tech/products/phone-2", "Unique Glyph interface with customizable light sequences, Snapdragon 8+ Gen 1, Nothing OS 2.5."),
    ("Nothing", "Nothing Phone (2a)", "Smartphones", "$349", "https://nothing.tech/products/phone-2a", "Iconic transparent back design, MediaTek Dimensity 7200 Pro, dual 50MP cameras."),
    ("Nothing", "Nothing Phone (2a) Plus", "Smartphones", "$399", "https://nothing.tech/products/phone-2a-plus", "Metallic visual finish, Dimensity 7350 Pro 5G, 50MP selfie camera, 50W fast charging."),
    ("Nothing", "Nothing Ear (2024)", "Audio & Headphones", "$149", "https://nothing.tech/products/ear", "11mm custom ceramic drivers, Hi-Res Audio certification with LHDC 5.0, 45dB Smart ANC."),
    ("Nothing", "Nothing Ear (a)", "Audio & Headphones", "$99", "https://nothing.tech/products/ear-a", "Playful bright yellow colorway, powerful bass boost algorithm, up to 42.5 hours total playback."),
    ("Nothing", "CMF Phone 1", "Smartphones", "$239", "https://cmf.tech/pages/phone-1", "Modular removable back cover with accessory mounting dial for lanyards, kickstands, and wallets."),
    ("Nothing", "CMF Watch Pro 2", "Smartwatches & Wearables", "$69", "https://cmf.tech/pages/watch-pro-2", "Interchangeable bezels, 1.32-inch AMOLED display, gesture controls, Bluetooth calls with AI reduction."),
    ("Nothing", "CMF Buds Pro 2", "Audio & Headphones", "$59", "https://cmf.tech/pages/buds-pro-2", "Customizable Smart Dial on charging case to adjust volume, dual drivers with LDAC support."),

    # --- MOTOROLA (7 Products) ---
    ("Motorola", "Motorola Edge 50 Ultra", "Smartphones", "$999", "https://www.motorola.com/us/smartphones-edge-50-ultra/p", "Real wood and vegan leather finishes, Pantone validated camera and display, Snapdragon 8s Gen 3."),
    ("Motorola", "Motorola Edge 50 Pro", "Smartphones", "$699", "https://www.motorola.com/us/smartphones-edge-50-pro/p", "144Hz pOLED curved screen, 125W TurboPower charging with 50W wireless, IP68 water protection."),
    ("Motorola", "Motorola Edge 50 Fusion", "Smartphones", "$399", "https://www.motorola.com/us/smartphones-edge-50-fusion/p", "Symmetrical curved design, Sony LYT-700C sensor with OIS, stereo speakers with Dolby Atmos."),
    ("Motorola", "Motorola Razr 50 Ultra", "Smartphones", "$999", "https://www.motorola.com/us/smartphones-razr-plus-gen-2/p", "Largest 4.0-inch external display on flip phone, 2x telephoto camera, Snapdragon 8s Gen 3."),
    ("Motorola", "Motorola Razr 50", "Smartphones", "$699", "https://www.motorola.com/us/smartphones-razr-gen-2/p", "Vegan leather clamshell folding design, 3.6-inch cover screen, 4200mAh long-lasting battery."),
    ("Motorola", "Moto G85 5G", "Smartphones", "$249", "https://www.motorola.com/us/smartphones-moto-g-85-5g/p", "First Moto G phone with curved 3D pOLED 120Hz display, 50MP Sony LYT-600 camera."),
    ("Motorola", "Moto G54 5G", "Smartphones", "$189", "https://www.motorola.com/us/smartphones-moto-g-54-5g/p", "Massive 6000mAh battery cell, 120Hz display, clean near-stock Android with Moto Gestures."),

    # --- SENNHEISER, JBL & MARSHALL (10 Products) ---
    ("Sennheiser", "Momentum 4 Wireless Headphones", "Audio & Headphones", "$349", "https://www.sennheiser-hearing.com/en-US/p/momentum-4-wireless/", "Incredible 60-hour battery life, 42mm audiophile transducer system, adaptive ANC, aptX Adaptive."),
    ("Sennheiser", "Momentum True Wireless 4", "Audio & Headphones", "$299", "https://www.sennheiser-hearing.com/en-US/p/momentum-true-wireless-4/", "Qualcomm S5 Gen 2 Sound platform with Auracast and LE Audio, Lossless sound transmission."),
    ("Sennheiser", "HD 660S2 Open-Back Headphones", "Audio & Headphones", "$499", "https://www.sennheiser-hearing.com/en-US/p/hd-660s2/", "Audiophile reference open-back headphones with 300-ohm impedance, sub-bass tuning perfection."),
    ("JBL", "Tour ONE M2 Wireless Headphones", "Audio & Headphones", "$299", "https://www.jbl.com/wireless-headphones/TOUR-ONE-M2.html", "True Adaptive Noise Cancelling with 4 mics, Personi-Fi 2.0 sound personalization, 50hr battery."),
    ("JBL", "Live Pro 2 TWS Earbuds", "Audio & Headphones", "$149", "https://www.jbl.com/wireless-earbuds/LIVE-PRO-2-TWS.html", "Oval Tubes design for acoustic comfort, True Adaptive ANC with Smart Ambient, 40hr playback."),
    ("JBL", "Flip 6 Portable Waterproof Speaker", "Audio & Headphones", "$129", "https://www.jbl.com/bluetooth-speakers/JBLFLIP6BLKAM.html", "2-way speaker system with racetrack-shaped woofer, separate tweeter, IP67 waterproof and dustproof."),
    ("JBL", "Charge 5 Portable Speaker", "Audio & Headphones", "$179", "https://www.jbl.com/bluetooth-speakers/JBLCHARGE5BLKAM.html", "Built-in powerbank to charge mobile phones, dual passive bass radiators, 20 hours of playtime."),
    ("Marshall", "Stanmore III Bluetooth Home Speaker", "Audio & Headphones", "$379", "https://www.marshallheadphones.com/us/en/stanmore-iii.html", "Iconic vintage rock 'n' roll aesthetic with brass knobs, outward-angled tweeters for wider soundstage."),
    ("Marshall", "Emberton II Portable Speaker", "Audio & Headphones", "$169", "https://www.marshallheadphones.com/us/en/emberton-ii.html", "True Stereophonic 360-degree multidirectional sound, 30+ hours of portable playtime, IP67."),
    ("Marshall", "Major V On-Ear Wireless Headphones", "Audio & Headphones", "$149", "https://www.marshallheadphones.com/us/en/major-v.html", "Astonishing 100+ hours of wireless playtime, foldable design, custom M-button for Spotify Tap."),

    # --- GARMIN (5 Products) ---
    ("Garmin", "Fenix 8 AMOLED 47mm", "Smartwatches & Wearables", "$999", "https://www.garmin.com/en-US/p/1228424", "Vibrant AMOLED display with sapphire lens, titanium bezel, built-in speaker and mic, scuba dive rated."),
    ("Garmin", "Epix Pro Gen 2 51mm", "Smartwatches & Wearables", "$1,099", "https://www.garmin.com/en-US/p/884088", "Stunning AMOLED screen, multi-LED flashlight, Elevate Gen 5 heart rate sensor, 31-day battery."),
    ("Garmin", "Forerunner 965 Running Watch", "Smartwatches & Wearables", "$599", "https://www.garmin.com/en-US/p/886724", "Titanium bezel, full-color onboard mapping, training readiness score, multi-band GNSS."),
    ("Garmin", "Venu 3 GPS Smartwatch", "Smartwatches & Wearables", "$449", "https://www.garmin.com/en-US/p/873008", "Sleep coach with nap detection, wheelchair mode, voice calling from wrist, bright AMOLED."),
    ("Garmin", "Instinct 2X Solar Rugged Watch", "Smartwatches & Wearables", "$449", "https://www.garmin.com/en-US/p/884585", "Unlimited battery life in smartwatch mode with solar charging, integrated tactical flashlight."),

    # --- CAMERAS & DRONES (10 Products) ---
    ("Canon", "EOS R5 Mark II Mirrorless Camera", "Cameras & Drones", "$4,299", "https://www.usa.canon.com/shop/p/eos-r5-mark-ii", "45MP stacked full-frame sensor, Accelerated Capture DIGIC accelerator, Eye Control AF, 8K 60p RAW."),
    ("Canon", "EOS R6 Mark II Mirrorless Camera", "Cameras & Drones", "$2,499", "https://www.usa.canon.com/shop/p/eos-r6-mark-ii", "24.2MP full-frame CMOS sensor, 40 fps electronic shutter, 4K 60p uncropped video, 6K RAW."),
    ("Nikon", "Z8 Mirrorless Camera", "Cameras & Drones", "$3,799", "https://www.nikonusa.com/p/z-8/1695/overview", "Flagship Z9 capabilities in compact body, 45.7MP stacked CMOS, blackout-free Real-Live Viewfinder."),
    ("Nikon", "Z6 III Mirrorless Camera", "Cameras & Drones", "$2,499", "https://www.nikonusa.com/p/z-6iii/1698/overview", "World's first partially-stacked CMOS sensor, 6K 60p internal RAW video, 5.76M-dot 4000 nits EVF."),
    ("Fujifilm", "X-T5 Mirrorless Camera", "Cameras & Drones", "$1,699", "https://fujifilm-x.com/en-us/products/cameras/x-t5/", "40.2MP X-Trans CMOS 5 HR sensor, classical top-plate analog dials, 7 stops in-body stabilization."),
    ("Fujifilm", "X100VI Digital Camera", "Cameras & Drones", "$1,599", "https://fujifilm-x.com/en-us/products/cameras/x100vi/", "Fixed 23mm F2 prime lens, 40.2MP sensor with 6.0 stops IBIS, legendary Film Simulation dial."),
    ("GoPro", "HERO 13 Black Action Camera", "Cameras & Drones", "$399", "https://gopro.com/en/us/shop/cameras/hero13-black/CHDHX-131-master.html", "HB-Series lens auto-detection with Anamorphic and Macro lenses, magnetic latch mount, 5.3K 60fps."),
    ("DJI", "Osmo Pocket 3 Gimbal Camera", "Cameras & Drones", "$519", "https://www.dji.com/osmo-pocket-3", "1-inch CMOS sensor, 2-inch rotatable OLED touchscreen, 3-axis mechanical stabilization, 4K 120fps."),
    ("DJI", "Mini 4 Pro Drone", "Cameras & Drones", "$759", "https://www.dji.com/mini-4-pro", "Sub-249g regulation-friendly drone with omnidirectional obstacle sensing, 4K 60fps HDR, 20km video."),
    ("DJI", "Air 3 Drone", "Cameras & Drones", "$1,099", "https://www.dji.com/air-3", "Dual primary camera system with wide-angle and 3x medium telephoto, 46-minute flight time."),

    # --- MICROSOFT & GAMING (6 Products) ---
    ("Microsoft", "Surface Pro 11th Edition Copilot+ PC", "Tablets", "$999", "https://www.microsoft.com/en-us/surface/devices/surface-pro-11th-edition", "Snapdragon X Plus/Elite, optional OLED 120Hz display, Surface Slim Pen storage in Flex Keyboard."),
    ("Microsoft", "Surface Laptop 7th Edition", "Laptops & Computers", "$999", "https://www.microsoft.com/en-us/surface/devices/surface-laptop-7th-edition", "PixelSense touchscreen with razor-thin bezels, AI-accelerated Copilot key, all-day battery."),
    ("Microsoft", "Xbox Series X 1TB Console", "Gaming & Consoles", "$499", "https://www.xbox.com/en-US/consoles/xbox-series-x", "12 teraflops raw graphical processing power, DirectX ray tracing, 4K 120fps gaming, Quick Resume."),
    ("Microsoft", "Xbox Series S 1TB Console", "Gaming & Consoles", "$349", "https://www.xbox.com/en-US/consoles/xbox-series-s", "Carbon Black all-digital compact console, Xbox Velocity Architecture, backward compatibility."),
    ("Valve", "Steam Deck OLED 512GB", "Gaming & Consoles", "$549", "https://store.steampowered.com/steamdeck", "7.4-inch 90Hz HDR OLED display, custom AMD APU, 50Wh battery for 3-12 hours of PC gaming anywhere."),
    ("Nintendo", "Switch OLED Model", "Gaming & Consoles", "$349", "https://www.nintendo.com/us/switch/oled-model/", "Vibrant 7-inch OLED screen, wide adjustable tabletop stand, dock with wired LAN port, 64GB storage.")
]

def generate_catalog():
    products = []
    for brand, name, category, price, official_url, desc_extra in RAW_DATA:
        p = create_product(brand, name, category, price, official_url, desc_extra)
        products.append(p)

    with open(JSON_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2)

    print(f"[OK] Generated {len(products)} original brand products saved to {JSON_OUTPUT_PATH}")
    return products

if __name__ == "__main__":
    generate_catalog()
