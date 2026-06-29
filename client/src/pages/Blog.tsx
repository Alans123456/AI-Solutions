import { useEffect, useState } from "react";
import { Calendar, Clock, User, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getBlogPosts, BlogPost } from "@/api/blog";
import { useToast } from "@/hooks/useToast";

const categories = [
  "All",
  "Technology",
  "Cloud Computing",
  "Mobile Development",
  "AI/ML",
];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching blog posts...");
        const response = (await getBlogPosts()) as { posts: BlogPost[] };
        setPosts(response.posts);
        setFilteredPosts(response.posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error",
          description: "Failed to load blog posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, posts]);

  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen py-20 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-[600px] mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900/60 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-48 bg-slate-200 dark:bg-gray-800/60 rounded mb-4" />
                    <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-slate-200 dark:bg-gray-800/60 rounded-xl animate-pulse"></div>
              <div className="h-48 bg-slate-200 dark:bg-gray-800/60 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Stay updated with the latest trends, insights, and best practices in
            software development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Featured post */}
            {featuredPost && (
              <Card className="mb-12 overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
                <div className="relative">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(
                          featuredPost.publishDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link to={`/blog/${featuredPost._id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regular posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <Card
                  key={post._id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link to={`/blog/${post._id}`}>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </h3>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Categories
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "ghost"
                      }
                      className={`w-full justify-start ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent posts */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Posts
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post._id}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular tags */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Popular Tags
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap((post) => post.tags)))
                    .slice(0, 10)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        onClick={() => setSearchTerm(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
