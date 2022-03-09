/* eslint-disable */
// Otherwise webpack fails silently
// https://github.com/facebook/create-react-app/issues/8014

import {exposePyodide, loadPyodideAndPackage, makeRunnerCallback} from "../lib";
import * as Comlink from "comlink";
import {ExposeSyncExtras} from "comsync";
const packageUrl = require("url-loader!./package.tar").default;

const pyodidePromise = loadPyodideAndPackage({url: packageUrl, format: "tar"})
Comlink.expose({
  test: exposePyodide(pyodidePromise,
    (extras: ExposeSyncExtras, pyodide: any, code: string, inputCallback: any, outputCallback: any) => {
      const callback = makeRunnerCallback(extras, {
        input: inputCallback,
        output: outputCallback,
      });
      const runner = pyodide.pyimport("python_runner").Runner();
      runner.set_callback(callback);
      runner.run(code);
      return "success";
    }),
});