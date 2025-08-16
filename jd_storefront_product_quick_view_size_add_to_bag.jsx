import React from "react";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle,
  X,
  Plus,
  Minus,
} from "lucide-react";

// --- Types ---
interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  image: string; // primary
  images: string[]; // gallery
}

// --- Sample Images (royalty‑free Unsplash placeholders) ---
const IMG = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542293787938-c9e299b88054?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603808033174-05f3f4fa1bd6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528701800489-20be3c2ea4f1?q=80&w=1200&auto=format&fit=crop",
];

const PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i + 1}`,
  brand: ["Nike", "adidas", "New Balance", "PUMA"][i % 4],
  name: ["Air Max 270", "Ultraboost 5", "574 Core", "RS-X³"][i % 4],
  price: 899 + (i % 3) * 100,
  rating: 4 + (i % 2),
  image: IMG[i % IMG.length],
  images: [IMG[i % IMG.length], IMG[(i + 1) % IMG.length], IMG[(i + 2) % IMG.length], IMG[(i + 3) % IMG.length]],
}));

const CATEGORIES = [
  { label: "New In" },
  { label: "Men" },
  { label: "Women" },
  { label: "Kids" },
  { label: "Footwear" },
  { label: "Clothing" },
  { label: "Accessories" },
  { label: "Brands" },
  { label: "Sale" },
];

// --- Header / Shell (shortened) ---
function TopPromoBar() {
  return (
    <div className="bg-black text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" aria-hidden />
        <span>Free delivery over 700 DKK · Free returns in 28 days</span>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <button className="lg:hidden p-2" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-6 w-6" />
          </button>
          <a href="#" className="font-black text-2xl tracking-tight">JD<span className="text-black/50">clone</span></a>
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 border rounded-2xl px-3 py-2">
            <Search className="h-5 w-5" />
            <input className="w-full bg-transparent outline-none text-sm" placeholder="Search for brands, products and more" />
          </div>
          <nav className="flex items-center gap-3">
            <a href="#" className="hidden md:inline-flex items-center gap-2 text-sm"><User className="h-5 w-5"/>Account</a>
            <a href="#" className="hidden md:inline-flex items-center gap-2 text-sm"><Heart className="h-5 w-5"/>Wishlist</a>
            <a href="#" className="inline-flex items-center gap-2 text-sm"><ShoppingBag className="h-5 w-5"/>Bag<span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[11px]">2</span></a>
          </nav>
        </div>
        <div className="hidden lg:flex h-12 items-center gap-6 text-sm font-medium">
          {CATEGORIES.map((c) => (
            <a key={c.label} href="#" className="inline-flex items-center gap-1 hover:text-black/70"><span>{c.label}</span><ChevronDown className="h-4 w-4"/></a>
          ))}
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 grid gap-2">
            {CATEGORIES.map((c) => (
              <a href="#" key={c.label} className="py-2 border-b last:border-none" onClick={() => setOpen(false)}>{c.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < value ? "fill-black" : ""}`} />
      ))}
    </div>
  );
}

// --- Quick View Modal ---
function SizeButton({ label, disabled, selected, onClick }: { label: string; disabled?: boolean; selected?: boolean; onClick?: () => void; }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`h-10 rounded-lg border px-3 text-sm font-medium ${selected ? "bg-black text-white" : "bg-white"} ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-50"}`}
    >
      EU {label}
    </button>
  );
}

