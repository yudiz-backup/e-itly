export type ItineraryScheduleType = {
  itineraryName: string;
  editedCost?: number;
  participantList: string[];
  createdAt?: string;
  createdBy?: string;
  itineraryId: number;
  algoliaId?: string;
  id?: string;
  startDate: string;
  participants: string;
  noOfDay: number;
  endDate: string;
  agent: ItineraryAgentType;
  status: string;
  day: Day[];
  bookerEmail?: string;
  versionNumber: number;
  itineraryVersion?: ItineraryScheduleType[];
  timeStamp?: string;
  termsData?: TermsDatum[];
};

export type ItineraryAgentType = {
  dropeedId: string;
  name: string;
  agentCommission: string;
  id: string;
  isActive: boolean;
  email: string;
  agencyName: string;
};

export type Day = {
  event: ItineraryEventType[];
};

export type ItineraryEventType = {
  eventDay: string;
  eventTitle: EventTitle;
  eventDuration: string;
  notes: string;
  service: ItineraryServiceType[];
  block: ItineraryBlockType[];
  id: string;
  region: string;
  isActive: boolean;
};

export type ItineraryBlockType = {
  image: string;
  blockName: string;
  description: string;
  id: string;
  isActive: boolean;
};

export type ItineraryServiceType = {
  serviceType: string;
  supplierName: string;
  supplierId: string;
  serviceRefId?: string;
  supplierEmail: string;
  externalCost: string;
  description: string;
  isBooked?: boolean;
  serviceName: string;
  isActive: boolean;
  pricePerPerson: boolean;
  startTime?: string;
  id: string;
  region: string;
  internalCost: string;
  startDate?: string;
};

export type TermsDatum = {
  dropeedId: string;
  description: string;
  id: string;
  title: string;
  isActive: boolean;
};

type MessageDataType = {
  agentId: string;
  attachments: [];
  createdAt: string;
  day: string;
  dayIndex: string;
  eventId: string;
  eventIndex: string;
  id: string;
  isSender: boolean;
  itineraryId: string;
  message: string;
  messageId: string;
  serviceId: string;
  serviceIndex: string;
  supplierId: string;
  timestamp: number;
  type: string;
};

export type ServiceEmailChatPanelProps = {
  serviceData: ItineraryServiceType;
  messageData: MessageDataType[];
  eiMessageData: MessageDataType[];
  refTime: MutableRef<any>;
  itineraryData: ItineraryScheduleType;
  /**
   * true when service has been booked and got the success response
   */
  isServiceBooked?: boolean;
  /**
   * update itinerary and send message mutation load
   */
  serviceScheduleMutation?: { isLoading: boolean; isSuccess: boolean };
  serviceBookingData: {
    startDate: Date;
    startTime: Date;
  } | null;
  handleSupplierRefresh: () => void;
  handleScrollSupplierFetch: (target: any) => void;
  handleSupplierMessageSend: ({ email, files }: { email: string; files?: File[]; isServiceBooked?: boolean }) => void;
  handleEiRefresh: () => void;
  handleScrollEiFetch: (target: any) => void;
  handleExternalMessageSend: ({ message, files }: { message: string; files: File[] }) => void;
};
