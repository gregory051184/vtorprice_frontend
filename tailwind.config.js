/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./features/**/*.{js,ts,jsx,tsx}",
        "./shared/**/*.{js,ts,jsx,tsx}",
        "./widgets/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            black: "#000000",
            white: {
                DEFAULT:"#FFFFFF",
                "90":"rgba(255, 255, 255, 0.9)",
                "80":"rgba(255, 255, 255, 0.8)",
                "70":"rgba(255, 255, 255, 0.7)",
                "60":"rgba(255, 255, 255, 0.6)",
                "50":"rgba(255, 255, 255, 0.5)",
                "40":"rgba(255, 255, 255, 0.4)",
                "30":"rgba(255, 255, 255, 0.3)",
                "20":"rgba(255, 255, 255, 0.2)",
                "10":"rgba(255, 255, 255, 0.1)",
            },
            grey: {
                DEFAULT:"#2B2E2E",
                "90":"#2B2E2E",
                "80":"#434747",
                "70":"#5C6061",
                "60":"#767A7A",
                "50":"#8E9394",
                "40":"#A8ADAD",
                "30":"#C1C6C7",
                "20":"#DEE0E0",
                "10":"#F5F7F7",
            },
            background: {
                "grey": "#F5F5F5",
                "white":"#FFFFFF",
                "90": "rgba(245, 245, 245, 0.9)",
                "70": "rgba(245, 245, 245, 0.7)"
            },
            primaryGreen: {
                "dark": "#2F8063",
                "main": "#399977",
                "light": "#42B38B",
            },
            secondaryGreen: {
                "dark": "rgba(57, 153, 119, 0.45)",
                "main": "rgba(57, 153, 119, 0.3)",
                "light": "rgba(57, 153, 119, 0.1)",
            },
            specialGreen: {
                DEFAULT:"#399977",
            },
            red: {
                "dark": "#FF2C52",
                "main": "rgba(255, 44, 82, 0.6)",
                "light": "rgba(255, 44, 82, 0.1)",
            },
            specialRed: {
                DEFAULT:"#FF2C52",
            },
            orange: {
                "dark": "#FFA048",
                "main": "rgba(255, 160, 72, 0.6)",
                "light": "rgba(255, 160, 72, 0.1)",
            },
            yellow: {
                "2x-dark": '#FFB72C',
                "dark": "#FFF27E",
                "main": "rgba(255, 242, 126, 0.6)",
                "light": "rgba(255, 242, 126, 0.1)",
            },
            green: {
                "dark": "#00BC8E",
                "main": "rgba(0, 188, 142, 0.6)",
                "light": "rgba(0, 188, 142, 0.1)",
            },
            blue: {
                "2x-dark" : '#368AEE',
                "dark": "#2EFFF2",
                "main": "rgba(46, 255, 242, 0.6)",
                "light": "rgba(46, 255, 242, 0.1)",
            },
            deep_blue: {
                "dark": "#4664FF",
                "main": "rgba(70, 100, 255, 0.6)",
                "light": "rgba(70, 100, 255, 0.1)",
            },
            violet: {
                "dark": "#7C5BFF",
                "main": "rgba(124, 91, 255, 0.6)",
                "light": "rgba(124, 91, 255, 0.1)",
            },
            pink: {
                "dark": "#FF49AB",
                "main": "rgba(255, 73, 171, 0.6)",
                "light": "rgba(255, 73, 171, 0.1)",
            },

        },
        boxShadow:{
          DEFAULT:"0px 10px 20px rgba(0, 0, 0, 0.05)"
        },
        backdropBlur:{
            DEFAULT: "15px"
        },
        extend: {},
    },
    plugins: [],
}
