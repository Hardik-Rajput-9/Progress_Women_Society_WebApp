"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { postsApi } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsApi.getAll();

        // Only set posts if the backend actually returned an array
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("API did not return an array of posts:", data);
          setPosts([]); // Fallback to an empty array so .map() never crashes
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Extra safety: ensure posts is an array before we try to check length or map over it
  const safePosts = Array.isArray(posts) ? posts : [];

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
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Updates & <span className="text-accent">Stories</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay up to date with our latest initiatives, success stories, and
            the impact your contributions are making.
          </p>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : safePosts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No posts published yet. Check back soon!
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {safePosts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-accent/50"
              >
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-accent backdrop-blur-sm shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.createdAt).toLocaleDateString("en-IN")}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {post.author || "Admin Team"}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-primary transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center font-bold text-accent">
                    Read Full Story
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
