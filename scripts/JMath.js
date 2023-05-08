export class JMath {
    /**
     * Convert Kelvin to Celsius
     * @param {number} K Kelvin
     * @returns Celsius
     */
    static KtoC(K) {
        return K - 273.15;
    }

    /**
     * Convert Kelvin to Fahrenheit
     * @param {number} K Kelvin
     * @returns Fahrenheit
     */
    static KtoF(K) {
        return 1.8 * this.KtoC(K) + 32;
    }

    static clamp(n = 0, min = 0, max = 0) {
        if (n < min) {
            return min;
        }
        if (n > max) {
            return max;
        }
        return n;
    }
}