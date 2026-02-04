import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Amal V S
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-4 w-[1px] bg-border" />
                    <Button variant="ghost" size="icon" asChild>
                        <a href="https://github.com/alchemist123" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href="https://www.linkedin.com/in/amal-v-s-948079200/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href="mailto:amal.vs.engineer@gmail.com" title="Email">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                        </a>
                    </Button>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-4 mt-8">
                                <a
                                    href="https://github.com/alchemist123"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Github className="h-5 w-5" /> GitHub
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/amal-v-s-948079200/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Linkedin className="h-5 w-5" /> LinkedIn
                                </a>
                                <a
                                    href="mailto:amal.vs.engineer@gmail.com"
                                    className="flex items-center gap-2 text-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Mail className="h-5 w-5" /> Email
                                </a>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-lg font-medium ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

const Footer = () => {
    return (
        <footer className="py-6 md:px-8 md:py-0 border-t">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by Amal V S.
                </p>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <a href="https://github.com/alchemist123" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <Github className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href="mailto:amal.vs.engineer@gmail.com" title="Email">
                            <Mail className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href="https://www.linkedin.com/in/amal-v-s-948079200/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </footer>
    )
}

const Layout = () => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
