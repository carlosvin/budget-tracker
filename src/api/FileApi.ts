
export class FilesApi {

    static async getFileContent(file: File) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve, reject) => {
            // TODO remove the cast to any when following is fixed: https://github.com/Microsoft/TypeScript/issues/299#issuecomment-168538829
            reader.onload = (ev: ProgressEvent) => resolve((ev as any).target.result); 
            reader.onerror = reject;
        });
        reader.readAsText(file);
        return promise;
    }
}
