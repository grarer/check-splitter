# Check Splitter

When my family goes out to eat, usually one person pays the check and then sends Cash App requests for each other person's share. This is a little web-app tool to calculate each person's contribution and split the taxes, fees, and tips proportionally to each person's share of the subtotal. For items belonging to multiple people, the cost is split evenly between them - useful when the whole table shares an appetizer, or two out of four people split a pizza.

[Click to open](https://grarer.github.io/check-splitter/)

This app was made with Preact, MUI, and Google's Material Icons. It uses Dinero.js for the money calculations; shout-out to the lovely @kanwren for recommending it to me, and for her very correct opinions on the fairest way to allocate extra cents.

## dev commands

-   `npm run dev` - Starts a dev server at http://localhost:5173/

-   `npm run host` - Starts a dev server at http://localhost:5173/ and exposes it to the network (useful for testing on mobile!)

-   `npm run build` - Builds for production, emitting to `dist/`. Prerenders app to static HTML

-   `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally
