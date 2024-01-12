import { Strings } from "src/resources";

export function calculateTotalExternalCost(itineraryData) {
    let totalExternalCost = itineraryData?.editedCost || 0;
    (!itineraryData?.editedCost) &&
        itineraryData?.day?.forEach(day => {
            day?.event?.forEach(event => {
                event?.service?.forEach(service => {
                    if (service.externalCost && !isNaN(parseFloat(service.externalCost))) {
                        totalExternalCost += service?.pricePerPerson === true ? parseFloat(service.externalCost) * Number(itineraryData?.participants) : parseFloat(service.externalCost);
                    }
                });
            });
        });
    return totalExternalCost;
}
export function calculateTotalInternalCost(itineraryData) {
    let totalInternalCost = 0;

    itineraryData?.day?.forEach(day => {
        day?.event?.forEach(event => {
            event?.service?.forEach(service => {
                if (service.internalCost && !isNaN(parseFloat(service.internalCost))) {
                    totalInternalCost += service?.pricePerPerson === true ? parseFloat(service.internalCost) * Number(itineraryData?.participants) : parseFloat(service.internalCost);
                }
            });
        });
    });

    return totalInternalCost;
}

export function getFormatEuroPrice(price: number) {
    return new Intl.NumberFormat('en-DE', { minimumFractionDigits: 2 }).format(price)
}

// if % not available than add % symbol 
export function handleAddPercentageSymbol(strData: string) {
    const getLastElement = strData.split('').pop()
    if (getLastElement !== Strings.percentage) {
        return strData + Strings.percentage
    }
    else {
        return strData
    }
}