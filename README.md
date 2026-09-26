# SafeCity Link

**Secure emergency communication for resilient cities**

SafeCity Link is a local, browser-based simulation of an emergency communications network for a smart city. It demonstrates how emergency messages can be routed around damaged infrastructure and how a suspicious device can be isolated from the network.

> **Prototype only:** SafeCity Link is an educational simulation. It does not connect to real emergency services, wireless equipment, or live city data.

## The challenge

Disasters such as floods can damage communication infrastructure just when hospitals, emergency vehicles, fire services, sensors, and city authorities need to coordinate. A single failed link can interrupt a message if the network has no alternate route. A compromised device can also produce misleading or excessive traffic.

## What the prototype demonstrates

- A 12-node simulated wireless mesh with a city control center, hospital, ambulance, fire station, shelter, relay nodes, and environmental sensors.
- Emergency alerts sent from a selected service to the control center.
- Latency-based route selection using Dijkstra's algorithm. Routes avoid inactive and quarantined nodes.
- Flood and network failure scenarios that change the topology and trigger route recalculation.
- A simulated cyberattack that raises a relay's traffic, lowers its trust score, and quarantines it.
- Live network metrics, route visualization, and an event timeline.

## Try the demo

1. Select **Send emergency alert** and send a message from the ambulance. The chosen route is highlighted on the map.
2. Press **Simulate Flood**. Several links become unavailable, a sensor goes offline, and the route is recalculated.
3. Press **Simulate Cyber Attack**. Relay Charlie's traffic becomes abnormal, its trust score falls below the threshold, and the node is quarantined.
4. Press **Reset simulation** to restore the original 12-node network.

The **Network Failure** control separately takes Relay Bravo offline. Scenarios can be explored without refreshing the page.

## How the simulation works

### Network and routing

All topology and scenario data live in the browser. Links have simulated latency and availability. Dijkstra's algorithm finds a lowest-latency path from an emergency source to City Control. Offline and quarantined nodes are excluded from route calculations.

### Trust and anomaly response

Nodes have a trust score from 0 to 100 and a normal simulated traffic rate. The attack scenario sets Relay Charlie's traffic to 180 packets per minute against a 15 packets per minute baseline, then sets its trust score to 24. The simulation quarantines nodes below a trust score of 30. These simple deterministic rules are explained in `src/simulation.js` and `src/App.jsx`; they are not a production intrusion detection system.

### Metrics

Health, packet delivery, latency, traffic, and event times are illustrative simulation values. They do not represent measured network performance.

## SDG 11 connection

UN Sustainable Development Goal 11 focuses on inclusive, safe, resilient, and sustainable cities and communities. SafeCity Link relates specifically to disaster resilience and continuity of critical services. It demonstrates one possible technological approach; this prototype does not solve SDG 11.

## Technology

- React 18
- Vite 2
- JavaScript
- CSS and inline SVG for the network graph
- Lucide React icons

No backend, database, broker, cloud service, physical wireless hardware, or external API is required.

## Run locally

Requires Node.js and npm. From the project directory, run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To create a production build:

```bash
npm run build
```

## Limitations

- This is a software simulation, not a deployed emergency communications system.
- It does not communicate with physical wireless hardware or real emergency services.
- Network metrics and node traffic are simulated.
- Cyberattack detection is a demonstration mechanism, not a production IDS.
- The topology is predefined and has no geographic map or live telemetry.

## Future work

- Geographic city maps and configurable topologies
- Integration with real IoT sensors and network telemetry
- LoRa/LoRaWAN or private LTE/5G connectivity
- Edge computing for local decision-making
- More realistic and evaluated security detection
