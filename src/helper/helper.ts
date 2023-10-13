
export class Helper{
    public static GetRandomNumber(num:number, base:number) {
        return Math.floor(Math.random() * num) + base;
    }

    public static TimeoutPromise(ms:number) {
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve(true);
            }, ms);
        });        
    }

}