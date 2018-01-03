
export class Interpolation {
    public id: string;
    public method: string;
    public property1: string;
    public property2: string;
    public domElement: any;


    constructor(attribute: string, domElement: any) {
        var splitResult = attribute.split('$$');
        this.method = splitResult[0];
        this.property1 = splitResult[1];
        this.property2 = splitResult[2];
        this.id = this.getGuid();
        this.domElement = domElement;
    }

    public Has2Properties(): boolean {
        return !(this.property2 == null || this.property2 == '');
    }

    private getGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

