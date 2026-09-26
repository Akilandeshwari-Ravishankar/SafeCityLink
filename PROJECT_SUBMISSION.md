## Inspiration

SafeCity Link was inspired by a practical question: **How can essential city services stay connected when a disaster disrupts the network?** During a flood or infrastructure failure, emergency responders, hospitals, sensors, and city authorities still need to coordinate. The project explores how a wireless mesh could reroute messages around damaged links and isolate devices behaving abnormally.

## What it does

SafeCity Link simulates a 12-node smart-city communication network. Users can send emergency alerts, trigger flood or network failure scenarios, and watch routes recalculate around unavailable infrastructure. A cyberattack scenario increases a relay's traffic, lowers its trust score, and quarantines it from routing. The dashboard displays network status, simulated metrics, routes, and an event timeline.

## How we built it

We built the prototype with React, JavaScript, Vite, and CSS. The network graph uses inline SVG, and all simulation data runs locally in the browser. Dijkstra's algorithm selects a low-latency route to the control center while avoiding inactive or quarantined nodes. Trust scores and anomaly detection use simple deterministic rules.

## Challenges we ran into

We needed to make network changes easy to understand during a short demo while keeping the simulation simple and dependable. We also had to ensure that failed links and quarantined nodes affect route selection, and that reset returns the network to its original state.

## Accomplishments that we're proud of

We created a working, interactive prototype that combines emergency messaging, route recovery, disaster scenarios, and simulated threat response in one dashboard. The demo can show a message rerouting after a flood and a suspicious node being isolated without requiring a backend or physical hardware.

## What we learned

We learned how graph routing can demonstrate network resilience, and how trust thresholds can model a basic security response. We also learned to distinguish a useful prototype from a production system: the metrics and threat detection here are illustrative, not real network measurements or operational security.

## What's next for SafeCityLink

Next, we'd like to add geographic city maps, configurable network layouts, and more realistic simulations. Future versions could explore real sensor telemetry, LoRa/LoRaWAN or private LTE/5G connectivity, edge computing, and more thoroughly evaluated intrusion detection.

SafeCity Link is a prototype demonstrating one technological approach toward urban resilience and the disaster-resilience aspects of UN SDG 11.
