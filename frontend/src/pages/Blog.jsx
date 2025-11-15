import React from 'react'
import Title from '../components/Title'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Car Sharing: Trends to Watch in 2025",
      excerpt: "Discover the latest innovations transforming the car rental industry and what they mean for consumers.",
      author: "Emily Rodriguez",
      date: "November 10, 2024",
      category: "Industry Trends",
      image: "/hero.png"
    },
    {
      id: 2,
      title: "Electric Vehicles: A Complete Guide for First-Time Renters",
      excerpt: "Everything you need to know about renting and driving electric vehicles, from charging to range anxiety.",
      author: "Michael Chen",
      date: "November 5, 2024",
      category: "Electric Vehicles",
      image: "/banner.png"
    },
    {
      id: 3,
      title: "How to Choose the Perfect Car for Your Road Trip",
      excerpt: "Essential tips for selecting the right vehicle based on your destination, group size, and driving style.",
      author: "Sarah Johnson",
      date: "October 28, 2024",
      category: "Travel Tips",
      image: "/auto.png"
    },
    {
      id: 4,
      title: "Business Travel Made Easy: Corporate Rental Solutions",
      excerpt: "Streamline your company's travel logistics with our comprehensive business rental programs.",
      author: "David Park",
      date: "October 20, 2024",
      category: "Business Travel",
      image: "/hero.png"
    },
    {
      id: 5,
      title: "Sustainable Mobility: Reducing Your Carbon Footprint",
      excerpt: "Learn how choosing the right rental vehicle can contribute to environmental conservation.",
      author: "Lisa Thompson",
      date: "October 15, 2024",
      category: "Sustainability",
      image: "/banner.png"
    },
    {
      id: 6,
      title: "Airport Rental Secrets: Insider Tips from Industry Experts",
      excerpt: "Navigate airport car rentals like a pro with these expert recommendations and time-saving strategies.",
      author: "James Wilson",
      date: "October 8, 2024",
      category: "Travel Tips",
      image: "/auto.png"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Blog" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Autoria Blog</h1>
            <p className="text-xl text-gray-600">Insights, tips, and stories from the world of car rentals</p>
          </div>

          {/* Featured Post */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="text-primary text-sm font-semibold mb-2">{blogPosts[0].category}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h2>
                <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                <div className="text-sm text-gray-500 mb-4">
                  By {blogPosts[0].author} • {blogPosts[0].date}
                </div>
                <a 
                  href="#"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-primary text-sm font-semibold mb-2">{post.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    By {post.author} • {post.date}
                  </div>
                  <a 
                    href="#"
                    className="text-primary hover:underline font-semibold"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-primary text-white rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6">Subscribe to our newsletter for the latest car rental tips and industry insights</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog