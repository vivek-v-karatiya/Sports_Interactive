import moment from "moment/moment";

export const LocalTime = (dateTime) =>
	moment.utc(dateTime).local().format("DD-MM-YYYY h:mm:ss a");
