"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StarRating } from "./StarRating";
import { BadgeCheck, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewSectionProps {
  productId: string;
}

interface ReviewStats {
  average: number;
  total: number;
  distribution: Array<{ stars: number; count: number; percentage: number }>;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  customer: { id: string; name: string } | null;
  createdAt: string;
}

interface ReviewListResult {
  reviews: Review[];
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const { data: rawStats } = useQuery(
    trpc.reviews.getStats.queryOptions({ productId })
  );
  const stats = rawStats as unknown as ReviewStats | undefined;

  const { data: rawReviews, isLoading: reviewsLoading } = useQuery(
    trpc.reviews.getByProduct.queryOptions({ productId, limit: 10 })
  );
  const reviewsData = rawReviews as unknown as ReviewListResult | undefined;

  const createReview = useMutation({
    ...trpc.reviews.create.mutationOptions(),
    onSuccess: () => {
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
      setError("");
      queryClient.invalidateQueries();
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setError("");
    createReview.mutate({
      productId,
      rating,
      title: title || undefined,
      body: body || undefined,
    });
  };

  return (
    <div>
      {/* Stats header */}
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Average score */}
        <div className="flex-shrink-0 text-center md:text-left">
          <div className="text-5xl font-bold">{stats?.average || 0}</div>
          <StarRating rating={Math.round(stats?.average || 0)} size="md" />
          <p className="mt-1 text-sm text-muted-foreground">
            {stats?.total || 0} review{(stats?.total || 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const dist = stats?.distribution.find((d) => d.stars === star);
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 text-right text-sm text-muted-foreground">
                  {star}★
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dist?.percentage || 0}%` }}
                    transition={{ duration: 0.5, delay: (5 - star) * 0.1 }}
                    className="h-full rounded-full bg-amber-400"
                  />
                </div>
                <span className="w-8 text-sm text-muted-foreground">
                  {dist?.count || 0}
                </span>
              </div>
            );
          })}
        </div>

        {/* Write review button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">Write a Review</h3>

              {error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onChange={setRating}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="review-title" className="mb-1.5 block text-sm font-medium">
                  Title <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Sum it up in a few words"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="review-body" className="mb-1.5 block text-sm font-medium">
                  Review <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="review-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={createReview.isPending}
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                >
                  {createReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      <div className="mt-8">
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : reviewsData && reviewsData.reviews.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {review.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <BadgeCheck className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    {review.title && (
                      <h4 className="mt-2 font-semibold">{review.title}</h4>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{review.customer?.name || "Anonymous"}</p>
                    <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {review.body && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed py-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
