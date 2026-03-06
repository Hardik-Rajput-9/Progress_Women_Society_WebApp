"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { galleryApi } from "@/lib/api";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryApi.getAll();
        // Only set images if data is actually an array
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error("API did not return an array:", data);
          setImages([]); // Default to empty array on weird responses
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Ensure images is an array before mapping
  const categories = useMemo(() => {
    if (!Array.isArray(images)) return ["All"];
    const uniqueCategories = Array.from(
      new Set(images.map((img) => img.category)),
    );
    return ["All", ...uniqueCategories];
  }, [images]);

  const filteredImages = Array.isArray(images)
    ? images.filter(
        (img) => activeCategory === "All" || img.category === activeCategory,
      )
    : [];

  return (
    <div className="min-h-screen bg-background pb-20 pt-28">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <ImageIcon className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Our <span className="text-accent">Gallery</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A visual journey of our community, our initiatives, and the lives
            we've touched together.
          </p>
        </motion.div>

        {/* Dynamic Category Filters */}
        {!isLoading && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  activeCategory === category
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-card text-muted-foreground border border-border hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Masonry-style Image Grid */}
      <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No images uploaded yet.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-3xl bg-muted aspect-square sm:aspect-auto sm:h-80 border border-border shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">
                      {img.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
