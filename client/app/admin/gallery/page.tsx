"use client";

import { useEffect, useState } from "react";
import { galleryApi } from "@/lib/api";
import { Trash2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    galleryApi
      .getAll()
      .then((data) => {
        // Only set state if the API actually returned an array!
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error("API returned non-array:", data);
          setImages([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load gallery:", err);
        setImages([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await galleryApi.delete(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // Double-check safeguard before rendering
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Manage Gallery</h1>
        <Link
          href="/admin/gallery/create"
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-bold hover:brightness-105 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Image
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : safeImages.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          No images in your gallery yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safeImages.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Delete button overlay - Appears on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transform hover:scale-110 transition-all shadow-lg"
                  title="Delete Image"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              {/* Label overlay - Always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-2 px-3">
                <p className="text-white text-sm font-bold truncate">
                  {img.title}
                </p>
                <p className="text-accent text-xs font-semibold truncate">
                  {img.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
