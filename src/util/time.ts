import * as d3 from "d3";

export const parseTime = d3.utcParse("%Y.%m.%d");
export const readableTime = d3.utcFormat("%d/%m/%Y");
