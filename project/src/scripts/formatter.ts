export class Formatter {
    public static MilisecondsToDateString(miliseconds : number) : string {
            const date = new Date(miliseconds);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
    }

    public static NumberToMonetaryString(value : number) : string {
        if(typeof value !== 'number') {
            return `Invalid value`
        }

        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}