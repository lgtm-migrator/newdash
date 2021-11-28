import * as assert from "assert";
import camelCase from "../src/camelCase";
import each from "../src/each";

describe("camelCase", () => {

  it("should work with numbers", () => {
    assert.strictEqual(camelCase("12 feet"), "12Feet");
    assert.strictEqual(camelCase("enable 6h format"), "enable6HFormat");
    assert.strictEqual(camelCase("enable 24H format"), "enable24HFormat");
    assert.strictEqual(camelCase("too legit 2 quit"), "tooLegit2Quit");
    assert.strictEqual(camelCase("walk 500 miles"), "walk500Miles");
    assert.strictEqual(camelCase("xhr2 request"), "xhr2Request");
  });

  it("should handle acronyms", () => {

    each(["safe HTML", "safeHTML"], (string) => {
      assert.strictEqual(camelCase(string), "safeHtml");
    });

    each(["escape HTML entities", "escapeHTMLEntities"], (string) => {
      assert.strictEqual(camelCase(string), "escapeHtmlEntities");
    });

    each(["XMLHttpRequest", "XmlHTTPRequest"], (string) => {
      assert.strictEqual(camelCase(string), "xmlHttpRequest");
    });

  });
});
