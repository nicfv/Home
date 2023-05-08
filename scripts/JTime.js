export class JTime {
    /**
     * Parse a time in seconds to determine number of days, hours, minutes, and seconds.
     * @param {number} t The length of time in seconds
     */
    static parse(t) {
        t = Math.abs(t);
        return {
            s: t % 60,
            m: Math.floor(t / 60) % 60,
            h: Math.floor(t / (60 * 60)) % (60 * 60),
            d: Math.floor(t / (60 * 60 * 24)) % (60 * 60 * 24),
        };
    }
    /**
     * Format a time `t` in seconds to the format `DD:HH:MM:SS`
     * @param {number} t The length of time in seconds
     * @returns A formatted string
     */
    static format(t) {
        const parsed = this.parse(t);
        let formatted = parsed.m.toString().padStart(2, '0') + ':' + parsed.s.toString().padStart(2, '0');
        if (parsed.h || parsed.d) {
            formatted = parsed.h.toString().padStart(2, '0') + ':' + formatted;
            if (parsed.d) {
                formatted = parsed.d.toString().padStart(2, '0') + ':' + formatted;
            }
        }
        return formatted;
    }
}