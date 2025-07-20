import { describe, it, expect } from "@jest/globals";
import { getAnimationForPath } from "~/AnimatedBackground";

describe("getAnimationForPath", () => {
  it("should return dna for home page", () => {
    expect(getAnimationForPath("/en")).toBe("dna");
    expect(getAnimationForPath("/en/")).toBe("dna");
    expect(getAnimationForPath("/")).toBe("dna");
    expect(getAnimationForPath("")).toBe("dna");
  });

  it("should return torusKnot for about page", () => {
    expect(getAnimationForPath("/en/about")).toBe("torusKnot");
    expect(getAnimationForPath("/about")).toBe("torusKnot");
  });

  it("should return stars for contact page", () => {
    expect(getAnimationForPath("/en/contact")).toBe("stars");
    expect(getAnimationForPath("/contact")).toBe("stars");
  });

  it("should return polyhedron for blog page", () => {
    expect(getAnimationForPath("/en/blog")).toBe("polyhedron");
    expect(getAnimationForPath("/blog")).toBe("polyhedron");
  });

  it("should return dna for career page", () => {
    expect(getAnimationForPath("/en/career")).toBe("dna");
    expect(getAnimationForPath("/career")).toBe("dna");
  });

  it("should return torusKnot for resume page", () => {
    expect(getAnimationForPath("/en/resume")).toBe("torusKnot");
    expect(getAnimationForPath("/resume")).toBe("torusKnot");
  });

  it("should return stars for admin pages", () => {
    expect(getAnimationForPath("/en/admin")).toBe("stars");
    expect(getAnimationForPath("/admin")).toBe("stars");
  });

  it("should handle nested blog paths", () => {
    expect(getAnimationForPath("/en/blog/some-post")).toBe("polyhedron");
    expect(getAnimationForPath("/blog/category/tech")).toBe("polyhedron");
  });

  it("should handle nested admin paths", () => {
    expect(getAnimationForPath("/en/admin/users")).toBe("stars");
    expect(getAnimationForPath("/admin/settings")).toBe("stars");
  });

  it("should handle dna-related paths", () => {
    expect(getAnimationForPath("/en/dna-test")).toBe("dna");
    expect(getAnimationForPath("/dna-analysis")).toBe("dna");
  });

  it("should default to dna for unknown paths", () => {
    expect(getAnimationForPath("/en/unknown")).toBe("dna");
    expect(getAnimationForPath("/random-path")).toBe("dna");
  });
});
