interface StopArea {
  id: string;
  embedded_type: string;
  name: string;
  quality: number;
  stop_area: object;
}

interface Departure {
  display_informations: {
    code: string;
    color: string;
    commercial_mode: string;
    description: string;
    direction: string;
    equipments: string[];
    headsign: string;
    label: string;
    links: {
      category: string;
      id: string;
      internal: boolean;
      rel: string;
      templated: boolean;
      type: string;
    };
    name: string;
    network: string;
    physical_mode: string;
    text_color: string;
    trip_short_name: string;
  };
  links: { id: string; type: string };
  routes: object;
  stop_date_time: {
    additional_informations: [];
    arrival_date_time: string;
    base_arrival_date_time: string;
    base_departure_date_time: string;
    data_freshness: string;
    departure_date_time: string;
  };
  stop_point: object;
}

interface ResponseNativiaDeparture {
  context: object;
  departures: Departure[];
  disruptions: [];
  exceptions: [];
  feed_publishers: [];
  links: [];
  notes: [];
  origins: string[];
  pagination: object;
  terminus: string[];
}

const convertNativiaDate = (nativiaDate: string) => {
  const year: string =
    nativiaDate[0] + nativiaDate[1] + nativiaDate[2] + nativiaDate[3];

  const month: string = nativiaDate[4] + nativiaDate[5];
  const day: string = nativiaDate[6] + nativiaDate[7];
  const hour: string = nativiaDate[9] + nativiaDate[10];
  const minutes: string = nativiaDate[11] + nativiaDate[12];

  return `${day}/${month} - ${hour}:${minutes}`;
};

export {
  convertNativiaDate,
  type Departure,
  type ResponseNativiaDeparture,
  type StopArea,
};
