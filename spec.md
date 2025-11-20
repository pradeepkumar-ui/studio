# Offersense Platform: Functional Specification

## 1. Overview

This document outlines the functional specifications for the **Offersense Platform**, a modern airline retailing solution designed to manage the end-to-end lifecycle of offers and orders. The platform provides a comprehensive suite of tools for product definition, customer segmentation, dynamic pricing, offer construction, and controlled orchestration.

The system is organized around six core pillars of airline retailing:

1.  **Catalogue & Product Foundation:** Defining *what* can be sold.
2.  **Context & Cohorts:** Understanding *who* the customer is.
3.  **Offer Construction & Bundling:** Deciding *what package* to build.
4.  **Promotions & Offer Config:** Applying static campaigns and discounts.
5.  **Dynamic Pricing & Optimisation:** Flexing the price in real-time.
6.  **Orchestration & Exposure:** Controlling *how* offers are delivered.

---

## 2. Catalogue & Product Foundation

This layer serves as the commercial backbone of the platform, defining all sellable products and their associated attributes.

### 2.1. Flight & Fare Catalogue Service

This service manages the core flight products.

-   **Module:** **Fare Products** (`/catalog`)
    -   **Functionality:** Define commercial fare families (brands) like "Economy Flex" or "Business Saver".
    -   **Key Attributes:** Each brand has configurable rules for refundability, exchangeability, and transferability.

-   **Module:** **Fares** (`/fares`)
    -   **Functionality:** Create and manage specific base fares for a given route (e.g., JFK-LAX), price point, and currency.
    -   **Key Attributes:** Fares are linked to a Fare Basis Code (FBC), a booking class (RBD), and have defined validity dates. Version control is supported for all fare records.

-   **Module:** **Inventory** (`/inventory`)
    -   **Functionality:** Define the airline's booking classes (e.g., J, Y, M) and map them to commercial fare brands. Provides a live snapshot of availability for any given flight.

-   **Module:** **Corporate Contracts** (`/corporate`)
    -   **Functionality:** Manage negotiated fare agreements with corporate clients, effectively creating private tariffs.

-   **Module:** **Negotiated Space Agreements** (`/nsa`)
    -   **Functionality:** Manage block-space and negotiated agreements with partners, such as tour operators or other airlines.

### 2.2. Ancillary & Services Catalogue

This service manages all non-flight products that can be added to an offer.

-   **Module:** **Ancillary Pricing** (`/pricing/ancillary`)
    -   **Functionality:** A central catalogue for all à la carte ancillary products (e.g., baggage, meals, Wi-Fi, lounge access).
    -   **Key Attributes:** Each ancillary has a default price, currency, and category. The system supports segment-based pricing overrides (e.g., a different price for a specific route or channel).

-   **Module:** **Seat Pricing** (`/pricing/seat`)
    -   **Functionality:** Define seat characteristics (e.g., "Extra Legroom," "Forward Zone") and their default prices. Manage seat map configurations for different aircraft types.

### 2.3. Offer Data Management / Meta-Config

This layer contains the reference data that governs the system's logic.

-   **Module:** **Channels** (`/channels`)
    -   **Functionality:** Define and configure all sales channels, such as the airline website (Direct), TMC portals, and OTAs. Channel-specific rules and fare brand availability can be managed here.

---

## 3. Context & Cohorts

This pillar focuses on understanding the customer and their situation to enable personalization.

-   **Module:** **Cohort Management** (`/offers/cohorts`)
    -   **Functionality:** Create and manage dynamic customer segments (cohorts) based on a variety of attributes.
    -   **Key Attributes:** Definitions can be based on user's device type, point of sale, purchase history, total spend, loyalty tier, or corporate affiliation.
    -   **Usage:** These cohorts are used as conditions in the Dynamic Pricing and Bundling engines to trigger personalized offers and prices.

---

## 4. Offer Construction & Bundling

This layer is responsible for assembling a coherent set of products into a final offer.

### 4.1. Bundles Engine / Bundles Studio

-   **Module:** **Bundles Studio** (`/bundles`)
    -   **Functionality:** A user-friendly UI for product managers to create, manage, and price ancillary bundles.
    -   **Key Features:**
        -   **Component Definition:** Combine multiple ancillary products into a single, sellable package (e.g., "Comfort Pack").
        -   **Pricing Strategy:** Price bundles using a fixed discount, a percentage discount, or an absolute price.
        -   **Targeting Rules:** Define the scope for a bundle, making it available only when specific conditions (e.g., route, channel, cohort) are met.

