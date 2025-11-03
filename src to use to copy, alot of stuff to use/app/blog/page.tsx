import { BlogList } from '@/components/blog/blog-list';
import { BlogHero } from '@/components/blog/blog-hero';
import { BlogCategories } from '@/components/blog/blog-categories';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <BlogHero />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <BlogList />
            </div>
            <div className="lg:col-span-1">
              <BlogCategories />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}