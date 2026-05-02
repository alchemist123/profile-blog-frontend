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
        { name: "PodX", path: "/podx" },
        { name: "Logs", path: "/blog" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0B1015]/80 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold font-mono tracking-tight text-slate-200 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-blue-500">~/</span>amal-vs
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => {
                        const active =
                            link.path === "/podx"
                                ? location.pathname.startsWith("/podx")
                                : location.pathname === link.path;
                        return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-mono uppercase tracking-widest transition-colors hover:text-emerald-400 ${active ? "text-emerald-500" : "text-slate-500"
                                }`}
                        >
                            {link.name}
                        </Link>
                        );
                    })}
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5" asChild>
                        <a href="https://github.com/alchemist123" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10" asChild>
                        <a href="https://www.linkedin.com/in/amal-v-s-948079200/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10" asChild>
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
                            <Button variant="ghost" size="icon" className="text-slate-300">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-[#0B1015] border-l border-white/5">
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <a
                                        href="https://github.com/alchemist123"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/amal-v-s-948079200/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded bg-white/5 text-slate-300 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="mailto:amal.vs.engineer@gmail.com"
                                        className="p-2 rounded bg-white/5 text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </div>
                                <div className="flex flex-col gap-4">
                                {navLinks.map((link) => {
                                    const active =
                                        link.path === "/podx"
                                            ? location.pathname.startsWith("/podx")
                                            : location.pathname === link.path;
                                    return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-lg font-mono tracking-widest uppercase flex items-center gap-3 p-3 rounded-lg ${active ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:bg-white/5"
                                            }`}
                                    >
                                        <span className="text-slate-600">~/</span> {link.name}
                                    </Link>
                                    );
                                })}
                                </div>
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
        <footer className="py-8 md:py-0 border-t border-white/5 bg-[#0B1015] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-[11px] font-mono tracking-widest uppercase text-slate-500 md:text-left flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Amal V S <span className="text-slate-800">|</span> System Architect
                </p>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5" asChild>
                        <a href="https://github.com/alchemist123" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <Github className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10" asChild>
                        <a href="mailto:amal.vs.engineer@gmail.com" title="Email">
                            <Mail className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-400 hover:bg-blue-400/10" asChild>
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
        <div className="min-h-screen bg-[#0B1015] font-sans antialiased flex flex-col text-slate-300">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
