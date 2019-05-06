import { History } from "history";

export function slugify(str: string) {
    const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
    const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
    const p = new RegExp(a.split('').join('|'), 'g');
    return str.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');
}

export function dateDiff(from: Date, to: Date) {
    return Math.round((to.getTime() - from.getTime())/(1000*60*60*24));
}

export const goBack = (history: History) => {
    if (history.length > 2) {
        history.goBack();
    } else {
        history.replace('/');
    }
}

export function timestampToDate(timestamp: number) {
    return new Date(timestamp).toDateString();
}