### 4.2. Offer Construction / Composer Module

-   **Module:** **Offer Composer** (`/offer-composer`)
    -   **Functionality:** This is the core "brain" of the system and a powerful simulation tool. It orchestrates the entire offer creation process.
    -   **Key Features:**
        -   **Multi-modal Search:** Accepts both structured form-based searches and natural language queries via an AI assistant.
        -   **Dynamic Assembly:** Takes a search request and sequentially applies logic from all other modules (fares, bundles, promotions, dynamic pricing) to construct a final offer.
        -   **IATA-structured Payload:** Generates a real-time `OrderCreate` JSON payload that maintains distinct IDs for the offer and each offer item, ensuring a clean handoff to the Order Management System.
        -   **Orchestration Visualization:** The "Offer Lifecycle" card provides a real-time, visual representation of the offer's journey through the orchestration flow.

---

## 5. Promotions & Offer Config

This pillar manages the application of static campaigns and promotional discounts.

-   **Module:** **Offers Config** (`/offers`)
    -   **Functionality:** Define the primary, static offer rules and configurations that serve as the baseline for all dynamic adjustments. This includes setting validity dates, market scope, and target products.

-   **Module:** **Promotions** (`/promotions`)
    -   **Functionality:** Manage the creation and lifecycle of promotional code pools (e.g., `WINTER10`). Define usage types (single, multi-use), pool size, and expiry dates.

-   **Module:** **Campaign Management** (`/campaigns`)
    -   **Functionality:** Group offers and promotions into cohesive marketing campaigns, manage their schedules, and monitor their performance.

---

## 6. Dynamic Pricing & Optimisation

This layer is responsible for flexing the price of an offer in real-time based on a variety of inputs.

### 6.1. Static Rules-Based Pricing Engine

-   **Module:** **Dynamic Pricing Rules** (`/pricing/rules`)
    -   **Functionality:** A powerful UI for creating deterministic pricing rules. An **AI Assistant** can also be used to generate complex rules from natural language.
    -   **Inputs:** Rules can be triggered by context (route, channel), real-time signals (load factor, time to departure), customer cohort, or cart contents.
    -   **Outputs:** The engine applies price adjustments (e.g., +10%, -$50) to the base fare.

### 6.2. AI/ML Optimisation Engine

-   **Module:** **Fare Change Impact Forecast** (`/fare-change-forecast`)
    -   **Functionality:** An AI-powered tool that takes a natural language scenario (e.g., "What if we increase business class fares by 15%?") and generates a detailed forecast of the expected impact on revenue, bookings, and load factor.

-   **Module:** **Offer Optimisation** (`/optimisation`)
    -   **Functionality:** Serves as the human-in-the-loop interface for the AI engine. The **Recommendations Queue** displays proposed price adjustments or bundling strategies generated by AI models, which can then be approved or rejected by a revenue manager.
    -   The **A/B Test Centre** allows for the controlled testing and performance measurement of different pricing and offer strategies.

---

## 7. Orchestration & Exposure

This final layer provides the governance, control, and compliance checks necessary to ensure the right offer is delivered to the right channel at the right time.

-   **Module:** **Change Management Dashboard** (`/orchestration`)
    -   **Functionality:** A central hub for governing all configuration changes. It provides a formal workflow for submitting, reviewing, approving, and publishing any change to a rule or product, ensuring stability and auditability.

-   **Module:** **Compliance** (`/compliance`)
    -   **Functionality:** A "compliance-as-a-service" module that validates every offer against a set of policy packs before it is exposed.
    -   **Features:** The **Gate Monitor** tracks pass/block rates across the offer lifecycle, while the **Decision Inspector** allows for a full audit of the compliance checks for any specific offer.

-   **Module:** **Capacity Management** (`/capacity`)
    -   **Functionality:** Manages the volume of offers exposed to the market to protect against overselling and manage system load.
    -   **Features:** Allows for the configuration of hard **Caps** (max offers), **Quotas** (channel distribution), and **Pacing** (rate limiting).