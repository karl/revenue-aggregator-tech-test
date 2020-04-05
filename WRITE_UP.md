# Write Up

I approached this tech test in the same way as I approach most work tasks.

## Get a stable base with tooling

- Ensure code is in source control.
- Get the build stable and error free. This involved commenting out most tests and the unused `formatNumber` function.
- Add basic tooling to increase productivity (in this case Prettier for automatic code formatting).
- Get a release pipeline up and running and check the code releases smoothly. For this project I used `zeit.co`. It has built in support for Create React App, so no modifications were required for the project.

## Get a simple version working end to end

- Simple skeleton code to load data from the server and display it. This lets me validate that I understand the requirements and know how all parts from UI to server side need to work.
- The skeleton code made it clear to me that the requirements were missing error handling, which I added in.
- Add in a very simple logging framework that makes it easy to debug the app during development. Given extra time this would hide console logs by default (by using `console.debug`) and would send warnings and errors to a server (or something like Sentry).
- Add a quick workaround for the custom font not working (I didn't have time to debug the root cause).


## Finish the feature

- Next up a finished the requirements by adding filtering.
- This necessitated moving the total calculation from within the data fetching logic to per render.


## Add testing

- The last step was to add testing (or in this case uncomment and fix up the unit tests).
- This took longer than expected (causing me to run over the expected 60 minutes) as the tests didn't work with React hooks.
- I also tweaked some test implementations to better match how I had built the UI:
  - Loading and error states are within the table (not replacing the table). This helps stop the UI jumping around while loading.
  - Product `id` is used as the React key, rather than the name. I generally prefer to use ids for keys instead of names, as it isn't unusual for names to end up being duplicated.


## Release

- `zeit.co` automatically deploys the latest code pushed to master, so as my changes were pushed they were automatically released.

The deployed code can be found here:

https://revenue-aggregator-tech-test.now.sh/
