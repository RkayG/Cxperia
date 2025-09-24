import RotatingText from '@/components/RotatingText';
import CircularGallery from '@/components/CircularGallery';

export default function DesignedForSection() {
  return (
    <section className="w-full bg-[#e9c0e9] flex flex-col items-center py-16 px-4">
      <div className="mb-8 flex justify-between flex-row items-center">
        <span className='text-4xl text-[#4d2d7c] mr-3 max-w-md md:text-5xl bricolage-grotesque font-extrabold  leading-tight'>Designed for </span>
        <RotatingText
          texts={["Cosmetic Brands", "Brands Who Care", "Skincare Brands", "Haircare Brands", "Wellness Brands", "Beauty Brands"]}
          mainClassName="px-4 md:px-6 bg-[#DC143C] text-white  bricolage-grotesque overflow-hidden py-2 justify-center rounded-lg text-2xl md:text-3xl font-bold shadow-lg"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.04}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={3000}
        />
      </div>
      <div style={{ height: '600px', width: '100%', maxWidth: '1200px', position: 'relative' }}>
        <CircularGallery
          items={[
            { image: 'https://images.unsplash.com/photo-1627471279204-be3a98555819?auto=format&fit=crop&w=800&q=80', text: '' }, // Face cream/moisturizer
            { image: 'https://images.unsplash.com/photo-1614271630985-1d4e0e2d5c34?auto=format&fit=crop&w=800&q=80', text: '' }, // Lotion bottle
            { image: 'https://images.unsplash.com/photo-1608625902127-d4e511470487?auto=format&fit=crop&w=800&q=80', text: '' }, // Powder compact
            { image: 'https://images.unsplash.com/photo-1596700877918-028a07c1b3f9?auto=format&fit=crop&w=800&q=80', text: '' }, // Makeup brushes
            { image: 'https://images.unsplash.com/photo-1555529094-1a482cc90899?auto=format&fit=crop&w=800&q=80', text: '' }, // Lipstick
            { image: 'https://images.unsplash.com/photo-1612267568576-a006bfd92837?auto=format&fit=crop&w=800&q=80', text: '' }, // General skincare products
            { image: 'https://images.unsplash.com/photo-1606132789178-5a02422709e1?auto=format&fit=crop&w=800&q=80', text: '' }, // Foundation bottle
            { image: 'https://images.unsplash.com/photo-1596466982855-32130e61d858?auto=format&fit=crop&w=800&q=80', text: '' } // Hair care products
          ]}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </section>
  );
}