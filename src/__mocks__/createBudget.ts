import { DateDay } from "../domain/DateDay";
import { Budget } from "../api";
import { uuid } from "../domain/utils/uuid";

export function createBudget (budget: Partial<Budget> = {}, days = 30): Budget {
    const {from, to, identifier, total, currency, name} = budget;
    const today = days % 2 === 0 ? 1 : 0;
    const halfDays = Math.floor(days/2);
    return { 
        currency: currency || 'EUR',
        from: from || new DateDay().addDays(-halfDays).timeMs,
        to: to || new DateDay().addDays(halfDays - today).timeMs,
        identifier: identifier || uuid(),
        name: name || 'Test',
        total: total || 1000
    };
}
