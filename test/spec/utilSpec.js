define(
    [
        "util"
    ],
    function(util) {

        describe("storage", function () {

            it("storage is supported", function () {
                expect(util.storage.isSupported()).toBe(true);
            });

        });

        describe("math", function() {

            it("verify range of getRandom with difficulty 1", function() {
                var min = 1/3 - 0.000001;
                var max = 2/3;
                expect(util.math.getRandom(1)).toBeLessThan(max);
                expect(util.math.getRandom(1)).toBeGreaterThan(min);
            });

            it("verify range of getRandom with difficulty 2", function() {
                var min = 1/4 - 0.000001;
                var max = 3/4;
                expect(util.math.getRandom(2)).toBeLessThan(max);
                expect(util.math.getRandom(2)).toBeGreaterThan(min);
            });

            it("verify range of getRandom with difficulty 3", function() {
                var min = -0.000001;
                var max = 1;
                expect(util.math.getRandom(3)).toBeLessThan(max);
                expect(util.math.getRandom(3)).toBeGreaterThan(min);
            });

        });

    }
);
