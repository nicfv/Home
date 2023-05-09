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

    /**
     * Convert Meters to Miles
     * @param {number} m Meters
     * @returns Miles
     */
    static mtomi(m) {
        return m / 1609.3;
    }

    /**
     * Convert meters per second to miles per hour
     * @param {number} mps Meters/sec
     * @returns Miles/hour
     */
    static mpstoMPH(mps) {
        return mps * 3600 / 1609.3;
    }

    /**
     * Convert Hectopascals to Standard Atmospheres
     * @param {number} hPa Hectopascals
     * @returns Standard Atmospheres
     */
    static hPatoATM(hPa) {
        return hPa / 1013.25;
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