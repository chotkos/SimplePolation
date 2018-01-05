import { Interpolation } from './model/Interpolation';
import * as $ from 'jquery';

export class SimplePolationInstance {
    private domElement: any;
    private interpolationElements: Array<Interpolation> = [];

    constructor(domSelector = "body") {
        this.domElement = $(domSelector);
    }

    public run(context: any) {
        $(this.domElement).find('[sp]').each((i, e) => {
            this.interpolationElements.push(new Interpolation($(e).attr('sp'), e));
        });

        this.attachEventHandlers(context);
    }

    private setContextValue(path: string, context: any, value: any) {
        let extraContext = {
            setContextValueValue: value
        };
        let o = this.evalWithLog(path + '=setContextValueValue', context, extraContext);
        o = value;
        /*const pathSplit = path.split('.');
        let resultContext = context;
         
        pathSplit.forEach((e, i) => {
            if (i == pathSplit.length - 1) {
                resultContext[e] = value;
            } else {
                resultContext = resultContext[e];
            }
        });*/
    }

    private evalWithLog(text: any, context: any, extraContext?: any): any {
        let result = null;

        if (extraContext) {
            Object.keys(extraContext).forEach(function (key, index) {
                context[key] = extraContext[key];
            });
        }

        try {
            result = this.evalInContext(text, context);
        } catch (e) {
            throw new Error('Failed to evaluate pharse "' + text + '"');
        }
        return result;
    }



    private evalInContext(text: string, context: any): any {
        function evalSafely(text: string): any {
            let pre = '';
            Object.keys(context).forEach(function (key, index) {
                pre += "var " + key + " = this." + key + ";";
            }); 
            return eval(pre + text);
        }


        return evalSafely.call(context, text);
    }

    private setWatchOnContextValue(path: string, context: any, callback: any) {
        const pathSplit = path.split('.');
        let resultContext = context;
        pathSplit.forEach((e, i) => {
            if (i == pathSplit.length - 1) {
                resultContext.watch(e, callback);
            } else {
                resultContext = resultContext[e];
            }
        });
    }

    private attachEventHandlers(context: any) {

        this.interpolationElements.forEach((e, i) => {

            $(e.domElement).change(() => {
                if (!e.Has2Properties()) {
                    var newValue = ($(e.domElement) as any)[e.method]();
                    this.setContextValue(e.property1, context, newValue);
                } else {
                    var newValue = ($(e.domElement) as any)[e.method](e.property2);
                    this.setContextValue(e.property2, context, newValue);
                }
            });

            if (!e.Has2Properties()) {
                //ie = interpolation element! 
                this.setWatchOnContextValue(e.property1, context, (field: any, old: any, cur: any, ie = e) => {
                    $(ie.domElement)[ie.method](cur);
                    return cur;
                });

            } else {
                //ie = interpolation element! 
                this.setWatchOnContextValue(e.property2, context, (field: any, old: any, cur: any, ie = e) => {
                    $(ie.domElement)[ie.method](ie.property1, cur);
                    return cur;
                });
            }
        });
    }

}
