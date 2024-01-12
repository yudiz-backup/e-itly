import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getRecoil } from 'recoil-nexus';
import { toast } from 'react-toastify';

// query
import { addExportBd, updateExportBd } from 'src/Query/Itinerary/itinerary.mutation';
import queryClient from 'src/queryClient';

// recoil state
import { accountAtom } from 'src/recoilState/account';

import { getFormatEuroPrice, handleAddPercentageSymbol } from 'src/utils/calculation';
import { cartasiData } from 'src/constants/generics';
import { hasError } from 'src/services/ApiHelpers';
import { getDateRange } from 'src/utils/date';
import { Strings } from 'src/resources';
import * as XLSX from 'xlsx';


function useItineraryExportBDModal({ exportData, eventModalCloseHandler, itineraryData }: useItineraryExportBDModalType) {

    const { control, handleSubmit, reset } = useForm();

    const account = getRecoil<AccountType | undefined>(accountAtom);

    const [radioValue, setRadioValue] = useState(Strings.percentage);

    const itineraryId = itineraryData?.id
    const agentCommissionData = itineraryData?.agent?.agentCommission

    //add Export Bd
    const addExportBdMutation = useMutation(addExportBd, {
        onSuccess: (data) => {
            onSuccessModal(data)
        },
        onError: (error) => {
            onErrorModal(error)
        },
    });

    //update Export Bd
    const updateExportBdMutation = useMutation(updateExportBd, {
        onSuccess: (data) => {
            onSuccessModal(data)
        },
        onError: (error) => {
            onErrorModal(error)
        },
    });

    function handleResetField(cartasiResetField, agentCommissionResetField) {
        reset({
            cartasi: cartasiResetField,
            agentCommission: agentCommissionResetField || agentCommissionData,
            // agencyAddress: agencyAddress
        })
    }

    function handleRemoveSymbol(data) {
        return data?.substr(0, data?.length - 1)
    }

    function handleGetCartasiSymbol(cartasi) {
        return cartasi?.charAt(cartasi?.length - 1)
    }

    function handleCloseExportBdModal() {
        eventModalCloseHandler();
        handleResetField('', '')
    }

    function getExportBdSuccessModal(data) {
        const cartasi = data?.cartasi
        handleResetField(handleRemoveSymbol(cartasi), data?.agentCommission)
        setRadioValue((handleGetCartasiSymbol(cartasi) || Strings.percentage))
    }

    function onSuccessModal(data) {
        queryClient.invalidateQueries(['getExportBd'])
        toast.success(data?.message);
        handleCloseExportBdModal()

        const cartasi = data?.data?.cartasi
        const agentCommission = data?.data?.agentCommission
        const agentCommissionSubStr = handleRemoveSymbol(agentCommission)

        if (cartasi?.length) {
            handleExportBD(cartasi, agentCommissionSubStr);
        } else {
            handleExportBD('', agentCommissionSubStr);
        }
    }

    function onErrorModal(error) {
        const errorResponse = hasError(error);
        toast.error(errorResponse.message);
        handleCloseExportBdModal()
    }

    function calculateCartasiExternalPrice(cartasi, externalCostTotal) {

        const cartasiSubStr = handleRemoveSymbol(cartasi)
        const symbol = handleGetCartasiSymbol(cartasi)

        if (symbol === Strings.percentage) {
            return Number(((externalCostTotal * (cartasiSubStr / 100))))
        }
        else {
            return Number(cartasiSubStr)
        }
    }

    function calculateCartasiInternalPrice(externalCostTotal) {
        return Number((externalCostTotal * (cartasiData.internalCostPercentage / 100)))
    }

    function calculateAgentPrice(agentCommission, externalCostTotal) {
        return Number((externalCostTotal * (agentCommission / 100)))
    }

    function onSubmit(data) {

        const { cartasi, agentCommission, /* agencyAddress */ } = data

        const exportBdData = {
            agentCommission: handleAddPercentageSymbol(agentCommission),
            cartasi: cartasi && cartasi + radioValue,
            // agencyAddress,
            itineraryId
        }
        if (exportData?.id) {
            updateExportBdMutation.mutate({ exportBdData, id: exportData?.id })
        } else {
            addExportBdMutation.mutate(exportBdData)
        }
    }

    function handleExportBD(cartasi, agentCommission) {
        let csvData = [];
        let externalCostTotal = 0
        let internalCostTotal = 0
        if (itineraryData?.day) {
            const dateRangeArray = getDateRange(itineraryData?.startDate, itineraryData?.endDate);
            itineraryData?.day?.forEach((day, index) => {
                const services = day?.event.map(event => event.service).flat();
                services?.forEach((service) => {
                    const addService = {
                        "DATE": dateRangeArray[index],
                        "SERVICE": service?.serviceName,
                        "COST TO CLIENT": service?.pricePerPerson === true ? `${Strings.euro} ` + getFormatEuroPrice(parseFloat(service.externalCost) * Number(itineraryData?.participants)) : `${Strings.euro} ` + getFormatEuroPrice(parseFloat(service?.externalCost)),
                        "SUPPLIER": service?.supplierName,
                        "INTERNAL COST": service?.pricePerPerson === true ? `${Strings.euro} ` + getFormatEuroPrice(parseFloat(service.internalCost) * Number(itineraryData?.participants)) : `${Strings.euro} ` + getFormatEuroPrice(parseFloat(service?.internalCost)),
                    }
                    externalCostTotal += itineraryData?.editedCost ? parseFloat(itineraryData?.editedCost) : parseFloat(service?.externalCost)
                    internalCostTotal += parseFloat(service?.internalCost)
                    csvData.push(addService)
                    csvData.push({})
                })

            })
        }

        const cartasiExternalPrice = calculateCartasiExternalPrice(cartasi, externalCostTotal)
        const cartasiInternalPrice = calculateCartasiInternalPrice(externalCostTotal)
        const agentPrice = calculateAgentPrice(agentCommission, externalCostTotal)
        const totalNetAmount = externalCostTotal + (cartasi ? cartasiExternalPrice : 0)
        const gross = totalNetAmount + agentPrice

        const additionalInfo = [
            {
                "SERVICE": cartasi ? Strings.export_bd_cartasi : '',
                "COST TO CLIENT": cartasi ? `${Strings.euro} ${getFormatEuroPrice(cartasiExternalPrice)}` : '',
                "INTERNAL COST": cartasi ? `${Strings.euro} ${getFormatEuroPrice(cartasiInternalPrice)}` : ''
            },
            {},
            {
                "SERVICE": "Total Net Amount",
                "COST TO CLIENT": `${Strings.euro} ${getFormatEuroPrice(totalNetAmount)}`,
                "INTERNAL COST": `${Strings.euro} ${getFormatEuroPrice(internalCostTotal)}`
            },
            {},
            {
                "SERVICE": "commission agent",
                "COST TO CLIENT": `${Strings.euro} ${getFormatEuroPrice(agentPrice)}`,
            },
            {},
            {
                "SERVICE": "GROSS",
                "COST TO CLIENT": `${Strings.euro} ${getFormatEuroPrice(gross)}`,
            },
            {},
            {},
            {},
            {
                "SERVICE": `Account Owner:`,
                "COST TO CLIENT": `${account?.name}`,
            },
            {
                "SERVICE": `Name of Client:`,
                "COST TO CLIENT": `${itineraryData?.participantList[0]} `,
            },
            {
                "SERVICE": `Total Number of pax:`,
                "COST TO CLIENT": `${itineraryData?.participants}`,
            },
            {
                "SERVICE": `Agent:`,
                "COST TO CLIENT": `${itineraryData?.agent?.name}`,
            },
            {
                "SERVICE": `Agency:`,
                "COST TO CLIENT": `${itineraryData?.agent?.agencyName}`,
            },
            {
                "SERVICE": `Agency Address:`,
                "COST TO CLIENT": `${itineraryData?.agent?.agencyAddress}`,
            },
        ]

        csvData = csvData.concat(additionalInfo)

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(csvData, { header: Object.keys(csvData[0]) });
        const maxContentLengths = {};
        csvData.forEach((row) => {
            Object.keys(row).forEach((key) => {
                const contentLength = String(row[key]).length;
                maxContentLengths[key] = Math.max(maxContentLengths[key] || 0, contentLength);
            });
        });
        const colWidths = Object.keys(maxContentLengths).map((key) => ({ wch: maxContentLengths[key] + 9 }));
        worksheet['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, `${itineraryData?.itineraryName} ${itineraryData?.itineraryId}.xlsx`);

    }

    return {
        control,
        handleSubmit,
        radioValue,
        setRadioValue,
        handleCloseExportBdModal,
        getExportBdSuccessModal,
        onSubmit,
        onErrorModal,
        handleResetField
    }
}


type useItineraryExportBDModalType = {
    eventModalCloseHandler?: () => void;
    itineraryData?: ItineraryType;
    exportData?: ExportBDModalType;
}
export default useItineraryExportBDModal