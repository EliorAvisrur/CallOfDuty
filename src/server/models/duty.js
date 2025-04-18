function createDuty(dutyProperties) {
  const {
    name,
    description,
    location,
    startTime,
    endTime,
    minRank,
    maxRank,
    constraints,
    soldiersRequired,
    value,
  } = dutyProperties;
  const newDuty = {
    name: name,
    description: description,
    location: location,
    startTime: startTime,
    endTime: endTime,
    constraints: constraints,
    soldiersRequired: soldiersRequired,
    value: value,
    soldiers: [],
    status: "unscheduled",
    statusHistory: [{ status: "unscheduled", date: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (minRank) {
    newDuty.minRank = minRank;
  }
  if (maxRank) {
    newDuty.maxRank = maxRank;
  }
  return newDuty;
}
function adjustDutyQueryString(query) {
  Object.keys(query).forEach((key) => {
    if (
      key === "minRank" ||
      key === "maxRank" ||
      key === "soldiersRequired" ||
      key === "value"
    ) {
      query[key] = Number.parseInt(query[key]);
    } else if (
      key === "location" ||
      key === "constraints" ||
      key === "soldiers"
    ) {
      query[key] = JSON.parse(query[key]);
    }
  });
}
function filterForSchema(dutyProperties) {
  const {
    _id,
    name,
    description,
    location,
    startTime,
    endTime,
    minRank,
    maxRank,
    constraints,
    soldiersRequired,
    value,
    soldiers,
    status,
  } = dutyProperties;
  const filter = {
    ...(_id && { _id }),
    ...(name && { name }),
    ...(description && { description }),
    ...(location && { location }),
    ...(startTime && { startTime }),
    ...(endTime && { endTime }),
    ...(minRank && { minRank }),
    ...(maxRank && { maxRank }),
    ...(constraints && { constraints }),
    ...(soldiersRequired && { soldiersRequired }),
    ...(value && { value }),
    ...(soldiers && { soldiers }),
    ...(status && { status }),
  };
  return filter;
}
export { createDuty, filterForSchema, adjustDutyQueryString };
