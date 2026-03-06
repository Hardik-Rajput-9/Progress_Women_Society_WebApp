"use client";

import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import { Trash2, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    postsApi.getAll().then(setPosts).catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Manage Blog & Updates
        </h1>
        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-bold hover:brightness-105"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={post.imageUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-primary">{post.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.category} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(post.id)}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
