/*
 * require.main.filename =>  filename of the main module
 * (main module is the script that was run when the Node.js process was started(app.js)  )
 * path.dirname => extracts the directory path of a file name
 * Exports the directory name of the main modules filename(app.js)
 */
const path = require("path");
module.exports = path.dirname(require.main.filename);
