# Log viewer

https://log-viewer-liard.vercel.app

Standard Next.js setup - use `npm run dev` to start the dev server.

(_Just in case_ - yes, the readme is completely human written.)

## Scope

- Table
  - Severity, Time, Body, Resource, Service (Name, Version) columns
  - Expandable log rows showing log record's attributes
  - Nested togglable grouping
  - Virtual scroll
- Histogram
  - Stacking bars
  - 1h intervals

## Decisions

- Taking into account the amount of time allocated for the target functionality decided to fully rely on the OS libs where possible and prioritize feature-richness over code quality. But at the same time decided to have 2 side goals:
  - Make columns list easily extendable and and have an ability to make it easily togglable in the future. Also, have an ability in the future to filter, sort the data in an easy way.
  - Experiment with nested groups and reflect the grouping state in table and on the histogram.
- Code quality compromises and arch drawbacks
  - Used the concept of the `software as tree` with further responsibility distribution
    - `trunk`(arch, tools/libs selection, data-flow etc.) is on human
    - `branches`(code organization, modules interaction, base types, performance bottlenecks, etc.) is heavily supervised and lead by human
    - `leafs`(styling, composition, data processing algorithms (easy and not bottlenecks), etc.) is lightly supervised
  - Functional extendability and performance mostly limited by the "data processing engine" which is currently completely based on the Tan-stack Table. In a real world scenario for a product with such a complexity it would be unacceptable and require writing a hand-made one.
- With such goals and limitations in mind had made these tradeoffs/decisions
  - Next.js
    - Benefits: lightweight deployment, performance, familiarity.
    - Out of scope: SSR, env checks
  - Tailwind
    - Benefits: LLMs' support, out of the box design tokens
  - ShadCN
    - Benefits: complete ownership over the base UI components lib, good extendable primitives, outsource of basic design decisions, headless
    - Out of scope: testing
  - Tan-stack table
    - **Note**: used it as a "data processing engine" instead of just a solution for making tables.
    - Benefits
      - outsource of all heavy lifting for grouping, expanding, column definitions, data pipeline, etc.
      - good enough performance and data processing solutions
      - headless
    - Tradeoffs:
      - Not the best achievable performance because of the data pipelining nature and focus on the table rendering
      - "Vendor-locking" on the lib primitives(rows, columns) even where it was unnecessary
    - Out of scope: broad surface of filtering, sorting, columns resizing/pinning/sorting, etc.
  - OTLP types
    - Note: consciously used them as a base and only lightly composed to the needed structures
    - Benefits: no need to generate types and have a adapter level
    - Out of scope: schema versioning/validation, input validation
  - Tan-stack virtual
    - Benefits
      - State of the art performance and abstraction for huge grids rendering(from my perspective)
      - Ability in the future to use it for the horizontal axis
  - Tan-stack query
    - Benefits: easy handling of the loading states, retries, caching
    - Out of scope: proper error handling
  - ECharts
    - Benefits: known performance, flexibility, out of the box features for stacking charts, sliding window, data merging. etc.
    - **Note**:Hooked it to the already grouped(and potentially filtered) data from the Tan-stack Table, so currently, the histogram is conceptually not a standalone widget, but a derivative from the table state.
  - Heavy LLMs usage
    - Cursor ACP
    - Ref.tools for docs
    - Inlining rules ad hoc instead of creating a set of rules (because of the target timeframe)
  - Almost no CI and auto-testing
    - Used battle-tested primitives and mostly configured them to work together, so the primitives are "semi" tested
    - Drawbacks: cannot be sure that everything works as expected; next LLM change can break a lot
- What I would do differently for the real prod app with high standards of quality
  - Mostly do almost all data processing on the server side and send to the client only what's necessary
  - Lazily load facets, body, and other parts, but it depends on particular case
  - Save the most part of filtering/grouping/view-state to the URL
  - Rely much less or don't rely at all on the table dependency
  - Auto-test everything
  - Don't rely on the API types (only if BFF ones) and have a adapter level
  - Much more heavy AI setup
  - Most likely, make client-side computations(like some aggregations) in batches
  - Use WS or interval pooling to get updated data, and some technics to avoid re-rendering of the whole tree(like data merging feature in ECharts, but it's open question how to do that properly for me)
- Extra notes
  - Added ids for resources only to satisfy the requirement for grouping by resource, but aimed to be able to group by any custom column
