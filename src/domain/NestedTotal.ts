import { ObjectMap } from "../api";

declare type IndexType = number|string;

export class NestedTotal {
    private _total: number;
    private _subTotals: ObjectMap<NestedTotal>;

    constructor(){
        this._total = 0;
        this._subTotals = {};
    }

    add(n: number, subTotalIndexes?: IndexType[]): number{
        this._total += n;
        const subTotal = this._getSubTotal(subTotalIndexes);
        subTotal && subTotal.add(n, subTotalIndexes);
        return this._total;
    }

    subtract(n: number, subTotalIndexes?: IndexType[]): number {
        return this.add(-n, subTotalIndexes);
    }

    private _getSubTotal(subTotalIndexes?: IndexType[]): NestedTotal|undefined {
        if (subTotalIndexes !== undefined) {
            const index = subTotalIndexes.shift();
            if (index !== undefined) {
                if (!(index in this._subTotals)) {
                    this._subTotals[index] = new NestedTotal();
                }
                return this._subTotals[index];
            }
        }
        return undefined;
    }

    get total() {
        return this._total;
    }

    get avg() {
        return this._total / Object.keys(this._subTotals).length;
    }

    getSubtotal(indexes: IndexType[]): number {
        const index = indexes.shift();
        if (index !== undefined) {
            if (index in this._subTotals) {
                return this._subTotals[index].getSubtotal(indexes);
            } else {
                return 0;
            }
        }
        return this.total;
    }

    getAverage(indexes: IndexType[]): number {
        const index = indexes.shift();
        if (index !== undefined) {
            if (index in this._subTotals) {
                return this._subTotals[index].getAverage(indexes);
            } else {
                return 0;
            }
        }
        return this.avg;
    }

    get indexes () {
        return Object.keys(this._subTotals);
    }
}
