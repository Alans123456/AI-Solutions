import { Link } from "react-router-dom";
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Solution</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              AI features for the products you already use, plus complete
              AI-first products built from idea to launch.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/about"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Services
              </Link>
              <Link
                to="/projects"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                to="/events"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Events
              </Link>
              <Link
                to="/careers"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Careers
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Web Development</p>
              <p className="text-muted-foreground text-sm">Mobile Apps</p>
              <p className="text-muted-foreground text-sm">Cloud Solutions</p>
              <p className="text-muted-foreground text-sm">
                AI & Machine Learning
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  hello@aisolution.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  123 Tech Street, Silicon Valley
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            (c) 2024 AI Solution. All rights reserved. |
            <Link to="/privacy" className="hover:text-foreground ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link to="/terms" className="hover:text-foreground ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
