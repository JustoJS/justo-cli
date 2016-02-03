//imports
const path = require("path");
const Dir = require("justo-fs").Dir;
const file = require("justo-assert-fs").file;
const Generator = require("../../../dist/es5/nodejs/justo-cli/lib/PackageJsonGenerator").default;

//suite
describe("PackageJson", function() {
  const DATA_DIR = "test/unit/data";

  describe("#generate()", function() {
    const generate = Generator.generate;
    const DIR = new Dir(Dir.TMP_DIR, Date.now());

    beforeEach(function() {
      DIR.create();
    });

    afterEach(function() {
      DIR.remove();
    });

    it("generate(file)", function() {
      generate(path.join(DIR.path, "package.json"));
      file(DIR.path, "package.json").must.exist();
    });
  });
});
