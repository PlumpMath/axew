# axew
Desktop game engine built on three.js and Electron

This is a project being worked on as a hobby, to learn how game engines work.

# Setup instructions
1. Install [node.js](https://nodejs.org/en/). Installing via [nvm](https://github.com/creationix/nvm) is highly recommended. Any version of node starting from v6 will do. 
2. Clone the project.
3. Run `npm install`.
4. After this, you can run any of the `npm` commands to get started. For a complete list of commands, see [this section](#npm-commands).

# npm commands
- `npm start` - Run a local dev server at `localhost:8000`, which automatically reloads on a change in the source. See [webpack dev server](https://webpack.js.org/guides/development/#webpack-dev-server) docs for more information. Once the page opens, click on `dist/` to open the game in Chrome(any modern webGL enabled browser would also work).
- `npm run desktop-dev` - Run the code using `electron` on your local machine
- `npm run package` - Packages the actual game into production-ready, redistridutable packages for all supported platforms

