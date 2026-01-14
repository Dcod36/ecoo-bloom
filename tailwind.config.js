/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                accent: 'hsl(var(--accent))',
                'text-main': 'hsl(var(--text-main))',
                'text-muted': 'hsl(var(--text-muted))',
                background: 'hsl(var(--background))',
                surface: 'hsl(var(--surface))',
            },
            fontFamily: {
                'outfit': ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
        },
    },
    plugins: [],
}