function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [size, setSize] = React.useState<string | null>(null);
  const sizes = React.useMemo(() => ["38","39","40","41","42","43","44","45","46","47"].map((s, i) => ({ s, inStock: i % 7 !== 1 })), []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="absolute inset-0 m-auto h-[90vh] w-[95vw] max-w-6xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex h-full flex-col md:flex-row">
          {/* Gallery */}
          <div className="md:w-1/2 border-r bg-white">
            <div className="relative aspect-square w-full">
              <img src={product.images[activeIdx]} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2 p-3">
              {product.images.map((src, i) => (
                <button key={i} className={`relative aspect-square overflow-hidden rounded-lg border ${i===activeIdx?"ring-2 ring-black":""}`} onClick={() => setActiveIdx(i)}>
                  <img src={src} alt={`${product.name} ${i+1}`} className="absolute inset-0 h-full w-full object-cover"/>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-5 md:p-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-black/60">{product.brand}</div>
                <h2 className="text-xl font-black leading-tight">{product.name}</h2>
                <div className="mt-1 flex items-center gap-3">
                  <Rating value={product.rating} />
                  <span className="text-sm text-black/60">{product.rating}.0</span>
                </div>
              </div>
              <button aria-label="Close" onClick={onClose} className="rounded-lg p-2 hover:bg-zinc-100"><X className="h-5 w-5"/></button>
            </div>

            <div className="mt-3 text-2xl font-bold">{product.price} DKK</div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Select Size</span>
                <a href="#" className="text-xs underline">Size guide</a>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {sizes.map(({ s, inStock }) => (
                  <SizeButton key={s} label={s} disabled={!inStock} selected={size===s} onClick={() => setSize(s)} />
                ))}
              </div>
              {!size && <p className="mt-2 text-xs text-rose-600">Please choose a size to continue.</p>}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border">
                <button className="p-2" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q-1))}><Minus className="h-4 w-4"/></button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button className="p-2" aria-label="Increase" onClick={() => setQty((q) => Math.min(10, q+1))}><Plus className="h-4 w-4"/></button>
              </div>
              <button disabled={!size} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${size?"bg-black text-white hover:opacity-90":"bg-zinc-200 text-zinc-500"}`}>
                Add to Bag
              </button>
              <button className="rounded-xl border px-3 py-3" aria-label="Save"><Heart className="h-5 w-5"/></button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5"/>
                <div>
                  <div className="font-semibold">Fast, tracked delivery</div>
                  <div className="text-black/60">Order by 2PM for same‑day Click & Collect.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5"/>
                <div>
                  <div className="font-semibold">Secure checkout</div>
                  <div className="text-black/60">Encrypted payments with major providers.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5"/>
                <div>
                  <div className="font-semibold">Easy returns</div>
                  <div className="text-black/60">28‑day return policy. Free in‑store returns.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-black/70">
              <p>Product code: <span className="font-mono">{product.id.toUpperCase()}</span></p>
              <p className="mt-2">Upper: Textile & synthetic. Outsole: Rubber. Colour shown may vary with screen settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Product Card & Grid ---
function ProductCard({ p, onOpen }: { p: Product; onOpen: (p: Product) => void }) {
  return (
    <div className="group border rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
      <div className="relative">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black text-white text-xs px-2 py-1">New</span>
        <button onClick={() => onOpen(p)} className="block w-full text-left">
          <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
            <img src={p.image} alt={`${p.brand} ${p.name}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          </div>
        </button>
      </div>
      <div className="p-3">
        <div className="text-xs text-black/60">{p.brand}</div>
        <button onClick={() => onOpen(p)} className="block text-sm font-semibold leading-tight mt-0.5 hover:underline">{p.name}</button>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold">{p.price} DKK</span>
          <Rating value={p.rating} />
        </div>
        <button onClick={() => onOpen(p)} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm font-semibold group-hover:bg-black group-hover:text-white transition-colors">Select size</button>
      </div>
    </div>
  );
}

function ProductGrid({ onOpen }: { onOpen: (p: Product) => void }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Trending Now</h2>
            <p className="text-sm text-black/60">Most-loved picks this week</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <a href="#" className="font-black text-2xl">JD<span className="text-white/50">clone</span></a>
          <p className="mt-3 text-sm text-white/70 max-w-xs">A demo storefront UI inspired by JD. Replace placeholders with your content.</p>
        </div>
        <div>
          <div className="text-sm font-semibold">Help</div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} JDclone Demo</span>
          <span>Built for preview</span>
        </div>
      </div>
    </footer>
  );
}

export default function JDStorefrontWithQuickView() {
  const [openProduct, setOpenProduct] = React.useState<Product | null>(null);
  return (
    <div className="min-h-screen bg-white text-black">
      <TopPromoBar />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="uppercase tracking-widest text-[11px] text-white/70">JD Exclusive</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-black leading-tight">Fresh drops for late summer</h1>
            <p className="mt-4 text-white/80 max-w-prose">Tap any product below to pick your size.</p>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-[radial-gradient(circle_at_30%_30%,#ffffff22,transparent_50%),radial-gradient(circle_at_70%_70%,#ffffff11,transparent_50%)] border border-white/10" />
        </div>
      </section>

      <ProductGrid onOpen={setOpenProduct} />
      <Footer />

      {/* Quick View Modal */}
      <QuickView product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
