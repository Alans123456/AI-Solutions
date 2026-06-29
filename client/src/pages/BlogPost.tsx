import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBlogPost,
  getBlogPosts,
  BlogPost as BlogPostType,
} from "@/api/blog";
import { useToast } from "@/hooks/useToast";

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const postResponse = await getBlogPost(id);

        setPost(postResponse.post);

        try {
          const postsResponse = await getBlogPosts();
          const related = postsResponse.posts
            .filter(
              (p) => p._id !== id && p.category === postResponse.post.category,
            )
            .slice(0, 3);
          setRelatedPosts(related);
        } catch (relatedError) {
          console.error("Error fetching related blog posts:", relatedError);
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const shareUrl = window.location.href;
  const shareTitle = post?.title || "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 bg-white dark:bg-gray-900/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-8"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-96 mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center bg-white dark:bg-gray-900/80">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back button */}
        <Link
          to="/blog"
          className="relative z-20 inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors pointer-events-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <article className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {/* Featured image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                {post.category}
              </Badge>
            </div>
          </div>

          {/* Article content */}
          <div className="p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Article content */}
            <div
              className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share buttons */}
            <div className="flex items-center space-x-4 pt-8 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareLinks.facebook, "_blank")}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareLinks.twitter, "_blank")}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareLinks.linkedin, "_blank")}
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </article>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost._id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost._id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
