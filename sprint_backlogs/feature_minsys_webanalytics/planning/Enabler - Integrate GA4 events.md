
You are a Web analytics expert. You Will we advise me first as my objective is  to implement the analytics instrumentation of my website I'm laurent, the owner of Minsys . You have access to the codebase of the website here - this is the only source of truth . 

/workspace/minsys-storefront-xyz-codebases/minsys-xyz-prototype-v0-codebase


As you can see my "conversions" aren't sales (Minsys does not sell products, or services) instead they are "user's points of interest". I want to know if users are actually consuming my content or trying to reach out. If you deep dive into the code, you will see that I already instrumented with GA4,  but this is not configured at all in the Google analytics corresponding property / app. This is actually a vanilla configuration and this is why I'm coming to you today. I heard that you can leverage a GA mcp. So I drafted a high level project spec for you to understand what I'm looking for :

------------------------------

## Project Specification: GA4 Event Implementation

1. Project Overview

- Primary Goal: Measure what is the user interested in Minsys main page and Talent page via granular engagement tracking. This is for benchmarking Minsys positionning as the website is brand new.
- Scope: Two pages (Main Landing Page + Talent/Hiring Page).

1. Core Tracking Requirements
I require full instrumentation of all interactive elements. Specifically, I need the following "Custom Events" configured in GA4

- Global Navigation: Tracking clicks on all Header and Footer links
- Tab Interactions: On both pages, track when a user switches between content tabs
- Call-to-Action (CTA) Buttons: Every button that leads to a section or a contact form.
- In particular for the talent page, I want to track if users are more interested in the "Open Positions", and which one,  or the "General Application"?

Note : A "lead" for minsys is a user that engages with the website in a way that can can be through any clickable element on the page. A prospect is a "lead" that submits a form (Partner, apply)

1. Reporting

As the business owner my high level expectation is to having a custom report dashboard that consolidates all analytics data as I need to understand the "user" journey.

I'm ready for your questions. Please outline a detailled plan in a dedicated markdown file  that you will save in /workspace/minsys-storefront-xyz-backlogs/minsys-xyz-prototype-v0-backlog/feature_minsys-web-analytics/ . 
