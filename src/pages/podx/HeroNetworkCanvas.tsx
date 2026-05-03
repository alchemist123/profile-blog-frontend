import { useEffect, useRef } from "react";

const N = 55;
const CONN_DIST = 160;

export function HeroNetworkCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let W = 0;
        let H = 0;
        let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

        const resize = () => {
            const p = canvas.parentElement;
            if (!p) return;
            W = p.clientWidth;
            H = p.clientHeight;
            canvas.width = W;
            canvas.height = H;
        };

        const initNodes = () => {
            nodes = Array.from({ length: N }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.5 + 0.8,
            }));
        };

        let raf = 0;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
            }
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < CONN_DIST) {
                        const a = (1 - d / CONN_DIST) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(124,58,237,${a})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            for (const n of nodes) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(167,139,250,0.45)";
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        initNodes();
        raf = requestAnimationFrame(draw);
        const ro = new ResizeObserver(() => {
            resize();
            initNodes();
        });
        ro.observe(canvas.parentElement!);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden />;
}
