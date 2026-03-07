---
name: spec-to-code
description: Translates .feature files into implementation. Use when a new spec is provided.
---
# Instructions
1. **Parse**: Read the `.feature` file in `/specs`.
2. **Boilerplate**: Generate the Cucumber Step Definitions first.
3. **Implementation**: Build the minimal code required to pass the "Given/When/Then" steps.
4. **Componentization**: If UI is involved, create a corresponding `.stories.tsx` in Storybook.