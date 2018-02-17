export class ClassUtil {
    static getClassName(item: any) {
        let name: string;
        try {
            name = item.prototype.constructor.name;
        } catch (e) {
            name = item.prototype.constructor.toString().match(/\w+/g)[1];
        }
        return name;
    }
}
